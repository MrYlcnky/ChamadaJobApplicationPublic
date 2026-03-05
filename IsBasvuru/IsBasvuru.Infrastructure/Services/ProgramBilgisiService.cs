using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.ProgramBilgisiDtos;
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
    public class ProgramBilgisiService(IsBasvuruContext context, IMapper mapper, IMemoryCache cache) : IProgramBilgisiService
    {
        private readonly IsBasvuruContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly IMemoryCache _cache = cache;

        private const string CacheKey = "program_list";

        public async Task<ServiceResponse<List<ProgramBilgisiListDto>>> GetAllAsync()
        {
            if (_cache.TryGetValue(CacheKey, out List<ProgramBilgisiListDto>? cachedList) && cachedList is not null)
            {
                return ServiceResponse<List<ProgramBilgisiListDto>>.SuccessResult(cachedList);
            }

            var list = await _context.ProgramBilgileri
                .Include(x => x.Departman)
                    .ThenInclude(x => x!.MasterDepartman!)
                .Include(x => x.MasterProgram) // Master programı da dahil ediyoruz
                .AsNoTracking()
                .ToListAsync();

            var mappedList = _mapper.Map<List<ProgramBilgisiListDto>>(list) ?? [];

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24))
                .SetPriority(CacheItemPriority.Normal);

            _cache.Set(CacheKey, mappedList, cacheOptions);

            return ServiceResponse<List<ProgramBilgisiListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<ProgramBilgisiListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.ProgramBilgileri
                .Include(x => x.Departman)
                .Include(x => x.MasterProgram)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<ProgramBilgisiListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<ProgramBilgisiListDto>(entity);
            return ServiceResponse<ProgramBilgisiListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<ProgramBilgisiListDto>> CreateAsync(ProgramBilgisiCreateDto dto)
        {
            // 1. Departman kontrolü
            if (!await _context.Departmanlar.AnyAsync(x => x.Id == dto.DepartmanId))
                return ServiceResponse<ProgramBilgisiListDto>.FailureResult("Seçilen departman bulunamadı.");

            // 2. Master Program kontrolü
            if (!await _context.MasterProgramlar.AnyAsync(x => x.Id == dto.MasterProgramId))
                return ServiceResponse<ProgramBilgisiListDto>.FailureResult("Seçilen ana program (Master) bulunamadı.");

            // 3. Mükerrer kayıt kontrolü (Aynı departman, aynı master program)
            // İstersen burada 'ProgramAdi'na göre de kontrol yapabilirsin ama MasterId daha güvenilir
            if (await _context.ProgramBilgileri.AnyAsync(x => x.DepartmanId == dto.DepartmanId && x.MasterProgramId == dto.MasterProgramId))
                return ServiceResponse<ProgramBilgisiListDto>.FailureResult("Bu departmana bu program zaten atanmış.");

            var entity = _mapper.Map<ProgramBilgisi>(dto);
            await _context.ProgramBilgileri.AddAsync(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            // Mapper'ın isimleri (MasterProgramAdi, DepartmanAdi) doldurabilmesi için tekrar çekip dönüyoruz
            return await GetByIdAsync(entity.Id);
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(ProgramBilgisiUpdateDto dto)
        {
            var entity = await _context.ProgramBilgileri.FindAsync(dto.Id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // Eğer departman değiştirildiyse kontrol et
            if (entity.DepartmanId != dto.DepartmanId)
            {
                if (!await _context.Departmanlar.AnyAsync(x => x.Id == dto.DepartmanId))
                    return ServiceResponse<bool>.FailureResult("Yeni seçilen departman geçersiz.");
            }

            // Eğer master program değiştirildiyse kontrol et
            if (entity.MasterProgramId != dto.MasterProgramId)
            {
                if (!await _context.MasterProgramlar.AnyAsync(x => x.Id == dto.MasterProgramId))
                    return ServiceResponse<bool>.FailureResult("Yeni seçilen ana program geçersiz.");
            }

            // Çakışma kontrolü
            bool cakisma = await _context.ProgramBilgileri.AnyAsync(x =>
                x.DepartmanId == dto.DepartmanId &&
                x.MasterProgramId == dto.MasterProgramId && // Hem departman hem program aynıysa
                x.Id != dto.Id);

            if (cakisma)
                return ServiceResponse<bool>.FailureResult("Bu departmanda bu program zaten tanımlı.");

            _mapper.Map(dto, entity);
            _context.ProgramBilgileri.Update(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            bool kullanimdaMi = await _context.IsBasvuruDetayProgramlari.AnyAsync(x => x.ProgramBilgisiId == id);

            if (kullanimdaMi)
                return ServiceResponse<bool>.FailureResult("Bu program bilgisi personel başvurularında kullanıldığı için silinemez.");

            var entity = await _context.ProgramBilgileri.FindAsync(id);
            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            _context.ProgramBilgileri.Remove(entity);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return ServiceResponse<bool>.SuccessResult(true);
        }
    }
}