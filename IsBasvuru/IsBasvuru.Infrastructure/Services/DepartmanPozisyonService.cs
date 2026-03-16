using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanPozisyonDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OrganizationImportDtos;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;
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

        public async Task<ServiceResponse<bool>> ImportOrganizationAsync(List<OrganizationImportDto> importData)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 0. Temizleme ve Eksik Verileri Emele (Sadece tam dolu satırları alıyoruz)
                var validData = importData
                    .Where(r => !string.IsNullOrWhiteSpace(r.Sube) &&
                                !string.IsNullOrWhiteSpace(r.Alan) &&
                                !string.IsNullOrWhiteSpace(r.Departman) &&
                                !string.IsNullOrWhiteSpace(r.Pozisyon))
                    .Select(r => new {
                        Sube = r.Sube.Trim(),
                        Alan = r.Alan.Trim(),
                        Departman = r.Departman.Trim(),
                        Pozisyon = r.Pozisyon.Trim()
                    }).ToList();

                if (!validData.Any())
                    return ServiceResponse<bool>.FailureResult("Aktarılacak geçerli veri bulunamadı.");

                // ========================================================
                // 1. AŞAMA: TEKRAR EDENLERİ SADELEŞTİR VE MASTER TABLOLARA EKLE
                // ========================================================
                var uniqueSubeler = validData.Select(x => x.Sube).Distinct().ToList();
                var uniqueAlanlar = validData.Select(x => x.Alan).Distinct().ToList();
                var uniqueDepartmanlar = validData.Select(x => x.Departman).Distinct().ToList();
                var uniquePozisyonlar = validData.Select(x => x.Pozisyon).Distinct().ToList();

                // 1.1 ŞUBELER
                var existingSubeler = await _context.Subeler.ToListAsync();
                foreach (var u in uniqueSubeler)
                {
                    if (!existingSubeler.Any(e => e.SubeAdi != null && e.SubeAdi.Equals(u, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newItem = new Sube { SubeAdi = u, SubeAktifMi = true };
                        _context.Subeler.Add(newItem);
                        existingSubeler.Add(newItem); // Listeyi anlık güncelliyoruz ki First() metodu bulabilsin
                    }
                }
                await _context.SaveChangesAsync();

                // 1.2 MASTER ALANLAR
                var existingAlanlar = await _context.MasterAlanlar.ToListAsync();
                foreach (var u in uniqueAlanlar)
                {
                    if (!existingAlanlar.Any(e => e.MasterAlanAdi != null && e.MasterAlanAdi.Equals(u, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newItem = new MasterAlan { MasterAlanAdi = u };
                        _context.MasterAlanlar.Add(newItem);
                        existingAlanlar.Add(newItem);
                    }
                }
                await _context.SaveChangesAsync();

                // 1.3 MASTER DEPARTMANLAR
                var existingDept = await _context.MasterDepartmanlar.ToListAsync();
                foreach (var u in uniqueDepartmanlar)
                {
                    if (!existingDept.Any(e => e.MasterDepartmanAdi != null && e.MasterDepartmanAdi.Equals(u, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newItem = new MasterDepartman { MasterDepartmanAdi = u };
                        _context.MasterDepartmanlar.Add(newItem);
                        existingDept.Add(newItem);
                    }
                }
                await _context.SaveChangesAsync();

                // 1.4 MASTER POZİSYONLAR
                var existingPoz = await _context.MasterPozisyonlar.ToListAsync();
                foreach (var u in uniquePozisyonlar)
                {
                    if (!existingPoz.Any(e => e.MasterPozisyonAdi != null && e.MasterPozisyonAdi.Equals(u, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newItem = new MasterPozisyon { MasterPozisyonAdi = u };
                        _context.MasterPozisyonlar.Add(newItem);
                        existingPoz.Add(newItem);
                    }
                }
                await _context.SaveChangesAsync();

                // ========================================================
                // 2. AŞAMA: ORGANİZASYON BAĞLANTILARINI (HİYERARŞİYİ) OLUŞTUR
                // ========================================================

                // 2.1 Sube -> Alan İlişkisi (SubeAlan)
                var uniqueSubeAlanPairs = validData.Select(x => new { x.Sube, x.Alan }).Distinct().ToList();
                var existingSubeAlanlar = await _context.SubeAlanlar.ToListAsync();

                foreach (var pair in uniqueSubeAlanPairs)
                {
                    var subeId = existingSubeler.First(s => s.SubeAdi != null && s.SubeAdi.Equals(pair.Sube, StringComparison.OrdinalIgnoreCase)).Id;
                    var alanId = existingAlanlar.First(a => a.MasterAlanAdi != null && a.MasterAlanAdi.Equals(pair.Alan, StringComparison.OrdinalIgnoreCase)).Id;

                    if (!existingSubeAlanlar.Any(sa => sa.SubeId == subeId && sa.MasterAlanId == alanId))
                    {
                        var newSa = new SubeAlan { SubeId = subeId, MasterAlanId = alanId, SubeAlanAktifMi = true };
                        _context.SubeAlanlar.Add(newSa);
                        existingSubeAlanlar.Add(newSa);
                    }
                }
                await _context.SaveChangesAsync();

                // 2.2 SubeAlan -> Departman İlişkisi (Departman)
                var uniqueSubeAlanDept = validData.Select(x => new { x.Sube, x.Alan, x.Departman }).Distinct().ToList();
                var existingDepartmanlarOrg = await _context.Departmanlar.ToListAsync();

                foreach (var triple in uniqueSubeAlanDept)
                {
                    var subeId = existingSubeler.First(s => s.SubeAdi != null && s.SubeAdi.Equals(triple.Sube, StringComparison.OrdinalIgnoreCase)).Id;
                    var alanId = existingAlanlar.First(a => a.MasterAlanAdi != null && a.MasterAlanAdi.Equals(triple.Alan, StringComparison.OrdinalIgnoreCase)).Id;
                    var masterDeptId = existingDept.First(d => d.MasterDepartmanAdi != null && d.MasterDepartmanAdi.Equals(triple.Departman, StringComparison.OrdinalIgnoreCase)).Id;

                    var subeAlanId = existingSubeAlanlar.First(sa => sa.SubeId == subeId && sa.MasterAlanId == alanId).Id;

                    if (!existingDepartmanlarOrg.Any(d => d.SubeAlanId == subeAlanId && d.MasterDepartmanId == masterDeptId))
                    {
                        var newDep = new Departman { SubeAlanId = subeAlanId, MasterDepartmanId = masterDeptId, DepartmanAktifMi = true };
                        _context.Departmanlar.Add(newDep);
                        existingDepartmanlarOrg.Add(newDep);
                    }
                }
                await _context.SaveChangesAsync();

                // 2.3 Departman -> Pozisyon İlişkisi (DepartmanPozisyon)
                var uniqueOrg = validData.Select(x => new { x.Sube, x.Alan, x.Departman, x.Pozisyon }).Distinct().ToList();
                var existingDeptPoz = await _context.DepartmanPozisyonlar.ToListAsync();

                foreach (var quad in uniqueOrg)
                {
                    var subeId = existingSubeler.First(s => s.SubeAdi != null && s.SubeAdi.Equals(quad.Sube, StringComparison.OrdinalIgnoreCase)).Id;
                    var alanId = existingAlanlar.First(a => a.MasterAlanAdi != null && a.MasterAlanAdi.Equals(quad.Alan, StringComparison.OrdinalIgnoreCase)).Id;
                    var masterDeptId = existingDept.First(d => d.MasterDepartmanAdi != null && d.MasterDepartmanAdi.Equals(quad.Departman, StringComparison.OrdinalIgnoreCase)).Id;
                    var masterPozId = existingPoz.First(p => p.MasterPozisyonAdi != null && p.MasterPozisyonAdi.Equals(quad.Pozisyon, StringComparison.OrdinalIgnoreCase)).Id;

                    var subeAlanId = existingSubeAlanlar.First(sa => sa.SubeId == subeId && sa.MasterAlanId == alanId).Id;
                    var departmanId = existingDepartmanlarOrg.First(d => d.SubeAlanId == subeAlanId && d.MasterDepartmanId == masterDeptId).Id;

                    if (!existingDeptPoz.Any(dp => dp.DepartmanId == departmanId && dp.MasterPozisyonId == masterPozId))
                    {
                        var newDp = new DepartmanPozisyon { DepartmanId = departmanId, MasterPozisyonId = masterPozId, DepartmanPozisyonAktifMi = true };
                        _context.DepartmanPozisyonlar.Add(newDp);
                        existingDeptPoz.Add(newDp);
                    }
                }
                await _context.SaveChangesAsync();

                // İşlem sorunsuz bitti
                await transaction.CommitAsync();
                _cache.Remove("pozisyon_list");
                _cache.Remove("sube_list");
                _cache.Remove("sube_alan_list");
                _cache.Remove("departman_list");

                return ServiceResponse<bool>.SuccessResult(true, "Excel verileri başarıyla analiz edildi ve sisteme aktarıldı.");
            }
            catch (Exception ex)
            {
                // Bir yerde hata çıkarsa veritabanı işlemlerini tamamen geri al (Kirli veri oluşmaz)
                await transaction.RollbackAsync();
                return ServiceResponse<bool>.FailureResult($"İçe aktarım hatası: {ex.Message} - Detay: {ex.InnerException?.Message}");
            }
        }
    }
}