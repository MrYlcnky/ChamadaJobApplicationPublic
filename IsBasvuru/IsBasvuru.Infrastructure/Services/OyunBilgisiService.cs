using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OyunBilgisiDtos;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;
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
    public class OyunBilgisiService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache) : IOyunBilgisiService
    {
        private readonly IsBasvuruContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly IMemoryCache _cache = cache;

        private const string CacheKey = "oyun_list";

        public async Task<ServiceResponse<List<OyunBilgisiListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<OyunBilgisiListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<OyunBilgisiListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.OyunBilgileri
                .Include(x => x.Departman)
                    .ThenInclude(x => x!.MasterDepartman!)
                .Include(x => x.MasterOyun) // Master Oyun dahil edildi
                .AsNoTracking()
                .ToListAsync();

            var mappedList = _mapper.Map<List<OyunBilgisiListDto>>(list) ?? [];

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);

            return ServiceResponse<List<OyunBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<OyunBilgisiListDto>> GetByIdAsync(int id)
        {
            // FindAsync yerine FirstOrDefaultAsync ile Include yapıyoruz
            var entity = await _context.OyunBilgileri
                .Include(x => x.Departman)
                .Include(x => x.MasterOyun)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<OyunBilgisiListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<OyunBilgisiListDto>(entity);
            return ServiceResponse<OyunBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<OyunBilgisiListDto>> CreateAsync(OyunBilgisiCreateDto dto)
        {
            // 1. Departman kontrolü
            if (!await _context.Departmanlar.AnyAsync(x => x.Id == dto.DepartmanId))
                return ServiceResponse<OyunBilgisiListDto>.FailureResult("Seçilen departman bulunamadı.");

            // 2. Master Oyun kontrolü
            if (!await _context.MasterOyunlar.AnyAsync(x => x.Id == dto.MasterOyunId))
                return ServiceResponse<OyunBilgisiListDto>.FailureResult("Seçilen ana oyun (Master) bulunamadı.");

            // 3. Mükerrer kayıt kontrolü (Aynı departman, aynı master oyun)
            if (await _context.OyunBilgileri.AnyAsync(x => x.DepartmanId == dto.DepartmanId && x.MasterOyunId == dto.MasterOyunId))
                return ServiceResponse<OyunBilgisiListDto>.FailureResult("Bu departmana bu oyun zaten atanmış.");

            var entity = _mapper.Map<OyunBilgisi>(dto);
            await _context.OyunBilgileri.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            // Mapper'ın isimleri doldurabilmesi için detaylı getiriyoruz
            return await GetByIdAsync(entity.Id);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(OyunBilgisiUpdateDto dto)
        {
            var entity = await _context.OyunBilgileri.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // Eğer departman değiştirildiyse kontrol et
            if (entity.DepartmanId != dto.DepartmanId)
            {
                if (!await _context.Departmanlar.AnyAsync(x => x.Id == dto.DepartmanId))
                    return ServiceResponse<bool>.FailureResult("Yeni seçilen departman geçersiz.");
            }

            // Eğer master oyun değiştirildiyse kontrol et
            if (entity.MasterOyunId != dto.MasterOyunId)
            {
                if (!await _context.MasterOyunlar.AnyAsync(x => x.Id == dto.MasterOyunId))
                    return ServiceResponse<bool>.FailureResult("Yeni seçilen ana oyun geçersiz.");
            }

            // Çakışma kontrolü
            bool cakisma = await _context.OyunBilgileri.AnyAsync(x =>
                x.DepartmanId == dto.DepartmanId &&
                x.MasterOyunId == dto.MasterOyunId &&
                x.Id != dto.Id);

            if (cakisma)
                return ServiceResponse<bool>.FailureResult("Bu departmanda bu oyun zaten tanımlı.");

            _mapper.Map(dto, entity);
            _context.OyunBilgileri.Update(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            bool kullanimdaMi = await _context.IsBasvuruDetayOyunlari.AnyAsync(x => x.OyunBilgisiId == id);

            if (kullanimdaMi)
                return ServiceResponse<bool>.FailureResult("Bu oyun bilgisi personel başvurularında kullanıldığı için silinemez.");

            var entity = await _context.OyunBilgileri.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.OyunBilgileri.Remove(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}