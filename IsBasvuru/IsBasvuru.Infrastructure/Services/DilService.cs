using AutoMapper;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.DilDtos;
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
    public class DilService : IDilService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        private const string CacheKey = "dil_list";

        public DilService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<DilListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<DilListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<DilListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.Diller.ToListAsync();
            var mappedList = _mapper.Map<List<DilListDto>>(list) ?? new List<DilListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);

            return ServiceResponse<List<DilListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<DilListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Diller.FindAsync(id);
            if (entity == null)
                return ServiceResponse<DilListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<DilListDto>(entity);
            return ServiceResponse<DilListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<DilListDto>> CreateAsync(DilCreateDto dto)
        {
            // 1. Gelen metni normalize et (Büyük harf ve boşluk temizliği)
            string normalizedName = dto.DilAdi.ToTurkishUpper();

            // 2. Mükerrer kontrolünü normalize edilmiş isimle yap
            if (await _context.Diller.AnyAsync(x => x.DilAdi == normalizedName))
                return ServiceResponse<DilListDto>.FailureResult($"'{normalizedName}' isimli dil zaten kayıtlı.");

            var entity = _mapper.Map<Dil>(dto);

            // 3. Veritabanına büyük harfli halini kaydet
            entity.DilAdi = normalizedName;

            await _context.Diller.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            var mapped = _mapper.Map<DilListDto>(entity);
            return ServiceResponse<DilListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(DilUpdateDto dto)
        {
            var entity = await _context.Diller.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 1. Yeni ismi normalize et
            string normalizedName = dto.DilAdi.ToTurkishUpper();

            // 2. İsim Çakışma Kontrolü (Kendisi hariç kontrol)
            bool cakisma = await _context.Diller
                .AnyAsync(x => x.DilAdi == normalizedName && x.Id != dto.Id);

            if (cakisma)
                return ServiceResponse<bool>.FailureResult($"'{normalizedName}' isimli başka bir dil zaten var.");

            _mapper.Map(dto, entity);

            // 3. Update sonrası büyük harf garantisi
            entity.DilAdi = normalizedName;

            _context.Diller.Update(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var entity = await _context.Diller.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // Bu dil herhangi bir personelin Yabancı Dil bilgisinde kullanılıyor mu?
            bool isUsed = await _context.YabanciDilBilgileri.AnyAsync(x => x.DilId == id);

            if (isUsed)
            {
                return ServiceResponse<bool>.FailureResult($"Bu dil ({entity.DilAdi}) şu anda kullanımda olduğu için silinemez. Önce ilgili personel kayıtlarını kaldırmalısınız.");
            }

            _context.Diller.Remove(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}