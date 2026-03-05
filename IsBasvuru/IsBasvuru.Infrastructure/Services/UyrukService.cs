using AutoMapper;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.UyrukDtos;
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
    public class UyrukService : IUyrukService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        private const string CacheKey = "uyruk_list";

        public UyrukService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<UyrukListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<UyrukListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<UyrukListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.Uyruklar.Include(x => x.Ulke).ToListAsync();
            var mappedList = _mapper.Map<List<UyrukListDto>>(list) ?? new List<UyrukListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);

            return ServiceResponse<List<UyrukListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<UyrukListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Uyruklar.Include(x => x.Ulke).FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null)
                return ServiceResponse<UyrukListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<UyrukListDto>(entity);
            return ServiceResponse<UyrukListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<UyrukListDto>> CreateAsync(UyrukCreateDto createDto)
        {
            // 1. Gelen metni hemen normalize et (Büyük harfe çevir)
            string normalizedName = createDto.UyrukAdi.ToTurkishUpper();

            // Ülke varlık kontrolü
            if (!await _context.Ulkeler.AnyAsync(x => x.Id == createDto.UlkeId))
                return ServiceResponse<UyrukListDto>.FailureResult("Seçilen ülke bulunamadı.");

            // 2. Mükerrer kontrolünü normalleştirilmiş isim üzerinden yap
            if (await _context.Uyruklar.AnyAsync(x => x.UyrukAdi == normalizedName))
                return ServiceResponse<UyrukListDto>.FailureResult($"'{normalizedName}' uyruğu zaten sistemde tanımlı.");

            // 3. Ülkeye ait başka bir uyruk kaydı var mı kontrolü (1-1 ilişki kuralı)
            if (await _context.Uyruklar.AnyAsync(x => x.UlkeId == createDto.UlkeId))
                return ServiceResponse<UyrukListDto>.FailureResult("Bu ülkeye ait bir uyruk zaten tanımlanmış. Lütfen mevcut kaydı düzenleyin.");

            var entity = _mapper.Map<Uyruk>(createDto);

            // 4. Veritabanına büyük harfli halini kaydet
            entity.UyrukAdi = normalizedName;

            await _context.Uyruklar.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            var mapped = _mapper.Map<UyrukListDto>(entity);
            return ServiceResponse<UyrukListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(UyrukUpdateDto updateDto)
        {
            var entity = await _context.Uyruklar.FindAsync(updateDto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            string normalizedName = updateDto.UyrukAdi.ToTurkishUpper();

            // Ülke değişikliği varsa yeni ülkeyi doğrula
            if (entity.UlkeId != updateDto.UlkeId)
            {
                if (!await _context.Ulkeler.AnyAsync(x => x.Id == updateDto.UlkeId))
                    return ServiceResponse<bool>.FailureResult("Yeni seçilen ülke geçersiz.");

                // Yeni seçilen ülkenin zaten başka bir uyruk kaydı var mı?
                if (await _context.Uyruklar.AnyAsync(x => x.UlkeId == updateDto.UlkeId && x.Id != updateDto.Id))
                    return ServiceResponse<bool>.FailureResult("Seçtiğiniz ülkenin zaten tanımlı bir uyruğu bulunuyor.");
            }

            // İsim çakışması kontrolü (Kendisi hariç başka bir kayıt bu ismi kullanıyor mu?)
            if (await _context.Uyruklar.AnyAsync(x => x.UyrukAdi == normalizedName && x.Id != updateDto.Id))
                return ServiceResponse<bool>.FailureResult($"'{normalizedName}' ismi zaten başka bir uyruk kaydında kullanılıyor.");

            _mapper.Map(updateDto, entity);

            // Update işlemi sonrası manuel büyük harf garantisi
            entity.UyrukAdi = normalizedName;

            _context.Uyruklar.Update(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            bool personelVarMi = await _context.KisiselBilgileri.AnyAsync(x => x.UyrukId == id);

            if (personelVarMi)
            {
                return ServiceResponse<bool>.FailureResult("Bu uyruğa tanımlı personel kayıtları bulunmaktadır. Silme işlemi yapılamaz.");
            }

            var entity = await _context.Uyruklar.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.Uyruklar.Remove(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}