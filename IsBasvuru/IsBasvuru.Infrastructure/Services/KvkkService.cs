using AutoMapper;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.KvkkDtos;
using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class KvkkService : IKvkkService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;

        private const string CacheKey = "kvkk_list";

        public KvkkService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<KvkkListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<KvkkListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<KvkkListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.Kvkklar.ToListAsync();
            var mappedList = _mapper.Map<List<KvkkListDto>>(list) ?? new List<KvkkListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);

            return ServiceResponse<List<KvkkListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<KvkkListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Kvkklar.FindAsync(id);
            if (entity == null)
                return ServiceResponse<KvkkListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<KvkkListDto>(entity);
            return ServiceResponse<KvkkListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<KvkkListDto>> CreateAsync(KvkkCreateDto dto)
        {
            // Tekil Kayıt Kontrolü
            bool kayitVarMi = await _context.Kvkklar.AnyAsync();
            if (kayitVarMi)
            {
                return ServiceResponse<KvkkListDto>.FailureResult("Sistemde zaten bir KVKK metni var. Güncelleme yapınız.");
            }

            var entity = _mapper.Map<Kvkk>(dto);

            // OTOMATİK VERSİYONLAMA: İlk kayıt her zaman 1
            entity.KvkkVersiyon = "1";
            entity.GuncellemeTarihi = DateTime.Now;

            await _context.Kvkklar.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            var mapped = _mapper.Map<KvkkListDto>(entity);
            return ServiceResponse<KvkkListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(KvkkUpdateDto dto)
        {
            var entity = await _context.Kvkklar.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // DTO'dan gelen alanları güncelle (Mapper kullanmak yerine manuel set edelim ki versiyonu koruyalım veya mapper config ayarlıysa o da olur)
            entity.KvkkAciklamaTr = dto.KvkkAciklamaTr;
            entity.DogrulukAciklamaTr = dto.DogrulukAciklamaTr;
            entity.ReferansAciklamaTr = dto.ReferansAciklamaTr;
            entity.KvkkAciklamaEn = dto.KvkkAciklamaEn;
            entity.DogrulukAciklamaEn = dto.DogrulukAciklamaEn;
            entity.ReferansAciklamaEn = dto.ReferansAciklamaEn;
            entity.GuncellemeTarihi = DateTime.Now;

            // OTOMATİK VERSİYON ARTIRMA
            if (int.TryParse(entity.KvkkVersiyon, out int mevcutVersiyon))
            {
                entity.KvkkVersiyon = (mevcutVersiyon + 1).ToString();
            }
            else
            {
                // Eğer veritabanındaki eski veri "v1.0" gibi string ise ve parse edilemezse sıfırlayıp 1 yapalım veya hata vermemesi için 2'den başlatalım.
                entity.KvkkVersiyon = "1";
            }

            _context.Kvkklar.Update(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // NOT: Eğer KVKK metinleri personeller tarafından onaylanıyorsa, 
            // burada _context.PersonelKvkkOnaylari.AnyAsync(...) gibi bir kontrol yapmalısınız.

            var entity = await _context.Kvkklar.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            try
            {
                _context.Kvkklar.Remove(entity);
                await _context.SaveChangesAsync();

                _cache.Remove(CacheKey);

                return ServiceResponse<bool>.SuccessResult(true, "KVKK metni başarıyla silindi.");
            }
            catch (Exception ex)
            {
                // İlişkisel bir hata varsa burada yakalanır ve frontend'e 200 OK içinde hata mesajı döner.
                return ServiceResponse<bool>.FailureResult($"Silme işlemi sırasında hata oluştu (Muhtemelen bu metin kullanımda): {ex.Message}");
            }
        }
    }
}