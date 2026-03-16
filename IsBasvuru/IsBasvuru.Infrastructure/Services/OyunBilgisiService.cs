using AutoMapper;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OrganizationImportDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OyunBilgisiDtos;
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

        public async Task<ServiceResponse<bool>> ImportOyunAsync(List<OyunImportDto> importData)
        {
            // İşlemleri güvenliğe alıyoruz, hata çıkarsa tüm DB kayıtları geri alınacak (Rollback)
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 0. Temizleme ve Eksik Verileri Eleme
                var validData = importData
                    .Where(r => !string.IsNullOrWhiteSpace(r.Sube) &&
                                !string.IsNullOrWhiteSpace(r.Departman) &&
                                !string.IsNullOrWhiteSpace(r.OyunAdi))
                    .Select(r => new {
                        Sube = r.Sube.Trim(),
                        Departman = r.Departman.Trim(),
                        OyunAdi = r.OyunAdi.Trim()
                    }).ToList();

                if (!validData.Any())
                    return ServiceResponse<bool>.FailureResult("Aktarılacak geçerli veri bulunamadı.");

                // ========================================================
                // 1. AŞAMA: YENİ MASTER OYUNLARI EKLE (Eğer sistemde yoksa)
                // ========================================================
                var uniqueOyunlar = validData.Select(x => x.OyunAdi).Distinct().ToList();
                var existingOyunlar = await _context.MasterOyunlar.ToListAsync();

                foreach (var o in uniqueOyunlar)
                {
                    if (!existingOyunlar.Any(e => e.MasterOyunAdi != null && e.MasterOyunAdi.Equals(o, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newOyun = new MasterOyun { MasterOyunAdi = o };
                        _context.MasterOyunlar.Add(newOyun);
                        existingOyunlar.Add(newOyun); // Listeyi anlık güncelliyoruz
                    }
                }
                await _context.SaveChangesAsync();

                // ========================================================
                // 2. AŞAMA: ŞUBE VE DEPARTMAN EŞLEŞTİRMESİ
                // ========================================================
                var existingSubeler = await _context.Subeler.ToListAsync();
                var existingSubeAlanlar = await _context.SubeAlanlar.ToListAsync();
                var existingMasterDept = await _context.MasterDepartmanlar.ToListAsync();
                var existingDepartmanlarOrg = await _context.Departmanlar.ToListAsync();
                var existingOyunBilgileri = await _context.OyunBilgileri.ToListAsync();

                foreach (var data in validData)
                {
                    // Şubeyi bul
                    var sube = existingSubeler.FirstOrDefault(s => s.SubeAdi != null && s.SubeAdi.Equals(data.Sube, StringComparison.OrdinalIgnoreCase));
                    // Master Departmanı bul
                    var masterDept = existingMasterDept.FirstOrDefault(d => d.MasterDepartmanAdi != null && d.MasterDepartmanAdi.Equals(data.Departman, StringComparison.OrdinalIgnoreCase));
                    // Master Oyunu bul
                    var masterOyun = existingOyunlar.First(o => o.MasterOyunAdi != null && o.MasterOyunAdi.Equals(data.OyunAdi, StringComparison.OrdinalIgnoreCase));

                    // Eğer girilen Şube ve Departman DB'de varsa:
                    if (sube != null && masterDept != null)
                    {
                        // İlgili Şubeye ait SubeAlan ID'lerini bul
                        var subeyeAitAlanIds = existingSubeAlanlar.Where(sa => sa.SubeId == sube.Id).Select(sa => sa.Id).ToList();

                        // Departmanlar tablosundan "Gerçek" DepartmanId'yi bul (Şube->Alan->Departman zincirini kontrol ederek)
                        var gercekDepartman = existingDepartmanlarOrg.FirstOrDefault(d => subeyeAitAlanIds.Contains(d.SubeAlanId) && d.MasterDepartmanId == masterDept.Id);

                        if (gercekDepartman != null)
                        {
                            // Çakışma kontrolü (Bu şubenin bu departmanına bu oyun zaten atanmış mı?)
                            if (!existingOyunBilgileri.Any(ob => ob.DepartmanId == gercekDepartman.Id && ob.MasterOyunId == masterOyun.Id))
                            {
                                var newOb = new OyunBilgisi
                                {
                                    DepartmanId = gercekDepartman.Id,
                                    MasterOyunId = masterOyun.Id,
                                    OyunAdi = masterOyun.MasterOyunAdi,
                                    OyunAktifMi = true
                                };
                                _context.OyunBilgileri.Add(newOb);
                                existingOyunBilgileri.Add(newOb); // Aynı Excel dosyasında 2 tane aynı satır varsa mükerrer kaydı önler
                            }
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Önbelleği temizle (Eğer CacheKey farklıysa projene göre düzenle)
                _cache.Remove("oyun_list");

                return ServiceResponse<bool>.SuccessResult(true, "Oyun verileri başarıyla analiz edildi ve sisteme aktarıldı.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ServiceResponse<bool>.FailureResult($"İçe aktarım hatası: {ex.Message} - Detay: {ex.InnerException?.Message}");
            }
        }
    }
}