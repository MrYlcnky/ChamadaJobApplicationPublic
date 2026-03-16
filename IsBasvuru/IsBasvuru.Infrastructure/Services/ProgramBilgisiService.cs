using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OrganizationImportDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.ProgramBilgisiDtos;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi;
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

        public async Task<ServiceResponse<bool>> ImportProgramAsync(List<ProgramImportDto> importData)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var validData = importData
                    .Where(r => !string.IsNullOrWhiteSpace(r.Sube) &&
                                !string.IsNullOrWhiteSpace(r.Departman) &&
                                !string.IsNullOrWhiteSpace(r.ProgramAdi))
                    .Select(r => new {
                        Sube = r.Sube.Trim(),
                        Departman = r.Departman.Trim(),
                        ProgramAdi = r.ProgramAdi.Trim()
                    }).ToList();

                if (!validData.Any())
                    return ServiceResponse<bool>.FailureResult("Aktarılacak geçerli veri bulunamadı.");

                // 1. Yeni Master Programları Ekle (Eğer Yoksa)
                var uniquePrograms = validData.Select(x => x.ProgramAdi).Distinct().ToList();
                var existingPrograms = await _context.MasterProgramlar.ToListAsync();

                foreach (var p in uniquePrograms)
                {
                    if (!existingPrograms.Any(e => e.MasterProgramAdi != null && e.MasterProgramAdi.Equals(p, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newProg = new MasterProgram { MasterProgramAdi = p };
                        _context.MasterProgramlar.Add(newProg);
                        existingPrograms.Add(newProg);
                    }
                }
                await _context.SaveChangesAsync();

                // 2. Şube ve Departman Verilerini Çek (Eşleştirme için)
                var existingSubeler = await _context.Subeler.ToListAsync();
                var existingSubeAlanlar = await _context.SubeAlanlar.ToListAsync();
                var existingMasterDept = await _context.MasterDepartmanlar.ToListAsync();
                var existingDepartmanlarOrg = await _context.Departmanlar.ToListAsync();
                var existingProgramBilgileri = await _context.ProgramBilgileri.ToListAsync();

                foreach (var data in validData)
                {
                    // Şubeyi bul
                    var sube = existingSubeler.FirstOrDefault(s => s.SubeAdi != null && s.SubeAdi.Equals(data.Sube, StringComparison.OrdinalIgnoreCase));
                    // Master Departmanı bul
                    var masterDept = existingMasterDept.FirstOrDefault(d => d.MasterDepartmanAdi != null && d.MasterDepartmanAdi.Equals(data.Departman, StringComparison.OrdinalIgnoreCase));
                    // Master Programı bul
                    var masterProg = existingPrograms.First(p => p.MasterProgramAdi != null && p.MasterProgramAdi.Equals(data.ProgramAdi, StringComparison.OrdinalIgnoreCase));

                    if (sube != null && masterDept != null)
                    {
                        // İlgili Şubeye ait Alanları bul
                        var subeyeAitAlanIds = existingSubeAlanlar.Where(sa => sa.SubeId == sube.Id).Select(sa => sa.Id).ToList();

                        // Departman tablosundan Gerçek DepartmanId'yi bul
                        var gercekDepartman = existingDepartmanlarOrg.FirstOrDefault(d => subeyeAitAlanIds.Contains(d.SubeAlanId) && d.MasterDepartmanId == masterDept.Id);

                        if (gercekDepartman != null)
                        {
                            // Çakışma kontrolü (Zaten eklenmiş mi?)
                            if (!existingProgramBilgileri.Any(pb => pb.DepartmanId == gercekDepartman.Id && pb.MasterProgramId == masterProg.Id))
                            {
                                var newPb = new ProgramBilgisi
                                {
                                    DepartmanId = gercekDepartman.Id,
                                    MasterProgramId = masterProg.Id,
                                    ProgramAdi = masterProg.MasterProgramAdi,
                                    ProgramAktifMi = true
                                };
                                _context.ProgramBilgileri.Add(newPb);
                                existingProgramBilgileri.Add(newPb); // Aynı döngüde tekrar eklenmesini önler
                            }
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _cache.Remove("program_list"); // Cache anahtarını kendi yapına göre düzelt
                return ServiceResponse<bool>.SuccessResult(true, "Program verileri başarıyla aktarıldı.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ServiceResponse<bool>.FailureResult($"İçe aktarım hatası: {ex.Message}");
            }
        }
    }
}