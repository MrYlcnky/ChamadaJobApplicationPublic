using AutoMapper;
using IsBasvuru.Domain.DTOs.MasterBasvuruDtos;
using IsBasvuru.Domain.Entities;
using IsBasvuru.Domain.Entities.Log;
using IsBasvuru.Domain.Enums;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class MasterBasvuruService : IMasterBasvuruService
    {
        private readonly IsBasvuruContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogService _logService;
        private readonly IImageService _imageService;

        public MasterBasvuruService(IsBasvuruContext context, IMapper mapper, ICurrentUserService currentUserService, ILogService logService, IImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
            _logService = logService;
            _imageService = imageService;
        }

        public async Task<ServiceResponse<List<MasterBasvuruListDto>>> GetAllAsync(int roleId, int? subeId, int? departmanId, int? alanId)
        {
            var query = _context.MasterBasvurular.AsQueryable();

            // 1. Departman Müdürü (Rol: 6)
            if (roleId == 6)
            {
                // Güvenlik kontrolü: Müdürün departman ID'si yoksa hiç veri getirme
                if (!departmanId.HasValue)
                    return ServiceResponse<List<MasterBasvuruListDto>>.FailureResult("Departman bilgisi bulunamadı.");

                query = query.Where(x =>
                    (!subeId.HasValue || x.Personel!.IsBasvuruDetay!.BasvuruSubeler.Any(s => s.SubeId == subeId)) &&

                    
                    x.Personel!.IsBasvuruDetay!.BasvuruDepartmanlar.Any(d =>
                        d.Departman != null && d.Departman.MasterDepartmanId == departmanId.Value
                    )
                ).Where(x =>
                    // GÖRÜNÜRLÜK KURALLARI:
                    x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Departman_Onayi ||
                    (int)x.BasvuruOnayAsamasi > (int)BasvuruOnayAsamasi.Departman_Onayi ||
                    x.BasvuruDurum == BasvuruDurum.Reddedildi ||
                    x.BasvuruDurum == BasvuruDurum.RevizeTalebi
                );
            }
            // 2. Genel Müdür (Rol: 5)
            else if (roleId == 5)
            {
                query = query.Where(x =>
                    // GÜVENLİK: GM kendi şubesini görür (AlanId varsa ona göre kısıtlanır, yoksa şubeyi kapsar)
                    (!subeId.HasValue || x.Personel!.IsBasvuruDetay!.BasvuruSubeler.Any(s => s.SubeId == subeId)) &&
                    (!alanId.HasValue || x.Personel!.IsBasvuruDetay!.BasvuruAlanlar.Any(a => a.SubeAlan!.MasterAlanId == alanId))
                ).Where(x =>
                    // GÖRÜNÜRLÜK:
                    x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Genel_Mudur_Onayi || // 1. Kendi onayını bekleyenler (Aşama 4)
                    x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Tamamlandi ||         // 2. Onayladığı ve bitenler (Aşama 5)
                    x.BasvuruDurum == BasvuruDurum.Reddedildi ||                    // 3. Reddedilenler
                    x.BasvuruDurum == BasvuruDurum.RevizeTalebi                     // 4. Revize bekleyenler
                );
            }
            else if (roleId == 7)
            {
                query = query.Where(x =>
                    // GÜVENLİK: Kendi şubesindeki adayları görür
                    (!subeId.HasValue || x.Personel!.IsBasvuruDetay!.BasvuruSubeler.Any(s => s.SubeId == subeId))
                ).Where(x =>
                    // GÖRÜNÜRLÜK:
                    x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Mali_Isler_Mudur_Onayi || // 1. Kendi onayını bekleyenler (Aşama 5)
                    x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Tamamlandi ||         // 2. Onayladığı ve bitenler (Aşama 6)
                    x.BasvuruDurum == BasvuruDurum.Reddedildi ||                     // 3. Reddedilenler
                    x.BasvuruDurum == BasvuruDurum.RevizeTalebi                      // 4. Revize bekleyenler
                );
            }
            // 3. IK Grubu (1, 2, 3, 4) ise filtreleme yapma, her şeyi görsünler.

            // --- INCLUDE ZİNCİRİ ---
            var list = await query
                .Include(x => x.BasvuruIslemLoglari).ThenInclude(l => l.PanelKullanici).ThenInclude(u => u!.Rol)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.KisiselBilgiler)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.DigerKisiselBilgiler!)
                        .ThenInclude(d => d.KktcBelge)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.EgitimBilgileri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsDeneyimleri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.YabanciDilBilgileri!)
                    .ThenInclude(y => y.Dil)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.BilgisayarBilgileri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.SertifikaBilgileri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.ReferansBilgileri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.PersonelEhliyetler!)
                        .ThenInclude(e => e.EhliyetTuru)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                        .ThenInclude(d => d.BasvuruSubeler!).ThenInclude(s => s.Sube)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                        .ThenInclude(d => d.BasvuruAlanlar!).ThenInclude(a => a.SubeAlan!).ThenInclude(sa => sa.MasterAlan)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                        .ThenInclude(d => d.BasvuruDepartmanlar!).ThenInclude(dep => dep.Departman!).ThenInclude(md => md.MasterDepartman)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                        .ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(poz => poz.DepartmanPozisyon!).ThenInclude(mp => mp.MasterPozisyon)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                    .ThenInclude(d => d.BasvuruOyunlar!).ThenInclude(pro => pro.OyunBilgileri!).ThenInclude(mp => mp.MasterOyun)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                    .ThenInclude(d => d.BasvuruProgramlar!).ThenInclude(bp => bp.ProgramBilgisi!).ThenInclude(mp => mp.MasterProgram)
                .OrderByDescending(x => x.BasvuruTarihi)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            var mappedList = _mapper.Map<List<MasterBasvuruListDto>>(list);

            // Sadece listeyi dönüyoruz
            return ServiceResponse<List<MasterBasvuruListDto>>.SuccessResult(mappedList);
        }

        public async Task<ServiceResponse<MasterBasvuruListDto>> GetByIdAsync(int id, int roleId, int? subeId, int? departmanId, int? alanId)
        {
            var query = _context.MasterBasvurular.AsQueryable();

            if (roleId == 6)
            {
                // Sube kısıtlamasını buradan da kaldırdık, MasterDepartmanId kontrolünü ekledik
                query = query.Where(x =>
                    x.Personel!.IsBasvuruDetay!.BasvuruDepartmanlar.Any(d =>
                        d.DepartmanId == departmanId ||
                        (d.Departman != null && d.Departman.MasterDepartmanId == departmanId)
                    )
                );
            }
            else if (roleId == 5)
            {
                query = query.Where(x =>
                    x.Personel!.IsBasvuruDetay!.BasvuruSubeler.Any(s => s.SubeId == subeId) &&
                    x.Personel!.IsBasvuruDetay!.BasvuruAlanlar.Any(a => a.SubeAlan!.MasterAlanId == alanId));
            }

            var entity = await query
                 .Include(x => x.BasvuruIslemLoglari)
                     .ThenInclude(l => l.PanelKullanici)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.KisiselBilgiler)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.DigerKisiselBilgiler)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.EgitimBilgileri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsDeneyimleri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.YabanciDilBilgileri!)
                    .ThenInclude(y => y.Dil)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.BilgisayarBilgileri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.SertifikaBilgileri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.ReferansBilgileri)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.PersonelEhliyetler!)
                        .ThenInclude(e => e.EhliyetTuru)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                        .ThenInclude(d => d.BasvuruSubeler!).ThenInclude(s => s.Sube)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                        .ThenInclude(d => d.BasvuruAlanlar!).ThenInclude(a => a.SubeAlan!).ThenInclude(sa => sa.MasterAlan)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                        .ThenInclude(d => d.BasvuruDepartmanlar!).ThenInclude(dep => dep.Departman!).ThenInclude(md => md.MasterDepartman)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                        .ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(poz => poz.DepartmanPozisyon!).ThenInclude(mp => mp.MasterPozisyon)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                    .ThenInclude(d => d.BasvuruOyunlar!).ThenInclude(pro => pro.OyunBilgileri!).ThenInclude(mp => mp.MasterOyun)
                .Include(x => x.Personel!)
                    .ThenInclude(p => p.IsBasvuruDetay!)
                    .ThenInclude(d => d.BasvuruProgramlar!).ThenInclude(bp => bp.ProgramBilgisi!).ThenInclude(mp => mp.MasterProgram)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<MasterBasvuruListDto>.FailureResult("Başvuru kaydı bulunamadı veya bu kaydı görüntüleme yetkiniz yok.");

            var mapped = _mapper.Map<MasterBasvuruListDto>(entity);
            return ServiceResponse<MasterBasvuruListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<MasterBasvuruListDto>> GetByPersonelIdAsync(int personelId)
        {
            var entity = await _context.MasterBasvurular
                .Include(x => x.Personel)
                .FirstOrDefaultAsync(x => x.PersonelId == personelId);

            if (entity == null)
                return ServiceResponse<MasterBasvuruListDto>.FailureResult("Bu personele ait başvuru bulunamadı.");

            var mapped = _mapper.Map<MasterBasvuruListDto>(entity);
            return ServiceResponse<MasterBasvuruListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<MasterBasvuruListDto>> CreateAsync(MasterBasvuruCreateDto dto)
        {
            var existingEntity = await _context.MasterBasvurular
                .FirstOrDefaultAsync(x => x.PersonelId == dto.PersonelId);

            if (existingEntity != null)
            {
                _mapper.Map(dto, existingEntity);
                existingEntity.BasvuruVersiyonNo = VersiyonYukselt(existingEntity.BasvuruVersiyonNo);
                existingEntity.BasvuruTarihi = DateTime.Now;

                // YENİ ENUM DEĞERLERİ:
                existingEntity.BasvuruDurum = BasvuruDurum.YeniBasvuru; // 1
                existingEntity.BasvuruOnayAsamasi = BasvuruOnayAsamasi.Ik_Ilk_Degerlendirme; // 1

                _context.MasterBasvurular.Update(existingEntity);
                await _context.SaveChangesAsync();

                var mapped = _mapper.Map<MasterBasvuruListDto>(existingEntity);
                return ServiceResponse<MasterBasvuruListDto>.SuccessResult(mapped, "Mevcut başvuru güncellendi ve İK değerlendirmesine gönderildi.");
            }
            else
            {
                var entity = _mapper.Map<MasterBasvuru>(dto);
                entity.BasvuruTarihi = DateTime.Now;
                entity.BasvuruVersiyonNo = "v1.0";

                // YENİ ENUM DEĞERLERİ:
                entity.BasvuruDurum = BasvuruDurum.YeniBasvuru; // 1
                entity.BasvuruOnayAsamasi = BasvuruOnayAsamasi.Ik_Ilk_Degerlendirme; // 1

                await _context.MasterBasvurular.AddAsync(entity);
                await _context.SaveChangesAsync();

                var mapped = _mapper.Map<MasterBasvuruListDto>(entity);
                return ServiceResponse<MasterBasvuruListDto>.SuccessResult(mapped, "Başvuru başarıyla oluşturuldu ve İK değerlendirmesine alındı.");
            }
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(MasterBasvuruUpdateDto dto)
        {
            var entity = await _context.MasterBasvurular
                .Include(x => x.BasvuruIslemLoglari)
                .FirstOrDefaultAsync(x => x.Id == dto.Id);

            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Güncellenecek başvuru bulunamadı.");

            try
            {
                bool isProcessUpdate = dto.BasvuruOnayAsamasi != 0 || dto.BasvuruDurum != 0;

                if (isProcessUpdate)
                {
                    LogIslemTipi islemTipi = LogIslemTipi.Guncelleme;

                    // 1. İşlem Tipini Belirle
                    if (dto.BasvuruDurum == BasvuruDurum.Reddedildi)
                        islemTipi = LogIslemTipi.Red;
                    else if (dto.BasvuruDurum == BasvuruDurum.RevizeTalebi)
                    {
                        islemTipi = LogIslemTipi.Revize; // Enum değeri: 10
                    }
                    else if (entity.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Ik_Ilk_Degerlendirme &&
                             dto.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Departman_Onayi)
                        islemTipi = LogIslemTipi.Sevk;
                    else if (dto.BasvuruDurum == BasvuruDurum.Onaylandi || (int)dto.BasvuruOnayAsamasi > (int)entity.BasvuruOnayAsamasi)
                        islemTipi = LogIslemTipi.Onay;

                    // 2. Entity Durumlarını Güncelle
                    if (dto.BasvuruOnayAsamasi != 0) entity.BasvuruOnayAsamasi = dto.BasvuruOnayAsamasi;
                    if (dto.BasvuruDurum != 0) entity.BasvuruDurum = dto.BasvuruDurum;

                    // 3. LogService Üzerinden Logu Kaydet
                    await _logService.LogBasvuruIslemAsync(
                        entity.Id,
                        _currentUserService.UserId,
                        islemTipi,
                        dto.IslemAciklama ?? "İşlem açıklaması belirtilmedi.",
                        _currentUserService.RolId,       // O anki rol
                        entity.BasvuruDurum,             // O anki durum
                        entity.BasvuruOnayAsamasi
                    );
                }
                else
                {
                    // Eğer statü değil, veri değişiyorsa versiyon yükselt
                    entity.BasvuruVersiyonNo = VersiyonYukselt(entity.BasvuruVersiyonNo);
                    _mapper.Map(dto, entity);
                }

                await _context.SaveChangesAsync();
                return ServiceResponse<bool>.SuccessResult(true, "İşlem başarıyla kaydedildi ve loglandı.");
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Hata oluştu: {ex.Message}");
            }
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // 1. MasterBasvuru'yu Personel, KişiselBilgiler ve KVKK Logları ile birlikte çekiyoruz
            var masterBasvuru = await _context.MasterBasvurular
                .Include(m => m.Personel)
                    .ThenInclude(p => p!.KisiselBilgiler)
                .Include(m => m.Personel)
                    .ThenInclude(p => p!.BasvuruOnay) // KVKK & IP Logları
                .FirstOrDefaultAsync(x => x.Id == id);

            if (masterBasvuru == null)
                return ServiceResponse<bool>.FailureResult("Silinecek başvuru kaydı bulunamadı.");

            try
            {
                var personel = masterBasvuru.Personel;

                // 2. FOTOĞRAF TEMİZLİĞİ: Sunucudaki vesikalık dosyayı fiziksel olarak siliyoruz
                if (personel?.KisiselBilgiler != null && !string.IsNullOrEmpty(personel.KisiselBilgiler.VesikalikFotograf))
                {
                    await _imageService.DeleteImageAsync(personel.KisiselBilgiler.VesikalikFotograf, "personel");
                }

                if (personel != null)
                {
                    _context.Personeller.Remove(personel);
                }
                else
                {
                    _context.MasterBasvurular.Remove(masterBasvuru);
                }

                await _context.SaveChangesAsync();
                return ServiceResponse<bool>.SuccessResult(true, "Başvuru, aday bilgileri, fotoğraflar ve dijital izler kalıcı olarak silindi.");
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Silme işlemi sırasında teknik hata: {ex.Message}");
            }
        }

        private string VersiyonYukselt(string mevcutVersiyon)
        {
            if (string.IsNullOrEmpty(mevcutVersiyon)) return "v1.0";
            try
            {
                string sayiKismi = mevcutVersiyon.Replace("v", "").Split('.')[0];
                int versiyon = int.Parse(sayiKismi);
                versiyon++;
                return $"v{versiyon}.0";
            }
            catch
            {
                return "v2.0";
            }
        }

        public async Task<ServiceResponse<List<BasvuruBildirimDto>>> GetOnayBekleyenBildirimlerAsync(int roleId, int? subeId, int? departmanId, int? alanId)
        {
            var query = _context.MasterBasvurular
                .Include(x => x.Personel)
                    .ThenInclude(p => p!.KisiselBilgiler!)
                .AsQueryable();

            // Kural 1: IK Grubu (Rol 1, 2, 3, 4)
            if (new[] { 1, 2, 3, 4 }.Contains(roleId))
            {
                // Bildirim kuralı: İlk değerlendirme veya mülakat aşamasında olan, 
                // durumu Yeni, Devam Ediyor veya RevizeTalebi olanlar.
                query = query.Where(x =>
                    (x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Ik_Ilk_Degerlendirme || x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Ik_Son_Kontrol) &&
                    (x.BasvuruDurum == BasvuruDurum.YeniBasvuru || x.BasvuruDurum == BasvuruDurum.DevamEdiyor || x.BasvuruDurum == BasvuruDurum.RevizeTalebi)
                );
            }
            // Kural 2: Departman Müdürü (Rol 6)
            else if (roleId == 6)
            {
                if (!departmanId.HasValue)
                    return ServiceResponse<List<BasvuruBildirimDto>>.SuccessResult(new List<BasvuruBildirimDto>());

                query = query.Where(x =>
                    // 1. ŞUBE GÜVENLİĞİ
                    (!subeId.HasValue || x.Personel!.IsBasvuruDetay!.BasvuruSubeler.Any(s => s.SubeId == subeId)) &&

                    // 2. DEPARTMAN GÜVENLİĞİ
                    x.Personel!.IsBasvuruDetay!.BasvuruDepartmanlar.Any(d =>
                        d.Departman != null && d.Departman.MasterDepartmanId == departmanId.Value
                    ) &&

                    // 3. BİLDİRİM KURALI
                    x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Departman_Onayi &&
                    (x.BasvuruDurum == BasvuruDurum.DevamEdiyor || x.BasvuruDurum == BasvuruDurum.YeniBasvuru)
                );
            }
            // Kural 3: Genel Müdür (Rol 5)
            else if (roleId == 5)
            {
                query = query.Where(x =>
                    // 1. Güvenlik
                    (!subeId.HasValue || x.Personel!.IsBasvuruDetay!.BasvuruSubeler.Any(s => s.SubeId == subeId)) &&
                    (!alanId.HasValue || x.Personel!.IsBasvuruDetay!.BasvuruAlanlar.Any(a => a.SubeAlan!.MasterAlanId == alanId)) &&
                    // 2. Bildirim Kuralı
                    x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Genel_Mudur_Onayi &&
                    (x.BasvuruDurum == BasvuruDurum.DevamEdiyor || x.BasvuruDurum == BasvuruDurum.YeniBasvuru)
                );
            }
            // Kural 4: Mali İşler (Rol 7)
            else if (roleId == 7)
            {
                query = query.Where(x =>
                    // 1. Güvenlik
                    (!subeId.HasValue || x.Personel!.IsBasvuruDetay!.BasvuruSubeler.Any(s => s.SubeId == subeId)) &&
                    // 2. Bildirim Kuralı
                    x.BasvuruOnayAsamasi == BasvuruOnayAsamasi.Mali_Isler_Mudur_Onayi &&
                    (x.BasvuruDurum == BasvuruDurum.DevamEdiyor || x.BasvuruDurum == BasvuruDurum.YeniBasvuru)
                );
            }
            else
            {
                return ServiceResponse<List<BasvuruBildirimDto>>.SuccessResult(new List<BasvuruBildirimDto>());
            }

            var bildirimler = await query
                .OrderByDescending(x => x.BasvuruTarihi)
                .Take(15) // En güncel 15 bildirimi alıyoruz
                .Select(x => new BasvuruBildirimDto
                {
                    BasvuruId = x.Id,
                    PersonelId = x.PersonelId,
                    PersonelAd = (x.Personel != null && x.Personel.KisiselBilgiler != null) ? x.Personel.KisiselBilgiler.Ad : "İsimsiz",
                    PersonelSoyad = (x.Personel != null && x.Personel.KisiselBilgiler != null) ? x.Personel.KisiselBilgiler.Soyadi : "",
                    BasvuruTarihi = x.BasvuruTarihi
                })
                .ToListAsync();

            return ServiceResponse<List<BasvuruBildirimDto>>.SuccessResult(bildirimler);
        }
    }
}