using AutoMapper;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.KktcBelgeDtos;
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
    public class KktcBelgeService : IKktcBelgeService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;


        private const string CacheKey = "kktc_belge_list";

        public KktcBelgeService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<KktcBelgeListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<KktcBelgeListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<KktcBelgeListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.KktcBelgeler.ToListAsync();
            var mappedList = _mapper.Map<List<KktcBelgeListDto>>(list) ?? new List<KktcBelgeListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);

            return ServiceResponse<List<KktcBelgeListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<KktcBelgeListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.KktcBelgeler.FindAsync(id);
            if (entity == null)
                return ServiceResponse<KktcBelgeListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<KktcBelgeListDto>(entity);
            return ServiceResponse<KktcBelgeListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<KktcBelgeListDto>> CreateAsync(KktcBelgeCreateDto dto)
        {
            // 1. Gelen belge adını normalize et (Büyük harf ve boşluk temizliği)
            string normalizedName = dto.BelgeAdi.ToTurkishUpper();

            // 2. Mükerrer kontrolünü normalize edilmiş isimle yap
            if (await _context.KktcBelgeler.AnyAsync(x => x.BelgeAdi == normalizedName))
                return ServiceResponse<KktcBelgeListDto>.FailureResult($"'{normalizedName}' isimli belge zaten kayıtlı.");

            var entity = _mapper.Map<KktcBelge>(dto);

            // 3. Veritabanına büyük harfli halini kaydet
            entity.BelgeAdi = normalizedName;

            await _context.KktcBelgeler.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            var mapped = _mapper.Map<KktcBelgeListDto>(entity);
            return ServiceResponse<KktcBelgeListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(KktcBelgeUpdateDto dto)
        {
            var entity = await _context.KktcBelgeler.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 1. Yeni ismi normalize et
            string normalizedName = dto.BelgeAdi.ToTurkishUpper();

            // 2. İsim Çakışma Kontrolü (Kendisi hariç kontrol)
            bool cakisma = await _context.KktcBelgeler
                .AnyAsync(x => x.BelgeAdi == normalizedName && x.Id != dto.Id);

            if (cakisma)
                return ServiceResponse<bool>.FailureResult($"'{normalizedName}' isimli başka bir belge zaten var.");

            _mapper.Map(dto, entity);

            // 3. Update sonrası büyük harf garantisi
            entity.BelgeAdi = normalizedName;

            _context.KktcBelgeler.Update(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {

            // Bu belge tipi herhangi bir personelin "Diğer Kişisel Bilgiler" kaydında kullanılıyor mu?
            bool kullaniliyorMu = await _context.DigerKisiselBilgileri.AnyAsync(x => x.KktcBelgeId == id);
            if (kullaniliyorMu)
            {
                return ServiceResponse<bool>.FailureResult("Bu belge türü bir veya daha fazla personel kaydında kullanıldığı için silinemez.");
            }

            var entity = await _context.KktcBelgeler.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.KktcBelgeler.Remove(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}