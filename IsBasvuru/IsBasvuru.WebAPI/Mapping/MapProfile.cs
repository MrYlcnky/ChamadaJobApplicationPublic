using AutoMapper;
using IsBasvuru.Domain.DTOs.AdminDtos.PanelKullaniciDtos;
using IsBasvuru.Domain.DTOs.AdminDtos.RolDtos;
using IsBasvuru.Domain.DTOs.LogDtos.BasvuruLogDtos;
using IsBasvuru.Domain.DTOs.LogDtos.CvLogDtos;
using IsBasvuru.Domain.DTOs.MasterBasvuruDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BasvuruOnayDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.BilgisayarBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.DigerKisiselBilgilerDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.EgitimBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsBasvuruDetayDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.IsDeneyimiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.KisiselBilgilerDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.KisiselBilgilerListDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.ReferansBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.SertifikaBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelBilgileriDtos.YabanciDilBilgisiDtos;
using IsBasvuru.Domain.DTOs.PersonelDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterAlanDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterDepartmanDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterGorev;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterOyun;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterPozisyonDtos;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterProgram;
using IsBasvuru.Domain.DTOs.SirketMasterYapisiDtos.MasterSubeAlan;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.DepartmanPozisyonDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevAtamaDetayDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.GorevDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.OyunBilgisiDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.PersonelEhliyetDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.ProgramBilgisiDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeAlanDtos;
using IsBasvuru.Domain.DTOs.SirketYapisiDtos.SubeDtos;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.DilDtos;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.EhliyetTuruDtos;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.IlceDtos;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.KktcBelgeDtos;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.KvkkDtos;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.SehirDtos;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.UlkeDtos;
using IsBasvuru.Domain.DTOs.TanimlamalarDtos.UyrukDtos;
using IsBasvuru.Domain.Entities;
using IsBasvuru.Domain.Entities.AdminBilgileri;
using IsBasvuru.Domain.Entities.Log;
using IsBasvuru.Domain.Entities.PersonelBilgileri;
using IsBasvuru.Domain.Entities.SirketYapisi;
using IsBasvuru.Domain.Entities.SirketYapisi.GorevAtama;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;
using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Enums;
using System.Collections.Generic;
using System.Linq;

