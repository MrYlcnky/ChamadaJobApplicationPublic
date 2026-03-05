using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanDtos;
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
    public class DepartmanService : IDepartmanService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "departman_list";

        public DepartmanService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache)
        {
            _context = context;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ServiceResponse<List<DepartmanListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<DepartmanListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<DepartmanListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.Departmanlar
                .Include(x => x.MasterDepartman) 
                .Include(x => x.SubeAlan).ThenInclude(y => y!.Sube)
                .Include(x => x.SubeAlan).ThenInclude(y => y!.MasterAlan) 
                .ToListAsync();

            var mappedList = _mapper.Map<List<DepartmanListDto>>(list) ?? new List<DepartmanListDto>();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);
            return ServiceResponse<List<DepartmanListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<DepartmanListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Departmanlar
                .Include(x => x.MasterDepartman)
                .Include(x => x.SubeAlan).ThenInclude(y => y!.Sube)
                .Include(x => x.SubeAlan).ThenInclude(y => y!.MasterAlan)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null) return ServiceResponse<DepartmanListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<DepartmanListDto>(entity);
            return ServiceResponse<DepartmanListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<DepartmanListDto>> CreateAsync(DepartmanCreateDto createDto)
        {
            bool ofisVarMi = await _context.SubeAlanlar.AnyAsync(x => x.Id == createDto.SubeAlanId);
            if (!ofisVarMi) return ServiceResponse<DepartmanListDto>.FailureResult("Seçilen alan bulunamadı.");

            bool cakisma = await _context.Departmanlar
                .AnyAsync(x => x.SubeAlanId == createDto.SubeAlanId && x.MasterDepartmanId == createDto.MasterDepartmanId);

            if (cakisma) return ServiceResponse<DepartmanListDto>.FailureResult("Bu alanda bu departman zaten var.");

            var entity = _mapper.Map<Departman>(createDto);
            await _context.Departmanlar.AddAsync(entity);
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            var createdEntity = await _context.Departmanlar
                .Include(x => x.MasterDepartman)
                .Include(x => x.SubeAlan).ThenInclude(y => y!.Sube)
                .Include(x => x.SubeAlan).ThenInclude(y => y!.MasterAlan)
                .FirstOrDefaultAsync(x => x.Id == entity.Id);

            var mapped = _mapper.Map<DepartmanListDto>(createdEntity);
            return ServiceResponse<DepartmanListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(DepartmanUpdateDto updateDto)
        {
            var mevcut = await _context.Departmanlar.FindAsync(updateDto.Id);
            if (mevcut == null) return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // Çakışma kontrolü
            bool cakisma = await _context.Departmanlar
                .AnyAsync(x => x.SubeAlanId == updateDto.SubeAlanId &&
                               x.MasterDepartmanId == updateDto.MasterDepartmanId &&
                               x.Id != updateDto.Id);

            if (cakisma) return ServiceResponse<bool>.FailureResult("Bu alanda aynı isimde departman zaten var.");

            _mapper.Map(updateDto, mevcut);
            await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // GÜVENLİK: Bu departmanın altındaki herhangi bir pozisyonda personel var mı?
            // Null uyarısını önlemek için bağlantıları kontrol ederek ilerliyoruz.
            bool basvuruVarMi = await _context.IsBasvuruDetayPozisyonlari
                .AnyAsync(x => x.DepartmanPozisyon != null && x.DepartmanPozisyon.DepartmanId == id);

            if (basvuruVarMi)
                return ServiceResponse<bool>.FailureResult("Bu departmana bağlı personeller veya başvurular olduğu için silme işlemi yapılamaz.");

            var kayit = await _context.Departmanlar.FindAsync(id);
            if (kayit == null) return ServiceResponse<bool>.FailureResult("Silinecek kayıt bulunamadı.");

            // Cascade Delete yapılandırması sayesinde altındaki pozisyonlar da SQL tarafından silinecek.
            _context.Departmanlar.Remove(kayit);
            var result = await _context.SaveChangesAsync();
            _cache.Remove(CacheKey);

            return result > 0
                ? ServiceResponse<bool>.SuccessResult(true)
                : ServiceResponse<bool>.FailureResult("Silme işlemi gerçekleştirilemedi.");
        }
    }
}