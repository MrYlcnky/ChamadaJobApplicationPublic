using AutoMapper;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.UlkeDtos;
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
    public class UlkeService : IUlkeService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        private const string CacheKey = "ulke_list";

        public UlkeService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<UlkeListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<UlkeListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<UlkeListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.Ulkeler.ToListAsync();
            var mappedList = _mapper.Map<List<UlkeListDto>>(list) ?? new List<UlkeListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);

            return ServiceResponse<List<UlkeListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<UlkeListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Ulkeler.FindAsync(id);
            if (entity == null)
                return ServiceResponse<UlkeListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<UlkeListDto>(entity);
            return ServiceResponse<UlkeListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<UlkeListDto>> CreateAsync(UlkeCreateDto createDto)
        {
            // 1. Gelen metni hemen normalize et (Büyük harfe çevir ve boşlukları temizle)
            string normalizedName = createDto.UlkeAdi.ToTurkishUpper();

            // 2. Mükerrer kontrolünü normalleştirilmiş isim üzerinden yap
            if (await _context.Ulkeler.AnyAsync(x => x.UlkeAdi == normalizedName))
                return ServiceResponse<UlkeListDto>.FailureResult($"'{normalizedName}' isimli ülke zaten sistemde kayıtlı.");

            var entity = _mapper.Map<Ulke>(createDto);

            // 3. Veritabanına büyük harfli halini kaydet
            entity.UlkeAdi = normalizedName;

            await _context.Ulkeler.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            var mapped = _mapper.Map<UlkeListDto>(entity);
            return ServiceResponse<UlkeListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(UlkeUpdateDto updateDto)
        {
            var entity = await _context.Ulkeler.FindAsync(updateDto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 1. Yeni ismi normalize et
            string normalizedName = updateDto.UlkeAdi.ToTurkishUpper();

            // 2. İsim çakışması kontrolü (Kendisi hariç başka bir kayıt bu ismi kullanıyor mu?)
            if (await _context.Ulkeler.AnyAsync(x => x.UlkeAdi == normalizedName && x.Id != updateDto.Id))
                return ServiceResponse<bool>.FailureResult($"'{normalizedName}' ismi zaten başka bir ülke kaydında kullanılıyor.");

            _mapper.Map(updateDto, entity);

            // 3. Update işlemi sonrası manuel büyük harf garantisi
            entity.UlkeAdi = normalizedName;

            _context.Ulkeler.Update(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            if (await _context.Sehirler.AnyAsync(x => x.UlkeId == id))
                return ServiceResponse<bool>.FailureResult("Bu ülkeye bağlı şehirler var. Önce onları silmelisiniz.");

            if (await _context.Uyruklar.AnyAsync(x => x.UlkeId == id))
                return ServiceResponse<bool>.FailureResult("Bu ülkeye bağlı uyruk tanımları var.");

            var entity = await _context.Ulkeler.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Ulkeler.Remove(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}