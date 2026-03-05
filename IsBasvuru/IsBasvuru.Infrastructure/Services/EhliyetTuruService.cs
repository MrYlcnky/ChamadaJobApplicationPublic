using AutoMapper;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.EhliyetTuruDtos;
using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Infrastructure.Tools;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class EhliyetTuruService : IEhliyetTuruService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        private const string CacheKey = "ehliyet_turu_list";

        public EhliyetTuruService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<EhliyetTuruListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<EhliyetTuruListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<EhliyetTuruListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.EhliyetTurleri.ToListAsync();
            var mappedList = _mapper.Map<List<EhliyetTuruListDto>>(list) ?? new List<EhliyetTuruListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);

            return ServiceResponse<List<EhliyetTuruListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<EhliyetTuruListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.EhliyetTurleri.FindAsync(id);
            if (entity == null)
                return ServiceResponse<EhliyetTuruListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<EhliyetTuruListDto>(entity);
            return ServiceResponse<EhliyetTuruListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<EhliyetTuruListDto>> CreateAsync(EhliyetTuruCreateDto dto)
        {
            // 1. Metni hemen normalize et (Büyük harfe çevir ve boşlukları temizle)
            string normalizedName = dto.EhliyetTuruAdi.ToTurkishUpper();

            // 2. İsim Kontrolünü normalize edilmiş metin üzerinden yap
            if (await _context.EhliyetTurleri.AnyAsync(x => x.EhliyetTuruAdi == normalizedName))
                return ServiceResponse<EhliyetTuruListDto>.FailureResult($"'{normalizedName}' isimli ehliyet türü zaten kayıtlı.");

            var entity = _mapper.Map<EhliyetTuru>(dto);

            // 3. Veritabanına büyük harf garantisiyle kaydet
            entity.EhliyetTuruAdi = normalizedName;

            await _context.EhliyetTurleri.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            var mapped = _mapper.Map<EhliyetTuruListDto>(entity);
            return ServiceResponse<EhliyetTuruListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(EhliyetTuruUpdateDto dto)
        {
            var entity = await _context.EhliyetTurleri.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 1. Yeni ismi normalize et
            string normalizedName = dto.EhliyetTuruAdi.ToTurkishUpper();

            // 2. İsim Çakışma Kontrolü (Kendisi hariç bu ismi kullanan başka kayıt var mı?)
            bool cakisma = await _context.EhliyetTurleri
                .AnyAsync(x => x.EhliyetTuruAdi == normalizedName && x.Id != dto.Id);

            if (cakisma)
                return ServiceResponse<bool>.FailureResult($"'{normalizedName}' isimli başka bir ehliyet türü zaten var.");

            _mapper.Map(dto, entity);

            // 3. Manuel olarak büyük harfli halini set et (Update garantisi)
            entity.EhliyetTuruAdi = normalizedName;

            _context.EhliyetTurleri.Update(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // 1. İLİŞKİ KONTROLÜ
            bool kullanimdaMi = await _context.PersonelEhliyetleri.AnyAsync(x => x.EhliyetTuruId == id);
            if (kullanimdaMi)
                return ServiceResponse<bool>.FailureResult("Bu ehliyet türü personel kayıtlarında kullanıldığı için silinemez.");

            var entity = await _context.EhliyetTurleri.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 2. GÜVENLİ SİLME (Try-Catch)
            try
            {
                _context.EhliyetTurleri.Remove(entity);
                await _context.SaveChangesAsync();

                _cache.Remove(CacheKey);

                return ServiceResponse<bool>.SuccessResult(true, "Ehliyet türü başarıyla silindi.");
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Silme işlemi sırasında beklenmedik bir hata oluştu: {ex.Message}");
            }
        }
    }
}