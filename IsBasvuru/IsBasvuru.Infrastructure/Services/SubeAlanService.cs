using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeAlanDtos;
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
    public class SubeAlanService : ISubeAlanService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "sube_alan_list";

        public SubeAlanService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<SubeAlanListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<SubeAlanListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<SubeAlanListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.SubeAlanlar
                .Include(x => x.Sube)
                .Include(x => x.MasterAlan) 
                .ToListAsync();

            var mappedList = _mapper.Map<List<SubeAlanListDto>>(list) ?? new List<SubeAlanListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);
            return ServiceResponse<List<SubeAlanListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<SubeAlanListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.SubeAlanlar
                .Include(x => x.Sube)
                .Include(x => x.MasterAlan) 
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<SubeAlanListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<SubeAlanListDto>(entity);
            return ServiceResponse<SubeAlanListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<SubeAlanListDto>> CreateAsync(SubeAlanCreateDto createDto)
        {
            var subeVarMi = await _context.Subeler.AnyAsync(x => x.Id == createDto.SubeId);
            if (!subeVarMi) return ServiceResponse<SubeAlanListDto>.FailureResult("Seçilen şube bulunamadı!");

            bool cakisma = await _context.SubeAlanlar
                .AnyAsync(x => x.SubeId == createDto.SubeId && x.MasterAlanId == createDto.MasterAlanId);

            if (cakisma) return ServiceResponse<SubeAlanListDto>.FailureResult("Bu şubede bu alan zaten tanımlı.");

            var entity = _mapper.Map<SubeAlan>(createDto);
            await _context.SubeAlanlar.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            var createdEntity = await _context.SubeAlanlar
                .Include(x => x.Sube)
                .Include(x => x.MasterAlan)
                .FirstOrDefaultAsync(x => x.Id == entity.Id);

            var mapped = _mapper.Map<SubeAlanListDto>(createdEntity);
            return ServiceResponse<SubeAlanListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(SubeAlanUpdateDto updateDto)
        {
            var mevcut = await _context.SubeAlanlar.FindAsync(updateDto.Id);
            if (mevcut == null) return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            if (mevcut.SubeId != updateDto.SubeId)
            {
                bool subeVarMi = await _context.Subeler.AnyAsync(x => x.Id == updateDto.SubeId);
                if (!subeVarMi) return ServiceResponse<bool>.FailureResult("Yeni seçilen şube geçersiz.");
            }

            bool cakisma = await _context.SubeAlanlar
                .AnyAsync(x => x.SubeId == updateDto.SubeId && x.MasterAlanId == updateDto.MasterAlanId && x.Id != updateDto.Id);

            if (cakisma) return ServiceResponse<bool>.FailureResult("Bu şubede bu alan zaten var.");

            _mapper.Map(updateDto, mevcut);
            _context.SubeAlanlar.Update(mevcut);
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // 1. GÜVENLİK KONTROLÜ: 
            bool basvuruVarMi = await _context.IsBasvuruDetayPozisyonlari
           .AnyAsync(x => x.DepartmanPozisyon != null &&
                   x.DepartmanPozisyon.Departman != null &&
                   x.DepartmanPozisyon.Departman.SubeAlanId == id);

            if (basvuruVarMi)
                return ServiceResponse<bool>.FailureResult("Bu birime bağlı aktif personel veya başvurular mevcut. Silme işlemi yapılamaz.");

            // 2. KAYIT KONTROLÜ
            var kayit = await _context.SubeAlanlar.FindAsync(id);
            if (kayit == null) return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // 3. SİLME
            _context.SubeAlanlar.Remove(kayit);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}