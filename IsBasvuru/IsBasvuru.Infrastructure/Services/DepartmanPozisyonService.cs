using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanPozisyonDtos;
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
    public class DepartmanPozisyonService : IDepartmanPozisyonService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "pozisyon_list";

        public DepartmanPozisyonService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<DepartmanPozisyonListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<DepartmanPozisyonListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<DepartmanPozisyonListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.DepartmanPozisyonlar
                .Include(x => x.MasterPozisyon) 
                .Include(x => x.Departman).ThenInclude(d => d!.MasterDepartman) 
                .Include(x => x.Departman).ThenInclude(d => d!.SubeAlan).ThenInclude(sa => sa!.Sube)
                .Include(x => x.Departman).ThenInclude(d => d!.SubeAlan).ThenInclude(sa => sa!.MasterAlan) 
                .ToListAsync();

            var mappedList = _mapper.Map<List<DepartmanPozisyonListDto>>(list) ?? new List<DepartmanPozisyonListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);
            return ServiceResponse<List<DepartmanPozisyonListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<DepartmanPozisyonListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.DepartmanPozisyonlar
                .Include(x => x.MasterPozisyon) 
                .Include(x => x.Departman).ThenInclude(d => d!.MasterDepartman)
                .Include(x => x.Departman).ThenInclude(d => d!.SubeAlan).ThenInclude(sa => sa!.Sube)
                .Include(x => x.Departman).ThenInclude(d => d!.SubeAlan).ThenInclude(sa => sa!.MasterAlan)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null) return ServiceResponse<DepartmanPozisyonListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<DepartmanPozisyonListDto>(entity);
            return ServiceResponse<DepartmanPozisyonListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<DepartmanPozisyonListDto>> CreateAsync(DepartmanPozisyonCreateDto createDto)
        {
            bool departmanVarMi = await _context.Departmanlar.AnyAsync(x => x.Id == createDto.DepartmanId);
            if (!departmanVarMi) return ServiceResponse<DepartmanPozisyonListDto>.FailureResult("Seçilen departman bulunamadı.");

            bool cakisma = await _context.DepartmanPozisyonlar
                .AnyAsync(x => x.DepartmanId == createDto.DepartmanId && x.MasterPozisyonId == createDto.MasterPozisyonId);

            if (cakisma) return ServiceResponse<DepartmanPozisyonListDto>.FailureResult("Bu departmanda bu pozisyon zaten tanımlı.");

            var entity = _mapper.Map<DepartmanPozisyon>(createDto);
            await _context.DepartmanPozisyonlar.AddAsync(entity);
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            var createdEntity = await _context.DepartmanPozisyonlar
                .Include(x => x.MasterPozisyon)
                .Include(x => x.Departman).ThenInclude(d => d!.MasterDepartman)
                .FirstOrDefaultAsync(x => x.Id == entity.Id);

            var mapped = _mapper.Map<DepartmanPozisyonListDto>(createdEntity);
            return ServiceResponse<DepartmanPozisyonListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(DepartmanPozisyonUpdateDto updateDto)
        {
            var mevcut = await _context.DepartmanPozisyonlar.FindAsync(updateDto.Id);
            if (mevcut == null) return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // Çakışma kontrolü
            bool cakisma = await _context.DepartmanPozisyonlar
                .AnyAsync(x => x.DepartmanId == updateDto.DepartmanId &&
                               x.MasterPozisyonId == updateDto.MasterPozisyonId &&
                               x.Id != updateDto.Id);

            if (cakisma) return ServiceResponse<bool>.FailureResult("Bu departmanda bu pozisyon zaten tanımlı.");

            _mapper.Map(updateDto, mevcut);
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // Güvenlik: Bu pozisyona atanmış başvuru/personel var mı?
            bool personelVarMi = await _context.IsBasvuruDetayPozisyonlari.AnyAsync(x => x.DepartmanPozisyonId == id);
            if (personelVarMi)
                return ServiceResponse<bool>.FailureResult("Bu pozisyonda kayıtlı personel/başvuru bulunduğu için silme işlemi yapılamaz.");

            var kayit = await _context.DepartmanPozisyonlar.FindAsync(id);
            if (kayit == null) return ServiceResponse<bool>.FailureResult("Silinecek kayıt bulunamadı.");

            _context.DepartmanPozisyonlar.Remove(kayit);
            var result = await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            return result > 0
                ? ServiceResponse<bool>.SuccessResult(true)
                : ServiceResponse<bool>.FailureResult("Veritabanı silme işlemini onaylamadı.");
        }
    }
}