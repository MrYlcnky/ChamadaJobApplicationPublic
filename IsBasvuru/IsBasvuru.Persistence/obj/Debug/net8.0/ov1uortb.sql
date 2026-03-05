CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `Diller` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `DilAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Diller` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `DogrulamaKodlari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Eposta` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Kod` longtext CHARACTER SET utf8mb4 NOT NULL,
    `GecerlilikTarihi` datetime(6) NOT NULL,
    `KullanildiMi` tinyint(1) NOT NULL,
    CONSTRAINT `PK_DogrulamaKodlari` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `EhliyetTurleri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `EhliyetTuruAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_EhliyetTurleri` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `KktcBelgeler` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `BelgeAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_KktcBelgeler` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Kvkklar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `DogrulukAciklamaTr` longtext CHARACTER SET utf8mb4 NOT NULL,
    `KvkkAciklamaTr` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ReferansAciklamaTr` longtext CHARACTER SET utf8mb4 NOT NULL,
    `DogrulukAciklamaEn` longtext CHARACTER SET utf8mb4 NOT NULL,
    `KvkkAciklamaEn` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ReferansAciklamaEn` longtext CHARACTER SET utf8mb4 NOT NULL,
    `KvkkVersiyon` longtext CHARACTER SET utf8mb4 NOT NULL,
    `GuncellemeTarihi` datetime(6) NOT NULL,
    CONSTRAINT `PK_Kvkklar` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `MasterAlanlar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MasterAlanAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_MasterAlanlar` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `MasterDepartmanlar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MasterDepartmanAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_MasterDepartmanlar` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `MasterOyunlar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MasterOyunAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_MasterOyunlar` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `MasterPozisyonlar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MasterPozisyonAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_MasterPozisyonlar` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `MasterProgramlar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MasterProgramAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_MasterProgramlar` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Personeller` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `GuncellemeTarihi` datetime(6) NULL,
    CONSTRAINT `PK_Personeller` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Roller` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `RolAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `RolTanimi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Roller` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Subeler` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `SubeAdi` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `SubeAktifMi` tinyint(1) NOT NULL,
    CONSTRAINT `PK_Subeler` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Ulkeler` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UlkeAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Ulkeler` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `BasvuruOnaylari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `KvkkId` int NOT NULL,
    `OnayDurum` tinyint(1) NOT NULL,
    `IpAdres` longtext CHARACTER SET utf8mb4 NOT NULL,
    `KullaniciCihaz` longtext CHARACTER SET utf8mb4 NOT NULL,
    `KvkkVersiyon` longtext CHARACTER SET utf8mb4 NULL,
    `DogrulukAciklamaTr` longtext CHARACTER SET utf8mb4 NULL,
    `KvkkAciklamaTr` longtext CHARACTER SET utf8mb4 NULL,
    `ReferansAciklamaTr` longtext CHARACTER SET utf8mb4 NULL,
    `OnayTarihi` datetime(6) NOT NULL,
    CONSTRAINT `PK_BasvuruOnaylari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_BasvuruOnaylari_Kvkklar_KvkkId` FOREIGN KEY (`KvkkId`) REFERENCES `Kvkklar` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_BasvuruOnaylari_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `BilgisayarBilgileri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `ProgramAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Yetkinlik` int NOT NULL,
    CONSTRAINT `PK_BilgisayarBilgileri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_BilgisayarBilgileri_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `DigerKisiselBilgileri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `KktcBelgeId` int NOT NULL,
    `DavaDurumu` int NOT NULL,
    `DavaNedeni` longtext CHARACTER SET utf8mb4 NULL,
    `SigaraKullanimi` int NOT NULL,
    `AskerlikDurumu` int NOT NULL,
    `KaliciRahatsizlik` int NOT NULL,
    `KaliciRahatsizlikAciklama` longtext CHARACTER SET utf8mb4 NULL,
    `EhliyetDurumu` int NOT NULL,
    `Boy` int NOT NULL,
    `Kilo` int NOT NULL,
    CONSTRAINT `PK_DigerKisiselBilgileri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_DigerKisiselBilgileri_KktcBelgeler_KktcBelgeId` FOREIGN KEY (`KktcBelgeId`) REFERENCES `KktcBelgeler` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_DigerKisiselBilgileri_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `EgitimBilgileri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `EgitimSeviyesi` int NOT NULL,
    `OkulAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Bolum` longtext CHARACTER SET utf8mb4 NOT NULL,
    `DiplomaDurum` int NOT NULL,
    `NotSistemi` int NOT NULL,
    `Gano` decimal(4,2) NULL,
    `BaslangicTarihi` date NOT NULL,
    `BitisTarihi` date NULL,
    CONSTRAINT `PK_EgitimBilgileri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_EgitimBilgileri_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `IsBasvuruDetaylari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `LojmanTalebiVarMi` int NOT NULL,
    `NedenBiz` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_IsBasvuruDetaylari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_IsBasvuruDetaylari_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `MasterBasvurular` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `BasvuruTarihi` datetime(6) NOT NULL,
    `BasvuruDurum` int NOT NULL,
    `BasvuruOnayAsamasi` int NOT NULL,
    `BasvuruVersiyonNo` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_MasterBasvurular` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_MasterBasvurular_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `PersonelEhliyetleri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `EhliyetTuruId` int NOT NULL,
    CONSTRAINT `PK_PersonelEhliyetleri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_PersonelEhliyetleri_EhliyetTurleri_EhliyetTuruId` FOREIGN KEY (`EhliyetTuruId`) REFERENCES `EhliyetTurleri` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_PersonelEhliyetleri_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `ReferansBilgileri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `CalistigiKurum` int NOT NULL,
    `ReferansAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ReferansSoyadi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `IsYeri` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Gorev` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ReferansTelefon` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_ReferansBilgileri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_ReferansBilgileri_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `SertifikaBilgileri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `SertifikaAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `KurumAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Suresi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `VerilisTarihi` date NOT NULL,
    `GecerlilikTarihi` date NULL,
    CONSTRAINT `PK_SertifikaBilgileri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_SertifikaBilgileri_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `YabanciDilBilgileri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `DilId` int NOT NULL,
    `DigerDilAdi` longtext CHARACTER SET utf8mb4 NULL,
    `KonusmaSeviyesi` int NOT NULL,
    `YazmaSeviyesi` int NOT NULL,
    `OkumaSeviyesi` int NOT NULL,
    `DinlemeSeviyesi` int NOT NULL,
    `NasilOgrenildi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_YabanciDilBilgileri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_YabanciDilBilgileri_Diller_DilId` FOREIGN KEY (`DilId`) REFERENCES `Diller` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_YabanciDilBilgileri_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `PanelKullanicilari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `RolId` int NOT NULL,
    `SubeId` int NULL,
    `MasterAlanId` int NULL,
    `MasterDepartmanId` int NULL,
    `KullaniciAdi` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Adi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Soyadi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `KullaniciSifre` longtext CHARACTER SET utf8mb4 NOT NULL,
    `SonGirisTarihi` datetime(6) NOT NULL,
    CONSTRAINT `PK_PanelKullanicilari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_PanelKullanicilari_MasterAlanlar_MasterAlanId` FOREIGN KEY (`MasterAlanId`) REFERENCES `MasterAlanlar` (`Id`),
    CONSTRAINT `FK_PanelKullanicilari_MasterDepartmanlar_MasterDepartmanId` FOREIGN KEY (`MasterDepartmanId`) REFERENCES `MasterDepartmanlar` (`Id`),
    CONSTRAINT `FK_PanelKullanicilari_Roller_RolId` FOREIGN KEY (`RolId`) REFERENCES `Roller` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_PanelKullanicilari_Subeler_SubeId` FOREIGN KEY (`SubeId`) REFERENCES `Subeler` (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `SubeAlanlar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `SubeId` int NOT NULL,
    `MasterAlanId` int NOT NULL,
    `SubeAlanAktifMi` tinyint(1) NOT NULL,
    CONSTRAINT `PK_SubeAlanlar` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_SubeAlanlar_MasterAlanlar_MasterAlanId` FOREIGN KEY (`MasterAlanId`) REFERENCES `MasterAlanlar` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_SubeAlanlar_Subeler_SubeId` FOREIGN KEY (`SubeId`) REFERENCES `Subeler` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Sehirler` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UlkeId` int NOT NULL,
    `SehirAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Sehirler` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Sehirler_Ulkeler_UlkeId` FOREIGN KEY (`UlkeId`) REFERENCES `Ulkeler` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Uyruklar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UlkeId` int NOT NULL,
    `UyrukAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Uyruklar` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Uyruklar_Ulkeler_UlkeId` FOREIGN KEY (`UlkeId`) REFERENCES `Ulkeler` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `IsBasvuruDetaySubeler` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `IsBasvuruDetayId` int NOT NULL,
    `SubeId` int NOT NULL,
    CONSTRAINT `PK_IsBasvuruDetaySubeler` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_IsBasvuruDetaySubeler_IsBasvuruDetaylari_IsBasvuruDetayId` FOREIGN KEY (`IsBasvuruDetayId`) REFERENCES `IsBasvuruDetaylari` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_IsBasvuruDetaySubeler_Subeler_SubeId` FOREIGN KEY (`SubeId`) REFERENCES `Subeler` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `CvDegisiklikLoglari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MasterBasvuruId` int NULL,
    `PersonelId` int NOT NULL,
    `DegisenKayitId` int NOT NULL,
    `DegisenTabloAdi` longtext CHARACTER SET utf8mb4 NULL,
    `DegisenAlanAdi` longtext CHARACTER SET utf8mb4 NULL,
    `EskiDeger` longtext CHARACTER SET utf8mb4 NULL,
    `YeniDeger` longtext CHARACTER SET utf8mb4 NULL,
    `DegisiklikTipi` int NOT NULL,
    `DegisiklikTarihi` datetime(6) NOT NULL,
    CONSTRAINT `PK_CvDegisiklikLoglari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_CvDegisiklikLoglari_MasterBasvurular_MasterBasvuruId` FOREIGN KEY (`MasterBasvuruId`) REFERENCES `MasterBasvurular` (`Id`),
    CONSTRAINT `FK_CvDegisiklikLoglari_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `BasvuruIslemLoglari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MasterBasvuruId` int NOT NULL,
    `PanelKullaniciId` int NULL,
    `RolId` int NULL,
    `BasvuruDurum` int NULL,
    `BasvuruOnayAsamasi` int NULL,
    `IslemTipi` int NOT NULL,
    `IslemAciklama` longtext CHARACTER SET utf8mb4 NOT NULL,
    `IslemTarihi` datetime(6) NOT NULL,
    CONSTRAINT `PK_BasvuruIslemLoglari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_BasvuruIslemLoglari_MasterBasvurular_MasterBasvuruId` FOREIGN KEY (`MasterBasvuruId`) REFERENCES `MasterBasvurular` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_BasvuruIslemLoglari_PanelKullanicilari_PanelKullaniciId` FOREIGN KEY (`PanelKullaniciId`) REFERENCES `PanelKullanicilari` (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Departmanlar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `SubeAlanId` int NOT NULL,
    `MasterDepartmanId` int NOT NULL,
    `DepartmanAktifMi` tinyint(1) NOT NULL,
    CONSTRAINT `PK_Departmanlar` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Departmanlar_MasterDepartmanlar_MasterDepartmanId` FOREIGN KEY (`MasterDepartmanId`) REFERENCES `MasterDepartmanlar` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Departmanlar_SubeAlanlar_SubeAlanId` FOREIGN KEY (`SubeAlanId`) REFERENCES `SubeAlanlar` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `IsBasvuruDetayAlanlari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `IsBasvuruDetayId` int NOT NULL,
    `SubeAlanId` int NOT NULL,
    CONSTRAINT `PK_IsBasvuruDetayAlanlari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_IsBasvuruDetayAlanlari_IsBasvuruDetaylari_IsBasvuruDetayId` FOREIGN KEY (`IsBasvuruDetayId`) REFERENCES `IsBasvuruDetaylari` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_IsBasvuruDetayAlanlari_SubeAlanlar_SubeAlanId` FOREIGN KEY (`SubeAlanId`) REFERENCES `SubeAlanlar` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Ilceler` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `SehirId` int NOT NULL,
    `IlceAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Ilceler` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Ilceler_Sehirler_SehirId` FOREIGN KEY (`SehirId`) REFERENCES `Sehirler` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `IsDeneyimleri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `UlkeId` int NULL,
    `SehirId` int NULL,
    `SirketAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Departman` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Pozisyon` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Gorev` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Ucret` int NOT NULL,
    `UlkeAdi` longtext CHARACTER SET utf8mb4 NULL,
    `SehirAdi` longtext CHARACTER SET utf8mb4 NULL,
    `BaslangicTarihi` date NOT NULL,
    `BitisTarihi` date NULL,
    `AyrilisSebep` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_IsDeneyimleri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_IsDeneyimleri_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_IsDeneyimleri_Sehirler_SehirId` FOREIGN KEY (`SehirId`) REFERENCES `Sehirler` (`Id`),
    CONSTRAINT `FK_IsDeneyimleri_Ulkeler_UlkeId` FOREIGN KEY (`UlkeId`) REFERENCES `Ulkeler` (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `DepartmanPozisyonlar` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `DepartmanId` int NOT NULL,
    `MasterPozisyonId` int NOT NULL,
    `DepartmanPozisyonAktifMi` tinyint(1) NOT NULL,
    CONSTRAINT `PK_DepartmanPozisyonlar` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_DepartmanPozisyonlar_Departmanlar_DepartmanId` FOREIGN KEY (`DepartmanId`) REFERENCES `Departmanlar` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_DepartmanPozisyonlar_MasterPozisyonlar_MasterPozisyonId` FOREIGN KEY (`MasterPozisyonId`) REFERENCES `MasterPozisyonlar` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `IsBasvuruDetayDepartmanlari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `IsBasvuruDetayId` int NOT NULL,
    `DepartmanId` int NOT NULL,
    CONSTRAINT `PK_IsBasvuruDetayDepartmanlari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_IsBasvuruDetayDepartmanlari_Departmanlar_DepartmanId` FOREIGN KEY (`DepartmanId`) REFERENCES `Departmanlar` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_IsBasvuruDetayDepartmanlari_IsBasvuruDetaylari_IsBasvuruDeta~` FOREIGN KEY (`IsBasvuruDetayId`) REFERENCES `IsBasvuruDetaylari` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `OyunBilgileri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `DepartmanId` int NOT NULL,
    `OyunAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `MasterOyunId` int NOT NULL,
    `OyunAktifMi` tinyint(1) NOT NULL,
    CONSTRAINT `PK_OyunBilgileri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_OyunBilgileri_Departmanlar_DepartmanId` FOREIGN KEY (`DepartmanId`) REFERENCES `Departmanlar` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_OyunBilgileri_MasterOyunlar_MasterOyunId` FOREIGN KEY (`MasterOyunId`) REFERENCES `MasterOyunlar` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `ProgramBilgileri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `DepartmanId` int NOT NULL,
    `MasterProgramId` int NOT NULL,
    `ProgramAdi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ProgramAktifMi` tinyint(1) NOT NULL,
    CONSTRAINT `PK_ProgramBilgileri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_ProgramBilgileri_Departmanlar_DepartmanId` FOREIGN KEY (`DepartmanId`) REFERENCES `Departmanlar` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_ProgramBilgileri_MasterProgramlar_MasterProgramId` FOREIGN KEY (`MasterProgramId`) REFERENCES `MasterProgramlar` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `KisiselBilgileri` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `PersonelId` int NOT NULL,
    `UyrukId` int NULL,
    `UyrukAdi` longtext CHARACTER SET utf8mb4 NULL,
    `DogumUlkeId` int NULL,
    `DogumUlkeAdi` longtext CHARACTER SET utf8mb4 NULL,
    `DogumSehirId` int NULL,
    `DogumSehirAdi` longtext CHARACTER SET utf8mb4 NULL,
    `DogumIlceId` int NULL,
    `DogumIlceAdi` longtext CHARACTER SET utf8mb4 NULL,
    `IkametgahUlkeId` int NULL,
    `IkametgahUlkeAdi` longtext CHARACTER SET utf8mb4 NULL,
    `IkametgahSehirId` int NULL,
    `IkametgahSehirAdi` longtext CHARACTER SET utf8mb4 NULL,
    `IkametgahIlceId` int NULL,
    `IkametgahIlceAdi` longtext CHARACTER SET utf8mb4 NULL,
    `Ad` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Soyadi` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Email` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Telefon` longtext CHARACTER SET utf8mb4 NOT NULL,
    `TelefonWhatsapp` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Adres` longtext CHARACTER SET utf8mb4 NOT NULL,
    `DogumTarihi` date NOT NULL,
    `Cinsiyet` int NOT NULL,
    `MedeniDurum` int NOT NULL,
    `CocukSayisi` int NULL,
    `VesikalikFotograf` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_KisiselBilgileri` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_KisiselBilgileri_Ilceler_DogumIlceId` FOREIGN KEY (`DogumIlceId`) REFERENCES `Ilceler` (`Id`),
    CONSTRAINT `FK_KisiselBilgileri_Ilceler_IkametgahIlceId` FOREIGN KEY (`IkametgahIlceId`) REFERENCES `Ilceler` (`Id`),
    CONSTRAINT `FK_KisiselBilgileri_Personeller_PersonelId` FOREIGN KEY (`PersonelId`) REFERENCES `Personeller` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_KisiselBilgileri_Sehirler_DogumSehirId` FOREIGN KEY (`DogumSehirId`) REFERENCES `Sehirler` (`Id`),
    CONSTRAINT `FK_KisiselBilgileri_Sehirler_IkametgahSehirId` FOREIGN KEY (`IkametgahSehirId`) REFERENCES `Sehirler` (`Id`),
    CONSTRAINT `FK_KisiselBilgileri_Ulkeler_DogumUlkeId` FOREIGN KEY (`DogumUlkeId`) REFERENCES `Ulkeler` (`Id`),
    CONSTRAINT `FK_KisiselBilgileri_Ulkeler_IkametgahUlkeId` FOREIGN KEY (`IkametgahUlkeId`) REFERENCES `Ulkeler` (`Id`),
    CONSTRAINT `FK_KisiselBilgileri_Uyruklar_UyrukId` FOREIGN KEY (`UyrukId`) REFERENCES `Uyruklar` (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `IsBasvuruDetayPozisyonlari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `IsBasvuruDetayId` int NOT NULL,
    `DepartmanPozisyonId` int NOT NULL,
    CONSTRAINT `PK_IsBasvuruDetayPozisyonlari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_IsBasvuruDetayPozisyonlari_DepartmanPozisyonlar_DepartmanPoz~` FOREIGN KEY (`DepartmanPozisyonId`) REFERENCES `DepartmanPozisyonlar` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_IsBasvuruDetayPozisyonlari_IsBasvuruDetaylari_IsBasvuruDetay~` FOREIGN KEY (`IsBasvuruDetayId`) REFERENCES `IsBasvuruDetaylari` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `IsBasvuruDetayOyunlari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `IsBasvuruDetayId` int NOT NULL,
    `OyunBilgisiId` int NOT NULL,
    CONSTRAINT `PK_IsBasvuruDetayOyunlari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_IsBasvuruDetayOyunlari_IsBasvuruDetaylari_IsBasvuruDetayId` FOREIGN KEY (`IsBasvuruDetayId`) REFERENCES `IsBasvuruDetaylari` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_IsBasvuruDetayOyunlari_OyunBilgileri_OyunBilgisiId` FOREIGN KEY (`OyunBilgisiId`) REFERENCES `OyunBilgileri` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `IsBasvuruDetayProgramlari` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `IsBasvuruDetayId` int NOT NULL,
    `ProgramBilgisiId` int NOT NULL,
    CONSTRAINT `PK_IsBasvuruDetayProgramlari` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_IsBasvuruDetayProgramlari_IsBasvuruDetaylari_IsBasvuruDetayId` FOREIGN KEY (`IsBasvuruDetayId`) REFERENCES `IsBasvuruDetaylari` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_IsBasvuruDetayProgramlari_ProgramBilgileri_ProgramBilgisiId` FOREIGN KEY (`ProgramBilgisiId`) REFERENCES `ProgramBilgileri` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

INSERT INTO `Roller` (`Id`, `RolAdi`, `RolTanimi`)
VALUES (1, 'SuperAdmin', 'Tam yetkili, her şeyi gören ve müdahale eden yönetici.'),
(2, 'Admin', 'İK Müdürü, sistem tanımları ve kullanıcı atamaları yöneticisi.'),
(3, 'IkAdmin', 'Başvuru yönetimi, log görüntüleme ve revize onay yetkilisi.'),
(4, 'IK', 'Başvuru yönetimi ve revize işlemleri (Kısıtlı yetki).'),
(5, 'GenelMudur', 'Üst düzey başvuru değerlendirme ve onay mercii.'),
(6, 'DepartmanMudur', 'İlgili departmana gelen başvuruları değerlendirme mercii.');

INSERT INTO `PanelKullanicilari` (`Id`, `Adi`, `KullaniciAdi`, `KullaniciSifre`, `MasterAlanId`, `MasterDepartmanId`, `RolId`, `SonGirisTarihi`, `Soyadi`, `SubeId`)
VALUES (1, 'Sistem', 'SuperAdmin', '$2a$11$v7tUh0sfE41ZtdoAuuEO.emlTQzkMKgnygwNaRnBYJTkbaSDJETsK', NULL, NULL, 1, TIMESTAMP '2026-01-01 00:00:00', 'Yöneticisi', NULL);

CREATE INDEX `IX_BasvuruIslemLoglari_MasterBasvuruId` ON `BasvuruIslemLoglari` (`MasterBasvuruId`);

CREATE INDEX `IX_BasvuruIslemLoglari_PanelKullaniciId` ON `BasvuruIslemLoglari` (`PanelKullaniciId`);

CREATE INDEX `IX_BasvuruOnaylari_KvkkId` ON `BasvuruOnaylari` (`KvkkId`);

CREATE UNIQUE INDEX `IX_BasvuruOnaylari_PersonelId` ON `BasvuruOnaylari` (`PersonelId`);

CREATE INDEX `IX_BilgisayarBilgileri_PersonelId` ON `BilgisayarBilgileri` (`PersonelId`);

CREATE INDEX `IX_CvDegisiklikLoglari_MasterBasvuruId` ON `CvDegisiklikLoglari` (`MasterBasvuruId`);

CREATE INDEX `IX_CvDegisiklikLoglari_PersonelId` ON `CvDegisiklikLoglari` (`PersonelId`);

CREATE INDEX `IX_Departmanlar_MasterDepartmanId` ON `Departmanlar` (`MasterDepartmanId`);

CREATE INDEX `IX_Departmanlar_SubeAlanId` ON `Departmanlar` (`SubeAlanId`);

CREATE INDEX `IX_DepartmanPozisyonlar_DepartmanId` ON `DepartmanPozisyonlar` (`DepartmanId`);

CREATE INDEX `IX_DepartmanPozisyonlar_MasterPozisyonId` ON `DepartmanPozisyonlar` (`MasterPozisyonId`);

CREATE INDEX `IX_DigerKisiselBilgileri_KktcBelgeId` ON `DigerKisiselBilgileri` (`KktcBelgeId`);

CREATE UNIQUE INDEX `IX_DigerKisiselBilgileri_PersonelId` ON `DigerKisiselBilgileri` (`PersonelId`);

CREATE INDEX `IX_EgitimBilgileri_PersonelId` ON `EgitimBilgileri` (`PersonelId`);

CREATE INDEX `IX_Ilceler_SehirId` ON `Ilceler` (`SehirId`);

CREATE UNIQUE INDEX `IX_IsBasvuruDetayAlanlari_IsBasvuruDetayId_SubeAlanId` ON `IsBasvuruDetayAlanlari` (`IsBasvuruDetayId`, `SubeAlanId`);

CREATE INDEX `IX_IsBasvuruDetayAlanlari_SubeAlanId` ON `IsBasvuruDetayAlanlari` (`SubeAlanId`);

CREATE INDEX `IX_IsBasvuruDetayDepartmanlari_DepartmanId` ON `IsBasvuruDetayDepartmanlari` (`DepartmanId`);

CREATE UNIQUE INDEX `IX_IsBasvuruDetayDepartmanlari_IsBasvuruDetayId_DepartmanId` ON `IsBasvuruDetayDepartmanlari` (`IsBasvuruDetayId`, `DepartmanId`);

CREATE UNIQUE INDEX `IX_IsBasvuruDetaylari_PersonelId` ON `IsBasvuruDetaylari` (`PersonelId`);

CREATE UNIQUE INDEX `IX_IsBasvuruDetayOyunlari_IsBasvuruDetayId_OyunBilgisiId` ON `IsBasvuruDetayOyunlari` (`IsBasvuruDetayId`, `OyunBilgisiId`);

CREATE INDEX `IX_IsBasvuruDetayOyunlari_OyunBilgisiId` ON `IsBasvuruDetayOyunlari` (`OyunBilgisiId`);

CREATE INDEX `IX_IsBasvuruDetayPozisyonlari_DepartmanPozisyonId` ON `IsBasvuruDetayPozisyonlari` (`DepartmanPozisyonId`);

CREATE INDEX `IX_IsBasvuruDetayPozisyonlari_IsBasvuruDetayId` ON `IsBasvuruDetayPozisyonlari` (`IsBasvuruDetayId`);

CREATE UNIQUE INDEX `IX_IsBasvuruDetayProgramlari_IsBasvuruDetayId_ProgramBilgisiId` ON `IsBasvuruDetayProgramlari` (`IsBasvuruDetayId`, `ProgramBilgisiId`);

CREATE INDEX `IX_IsBasvuruDetayProgramlari_ProgramBilgisiId` ON `IsBasvuruDetayProgramlari` (`ProgramBilgisiId`);

CREATE UNIQUE INDEX `IX_IsBasvuruDetaySubeler_IsBasvuruDetayId_SubeId` ON `IsBasvuruDetaySubeler` (`IsBasvuruDetayId`, `SubeId`);

CREATE INDEX `IX_IsBasvuruDetaySubeler_SubeId` ON `IsBasvuruDetaySubeler` (`SubeId`);

CREATE INDEX `IX_IsDeneyimleri_PersonelId` ON `IsDeneyimleri` (`PersonelId`);

CREATE INDEX `IX_IsDeneyimleri_SehirId` ON `IsDeneyimleri` (`SehirId`);

CREATE INDEX `IX_IsDeneyimleri_UlkeId` ON `IsDeneyimleri` (`UlkeId`);

CREATE INDEX `IX_KisiselBilgileri_DogumIlceId` ON `KisiselBilgileri` (`DogumIlceId`);

CREATE INDEX `IX_KisiselBilgileri_DogumSehirId` ON `KisiselBilgileri` (`DogumSehirId`);

CREATE INDEX `IX_KisiselBilgileri_DogumUlkeId` ON `KisiselBilgileri` (`DogumUlkeId`);

CREATE UNIQUE INDEX `IX_KisiselBilgileri_Email` ON `KisiselBilgileri` (`Email`);

CREATE INDEX `IX_KisiselBilgileri_IkametgahIlceId` ON `KisiselBilgileri` (`IkametgahIlceId`);

CREATE INDEX `IX_KisiselBilgileri_IkametgahSehirId` ON `KisiselBilgileri` (`IkametgahSehirId`);

CREATE INDEX `IX_KisiselBilgileri_IkametgahUlkeId` ON `KisiselBilgileri` (`IkametgahUlkeId`);

CREATE UNIQUE INDEX `IX_KisiselBilgileri_PersonelId` ON `KisiselBilgileri` (`PersonelId`);

CREATE INDEX `IX_KisiselBilgileri_UyrukId` ON `KisiselBilgileri` (`UyrukId`);

CREATE UNIQUE INDEX `IX_MasterBasvurular_PersonelId` ON `MasterBasvurular` (`PersonelId`);

CREATE INDEX `IX_OyunBilgileri_DepartmanId` ON `OyunBilgileri` (`DepartmanId`);

CREATE INDEX `IX_OyunBilgileri_MasterOyunId` ON `OyunBilgileri` (`MasterOyunId`);

CREATE UNIQUE INDEX `IX_PanelKullanicilari_KullaniciAdi` ON `PanelKullanicilari` (`KullaniciAdi`);

CREATE INDEX `IX_PanelKullanicilari_MasterAlanId` ON `PanelKullanicilari` (`MasterAlanId`);

CREATE INDEX `IX_PanelKullanicilari_MasterDepartmanId` ON `PanelKullanicilari` (`MasterDepartmanId`);

CREATE INDEX `IX_PanelKullanicilari_RolId` ON `PanelKullanicilari` (`RolId`);

CREATE INDEX `IX_PanelKullanicilari_SubeId` ON `PanelKullanicilari` (`SubeId`);

CREATE INDEX `IX_PersonelEhliyetleri_EhliyetTuruId` ON `PersonelEhliyetleri` (`EhliyetTuruId`);

CREATE INDEX `IX_PersonelEhliyetleri_PersonelId` ON `PersonelEhliyetleri` (`PersonelId`);

CREATE INDEX `IX_ProgramBilgileri_DepartmanId` ON `ProgramBilgileri` (`DepartmanId`);

CREATE INDEX `IX_ProgramBilgileri_MasterProgramId` ON `ProgramBilgileri` (`MasterProgramId`);

CREATE INDEX `IX_ReferansBilgileri_PersonelId` ON `ReferansBilgileri` (`PersonelId`);

CREATE INDEX `IX_Sehirler_UlkeId` ON `Sehirler` (`UlkeId`);

CREATE INDEX `IX_SertifikaBilgileri_PersonelId` ON `SertifikaBilgileri` (`PersonelId`);

CREATE INDEX `IX_SubeAlanlar_MasterAlanId` ON `SubeAlanlar` (`MasterAlanId`);

CREATE INDEX `IX_SubeAlanlar_SubeId` ON `SubeAlanlar` (`SubeId`);

CREATE UNIQUE INDEX `IX_Subeler_SubeAdi` ON `Subeler` (`SubeAdi`);

CREATE UNIQUE INDEX `IX_Uyruklar_UlkeId` ON `Uyruklar` (`UlkeId`);

CREATE INDEX `IX_YabanciDilBilgileri_DilId` ON `YabanciDilBilgileri` (`DilId`);

CREATE INDEX `IX_YabanciDilBilgileri_PersonelId` ON `YabanciDilBilgileri` (`PersonelId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260225032557_InitialCreate', '8.0.2');

COMMIT;