namespace IsBasvuru.WebAPI.Mapping
{
    public class MapProfile : Profile
    {
        public MapProfile()
        {
            // =======================================================
            // 1. PERSONEL VE DETAYLARI
            // =======================================================

            CreateMap<PersonelCreateDto, IsBasvuruDetay>()
                .ForMember(dest => dest.LojmanTalebiVarMi, opt => opt.MapFrom(src => (SecimDurumu)src.LojmanTalebi))
                .ForMember(dest => dest.BasvuruSubeler, opt => opt.Ignore())
                .ForMember(dest => dest.BasvuruAlanlar, opt => opt.Ignore())
                .ForMember(dest => dest.BasvuruDepartmanlar, opt => opt.Ignore())
                .ForMember(dest => dest.BasvuruPozisyonlar, opt => opt.Ignore())
                .ForMember(dest => dest.BasvuruProgramlar, opt => opt.Ignore())
                .ForMember(dest => dest.BasvuruOyunlar, opt => opt.Ignore());

            // Create (DTO -> Entity)
            CreateMap<PersonelCreateDto, Personel>()
                .ForMember(dest => dest.IsBasvuruDetay, opt => opt.Ignore());

            // Update (DTO -> Entity)
            CreateMap<PersonelUpdateDto, Personel>()
                .ForMember(dest => dest.EgitimBilgileri, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeneyimleri, opt => opt.Ignore())
                .ForMember(dest => dest.YabanciDilBilgileri, opt => opt.Ignore())
                .ForMember(dest => dest.BilgisayarBilgileri, opt => opt.Ignore())
                .ForMember(dest => dest.SertifikaBilgileri, opt => opt.Ignore())
                .ForMember(dest => dest.ReferansBilgileri, opt => opt.Ignore())
                .ForMember(dest => dest.PersonelEhliyetler, opt => opt.Ignore())
                .ForMember(dest => dest.IsBasvuruDetay, opt => opt.Ignore());

            // List / Get (Entity -> DTO)
            CreateMap<Personel, PersonelListDto>()
                .ForMember(dest => dest.LojmanTalebi, opt => opt.MapFrom(src =>
                    src.IsBasvuruDetay != null ? (int)src.IsBasvuruDetay.LojmanTalebiVarMi : 0))
                .ForMember(dest => dest.NedenBiz, opt => opt.MapFrom(src =>
                    src.IsBasvuruDetay != null ? src.IsBasvuruDetay.NedenBiz : string.Empty))
                .ForMember(dest => dest.FotografYolu, opt => opt.MapFrom(src =>
                    src.KisiselBilgiler != null ? src.KisiselBilgiler.VesikalikFotograf : string.Empty))
                .ForMember(dest => dest.Ad, opt => opt.MapFrom(src =>
                    src.KisiselBilgiler != null ? src.KisiselBilgiler.Ad : string.Empty))
                .ForMember(dest => dest.Soyad, opt => opt.MapFrom(src =>
                    src.KisiselBilgiler != null ? src.KisiselBilgiler.Soyadi : string.Empty))
                .ForMember(dest => dest.IsBasvuruDetay, opt => opt.MapFrom(src => src.IsBasvuruDetay));

            // IsBasvuruDetay -> IsBasvuruDetayDto
            CreateMap<IsBasvuruDetay, IsBasvuruDetayDto>()
                .ForMember(dest => dest.LojmanTalebiVarMi, opt => opt.MapFrom(src => (int)src.LojmanTalebiVarMi))
                .ForMember(dest => dest.NedenBiz, opt => opt.MapFrom(src => src.NedenBiz ?? string.Empty))

                .ForMember(dest => dest.BasvuruSubeler, opt => opt.MapFrom(src =>
                    src.BasvuruSubeler != null
                        ? src.BasvuruSubeler.Where(x => x.Sube != null).Select(x => x.Sube!).ToList()
                        : new List<Sube>()))

                .ForMember(dest => dest.BasvuruAlanlar, opt => opt.MapFrom(src =>
                    src.BasvuruAlanlar != null
                        ? src.BasvuruAlanlar.Where(x => x.SubeAlan != null).Select(x => x.SubeAlan!).ToList()
                        : new List<SubeAlan>()))

                .ForMember(dest => dest.BasvuruDepartmanlar, opt => opt.MapFrom(src =>
                    src.BasvuruDepartmanlar != null
                        ? src.BasvuruDepartmanlar.Where(x => x.Departman != null).Select(x => x.Departman!).ToList()
                        : new List<Departman>()))

                .ForMember(dest => dest.BasvuruPozisyonlar, opt => opt.MapFrom(src =>
                    src.BasvuruPozisyonlar != null
                        ? src.BasvuruPozisyonlar.Where(x => x.DepartmanPozisyon != null).Select(x => x.DepartmanPozisyon!).ToList()
                        : new List<DepartmanPozisyon>()))

                .ForMember(dest => dest.BasvuruProgramlar, opt => opt.MapFrom(src =>
                    src.BasvuruProgramlar != null
                        ? src.BasvuruProgramlar.Where(x => x.ProgramBilgisi != null).Select(x => x.ProgramBilgisi!).ToList()
                        : new List<ProgramBilgisi>()))

                .ForMember(dest => dest.BasvuruOyunlar, opt => opt.MapFrom(src =>
                    src.BasvuruOyunlar != null
                        ? src.BasvuruOyunlar.Where(x => x.OyunBilgileri != null).Select(x => x.OyunBilgileri!).ToList()
                        : new List<OyunBilgisi>()));

            CreateMap<IsBasvuruDetayProgram, ProgramBilgisiListDto>()
    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProgramBilgisiId))
    .ForMember(dest => dest.ProgramAdi, opt => opt.MapFrom(src => src.ProgramBilgisi != null ? src.ProgramBilgisi.ProgramAdi : null))
    .ForMember(dest => dest.MasterProgramAdi, opt => opt.MapFrom(src =>
        src.ProgramBilgisi != null && src.ProgramBilgisi.MasterProgram != null
        ? src.ProgramBilgisi.MasterProgram.MasterProgramAdi
        : null));

