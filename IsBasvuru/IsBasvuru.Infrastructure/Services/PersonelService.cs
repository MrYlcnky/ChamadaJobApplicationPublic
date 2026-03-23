using AutoMapper;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BasvuruOnayDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.KisiselBilgilerListDtos;
using IsBasvuru.Domain.DTOs.PersonelDtos;
using IsBasvuru.Domain.DTOs.Shared;
using IsBasvuru.Domain.Entities;
using IsBasvuru.Domain.Entities.Log;
using IsBasvuru.Domain.Entities.PersonelBilgileri;
using IsBasvuru.Domain.Entities.SirketYapisi;
using IsBasvuru.Domain.Enums;
using IsBasvuru.Domain.Interfaces;
using IsBasvuru.Domain.Wrappers;
using IsBasvuru.Persistence.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace IsBasvuru.Infrastructure.Services
{
    public class PersonelService(IsBasvuruContext context, IMapper mapper, ILogService logService, IImageService imageService, IHttpContextAccessor httpContextAccessor) : IPersonelService
    {
        private readonly IsBasvuruContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly ILogService _logService = logService;
        private readonly IImageService _imageService = imageService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        public async Task<PagedResponse<List<PersonelListDto>>> GetAllAsync(PaginationFilter filter)
        {
            var validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
            var totalRecords = await _context.Personeller.CountAsync();

            var list = await _context.Personeller
                .Include(p => p.KisiselBilgiler)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruSubeler!).ThenInclude(s => s.Sube!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruAlanlar!).ThenInclude(a => a.SubeAlan!).ThenInclude(sa => sa.Sube!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruAlanlar!).ThenInclude(a => a.SubeAlan!).ThenInclude(sa => sa.MasterAlan!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruDepartmanlar!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.MasterDepartman!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruDepartmanlar!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.SubeAlan!).ThenInclude(sa => sa.Sube!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruDepartmanlar!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.SubeAlan!).ThenInclude(sa => sa.MasterAlan!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(pz => pz.DepartmanPozisyon!).ThenInclude(dp => dp.MasterPozisyon!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(pz => pz.DepartmanPozisyon!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.MasterDepartman!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(pz => pz.DepartmanPozisyon!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.SubeAlan!).ThenInclude(sa => sa.Sube!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(pz => pz.DepartmanPozisyon!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.SubeAlan!).ThenInclude(sa => sa.MasterAlan!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruProgramlar!).ThenInclude(pr => pr.ProgramBilgisi!).ThenInclude(p => p.Departman!).ThenInclude(d => d.MasterDepartman!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruOyunlar!).ThenInclude(o => o.OyunBilgileri!).ThenInclude(o => o.Departman!).ThenInclude(d => d.MasterDepartman!)
                .OrderByDescending(x => x.GuncellemeTarihi)
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .AsNoTracking()
                .ToListAsync();

            var mappedData = _mapper.Map<List<PersonelListDto>>(list);
            return new PagedResponse<List<PersonelListDto>>(mappedData, validFilter.PageNumber, validFilter.PageSize, totalRecords);
        }

        public async Task<ServiceResponse<PersonelListDto>> GetByIdAsync(int id)
        {
            var entity = await _context.Personeller
                .Include(p => p.KisiselBilgiler!).ThenInclude(k => k.Uyruk!)
                .Include(p => p.KisiselBilgiler!).ThenInclude(k => k.DogumUlke!)
                .Include(p => p.KisiselBilgiler!).ThenInclude(k => k.DogumSehir!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruSubeler!).ThenInclude(s => s.Sube!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruAlanlar!).ThenInclude(a => a.SubeAlan!).ThenInclude(sa => sa.Sube!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruAlanlar!).ThenInclude(a => a.SubeAlan!).ThenInclude(sa => sa.MasterAlan!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruDepartmanlar!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.MasterDepartman!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruDepartmanlar!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.SubeAlan!).ThenInclude(sa => sa.Sube!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruDepartmanlar!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.SubeAlan!).ThenInclude(sa => sa.MasterAlan!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(pz => pz.DepartmanPozisyon!).ThenInclude(dp => dp.MasterPozisyon!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(pz => pz.DepartmanPozisyon!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.MasterDepartman!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(pz => pz.DepartmanPozisyon!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.SubeAlan!).ThenInclude(sa => sa.Sube!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruPozisyonlar!).ThenInclude(pz => pz.DepartmanPozisyon!).ThenInclude(dp => dp.Departman!).ThenInclude(d => d.SubeAlan!).ThenInclude(sa => sa.MasterAlan!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruProgramlar!).ThenInclude(pr => pr.ProgramBilgisi!).ThenInclude(p => p.Departman!).ThenInclude(d => d.MasterDepartman!)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruOyunlar!).ThenInclude(o => o.OyunBilgileri!).ThenInclude(o => o.Departman!).ThenInclude(d => d.MasterDepartman!)
                .Include(p => p.EgitimBilgileri)
                .Include(p => p.IsDeneyimleri)
                .Include(p => p.SertifikaBilgileri)
                .Include(p => p.YabanciDilBilgileri)
                .Include(p => p.BilgisayarBilgileri)
                .Include(p => p.ReferansBilgileri)
                .Include(p => p.PersonelEhliyetler)
                .Include(p => p.DigerKisiselBilgiler)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<PersonelListDto>.FailureResult("Personel bulunamadı.");

            var mapped = _mapper.Map<PersonelListDto>(entity);
            return ServiceResponse<PersonelListDto>.SuccessResult(mapped);
        }

        public async Task<ServiceResponse<PersonelListDto>> CreateAsync(PersonelCreateDto dto)
        {
            var existingPersonel = await _context.KisiselBilgileri
         .AnyAsync(x => x.Email == dto.KisiselBilgiler.Email);
            if (existingPersonel)
            {
                return ServiceResponse<PersonelListDto>.FailureResult("Bu e-posta adresi veya telefon numarası ile daha önce bir başvuru oluşturulmuş.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var personel = new Personel
                {
                    GuncellemeTarihi = DateTime.Now,
                    KisiselBilgiler = _mapper.Map<KisiselBilgiler>(dto.KisiselBilgiler),
                    DigerKisiselBilgiler = dto.DigerKisiselBilgiler != null
                        ? _mapper.Map<DigerKisiselBilgiler>(dto.DigerKisiselBilgiler)
                        : null,

                    EgitimBilgileri = dto.EgitimBilgileri != null
                        ? dto.EgitimBilgileri.Select(e =>
                        {
                            var egitim = _mapper.Map<EgitimBilgisi>(e);
                            egitim.BaslangicTarihi = egitim.BaslangicTarihi.Date;
                            if (egitim.BitisTarihi.HasValue)
                                egitim.BitisTarihi = egitim.BitisTarihi.Value.Date;

                            if (egitim.Gano.HasValue)
                            {
                                var gano = (decimal)egitim.Gano.Value;
                                int notSistemi = (int)e.NotSistemi;
                                decimal esikDeger = (notSistemi == 1) ? 100m : 4m;

                                while (gano > esikDeger)
                                {
                                    gano /= 10;
                                }
                                egitim.Gano = Math.Round(gano, 2);
                            }
                            return egitim;
                        }).ToList()
                        : [],

                    SertifikaBilgileri = dto.SertifikaBilgileri != null
                        ? dto.SertifikaBilgileri.Select(s =>
                        {
                            var sertifika = _mapper.Map<SertifikaBilgisi>(s);
                            sertifika.VerilisTarihi = sertifika.VerilisTarihi.Date;
                            if (sertifika.GecerlilikTarihi.HasValue)
                                sertifika.GecerlilikTarihi = sertifika.GecerlilikTarihi.Value.Date;
                            return sertifika;
                        }).ToList()
                        : [],

                    IsDeneyimleri = dto.IsDeneyimleri != null
                        ? dto.IsDeneyimleri.Select(i =>
                        {
                            var isDeneyimi = _mapper.Map<IsDeneyimi>(i);
                            isDeneyimi.BaslangicTarihi = isDeneyimi.BaslangicTarihi.Date;
                            if (isDeneyimi.BitisTarihi.HasValue)
                                isDeneyimi.BitisTarihi = isDeneyimi.BitisTarihi.Value.Date;
                            return isDeneyimi;
                        }).ToList()
                        : [],

                    BilgisayarBilgileri = dto.BilgisayarBilgileri != null
                        ? dto.BilgisayarBilgileri.Select(b => _mapper.Map<BilgisayarBilgisi>(b)).ToList()
                        : [],

                    YabanciDilBilgileri = dto.YabanciDilBilgileri != null
                        ? dto.YabanciDilBilgileri.Select(y => _mapper.Map<YabanciDilBilgisi>(y)).ToList()
                        : [],

                    ReferansBilgileri = dto.ReferansBilgileri != null
                        ? dto.ReferansBilgileri.Select(r => _mapper.Map<ReferansBilgisi>(r)).ToList()
                        : [],

                    PersonelEhliyetler = dto.PersonelEhliyetler != null
                        ? dto.PersonelEhliyetler.Select(e => new PersonelEhliyet { EhliyetTuruId = e.EhliyetTuruId }).ToList()
                        : []
                };

                if (personel.KisiselBilgiler != null)
                {
                    personel.KisiselBilgiler.DogumTarihi = personel.KisiselBilgiler.DogumTarihi.Date;
                }

                var isBasvuruDetay = new IsBasvuruDetay
                {
                    NedenBiz = dto.NedenBiz,
                    LojmanTalebiVarMi = dto.LojmanTalebi,
                    BasvuruSubeler = dto.SubeIds?.Select(id => new IsBasvuruDetaySube { SubeId = id }).ToList() ?? [],
                    BasvuruAlanlar = dto.SubeAlanIds?.Select(id => new IsBasvuruDetayAlan { SubeAlanId = id }).ToList() ?? [],
                    BasvuruDepartmanlar = dto.DepartmanIds?.Select(id => new IsBasvuruDetayDepartman { DepartmanId = id }).ToList() ?? [],
                    BasvuruPozisyonlar = dto.DepartmanPozisyonIds?.Select(id => new IsBasvuruDetayPozisyon { DepartmanPozisyonId = id }).ToList() ?? [],
                    BasvuruProgramlar = dto.ProgramIds?.Select(id => new IsBasvuruDetayProgram { ProgramBilgisiId = id }).ToList() ?? [],
                    BasvuruOyunlar = dto.OyunIds?.Select(id => new IsBasvuruDetayOyun { OyunBilgisiId = id }).ToList() ?? []
                };

                personel.IsBasvuruDetay = isBasvuruDetay;

                await _context.Personeller.AddAsync(personel);
                await _context.SaveChangesAsync();
              
                if (dto.BasvuruOnay != null)
                {
                        // --- GÜNCEL VE GELİŞMİŞ IP YAKALAMA MANTIĞI ---
                        var context = _httpContextAccessor.HttpContext;
                        string ipAdresi = "Bilinmiyor";

                        if (context != null)
                        {
                            var request = context.Request;

                            // 1. İHTİMAL: Sunucu Cloudflare arkasındaysa gerçek IP buradadır (En güveniliri)
                            var cfHeader = request.Headers["CF-Connecting-IP"].FirstOrDefault();
                            if (!string.IsNullOrEmpty(cfHeader))
                            {
                                ipAdresi = cfHeader;
                            }
                            else
                            {
                                // 2. İHTİMAL: Standart Nginx veya Apache "X-Real-IP" kullanır
                                var realIpHeader = request.Headers["X-Real-IP"].FirstOrDefault();
                                if (!string.IsNullOrEmpty(realIpHeader))
                                {
                                    ipAdresi = realIpHeader;
                                }
                                else
                                {
                                    // 3. İHTİMAL: Standart X-Forwarded-For (Birden fazla IP gelebilir, ilkini alırız)
                                    var forwardedHeader = request.Headers["X-Forwarded-For"].FirstOrDefault();
                                    if (!string.IsNullOrEmpty(forwardedHeader))
                                    {
                                        ipAdresi = forwardedHeader.Split(',')[0].Trim();
                                    }
                                    else
                                    {
                                        // 4. İHTİMAL: Arada proxy yoksa (veya IIS in-process çalışıyorsa) standart .NET metodu
                                        ipAdresi = context.Connection?.RemoteIpAddress?.ToString() ?? "Bilinmiyor";
                                    }
                                }
                            }
                        }

                        // IPv6 yerel döngü adresini temizle
                        if (ipAdresi == "::1") ipAdresi = "127.0.0.1";
                    // ---------------------------------

                    string userAgent = context?.Request?.Headers["User-Agent"].ToString() ?? "Bilinmiyor";

                    var aktifKvkk = await _context.Kvkklar.FindAsync(dto.BasvuruOnay.KvkkId);

                    if (aktifKvkk != null)
                    {
                        var onay = new BasvuruOnay
                        {
                            PersonelId = personel.Id,
                            KvkkId = aktifKvkk.Id,
                            OnayDurum = dto.BasvuruOnay.OnayDurum,
                            IpAdres = ipAdresi, // Artık gerçek IP
                            KullaniciCihaz = userAgent,
                            KvkkVersiyon = aktifKvkk.KvkkVersiyon ?? "v1.0",
                            DogrulukAciklamaTr = aktifKvkk.DogrulukAciklamaTr ?? "Bu başvuru formunu imzalarken belirtilen her şeyin doğru ve eksiksiz olduğunu kabul ediyorum.",
                            KvkkAciklamaTr = aktifKvkk.KvkkAciklamaTr ?? "Başvurumu kabul ederek, kişisel verilerimin işlenmesini ve saklanmasını onaylıyorum.",
                            ReferansAciklamaTr = aktifKvkk.ReferansAciklamaTr ?? "Referanslarımla iletişime geçilmesine onay veriyorum.",
                            OnayTarihi = DateTime.Now
                        };

                        await _context.BasvuruOnaylari.AddAsync(onay);
                        await _context.SaveChangesAsync();
                    }
                }

                if (dto.VesikalikDosyasi != null && dto.VesikalikDosyasi.Length > 0)
                {
                    var imageResponse = await _imageService.UploadImageAsync(dto.VesikalikDosyasi, "personel");
                    if (imageResponse == null || !imageResponse.Success)
                    {
                        // Fotoğraf yüklenemezse hata fırlatıyoruz ki catch bloğuna düşüp ROLLBACK yapsın
                        throw new Exception("Vesikalık fotoğraf yüklenemediği için başvuru iptal edildi: " + imageResponse?.Message);
                    }
                    personel.KisiselBilgiler!.VesikalikFotograf = imageResponse.Data;
                    _context.KisiselBilgileri.Update(personel.KisiselBilgiler);
                    await _context.SaveChangesAsync();
                }

                var masterBasvuru = new MasterBasvuru
                {
                    PersonelId = personel.Id,
                    BasvuruTarihi = DateTime.Now,
                    BasvuruDurum = BasvuruDurum.YeniBasvuru,
                    BasvuruOnayAsamasi = BasvuruOnayAsamasi.Ik_Ilk_Degerlendirme,
                    BasvuruVersiyonNo = "v1.0"
                };
                await _context.MasterBasvurular.AddAsync(masterBasvuru);
                await _context.SaveChangesAsync();

                var adSoyad = personel.KisiselBilgiler != null
                        ? $"{personel.KisiselBilgiler.Ad} {personel.KisiselBilgiler.Soyadi}"
                        : "Bilinmeyen Personel";

                await _logService.LogBasvuruIslemAsync(
                    masterBasvuru.Id,
                    null,
                    LogIslemTipi.YeniBasvuru,
                    $"Yeni başvuru alındı: {adSoyad} (v1.0)"
                );

                await transaction.CommitAsync();

                var mapped = _mapper.Map<PersonelListDto>(personel);
                return ServiceResponse<PersonelListDto>.SuccessResult(mapped, "Başvurunuz başarıyla alındı.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ServiceResponse<PersonelListDto>.FailureResult($"İşlem Tamamlanamadı: {ex.Message}");
            }
        }

        public async Task<ServiceResponse<bool>> UpdateAsync(PersonelUpdateDto dto)
        {
            if (dto == null)
                return ServiceResponse<bool>.FailureResult("Form verileri sunucuya ulaşamadı (DTO Null).");

        
            // 1. Eğitim Bilgileri 
            if (dto.EgitimBilgileri != null)
            {
                foreach (var item in dto.EgitimBilgileri) item.PersonelId = dto.Id;
            }

            // 2. İş Deneyimleri
            if (dto.IsDeneyimleri != null)
            {
                foreach (var item in dto.IsDeneyimleri) item.PersonelId = dto.Id;
            }

            // 3. Sertifika Bilgileri
            if (dto.SertifikaBilgileri != null)
            {
                foreach (var item in dto.SertifikaBilgileri) item.PersonelId = dto.Id;
            }

            // 4. Yabancı Dil Bilgileri
            if (dto.YabanciDilBilgileri != null)
            {
                foreach (var item in dto.YabanciDilBilgileri) item.PersonelId = dto.Id;
            }

            // 5. Bilgisayar Bilgileri
            if (dto.BilgisayarBilgileri != null)
            {
                foreach (var item in dto.BilgisayarBilgileri) item.PersonelId = dto.Id;
            }

            // 6. Referans Bilgileri
            if (dto.ReferansBilgileri != null)
            {
                foreach (var item in dto.ReferansBilgileri) item.PersonelId = dto.Id;
            }

            // 7. Personel Ehliyetler (Eğer liste olarak geliyorsa)
            if (dto.PersonelEhliyetler != null)
            {
                foreach (var item in dto.PersonelEhliyetler) item.PersonelId = dto.Id;
            }
            var personel = await _context.Personeller
                .Include(p => p.KisiselBilgiler)
                .Include(p => p.DigerKisiselBilgiler)
                .Include(p => p.PersonelEhliyetler)
                .Include(p => p.EgitimBilgileri)
                .Include(p => p.SertifikaBilgileri)
                .Include(p => p.BilgisayarBilgileri)
                .Include(p => p.YabanciDilBilgileri)
                .Include(p => p.IsDeneyimleri)
                .Include(p => p.ReferansBilgileri)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruSubeler)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruAlanlar)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruDepartmanlar)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruPozisyonlar)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruProgramlar)
                .Include(p => p.IsBasvuruDetay!).ThenInclude(d => d.BasvuruOyunlar)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == dto.Id);

            if (personel == null) return ServiceResponse<bool>.FailureResult("Personel bulunamadı.");
            
           var egitimListesi = dto.EgitimBilgileri;
           var sertifikaListesi = dto.SertifikaBilgileri;
           var bilgisayarListesi = dto.BilgisayarBilgileri;
           var dilListesi = dto.YabanciDilBilgileri;
           var isListesi = dto.IsDeneyimleri;
           var referansListesi = dto.ReferansBilgileri;
           var ehliyetListesi = dto.PersonelEhliyetler;
            
          // AutoMapper listeleri ezmemesi için DTO içini temizliyoruz
          dto.EgitimBilgileri = null!;
          dto.SertifikaBilgileri = null!;
          dto.BilgisayarBilgileri = null!;
          dto.YabanciDilBilgileri = null!;
          dto.IsDeneyimleri = null!;
          dto.ReferansBilgileri = null!;
          dto.PersonelEhliyetler = null!;
            dto.BasvuruOnay = null!;

            if (personel.KisiselBilgiler != null && dto.KisiselBilgiler != null)
            {
                if (dto.KisiselBilgiler.Email != personel.KisiselBilgiler.Email)
                {
                    bool emailVarMi = await _context.KisiselBilgileri
                        .AnyAsync(x => x.Email == dto.KisiselBilgiler.Email && x.PersonelId != dto.Id);

                    if (emailVarMi) return ServiceResponse<bool>.FailureResult("Bu e-posta adresi kullanımda.");
                }
            }

            var kisiselTemp = dto.KisiselBilgiler;
            var digerTemp = dto.DigerKisiselBilgiler;
            dto.KisiselBilgiler = null!;
            dto.DigerKisiselBilgiler = null!;

            var orijinalKisisel = personel.KisiselBilgiler;
            var orijinalDiger = personel.DigerKisiselBilgiler;

            _mapper.Map(dto, personel);
            personel.GuncellemeTarihi = DateTime.Now;

            personel.KisiselBilgiler = orijinalKisisel;
            personel.DigerKisiselBilgiler = orijinalDiger;
            /*
            if (personel.KisiselBilgiler != null && kisiselTemp != null)
            {
                _mapper.Map(kisiselTemp, personel.KisiselBilgiler);
                personel.KisiselBilgiler.PersonelId = personel.Id;
                personel.KisiselBilgiler.DogumTarihi = personel.KisiselBilgiler.DogumTarihi.Date;
            }

            if (personel.DigerKisiselBilgiler != null && digerTemp != null)
            {
                _mapper.Map(digerTemp, personel.DigerKisiselBilgiler);
                personel.DigerKisiselBilgiler.PersonelId = personel.Id;
            }*/

            // --- DÜZELTİLMİŞ KİŞİSEL BİLGİLER BLOĞU ---
            if (personel.KisiselBilgiler != null && kisiselTemp != null)
            {
                // 1. Orijinal ID'yi güvene al
                int orijinalKisiselId = personel.KisiselBilgiler.Id;

                _mapper.Map(kisiselTemp, personel.KisiselBilgiler);
                personel.KisiselBilgiler.Id = orijinalKisiselId;
                personel.KisiselBilgiler.PersonelId = personel.Id;
                personel.KisiselBilgiler.DogumTarihi = personel.KisiselBilgiler.DogumTarihi.Date;
            }

            // --- DÜZELTİLMİŞ DİĞER KİŞİSEL BİLGİLER BLOĞU ---
            if (personel.DigerKisiselBilgiler != null && digerTemp != null)
            {
                int orijinalDigerId = personel.DigerKisiselBilgiler.Id;
                _mapper.Map(digerTemp, personel.DigerKisiselBilgiler);
                personel.DigerKisiselBilgiler.Id = orijinalDigerId;
                personel.DigerKisiselBilgiler.PersonelId = personel.Id;
            }

            dto.KisiselBilgiler = kisiselTemp!;
            dto.DigerKisiselBilgiler = digerTemp!;

            if (personel.IsBasvuruDetay == null)
            {
                personel.IsBasvuruDetay = new IsBasvuruDetay
                {
                    PersonelId = personel.Id,
                    NedenBiz = dto.NedenBiz ?? "",
                    LojmanTalebiVarMi = (SecimDurumu)dto.LojmanTalebi
                };
            }
            else
            {
                personel.IsBasvuruDetay.NedenBiz = dto.NedenBiz ?? "";
                personel.IsBasvuruDetay.LojmanTalebiVarMi = (SecimDurumu)dto.LojmanTalebi;
            }

            var detay = personel.IsBasvuruDetay;
            detay.BasvuruSubeler ??= new List<IsBasvuruDetaySube>();
            detay.BasvuruAlanlar ??= new List<IsBasvuruDetayAlan>();
            detay.BasvuruDepartmanlar ??= new List<IsBasvuruDetayDepartman>();
            detay.BasvuruPozisyonlar ??= new List<IsBasvuruDetayPozisyon>();
            detay.BasvuruProgramlar ??= new List<IsBasvuruDetayProgram>();
            detay.BasvuruOyunlar ??= new List<IsBasvuruDetayOyun>();

            UpdateDetailList(detay.BasvuruSubeler, dto.SubeIds, id => new IsBasvuruDetaySube { SubeId = id }, x => x.SubeId);
            UpdateDetailList(detay.BasvuruAlanlar, dto.SubeAlanIds, id => new IsBasvuruDetayAlan { SubeAlanId = id }, x => x.SubeAlanId);
            UpdateDetailList(detay.BasvuruDepartmanlar, dto.DepartmanIds, id => new IsBasvuruDetayDepartman { DepartmanId = id }, x => x.DepartmanId);
            UpdateDetailList(detay.BasvuruPozisyonlar, dto.DepartmanPozisyonIds, id => new IsBasvuruDetayPozisyon { DepartmanPozisyonId = id }, x => x.DepartmanPozisyonId);
            UpdateDetailList(detay.BasvuruProgramlar, dto.ProgramIds, id => new IsBasvuruDetayProgram { ProgramBilgisiId = id }, x => x.ProgramBilgisiId);
            UpdateDetailList(detay.BasvuruOyunlar, dto.OyunIds, id => new IsBasvuruDetayOyun { OyunBilgisiId = id }, x => x.OyunBilgisiId);

            var gelenEhliyetIds = new HashSet<int>(ehliyetListesi?.Select(x => x.EhliyetTuruId) ?? []);
            personel.PersonelEhliyetler ??= new List<PersonelEhliyet>();

            foreach (var item in personel.PersonelEhliyetler.ToList())
                if (!gelenEhliyetIds.Contains(item.EhliyetTuruId)) _context.Set<PersonelEhliyet>().Remove(item);

            var mevcutEhliyetIds = personel.PersonelEhliyetler.Select(x => x.EhliyetTuruId).ToHashSet();
            foreach (var id in gelenEhliyetIds)
                if (!mevcutEhliyetIds.Contains(id)) personel.PersonelEhliyetler.Add(new PersonelEhliyet { PersonelId = personel.Id, EhliyetTuruId = id });

            personel.EgitimBilgileri ??= new List<EgitimBilgisi>();
            UpdateCollection(personel.EgitimBilgileri, egitimListesi, (entity, dtoItem) =>
            {
                _mapper.Map(dtoItem, entity);

                if (entity.Gano > 0)
                {
                    int notSistemi = (int)entity.NotSistemi;
                    decimal esikDeger = (notSistemi == 1) ? 100m : 4m;
                    decimal gano = (decimal)entity.Gano;

                    while (gano > esikDeger)
                    {
                        gano /= 10;
                    }
                    entity.Gano = Math.Round(gano, 2);
                }
            }, personel.Id);

            personel.SertifikaBilgileri ??= new List<SertifikaBilgisi>();
            UpdateCollection(personel.SertifikaBilgileri, sertifikaListesi, (entity, dtoItem) => _mapper.Map(dtoItem, entity), personel.Id);

            personel.BilgisayarBilgileri ??= new List<BilgisayarBilgisi>();
            UpdateCollection(personel.BilgisayarBilgileri, bilgisayarListesi, (entity, dtoItem) => _mapper.Map(dtoItem, entity), personel.Id);

            personel.YabanciDilBilgileri ??= new List<YabanciDilBilgisi>();
            UpdateCollection(personel.YabanciDilBilgileri, dilListesi, (entity, dtoItem) => _mapper.Map(dtoItem, entity), personel.Id);

            personel.IsDeneyimleri ??= new List<IsDeneyimi>();
            UpdateCollection(personel.IsDeneyimleri, isListesi, (entity, dtoItem) => _mapper.Map(dtoItem, entity), personel.Id);

            personel.ReferansBilgileri ??= new List<ReferansBilgisi>();
            UpdateCollection(personel.ReferansBilgileri, referansListesi, (entity, dtoItem) => _mapper.Map(dtoItem, entity), personel.Id);

            LogCvDegisiklikleri(personel.Id);


            if (dto.BasvuruOnay != null)
            {
                // --- GÜNCEL VE GELİŞMİŞ IP YAKALAMA MANTIĞI ---
                var context = _httpContextAccessor.HttpContext;
                string ipAdresi = "Bilinmiyor";

                if (context != null)
                {
                    var request = context.Request;

                    // 1. İHTİMAL: Sunucu Cloudflare arkasındaysa gerçek IP buradadır (En güveniliri)
                    var cfHeader = request.Headers["CF-Connecting-IP"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(cfHeader))
                    {
                        ipAdresi = cfHeader;
                    }
                    else
                    {
                        // 2. İHTİMAL: Standart Nginx veya Apache "X-Real-IP" kullanır
                        var realIpHeader = request.Headers["X-Real-IP"].FirstOrDefault();
                        if (!string.IsNullOrEmpty(realIpHeader))
                        {
                            ipAdresi = realIpHeader;
                        }
                        else
                        {
                            // 3. İHTİMAL: Standart X-Forwarded-For (Birden fazla IP gelebilir, ilkini alırız)
                            var forwardedHeader = request.Headers["X-Forwarded-For"].FirstOrDefault();
                            if (!string.IsNullOrEmpty(forwardedHeader))
                            {
                                ipAdresi = forwardedHeader.Split(',')[0].Trim();
                            }
                            else
                            {
                                // 4. İHTİMAL: Arada proxy yoksa (veya IIS in-process çalışıyorsa) standart .NET metodu
                                ipAdresi = context.Connection?.RemoteIpAddress?.ToString() ?? "Bilinmiyor";
                            }
                        }
                    }
                }

                // IPv6 yerel döngü adresini IPv4'e çevir
                if (ipAdresi == "::1") ipAdresi = "127.0.0.1";
                // ---------------------------------

                var userAgent = context?.Request?.Headers["User-Agent"].ToString() ?? "Bilinmiyor";
                var aktifKvkk = await _context.Kvkklar.FindAsync(dto.BasvuruOnay.KvkkId);

                if (aktifKvkk != null)
                {
                    var onay = new BasvuruOnay
                    {
                        PersonelId = personel.Id,
                        KvkkId = aktifKvkk.Id,
                        OnayDurum = dto.BasvuruOnay.OnayDurum,
                        IpAdres = ipAdresi, // Artık gerçek IP
                        KullaniciCihaz = userAgent,
                        KvkkVersiyon = aktifKvkk.KvkkVersiyon ?? "v1.0",
                        DogrulukAciklamaTr = aktifKvkk.DogrulukAciklamaTr ?? "Bu başvuru formunu imzalarken belirtilen her şeyin doğru ve eksiksiz olduğunu kabul ediyorum.",
                        KvkkAciklamaTr = aktifKvkk.KvkkAciklamaTr ?? "Başvurumu kabul ederek, kişisel verilerimin işlenmesini ve saklanmasını onaylıyorum.",
                        ReferansAciklamaTr = aktifKvkk.ReferansAciklamaTr ?? "Referanslarımla iletişime geçilmesine onay veriyorum.",
                        OnayTarihi = DateTime.Now
                    };
                    await _context.BasvuruOnaylari.AddAsync(onay);
                }
            }
            if (dto.VesikalikDosyasi != null && dto.VesikalikDosyasi.Length > 0)
            {
                // Ozel Isim Olustur (Örn: 35_mehmet_yalcinkaya)
                string ozelIsim = $"{personel.Id}_{personel.KisiselBilgiler?.Ad}_{personel.KisiselBilgiler?.Soyadi}";

                var oldPhoto = personel.KisiselBilgiler?.VesikalikFotograf;

                var imageResponse = await _imageService.UploadImageAsync(
                    dto.VesikalikDosyasi,
                    "personel-fotograflari", // Controller'da kullandığınız klasör adını buraya taşıdım
                    ozelIsim, // Orijinal isteğinizdeki özel isim mantığı eklendi
                    oldPhoto);

                if (imageResponse.Success)
                {
                    personel.KisiselBilgiler!.VesikalikFotograf = imageResponse.Data;
                }
                else
                {
                    return ServiceResponse<bool>.FailureResult(imageResponse.Message!);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
                return ServiceResponse<bool>.SuccessResult(true, "Bilgiler güncellendi.");
            }
            catch (DbUpdateException ex)
            {
                var message = ex.Message;
                var inner = ex.InnerException;
                while (inner != null)
                {
                    message += " | DETAY: " + inner.Message;
                    inner = inner.InnerException;
                }
                return ServiceResponse<bool>.FailureResult($"Veritabanı Hatası: {message}");
            }
            catch (Exception ex)
            {
                return ServiceResponse<bool>.FailureResult($"Sistem Hatası: {ex.Message}");
            }
        }

        public async Task<ServiceResponse<bool>> UpdateVesikalikAsync(int id, string dosyaAdi)
        {
            var personel = await _context.Personeller
                .Include(p => p.KisiselBilgiler)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (personel?.KisiselBilgiler == null)
                return ServiceResponse<bool>.FailureResult("Personel veya kişisel bilgiler bulunamadı.");

            personel.KisiselBilgiler.VesikalikFotograf = dosyaAdi;
            await _context.SaveChangesAsync();

            return ServiceResponse<bool>.SuccessResult(true, "Fotoğraf güncellendi.");
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            // Personeli tüm alt tablolarıyla birlikte buluyoruz (Cascade delete için EF Core'a yardımcı oluyoruz)
            var entity = await _context.Personeller
                .Include(p => p.KisiselBilgiler)
                .Include(p => p.IsBasvuruDetay)
                .Include(p => p.BasvuruOnay) // KVKK Logları
                .FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                return ServiceResponse<bool>.FailureResult("Kayıt bulunamadı.");

            // EF Core'da tablolar arası ilişki 'Cascade' ise Personel silinince hepsi silinir.
            _context.Personeller.Remove(entity);

            await _context.SaveChangesAsync();
            return ServiceResponse<bool>.SuccessResult(true, "Adaya ait tüm bilgiler ve dijital izler kalıcı olarak silindi.");
        }

        public async Task<ServiceResponse<PersonelListDto>> GetByEmailAsync(string email)
        {
            var entity = await _context.Personeller
                .Include(p => p.KisiselBilgiler!).ThenInclude(k => k.Uyruk!)
                .Include(p => p.KisiselBilgiler!).ThenInclude(k => k.DogumUlke!)
                .Include(p => p.KisiselBilgiler!).ThenInclude(k => k.DogumSehir!)
                .Include(p => p.DigerKisiselBilgiler)

                .Include(p => p.IsBasvuruDetay).ThenInclude(d => d!.BasvuruSubeler!).ThenInclude(s => s.Sube)
                .Include(p => p.IsBasvuruDetay).ThenInclude(d => d!.BasvuruAlanlar!).ThenInclude(a => a.SubeAlan)
                .Include(p => p.IsBasvuruDetay).ThenInclude(d => d!.BasvuruDepartmanlar!).ThenInclude(dp => dp.Departman)
                .Include(p => p.IsBasvuruDetay).ThenInclude(d => d!.BasvuruPozisyonlar!).ThenInclude(pz => pz.DepartmanPozisyon)
                .Include(p => p.IsBasvuruDetay).ThenInclude(d => d!.BasvuruProgramlar!).ThenInclude(pr => pr.ProgramBilgisi)
                .Include(p => p.IsBasvuruDetay).ThenInclude(d => d!.BasvuruOyunlar!).ThenInclude(o => o.OyunBilgileri)

                .Include(p => p.EgitimBilgileri)
                .Include(p => p.IsDeneyimleri)
                .Include(p => p.SertifikaBilgileri)
                .Include(p => p.YabanciDilBilgileri)
                .Include(p => p.BilgisayarBilgileri)
                .Include(p => p.ReferansBilgileri)
                .Include(p => p.PersonelEhliyetler)
                .AsNoTracking()
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.KisiselBilgiler!.Email == email);

            if (entity == null)
                return ServiceResponse<PersonelListDto>.FailureResult("Kayıt bulunamadı.");

            var mapped = _mapper.Map<PersonelListDto>(entity);
            return ServiceResponse<PersonelListDto>.SuccessResult(mapped);
        }

        private void LogCvDegisiklikleri(int personelId)
        {
            // 1. İlgili Master Başvuru ID'sini bul
            var sonBasvuru = _context.MasterBasvurular
                .Where(x => x.PersonelId == personelId)
                .OrderByDescending(x => x.BasvuruTarihi)
                .FirstOrDefault();
            int? masterBasvuruId = sonBasvuru?.Id;

            // 2. Değişiklikleri Yakala
            var changes = _context.ChangeTracker.Entries()
                .Where(x => x.State == EntityState.Added || x.State == EntityState.Modified || x.State == EntityState.Deleted)
                .ToList();

            var logListesi = new List<CvDegisiklikLog>();
            var islemZamani = DateTime.Now;

            // --- AYARLAR ---

            // A) Kesinlikle Loglanmayacak Teknik Alanlar
            var gizliAlanlar = new HashSet<string>
    {
        "Id", "PersonelId", "MasterBasvuruId", "IsBasvuruDetayId",
        "GuncellemeTarihi", "OlusturmaTarihi", "Silindi", "AktifMi", "NotSistemi"
    };

            // B) Loglanmasına İZİN VERİLEN Foreign Key'ler (Seçim Kutuları)
            // Normalde FK'lar loglanmaz ama bunlar kullanıcının seçtiği değerler olduğu için loglanmalı.
            var izinVerilenIdler = new HashSet<string>
    {
        "EhliyetTuruId",        // PersonelEhliyet
        "SubeId",               // IsBasvuruDetaySube
        "SubeAlanId",           // IsBasvuruDetayAlan
        "DepartmanId",          // IsBasvuruDetayDepartman
        "DepartmanPozisyonId",  // IsBasvuruDetayPozisyon
        "ProgramBilgisiId",     // IsBasvuruDetayProgram
        "OyunBilgisiId",        // IsBasvuruDetayOyun
        "KktcBelgeId",          // DigerKisiselBilgiler
        "UlkeId", "SehirId",    // Adres veya İş Deneyimi
        "DilId"                 // Yabancı Dil
    };

            foreach (var entry in changes)
            {
                // Log tablosunun kendisini loglama :)
                if (entry.Entity is CvDegisiklikLog) continue;

                string tabloAdi = entry.Entity.GetType().Name.Replace("Proxy", "");

                // Kaydın ID'sini al (Varsa)
                int kayitId = 0;
                var idProp = entry.Entity.GetType().GetProperty("Id");
                if (idProp != null) kayitId = (int?)idProp.GetValue(entry.Entity) ?? 0;

                foreach (var prop in entry.Properties)
                {
                    string alanAdi = prop.Metadata.Name;

                    // --- FİLTRELEME MANTIĞI ---

                    // 1. Gizli alan ise ATLA
                    if (gizliAlanlar.Contains(alanAdi)) continue;

                    // 2. Eğer alan bir Foreign Key ise VE İzin verilenler listesinde YOKSA -> ATLA
                    // (Örn: PersonelId FK'dır ama izin listesinde yok -> Atla)
                    // (Örn: EhliyetTuruId FK'dır ama izin listesinde var -> Logla)
                    if (prop.Metadata.IsForeignKey() && !izinVerilenIdler.Contains(alanAdi)) continue;

                    string? eskiDeger = null;
                    string? yeniDeger = null;
                    bool logEkle = false;
                    LogIslemTipi islemTipi = LogIslemTipi.Guncelleme;

                    // --- DURUMA GÖRE LOGLAMA ---

                    // Durum 1: GÜNCELLEME (Modified)
                    if (entry.State == EntityState.Modified && prop.IsModified)
                    {
                        eskiDeger = prop.OriginalValue?.ToString();
                        yeniDeger = prop.CurrentValue?.ToString();

                        // Değer değişmemişse loglama
                        if (eskiDeger == yeniDeger) continue;

                        logEkle = true;
                        islemTipi = LogIslemTipi.Guncelleme;
                    }
                    // Durum 2: YENİ KAYIT (Added)
                    else if (entry.State == EntityState.Added)
                    {
                        yeniDeger = prop.CurrentValue?.ToString();
                        // Boş değerleri "Eklendi" diye loglamaya gerek yok
                        if (!string.IsNullOrEmpty(yeniDeger))
                        {
                            eskiDeger = null;
                            logEkle = true;
                            islemTipi = LogIslemTipi.Ekleme;
                        }
                    }
                    // Durum 3: SİLME (Deleted)
                    else if (entry.State == EntityState.Deleted)
                    {
                        eskiDeger = prop.OriginalValue?.ToString();
                        if (!string.IsNullOrEmpty(eskiDeger))
                        {
                            yeniDeger = null;
                            logEkle = true;
                            islemTipi = LogIslemTipi.Silme;
                        }
                    }

                    // Kayıt Ekleme
                    if (logEkle)
                    {
                        logListesi.Add(new CvDegisiklikLog
                        {
                            PersonelId = personelId,
                            MasterBasvuruId = masterBasvuruId,
                            DegisenTabloAdi = tabloAdi,
                            DegisenKayitId = kayitId,
                            DegisenAlanAdi = alanAdi,
                            EskiDeger = eskiDeger,
                            YeniDeger = yeniDeger,
                            DegisiklikTipi = islemTipi,
                            DegisiklikTarihi = islemZamani
                        });
                    }
                }
            }

            // Toplu Kayıt
            if (logListesi.Count > 0) _context.Set<CvDegisiklikLog>().AddRange(logListesi);
        }

        public async Task<ServiceResponse<List<BasvuruOnayListDto>>> GetOnayLoglariAsync()
        {
            try
            {
                var loglar = await _context.BasvuruOnaylari
                    .Include(x => x.Personel)
                        .ThenInclude(p => p!.KisiselBilgiler)
                        .Include(x => x.Personel)
            .Include(x => x.Personel)
            .ThenInclude(p => p!.MasterBasvuru)
                    .OrderByDescending(x => x.OnayTarihi)
                    .ToListAsync();

                var mapped = _mapper.Map<List<BasvuruOnayListDto>>(loglar);
                return ServiceResponse<List<BasvuruOnayListDto>>.SuccessResult(mapped);
            }
            catch (Exception ex)
            {
                return ServiceResponse<List<BasvuruOnayListDto>>.FailureResult($"Loglar getirilirken hata: {ex.Message}");
            }
        }

        private static void UpdateDetailList<TEntity>(ICollection<TEntity> dbList, List<int>? newIds, Func<int, TEntity> creator, Func<TEntity, int> idSelector) where TEntity : class
        {
            var ids = new HashSet<int>(newIds ?? new List<int>());
            var toRemove = dbList.Where(x => !ids.Contains(idSelector(x))).ToList();
            foreach (var item in toRemove) dbList.Remove(item);

            var existingIds = dbList.Select(idSelector).ToHashSet();
            foreach (var id in ids.Except(existingIds)) dbList.Add(creator(id));
        }


        // Bu metodun amacı: DB'deki listeyi, DTO'dan gelen listeyle eşitlemektir.
        private static void UpdateCollection<TEntity, TDto>(ICollection<TEntity> dbList, IEnumerable<TDto>? dtoList, Action<TEntity, TDto> mapAction, int personelId)
            where TEntity : class
            where TDto : class
        {
            if (dbList == null) return;
            dtoList ??= new List<TDto>();

            // 1. Gelen ID'leri Hazırla
            var incomingIds = new HashSet<int>();
            foreach (var dtoItem in dtoList)
            {
                var idProp = dtoItem.GetType().GetProperty("Id");
                var val = (int?)idProp?.GetValue(dtoItem) ?? 0;
                if (val > 0) incomingIds.Add(val);
            }

            // 2. SİLME (Delete)
            // DB'de olup da Gelen Listede olmayanları sil
            var toRemove = dbList.Where(e =>
            {
                var idVal = (int?)e.GetType().GetProperty("Id")?.GetValue(e) ?? 0;
                // Eğer DB'deki ID listede yoksa sil
                return !incomingIds.Contains(idVal);
            }).ToList();

            foreach (var item in toRemove) dbList.Remove(item);

            // 3. GÜNCELLEME ve EKLEME (Upsert)
            foreach (var dtoItem in dtoList)
            {
                var idProp = dtoItem.GetType().GetProperty("Id");
                var dtoId = (int?)idProp?.GetValue(dtoItem) ?? 0;

                // --- GÜNCELLEME ---
                if (dtoId > 0)
                {
                    var existingEntity = dbList.FirstOrDefault(e =>
                        ((int?)e.GetType().GetProperty("Id")?.GetValue(e) ?? 0) == dtoId);

                    if (existingEntity != null)
                    {
                        // Mevcut entity'nin ID'sini koru!
                        var originalId = dtoId;

                        mapAction(existingEntity, dtoItem); // Alanları güncelle

                        // AutoMapper ID'yi bozduysa düzelt
                        var entityIdProp = existingEntity.GetType().GetProperty("Id");
                        if (entityIdProp != null && entityIdProp.CanWrite)
                        {
                            entityIdProp.SetValue(existingEntity, originalId);
                        }
                    }
                }
                // --- EKLEME ---
                else
                {
                    var newEntity = Activator.CreateInstance<TEntity>();
                    if (newEntity != null)
                    {
                        mapAction(newEntity, dtoItem);

                        // Foreign Key Ataması (PersonelId)
                        var pIdProp = newEntity.GetType().GetProperty("PersonelId");
                        if (pIdProp != null && pIdProp.CanWrite) pIdProp.SetValue(newEntity, personelId);

                        // ID'nin 0 olduğundan emin ol (Identity insert için)
                        var idPrp = newEntity.GetType().GetProperty("Id");
                        if (idPrp != null && idPrp.CanWrite) idPrp.SetValue(newEntity, 0);

                        dbList.Add(newEntity);
                    }
                }
            }
        }
      
    }
}