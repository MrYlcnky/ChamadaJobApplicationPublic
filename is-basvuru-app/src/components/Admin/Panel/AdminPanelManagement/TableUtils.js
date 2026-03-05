// src/components/Admin/Panel/AdminPanelManagement/TableUtils.js

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_IMAGE_PATH = "uploads/personel-fotograflari";

export const EGITIM_SEVIYELERI = {
  1: "Lise",
  2: "Ön Lisans",
  3: "Lisans",
  4: "Yüksek Lisans",
  5: "Doktora",
  6: "Diğer",
};

export const DIL_SEVIYELERI = {
  0: "-",
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

export const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  let cleanPath = path
    .replace(/\\/g, "/")
    .replace(/^wwwroot\/?/i, "")
    .replace(/^\/+/, "");
  if (!cleanPath.startsWith("uploads"))
    cleanPath = `${DEFAULT_IMAGE_PATH}/${cleanPath}`;
  return `${BASE_URL}/${cleanPath}`;
};

export const calculateAge = (birthDateString) => {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const mapDtoToCvFormat = (originalRow) => {
  const p = originalRow?.personel || originalRow?.Personel || {};
  const k = p.kisiselBilgiler || p.KisiselBilgiler || {};
  const d = p.digerKisiselBilgiler || p.DigerKisiselBilgiler || {};
  const detay = p.isBasvuruDetay || p.IsBasvuruDetay || {};

  const getCinsiyet = (val) =>
    val === 1 ? "Kadın" : val === 2 ? "Erkek" : "Belirtilmemiş";
  const getMedeniDurum = (val) =>
    ({ 1: "Bekar", 2: "Evli", 3: "Boşanmış", 4: "Dul" })[val] || "-";

  return {
    name: `${k.ad || ""} ${k.soyadi || ""}`,
    personal: {
      ad: k.ad,
      soyad: k.soyadi,
      telefon: k.telefon || k.cepTelefonu,
      whatsapp: k.telefonWhatsapp,
      eposta: k.email,
      adres: k.adres,
      dogumTarihi: k.dogumTarihi,
      cinsiyet: getCinsiyet(k.cinsiyet),
      medeniDurum: getMedeniDurum(k.medeniDurum),
      cocukSayisi: k.cocukSayisi ?? 0,
      uyruk: k.uyrukAdi || "-",
      dogumSehir: k.dogumSehirAdi,
      dogumUlke: k.dogumUlkeAdi,
      dogumIlce: k.dogumIlceAdi,
      ikametSehir: k.ikametgahSehirAdi,
      ikametUlke: k.ikametgahUlkeAdi,
      ikametIlce: k.ikametgahIlceAdi,
      foto: resolveImageUrl(k.vesikalikFotograf || p.fotografYolu),
    },
    jobDetails: {
      subeler: detay.basvuruSubeler?.map((x) => ({ label: x.subeAdi })) || [],
      alanlar:
        detay.basvuruAlanlar?.map((x) => ({
          label: x.alanAdi || x.subeAlan?.masterAlan?.masterAlanAdi,
        })) || [],
      departmanlar:
        detay.basvuruDepartmanlar?.map((x) => ({
          label:
            x.departmanAdi || x.departman?.masterDepartman?.masterDepartmanAdi,
        })) || [],
      departmanPozisyonlari:
        detay.basvuruPozisyonlar?.map((x) => ({
          label:
            x.pozisyonAdi ||
            x.departmanPozisyon?.masterPozisyon?.masterPozisyonAdi,
        })) || [],
      programlar: (detay.basvuruProgramlar || []).map((x) => ({
        label: x.masterProgramAdi || x.programAdi || "Tanımsız Program",
      })),
      kagitOyunlari: (detay.basvuruOyunlar || []).map((x) => ({
        label: x.masterOyunAdi || x.oyunAdi || "Tanımsız Oyun",
      })),
      lojman: detay.lojmanTalebiVarMi === 1 ? "Hayır" : "Evet",
      tercihNedeni: detay.nedenBiz,
    },
    education: (p.egitimBilgileri || []).map((e) => ({
      seviye: EGITIM_SEVIYELERI[e.egitimSeviyesi] || "-",
      okul: e.okulAdi,
      bolum: e.bolum,
      baslangic: e.baslangicTarihi,
      bitis: e.bitisTarihi,
      diplomaDurum:
        { 1: "Mezun", 2: "Devam Ediyor", 3: "Ara Verdi", 4: "Terk" }[
          e.diplomaDurum
        ] || "-",
      gano: e.gano,
      notSistemi: e.notSistemi === 1 ? "100'lük" : "4'lük",
    })),
    experience: (p.isDeneyimleri || []).map((exp) => ({
      isAdi: exp.sirketAdi,
      departman: exp.departman,
      pozisyon: exp.pozisyon,
      ulkeAdi: exp.ulkeAdi,
      sehirAdi: exp.sehirAdi,
      ucret: exp.ucret,
      baslangicTarihi: exp.baslangicTarihi,
      bitisTarihi: exp.bitisTarihi,
      halenCalisiyor: !exp.bitisTarihi,
      ayrilisSebebi: exp.ayrilisSebep,
    })),
    languages: (p.yabanciDilBilgileri || []).map((l) => ({
      dil: l.dil?.dilAdi || l.dilAdi || "Diğer",
      konusma: DIL_SEVIYELERI[l.konusmaSeviyesi] || "-",
      dinleme: DIL_SEVIYELERI[l.dinlemeSeviyesi] || "-",
      okuma: DIL_SEVIYELERI[l.okumaSeviyesi] || "-",
      yazma: DIL_SEVIYELERI[l.yazmaSeviyesi] || "-",
      ogrenilenKurum: l.nasilOgrenildi,
    })),
    computer: (p.bilgisayarBilgileri || []).map((c) => ({
      programAdi: c.programAdi,
      yetkinlik:
        { 1: "Çok Zayıf", 2: "Zayıf", 3: "Orta", 4: "İyi", 5: "Çok İyi" }[
          c.yetkinlik
        ] || "-",
    })),
    certificates: (p.sertifikaBilgileri || []).map((c) => ({
      ad: c.sertifikaAdi,
      kurum: c.kurumAdi,
      sure: c.suresi,
      verilisTarihi: c.verilisTarihi,
      gecerlilikTarihi: c.gecerlilikTarihi,
    })),
    references: (p.referansBilgileri || []).map((r) => ({
      referansAdi: r.referansAdi,
      referansSoyadi: r.referansSoyadi,
      referansIsYeri: r.isYeri,
      referansGorevi: r.gorev,
      referansTelefon: r.referansTelefon,
      calistigiKurum:
        r.calistigiKurum === 1
          ? "Bünyemizde"
          : r.calistigiKurum === 2
            ? "Harici"
            : "Kişisel",
    })),
    otherInfo: {
      kktcGecerliBelge: d.kktcBelgeAdi || d.KktcBelgeAdi || "-",
      askerlik: d.askerlikDurumuAdi || d.AskerlikDurumuAdi || "-",
      ehliyet: d.ehliyetDurumuAdi || d.EhliyetDurumuAdi || "-",
      ehliyetTurleri: (p.personelEhliyetler || [])
        .map((e) => e.ehliyetTuruAdi || e.EhliyetTuruAdi)
        .filter(Boolean),
      boy: d.boy || d.Boy || "-",
      kilo: d.kilo || d.Kilo || "-",
      sigara: d.sigaraKullanimiAdi || d.SigaraKullanimiAdi || "-",
      davaDurumu: d.davaDurumuAdi || d.DavaDurumuAdi || "-",
      davaNedeni: d.davaNedeni || d.DavaNedeni || "-",
      kaliciRahatsizlik:
        d.kaliciRahatsizlikAdi || d.KaliciRahatsizlikAdi || "-",
      rahatsizlikAciklama:
        d.kaliciRahatsizlikAciklama || d.KaliciRahatsizlikAciklama || "-",
    },
    notes: originalRow.notes || originalRow.Notes || [],
  };
};
