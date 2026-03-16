using IsBasvuru.Domain.Entities;
using IsBasvuru.Domain.Entities.AdminBilgileri;
using IsBasvuru.Domain.Entities.KimlikDogrulama;
using IsBasvuru.Domain.Entities.Log;
using IsBasvuru.Domain.Entities.PersonelBilgileri;
using IsBasvuru.Domain.Entities.SirketYapisi;
using IsBasvuru.Domain.Entities.SirketYapisi.GorevAtama;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketMasterYapisi;
using IsBasvuru.Domain.Entities.SirketYapisi.SirketTanimYapisi;
using IsBasvuru.Domain.Entities.Tanimlamalar;
using IsBasvuru.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IsBasvuru.Persistence.Context
{
    public class IsBasvuruContext : DbContext
    {
        public IsBasvuruContext(DbContextOptions<IsBasvuruContext> options) : base(options)
        { }

        // 1-Admin Bilgileri
        public DbSet<PanelKullanici> PanelKullanicilari { get; set; }
        public DbSet<Rol> Roller { get; set; }

        // 2-Log
        public DbSet<BasvuruIslemLog> BasvuruIslemLoglari { get; set; }
        public DbSet<CvDegisiklikLog> CvDegisiklikLoglari { get; set; }
        // IsBasvuruContext.cs içine ekle

        // 3-PersonelBilgileri
        public DbSet<BasvuruOnay> BasvuruOnaylari { get; set; }
        public DbSet<BilgisayarBilgisi> BilgisayarBilgileri { get; set; }
        public DbSet<DigerKisiselBilgiler> DigerKisiselBilgileri { get; set; }
        public DbSet<EgitimBilgisi> EgitimBilgileri { get; set; }
        public DbSet<IsBasvuruDetay> IsBasvuruDetaylari { get; set; }
        public DbSet<IsDeneyimi> IsDeneyimleri { get; set; }
        public DbSet<KisiselBilgiler> KisiselBilgileri { get; set; }
        public DbSet<ReferansBilgisi> ReferansBilgileri { get; set; }
        public DbSet<SertifikaBilgisi> SertifikaBilgileri { get; set; }
        public DbSet<YabanciDilBilgisi> YabanciDilBilgileri { get; set; }

        // 4.1-SirketYapisi
        public DbSet<IsBasvuruDetayAlan> IsBasvuruDetayAlanlari { get; set; }
        public DbSet<IsBasvuruDetayDepartman> IsBasvuruDetayDepartmanlari { get; set; }
        public DbSet<IsBasvuruDetayOyun> IsBasvuruDetayOyunlari { get; set; }
        public DbSet<IsBasvuruDetayPozisyon> IsBasvuruDetayPozisyonlari { get; set; }
        public DbSet<IsBasvuruDetayProgram> IsBasvuruDetayProgramlari { get; set; }
        public DbSet<IsBasvuruDetaySube> IsBasvuruDetaySubeler { get; set; }
        public DbSet<PersonelEhliyet> PersonelEhliyetleri { get; set; }


        // 4.2-SirketTanimYapisi
        public DbSet<Departman> Departmanlar { get; set; }
        public DbSet<DepartmanPozisyon> DepartmanPozisyonlar { get; set; }
        public DbSet<OyunBilgisi> OyunBilgileri { get; set; }
        public DbSet<ProgramBilgisi> ProgramBilgileri { get; set; }
        public DbSet<Sube> Subeler { get; set; }
        public DbSet<SubeAlan> SubeAlanlar { get; set; }

        public DbSet<MasterAlan> MasterAlanlar { get; set; }
        public DbSet<MasterDepartman> MasterDepartmanlar { get; set; }
        public DbSet<MasterPozisyon> MasterPozisyonlar { get; set; }
        public DbSet<MasterProgram> MasterProgramlar { get; set; }
        public DbSet<MasterOyun> MasterOyunlar { get; set; }
        // Context içine eklenecekler
        public DbSet<GorevAtamaDetay> GorevAtamaDetaylari { get; set; }
        public DbSet<MasterGorev> MasterGorevler { get; set; }
        public DbSet<Gorev> Gorevler { get; set; }

        // 5-Tanimlamalar
        public DbSet<Dil> Diller { get; set; }
        public DbSet<EhliyetTuru> EhliyetTurleri { get; set; }
        public DbSet<Ilce> Ilceler { get; set; }
        public DbSet<KktcBelge> KktcBelgeler { get; set; }
        public DbSet<Kvkk> Kvkklar { get; set; }
        public DbSet<Sehir> Sehirler { get; set; }
        public DbSet<Ulke> Ulkeler { get; set; }
        public DbSet<Uyruk> Uyruklar { get; set; }

        // 6-Entities
        public DbSet<MasterBasvuru> MasterBasvurular { get; set; }
        public DbSet<Personel> Personeller { get; set; }

        // 7- Kimlik Doğrulama
        public DbSet<DogrulamaKodu> DogrulamaKodlari { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Kisisel Bilgiler
            modelBuilder.Entity<KisiselBilgiler>(entity =>
            {
                // Email kesinlikle benzersiz olsun (İletişim karışıklığını önlemek için)
                entity.HasIndex(e => e.Email).IsUnique();

                // Bir personelin sadece bir tane kişisel bilgi kaydı olabilir
                entity.HasIndex(e => e.PersonelId).IsUnique();

                // TARİH DÜZELTMESİ (Doğum Tarihi - Sadece Tarih)
                entity.Property(e => e.DogumTarihi).HasColumnType("date");
            });

            //  2. Admin Kullanıcıları
            modelBuilder.Entity<PanelKullanici>(entity =>
            {
                // Aynı kullanıcı adıyla ikinci bir admin oluşturulamaz
                entity.HasIndex(e => e.KullaniciAdi).IsUnique();
            });

            //  3. Şirket Yapısı 
            modelBuilder.Entity<Sube>(entity =>
            {
                // Aynı isimde iki şube olmasın (Örn: İki tane "Girne" şubesi olmasın)
                entity.HasIndex(e => e.SubeAdi).IsUnique();
            });

            //  4. Eğitim Bilgileri 
            modelBuilder.Entity<EgitimBilgisi>(entity =>
            {
                // GANO: 3.24 gibi 2 basamaklı olsun.
                entity.Property(e => e.Gano).HasColumnType("decimal(4,2)");

                // TARİHLER: Sadece Tarih (Saat yok)
                entity.Property(e => e.BaslangicTarihi).HasColumnType("date");
                entity.Property(e => e.BitisTarihi).HasColumnType("date");
            });

            // 5. Sertifika Bilgileri
            modelBuilder.Entity<SertifikaBilgisi>(entity =>
            {
                entity.Property(e => e.VerilisTarihi).HasColumnType("date");
                entity.Property(e => e.GecerlilikTarihi).HasColumnType("date");
            });

            //  6. İş Deneyimi 
            modelBuilder.Entity<IsDeneyimi>(entity =>
            {
                entity.Property(e => e.BaslangicTarihi).HasColumnType("date");
                entity.Property(e => e.BitisTarihi).HasColumnType("date");
            });

            // 7. 1-1 İlişki Güvenliği
            modelBuilder.Entity<MasterBasvuru>()
                .HasIndex(e => e.PersonelId).IsUnique();

            modelBuilder.Entity<IsBasvuruDetay>()
                .HasIndex(e => e.PersonelId).IsUnique();

            modelBuilder.Entity<BasvuruOnay>()
                .HasIndex(e => e.PersonelId).IsUnique();

            modelBuilder.Entity<DigerKisiselBilgiler>()
                .HasIndex(e => e.PersonelId).IsUnique();

            //8. Çoka-Çok İlişki Tekillik
            modelBuilder.Entity<IsBasvuruDetaySube>()
                .HasIndex(e => new { e.IsBasvuruDetayId, e.SubeId }).IsUnique();

            modelBuilder.Entity<IsBasvuruDetayAlan>()
                .HasIndex(e => new { e.IsBasvuruDetayId, e.SubeAlanId }).IsUnique();

            modelBuilder.Entity<IsBasvuruDetayDepartman>()
                .HasIndex(e => new { e.IsBasvuruDetayId, e.DepartmanId }).IsUnique();

            modelBuilder.Entity<IsBasvuruDetayPozisyon>()
         .HasOne(x => x.DepartmanPozisyon)
         .WithMany()
         .HasForeignKey(x => x.DepartmanPozisyonId)
         .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<IsBasvuruDetayProgram>()
                .HasIndex(e => new { e.IsBasvuruDetayId, e.ProgramBilgisiId }).IsUnique();

            modelBuilder.Entity<IsBasvuruDetayOyun>()
                .HasIndex(e => new { e.IsBasvuruDetayId, e.OyunBilgisiId }).IsUnique();

            // 1. ŞubeAlan silinince bağlı Departmanlar silinsin
            modelBuilder.Entity<Departman>()
                .HasOne(d => d.SubeAlan)
                .WithMany(sa => sa.Departmanlar)
                .HasForeignKey(d => d.SubeAlanId)
                .OnDelete(DeleteBehavior.Cascade);

            // 2. Departman silinince bağlı Pozisyonlar silinsin
            modelBuilder.Entity<DepartmanPozisyon>()
                .HasOne(dp => dp.Departman)
                .WithMany(d => d.DepartmanPozisyonlar)
                .HasForeignKey(dp => dp.DepartmanId)
                .OnDelete(DeleteBehavior.Cascade);


            // Roller
            modelBuilder.Entity<Rol>().HasData(
                new Rol
                {
                    Id = (int)RolEnum.SuperAdmin,
                    RolAdi = "SuperAdmin",
                    RolTanimi = "Tam yetkili, her şeyi gören ve müdahale eden yönetici."
                },
                new Rol
                {
                    Id = (int)RolEnum.Admin,
                    RolAdi = "Admin",
                    RolTanimi = "İK Müdürü, sistem tanımları ve kullanıcı atamaları yöneticisi."
                },
                new Rol
                {
                    Id = (int)RolEnum.IkAdmin,
                    RolAdi = "IkAdmin",
                    RolTanimi = "Başvuru yönetimi, log görüntüleme ve revize onay yetkilisi."
                },
                new Rol
                {
                    Id = (int)RolEnum.Ik,
                    RolAdi = "IK",
                    RolTanimi = "Başvuru yönetimi ve revize işlemleri (Kısıtlı yetki)."
                },
                new Rol
                {
                    Id = (int)RolEnum.GenelMudur,
                    RolAdi = "GenelMudur",
                    RolTanimi = "Üst düzey başvuru değerlendirme ve onay merci."
                },
                new Rol
                {
                    Id = (int)RolEnum.DepartmanMudur,
                    RolAdi = "DepartmanMudur",
                    RolTanimi = "İlgili departmana gelen başvuruları değerlendirme merci."
                }, new Rol
                {
                    Id = (int)RolEnum.MaliIslerMudur,
                    RolAdi = "MaliIslerMudur",
                    RolTanimi = "Adaya teklif edilen maaş ve kadro bütçesinin uygunluğunu denetleyip finansal onay veren merci."
                }
            );

            modelBuilder.Entity<PanelKullanici>().HasData(new PanelKullanici
            {
                Id = 1,
                KullaniciAdi = "SuperAdmin", 
                Adi = "Sistem",
                Soyadi = "Yöneticisi",
                KullaniciSifre = "$2a$11$v7tUh0sfE41ZtdoAuuEO.emlTQzkMKgnygwNaRnBYJTkbaSDJETsK",//superadmin
                RolId = 1, 
                SonGirisTarihi = new DateTime(2026, 1, 1),
                SubeId = null,
                MasterAlanId = null,
                MasterDepartmanId = null
            });

            modelBuilder.Entity<GorevAtamaDetay>()
        .HasOne(x => x.Personel)
        .WithMany()
        .HasForeignKey(x => x.PersonelId)
        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GorevAtamaDetay>()
                .HasOne(x => x.MasterDepartman)
                .WithMany()
                .HasForeignKey(x => x.MasterDepartmanId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GorevAtamaDetay>()
                .HasOne(x => x.Gorev)
                .WithMany()
                .HasForeignKey(x => x.GorevId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GorevAtamaDetay>()
                .HasOne(x => x.PanelKullanici)
                .WithMany()
                .HasForeignKey(x => x.PanelKullaniciId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GorevAtamaDetay>()
    .Property(x => x.BaslangicTarihi)
    .HasColumnType("date");
        }
    }
}