            // --- Mapping for Games ---
            CreateMap<IsBasvuruDetayOyun, OyunBilgisiListDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.OyunBilgisiId))
                .ForMember(dest => dest.OyunAdi, opt => opt.MapFrom(src => src.OyunBilgileri != null ? src.OyunBilgileri.OyunAdi : null))
                .ForMember(dest => dest.MasterOyunAdi, opt => opt.MapFrom(src =>
                    src.OyunBilgileri != null && src.OyunBilgileri.MasterOyun != null
                    ? src.OyunBilgileri.MasterOyun.MasterOyunAdi
                    : null));

            // =======================================================
            // 2. KİŞİSEL BİLGİLER VE ALT NESNELER
            // =======================================================
            CreateMap<KisiselBilgilerDto, KisiselBilgiler>().ReverseMap();
            CreateMap<KisiselBilgilerListDto, KisiselBilgiler>().ReverseMap();

            CreateMap<KisiselBilgiler, KisiselBilgilerListDto>()
                .ForMember(dest => dest.UyrukAdi, opt => opt.MapFrom(src => src.Uyruk != null ? src.Uyruk.UyrukAdi : src.UyrukAdi))
                .ForMember(dest => dest.DogumUlkeAdi, opt => opt.MapFrom(src => src.DogumUlke != null ? src.DogumUlke.UlkeAdi : src.DogumUlkeAdi))
                .ForMember(dest => dest.DogumSehirAdi, opt => opt.MapFrom(src => src.DogumSehir != null ? src.DogumSehir.SehirAdi : src.DogumSehirAdi))
                .ForMember(dest => dest.DogumIlceAdi, opt => opt.MapFrom(src => src.DogumIlce != null ? src.DogumIlce.IlceAdi : src.DogumIlceAdi))
                .ForMember(dest => dest.IkametgahUlkeAdi, opt => opt.MapFrom(src => src.IkametgahUlke != null ? src.IkametgahUlke.UlkeAdi : src.IkametgahUlkeAdi))
                .ForMember(dest => dest.IkametgahSehirAdi, opt => opt.MapFrom(src => src.IkametgahSehir != null ? src.IkametgahSehir.SehirAdi : src.IkametgahSehirAdi))
                .ForMember(dest => dest.IkametgahIlceAdi, opt => opt.MapFrom(src => src.IkametgahIlce != null ? src.IkametgahIlce.IlceAdi : src.IkametgahIlceAdi));

            CreateMap<DigerKisiselBilgilerCreateDto, DigerKisiselBilgiler>().ReverseMap();
            CreateMap<DigerKisiselBilgilerUpdateDto, DigerKisiselBilgiler>().ReverseMap();

            // Veri Listeleme (Entity -> DTO)
            CreateMap<DigerKisiselBilgiler, DigerKisiselBilgilerListDto>()
                .ForMember(dest => dest.KktcBelgeAdi, opt => opt.MapFrom(src =>
                    src.KktcBelge != null ? src.KktcBelge.BelgeAdi : "-"))
                .ForMember(dest => dest.DavaDurumuAdi, opt => opt.MapFrom(src => src.DavaDurumu.ToString()))
                .ForMember(dest => dest.SigaraKullanimiAdi, opt => opt.MapFrom(src => src.SigaraKullanimi.ToString()))
                .ForMember(dest => dest.AskerlikDurumuAdi, opt => opt.MapFrom(src => src.AskerlikDurumu.ToString()))
                .ForMember(dest => dest.KaliciRahatsizlikAdi, opt => opt.MapFrom(src => src.KaliciRahatsizlik.ToString()))
                .ForMember(dest => dest.EhliyetDurumuAdi, opt => opt.MapFrom(src => src.EhliyetDurumu.ToString()));

            // =======================================================
            // 3. EĞİTİM, İŞ, SERTİFİKA VB.
            // =======================================================

            // --- EĞİTİM BİLGİSİ ---
            CreateMap<EgitimBilgisiCreateDto, EgitimBilgisi>().ReverseMap();
            CreateMap<EgitimBilgisiUpdateDto, EgitimBilgisi>();
            CreateMap<EgitimBilgisi, EgitimBilgisiListDto>()
                .ForMember(dest => dest.EgitimSeviyesi, opt => opt.MapFrom(src => (int)src.EgitimSeviyesi))
                .ForMember(dest => dest.EgitimSeviyesiAdi, opt => opt.MapFrom(src => src.EgitimSeviyesi.ToString())); ;
            CreateMap<EgitimBilgisiListDto, EgitimBilgisi>();

            // --- İŞ DENEYİMİ ---
            CreateMap<IsDeneyimiCreateDto, IsDeneyimi>().ReverseMap();
           
            CreateMap<IsDeneyimiUpdateDto, IsDeneyimi>();
            CreateMap<IsDeneyimi, IsDeneyimiListDto>()
            .ForMember(dest => dest.UlkeAdi, opt => opt.MapFrom(src => src.Ulke != null ? src.Ulke.UlkeAdi : src.UlkeAdi))
            .ForMember(dest => dest.SehirAdi, opt => opt.MapFrom(src => src.Sehir != null ? src.Sehir.SehirAdi : src.SehirAdi))
            .ReverseMap();

            // --- YABANCI DİL ---
            CreateMap<YabanciDilBilgisiCreateDto, YabanciDilBilgisi>();
            CreateMap<YabanciDilBilgisiUpdateDto, YabanciDilBilgisi>();
            CreateMap<YabanciDilBilgisi, YabanciDilBilgisiListDto>()
                .ForMember(dest => dest.DilAdi, opt => opt.MapFrom(src => src.Dil != null ? src.Dil.DilAdi : null))
                .ForMember(dest => dest.KonusmaSeviyesiAdi, opt => opt.MapFrom(src => src.KonusmaSeviyesi.ToString()))
                .ForMember(dest => dest.YazmaSeviyesiAdi, opt => opt.MapFrom(src => src.YazmaSeviyesi.ToString()))
                .ForMember(dest => dest.OkumaSeviyesiAdi, opt => opt.MapFrom(src => src.OkumaSeviyesi.ToString()))
                .ForMember(dest => dest.DinlemeSeviyesiAdi, opt => opt.MapFrom(src => src.DinlemeSeviyesi.ToString()));

            // --- BİLGİSAYAR BİLGİSİ ---
            CreateMap<BilgisayarBilgisiCreateDto, BilgisayarBilgisi>().ReverseMap();
            CreateMap<BilgisayarBilgisiListDto, BilgisayarBilgisi>().ReverseMap();
            CreateMap<BilgisayarBilgisiUpdateDto, BilgisayarBilgisi>();

            // --- SERTİFİKA ---
            CreateMap<SertifikaBilgisiCreateDto, SertifikaBilgisi>().ReverseMap();
            CreateMap<SertifikaBilgisiListDto, SertifikaBilgisi>().ReverseMap();
            CreateMap<SertifikaBilgisiUpdateDto, SertifikaBilgisi>();

            // --- REFERANS ---
            CreateMap<ReferansBilgisiCreateDto, ReferansBilgisi>().ReverseMap();
            CreateMap<ReferansBilgisiListDto, ReferansBilgisi>().ReverseMap();
            CreateMap<ReferansBilgisiUpdateDto, ReferansBilgisi>();

            // PersonelEhliyet
            CreateMap<PersonelEhliyetCreateDto, PersonelEhliyet>();
            CreateMap<PersonelEhliyetUpdateDto, PersonelEhliyet>();
            CreateMap<PersonelEhliyet, PersonelEhliyetListDto>()
                .ForMember(dest => dest.EhliyetTuruAdi, opt => opt.MapFrom(src => src.EhliyetTuru != null ? src.EhliyetTuru.EhliyetTuruAdi : ""));

            // =======================================================
            // 4. ŞİRKET YAPISI VE TANIMLAMALAR (MASTER)
            // =======================================================

            // MasterAlan
            CreateMap<MasterAlan, MasterAlanListDto>().ReverseMap();
            CreateMap<MasterAlanCreateDto, MasterAlan>();
            CreateMap<MasterAlanUpdateDto, MasterAlan>();

            // MasterDepartman
            CreateMap<MasterDepartman, MasterDepartmanListDto>().ReverseMap();
            CreateMap<MasterDepartmanCreateDto, MasterDepartman>();
            CreateMap<MasterDepartmanUpdateDto, MasterDepartman>();

            // MasterPozisyon
            CreateMap<MasterPozisyon, MasterPozisyonListDto>().ReverseMap();
            CreateMap<MasterPozisyonCreateDto, MasterPozisyon>();
            CreateMap<MasterPozisyonUpdateDto, MasterPozisyon>();

            // MasterProgram
            CreateMap<MasterProgram, MasterProgramDto>().ReverseMap();
            CreateMap<MasterProgramCreateDto, MasterProgram>();
            CreateMap<MasterProgramUpdateDto, MasterProgram>();

            // MasterOyun
            CreateMap<MasterOyun, MasterOyunDto>().ReverseMap();
            CreateMap<MasterOyunCreateDto, MasterOyun>();
            CreateMap<MasterOyunUpdateDto, MasterOyun>();

            // Sube
            CreateMap<Sube, SubeListDto>().ReverseMap();
            CreateMap<SubeCreateDto, Sube>();
            CreateMap<SubeUpdateDto, Sube>();

            // SubeAlan
            CreateMap<SubeAlan, SubeAlanListDto>()
                .ForMember(dest => dest.SubeAdi, opt => opt.MapFrom(src => src.Sube != null ? src.Sube.SubeAdi : string.Empty))
                .ForMember(dest => dest.AlanAdi, opt => opt.MapFrom(src => src.MasterAlan != null ? src.MasterAlan.MasterAlanAdi : string.Empty));
            CreateMap<SubeAlanCreateDto, SubeAlan>();
            CreateMap<SubeAlanUpdateDto, SubeAlan>();

            // Departman
            CreateMap<Departman, DepartmanListDto>()
                .ForMember(dest => dest.DepartmanAdi, opt => opt.MapFrom(src => src.MasterDepartman != null ? src.MasterDepartman.MasterDepartmanAdi : string.Empty))
                .ForMember(dest => dest.SubeAlanAdi, opt => opt.MapFrom(src => src.SubeAlan != null && src.SubeAlan.MasterAlan != null ? src.SubeAlan.MasterAlan.MasterAlanAdi : string.Empty))
                .ForMember(dest => dest.SubeAdi, opt => opt.MapFrom(src => src.SubeAlan != null && src.SubeAlan.Sube != null ? src.SubeAlan.Sube.SubeAdi : string.Empty));
            CreateMap<DepartmanCreateDto, Departman>();
            CreateMap<DepartmanUpdateDto, Departman>();

            // DepartmanPozisyon
            CreateMap<DepartmanPozisyon, DepartmanPozisyonListDto>()
                 .ForMember(dest => dest.PozisyonAdi, opt => opt.MapFrom(src => src.MasterPozisyon != null ? src.MasterPozisyon.MasterPozisyonAdi : string.Empty))
                 .ForMember(dest => dest.DepartmanAdi, opt => opt.MapFrom(src => src.Departman != null && src.Departman.MasterDepartman != null ? src.Departman.MasterDepartman.MasterDepartmanAdi : string.Empty))
                 .ForMember(dest => dest.SubeAlanAdi, opt => opt.MapFrom(src => src.Departman != null && src.Departman.SubeAlan != null && src.Departman.SubeAlan.MasterAlan != null ? src.Departman.SubeAlan.MasterAlan.MasterAlanAdi : string.Empty))
                 .ForMember(dest => dest.SubeAdi, opt => opt.MapFrom(src => src.Departman != null && src.Departman.SubeAlan != null && src.Departman.SubeAlan.Sube != null ? src.Departman.SubeAlan.Sube.SubeAdi : string.Empty));
            CreateMap<DepartmanPozisyonCreateDto, DepartmanPozisyon>();
            CreateMap<DepartmanPozisyonUpdateDto, DepartmanPozisyon>();

            // OyunBilgisi (Organizasyon)
            CreateMap<OyunBilgisi, OyunBilgisiListDto>()
                .ForMember(dest => dest.MasterOyunAdi, opt => opt.MapFrom(src => src.MasterOyun != null ? src.MasterOyun.MasterOyunAdi : string.Empty))
                .ForMember(dest => dest.DepartmanAdi, opt => opt.MapFrom(src => src.Departman != null && src.Departman.MasterDepartman != null ? src.Departman.MasterDepartman.MasterDepartmanAdi : string.Empty));
            CreateMap<OyunBilgisiCreateDto, OyunBilgisi>();
            CreateMap<OyunBilgisiUpdateDto, OyunBilgisi>();

            // ProgramBilgisi (Organizasyon)
            CreateMap<ProgramBilgisi, ProgramBilgisiListDto>()
                .ForMember(dest => dest.MasterProgramAdi, opt => opt.MapFrom(src => src.MasterProgram != null ? src.MasterProgram.MasterProgramAdi : string.Empty))
                .ForMember(dest => dest.DepartmanAdi, opt => opt.MapFrom(src => src.Departman != null && src.Departman.MasterDepartman != null ? src.Departman.MasterDepartman.MasterDepartmanAdi : string.Empty));
            CreateMap<ProgramBilgisiCreateDto, ProgramBilgisi>();
            CreateMap<ProgramBilgisiUpdateDto, ProgramBilgisi>();

            // =======================================================
            // 5. TANIMLAMALAR (ÜLKE, ŞEHİR, DİL VS.)
            // =======================================================
            CreateMap<Ulke, UlkeListDto>().ReverseMap();
            CreateMap<UlkeCreateDto, Ulke>().ReverseMap();
            CreateMap<UlkeUpdateDto, Ulke>().ReverseMap();

            CreateMap<Sehir, SehirListDto>()
                .ForMember(dest => dest.UlkeAdi, opt => opt.MapFrom(src => src.Ulke != null ? src.Ulke.UlkeAdi : string.Empty));
            CreateMap<SehirCreateDto, Sehir>();
            CreateMap<SehirUpdateDto, Sehir>();

            CreateMap<Ilce, IlceListDto>()
                .ForMember(dest => dest.SehirAdi, opt => opt.MapFrom(src => src.Sehir != null ? src.Sehir.SehirAdi : string.Empty))
                .ForMember(dest => dest.UlkeAdi, opt => opt.MapFrom(src => src.Sehir != null && src.Sehir.Ulke != null ? src.Sehir.Ulke.UlkeAdi : string.Empty));
            CreateMap<IlceCreateDto, Ilce>();
            CreateMap<IlceUpdateDto, Ilce>();

            CreateMap<Uyruk, UyrukListDto>()
                .ForMember(dest => dest.UlkeAdi, opt => opt.MapFrom(src => src.Ulke != null ? src.Ulke.UlkeAdi : string.Empty));
            CreateMap<UyrukCreateDto, Uyruk>();
            CreateMap<UyrukUpdateDto, Uyruk>();

            CreateMap<Dil, DilListDto>().ReverseMap();
            CreateMap<DilCreateDto, Dil>();
            CreateMap<DilUpdateDto, Dil>();

            CreateMap<EhliyetTuru, EhliyetTuruListDto>().ReverseMap();
            CreateMap<EhliyetTuruCreateDto, EhliyetTuru>();
            CreateMap<EhliyetTuruUpdateDto, EhliyetTuru>();

            CreateMap<KktcBelge, KktcBelgeListDto>().ReverseMap();
            CreateMap<KktcBelgeCreateDto, KktcBelge>();
            CreateMap<KktcBelgeUpdateDto, KktcBelge>();

            CreateMap<Kvkk, KvkkListDto>().ReverseMap();
            CreateMap<KvkkCreateDto, Kvkk>();
            CreateMap<KvkkUpdateDto, Kvkk>();

            // =======================================================
            // 6. ADMIN, ROL, LOG
            // =======================================================
            CreateMap<Rol, RolListDto>().ReverseMap();

            CreateMap<PanelKullanici, PanelKullaniciListDto>()
                .ForMember(dest => dest.RolAdi, opt => opt.MapFrom(src => src.Rol != null ? src.Rol.RolAdi : string.Empty))
                .ForMember(dest => dest.SubeAdi, opt => opt.MapFrom(src => src.Sube != null ? src.Sube.SubeAdi : string.Empty))
                .ForMember(dest => dest.MasterAlanAdi, opt => opt.MapFrom(src => src.MasterAlan != null ? src.MasterAlan.MasterAlanAdi : string.Empty))
                .ForMember(dest => dest.MasterDepartmanAdi, opt => opt.MapFrom(src => src.MasterDepartman != null ? src.MasterDepartman.MasterDepartmanAdi : string.Empty));

            CreateMap<PanelKullaniciCreateDto, PanelKullanici>();
            CreateMap<PanelKullaniciUpdateDto, PanelKullanici>()
                .ForMember(dest => dest.KullaniciSifre, opt => opt.Ignore());

            // Loglar
            CreateMap<BasvuruIslemLog, BasvuruIslemLogListDto>()
             .ForMember(dest => dest.IslemTipiAdi, opt => opt.MapFrom(src => src.IslemTipi.ToString()))
             .ForMember(dest => dest.PanelKullaniciAdSoyad, opt => opt.MapFrom(src =>
                 src.PanelKullanici != null ? $"{src.PanelKullanici.Adi} {src.PanelKullanici.Soyadi}" : "Sistem"))

             // Aday Bilgileri (Güvenli Erişim)
             .ForMember(dest => dest.AdSoyad, opt => opt.MapFrom(src =>
                 (src.MasterBasvuru != null && src.MasterBasvuru.Personel != null && src.MasterBasvuru.Personel.KisiselBilgiler != null)
                 ? $"{src.MasterBasvuru.Personel.KisiselBilgiler.Ad} {src.MasterBasvuru.Personel.KisiselBilgiler.Soyadi}"
                 : ""))
            
             .ForMember(dest => dest.FotoUrl, opt => opt.MapFrom(src =>
                 (src.MasterBasvuru != null && src.MasterBasvuru.Personel != null && src.MasterBasvuru.Personel.KisiselBilgiler != null)
                 ? src.MasterBasvuru.Personel.KisiselBilgiler.VesikalikFotograf
                 : ""))
            
             .ForMember(dest => dest.BasvuruVersiyonNo, opt => opt.MapFrom(src =>
                 src.MasterBasvuru != null ? src.MasterBasvuru.BasvuruVersiyonNo : "1.0"))
            
             // Kurumsal Tercihler (String.Join ile virgüllü liste haline getirme)
             .ForMember(dest => dest.Subeler, opt => opt.MapFrom(src =>
                 (src.MasterBasvuru != null && src.MasterBasvuru.Personel != null && src.MasterBasvuru.Personel.IsBasvuruDetay != null &&           src.MasterBasvuru.Personel.IsBasvuruDetay.BasvuruSubeler != null)
                 ? string.Join(", ", src.MasterBasvuru.Personel.IsBasvuruDetay.BasvuruSubeler
                     .Where(s => s.Sube != null)
                     .Select(s => s.Sube!.SubeAdi))
                 : ""))
            
             .ForMember(dest => dest.Alanlar, opt => opt.MapFrom(src =>
                 (src.MasterBasvuru != null && src.MasterBasvuru.Personel != null && src.MasterBasvuru.Personel.IsBasvuruDetay != null &&           src.MasterBasvuru.Personel.IsBasvuruDetay.BasvuruAlanlar != null)
                 ? string.Join(", ", src.MasterBasvuru.Personel.IsBasvuruDetay.BasvuruAlanlar
                     .Where(a => a.SubeAlan != null && a.SubeAlan.MasterAlan != null)
                     .Select(a => a.SubeAlan!.MasterAlan!.MasterAlanAdi))
                 : ""))
            
             .ForMember(dest => dest.Departmanlar, opt => opt.MapFrom(src =>
                 (src.MasterBasvuru != null && src.MasterBasvuru.Personel != null && src.MasterBasvuru.Personel.IsBasvuruDetay != null &&           src.MasterBasvuru.Personel.IsBasvuruDetay.BasvuruDepartmanlar != null)
                 ? string.Join(", ", src.MasterBasvuru.Personel.IsBasvuruDetay.BasvuruDepartmanlar
                     .Where(d => d.Departman != null && d.Departman.MasterDepartman != null)
                     .Select(d => d.Departman!.MasterDepartman!.MasterDepartmanAdi))
                 : ""))
            
             .ForMember(dest => dest.Pozisyonlar, opt => opt.MapFrom(src =>
                 (src.MasterBasvuru != null && src.MasterBasvuru.Personel != null && src.MasterBasvuru.Personel.IsBasvuruDetay != null &&           src.MasterBasvuru.Personel.IsBasvuruDetay.BasvuruPozisyonlar != null)
                 ? string.Join(", ", src.MasterBasvuru.Personel.IsBasvuruDetay.BasvuruPozisyonlar
                     .Where(p => p.DepartmanPozisyon != null && p.DepartmanPozisyon.MasterPozisyon != null)
                     .Select(p => p.DepartmanPozisyon!.MasterPozisyon!.MasterPozisyonAdi))
                 : ""))

             .ForMember(dest => dest.RolId, opt => opt.MapFrom(src => src.RolId))
             .ForMember(dest => dest.BasvuruDurum, opt => opt.MapFrom(src => (int?)src.BasvuruDurum))
             .ForMember(dest => dest.BasvuruOnayAsamasi, opt => opt.MapFrom(src => (int?)src.BasvuruOnayAsamasi))

             // Rol Bazlı İşlem Ayrıştırma (İşlemi yapanın rolüne göre sütun doldurma)
             .ForMember(dest => dest.DmIslemi, opt => opt.MapFrom(src =>
                 (src.PanelKullanici != null && src.PanelKullanici.Rol != null && src.PanelKullanici.Rol.RolAdi == "DepartmanMudur")
                 ? $"{src.PanelKullanici.Adi} {src.PanelKullanici.Soyadi}: {src.IslemAciklama}"
                 : ""))
            
             .ForMember(dest => dest.GmIslemi, opt => opt.MapFrom(src =>
                 (src.PanelKullanici != null && src.PanelKullanici.Rol != null && src.PanelKullanici.Rol.RolAdi == "GenelMudur")
                 ? $"{src.PanelKullanici.Adi} {src.PanelKullanici.Soyadi}: {src.IslemAciklama}"
                 : ""))
            
             .ForMember(dest => dest.IkIslemi, opt => opt.MapFrom(src =>
                 (src.PanelKullanici != null && src.PanelKullanici.Rol != null && (new[] { "IK", "Admin", "SuperAdmin" }).Contains(src.PanelKullanici.Rol.RolAdi))
                 ? $"{src.PanelKullanici.Adi} {src.PanelKullanici.Soyadi}: {src.IslemAciklama}"
                 : ""))
            .ForMember(dest => dest.MimIslemi, opt => opt.MapFrom(src =>
                 (src.PanelKullanici != null && src.PanelKullanici.Rol != null && src.PanelKullanici.Rol.RolAdi == "MaliIslerMudur")
                 ? $"{src.PanelKullanici.Adi} {src.PanelKullanici.Soyadi}: {src.IslemAciklama}"
                 : ""));

            CreateMap<CvDegisiklikLog, CvDegisiklikLogListDto>()
                .ForMember(dest => dest.DegisiklikTipiAdi, opt => opt.MapFrom(src => src.DegisiklikTipi.ToString()));

            // Master Başvuru
            CreateMap<MasterBasvuruCreateDto, MasterBasvuru>();
            CreateMap<MasterBasvuruUpdateDto, MasterBasvuru>()
                .ForMember(dest => dest.BasvuruIslemLoglari, opt => opt.Ignore());

            CreateMap<MasterBasvuru, MasterBasvuruListDto>()
                .ForMember(dest => dest.BasvuruDurumAdi, opt => opt.MapFrom(src => src.BasvuruDurum.ToString()))
                .ForMember(dest => dest.BasvuruOnayAsamasiAdi, opt => opt.MapFrom(src => src.BasvuruOnayAsamasi.ToString()))
               .ForMember(dest => dest.PersonelId, opt => opt.MapFrom(src => src.PersonelId)) // ID'yi ID'den al
               .ForMember(dest => dest.Personel, opt => opt.MapFrom(src => src.Personel))
               .ForMember(dest => dest.BasvuruIslemLoglari, opt => opt.MapFrom(src => src.BasvuruIslemLoglari))
               .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.BasvuruIslemLoglari));

            CreateMap<SubeAlan, SubeAlanListDto>()
    .ForMember(dest => dest.AlanAdi, opt => opt.MapFrom(src => src.MasterAlan != null ? src.MasterAlan.MasterAlanAdi : string.Empty));

            CreateMap<Departman, DepartmanListDto>()
                .ForMember(dest => dest.DepartmanAdi, opt => opt.MapFrom(src => src.MasterDepartman != null ? src.MasterDepartman.MasterDepartmanAdi : string.Empty));

            CreateMap<DepartmanPozisyon, DepartmanPozisyonListDto>()
                .ForMember(dest => dest.PozisyonAdi, opt => opt.MapFrom(src => src.MasterPozisyon != null ? src.MasterPozisyon.MasterPozisyonAdi : string.Empty));

            // BasvuruOnay Mappings
            CreateMap<BasvuruOnayCreateDto, BasvuruOnay>();
            CreateMap<BasvuruOnay, BasvuruOnayListDto>()
               .ForMember(dest => dest.BasvuruId, opt => opt.MapFrom(src =>(src.Personel != null && src.Personel.MasterBasvuru != null) ?src.Personel.MasterBasvuru.Id : (int?)null))
               .ForMember(dest => dest.PersonelAdSoyad, opt => opt.MapFrom(src =>(src.Personel != null && src.Personel.KisiselBilgiler != null)
                 ? $"{src.Personel.KisiselBilgiler.Ad} {src.Personel.KisiselBilgiler.Soyadi}": "Bilinmeyen Aday"));


            // ==========================================
            // 1. MasterGorev Mapping Ayarları
            // ==========================================
            CreateMap<MasterGorev, MasterGorevCreateDto>().ReverseMap();
            CreateMap<MasterGorev, MasterGorevUpdateDto>().ReverseMap();
            CreateMap<MasterGorev, MasterGorevListDto>().ReverseMap();

            // ==========================================
            // 2. Gorev Mapping Ayarları
            // ==========================================
            CreateMap<Gorev, GorevCreateDto>().ReverseMap();
            CreateMap<Gorev, GorevUpdateDto>().ReverseMap();
            CreateMap<Gorev, GorevListDto>()
                // Master Görev adını ilişkiden çek
                .ForMember(dest => dest.MasterGorevAdi, opt => opt.MapFrom(src =>
                    src.MasterGorev != null ? src.MasterGorev.MasterGorevAdi : null))
                // Departman Adını (Şube - MasterDepartman ilişkisinden) çek
                .ForMember(dest => dest.MasterDepartmanAdi, opt => opt.MapFrom(src =>
        src.MasterDepartman != null ? src.MasterDepartman.MasterDepartmanAdi : null))
    .ReverseMap();


            // ==========================================
            // 3. GorevAtamaDetay Mapping Ayarları (Sürecin Kalbi)
            // ==========================================
            CreateMap<GorevAtamaDetay, GorevAtamaDetayCreateDto>().ReverseMap();
            CreateMap<GorevAtamaDetay, GorevAtamaDetayUpdateDto>().ReverseMap();
            CreateMap<GorevAtamaDetay, GorevAtamaDetayListDto>()
                .ForMember(dest => dest.PersonelAdSoyad, opt => opt.MapFrom(src =>
                    src.Personel != null && src.Personel.KisiselBilgiler != null
                    ? src.Personel.KisiselBilgiler.Ad + " " + src.Personel.KisiselBilgiler.Soyadi
                    : null))
                .ForMember(dest => dest.MasterDepartmanAdi, opt => opt.MapFrom(src =>
                    src.MasterDepartman != null ? src.MasterDepartman.MasterDepartmanAdi : null))

                // GÖREV ADI ÇEKİMİ DEĞİŞTİ: Gorev tablosu üzerinden MasterGorev'e gidiyoruz
                .ForMember(dest => dest.GorevAdi, opt => opt.MapFrom(src =>
                    src.Gorev != null && src.Gorev.MasterGorev != null ? src.Gorev.MasterGorev.MasterGorevAdi : null))

                .ForMember(dest => dest.OnaylayanKullaniciAdSoyad, opt => opt.MapFrom(src =>
                    src.PanelKullanici != null ? src.PanelKullanici.Adi + " " + src.PanelKullanici.Soyadi : null))
                .ForMember(dest => dest.TalepNedeniMetin, opt => opt.MapFrom(src =>
                    src.TalepNedeni == IsBasvuru.Domain.Enums.TalepNedeni.YeniKadro ? "Yeni Kadro" : "Yerine"))
                .ForMember(dest => dest.BaslangicTarihi,
               opt => opt.MapFrom(src => src.BaslangicTarihi.ToString("yyyy-MM-dd")))
                .ReverseMap();
        }
    }
}