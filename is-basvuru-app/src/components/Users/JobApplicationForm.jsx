import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGraduationCap,
  faPlus,
  faAward,
  faLaptopCode,
  faLanguage,
  faBriefcase,
  faPhoneVolume,
  faUserCog,
  faFileSignature,
  faCheckCircle,
  faCircleXmark,
  faInfoCircle,
  faGlobe,
  faRotateLeft,
  faShieldHalved,
  faEnvelope,
  faPenToSquare,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import chIcon from "../../assets/ch.ico";

// Schemas
import { createMainApplicationSchema } from "../../schemas/mainApplicationSchema";
import { createPersonalSchema } from "../../schemas/personalInfoSchema";
import { createOtherInfoSchema } from "../../schemas/otherInfoSchema";
import { createJobDetailsSchema } from "../../schemas/jobDetailsSchema";

// Components
import PersonalInformation from "./usersComponents/PersonalInformation";
import EducationTable from "./usersComponents/EducationTable";
import CertificateTable from "./usersComponents/CertificatesTable";
import ComputerInformationTable from "./usersComponents/ComputerInformationTable";
import LanguageTable from "./usersComponents/LanguageTable";
import JobExperiencesTable from "./usersComponents/JobExperiencesTable";
import ReferencesTable from "./usersComponents/ReferencesTable";
import OtherPersonalInformationTable from "./usersComponents/OtherPersonalInformationTable";
import JobApplicationDetails from "./usersComponents/JobApplicationDetails";
import ApplicationConfirmSection from "./usersComponents/ApplicationConfirmSection";

// Hooks & Services
import { lockScroll } from "./modalHooks/scrollLock";
import LanguageSwitcher from "../LanguageSwitcher";
import { basvuruService } from "../../services/basvuruService";
import { authService } from "../../services/authService";
import { tanimlamaService } from "../../services/tanimlamalarService";

// Utils
import { toApiDate } from "./modalHooks/dateUtils";
import {
  safeEnum,
  getSafeValue,
  toFloat,
  mapArrayToIntList,
  toIntOrNull,
  safeStr,
} from "./modalHooks/formUtils";

const MySwal = withReactContent(Swal);

// --- AYARLAR ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_UPLOAD_PATH = "/uploads/personel-fotograflari";

const swalSkyConfig = {
  background: "#1e293b",
  color: "#fff",
  confirmButtonColor: "#0ea5e9",
  cancelButtonColor: "#475569",
  customClass: {
    popup: "border border-slate-700 shadow-2xl rounded-xl",
    input:
      "bg-slate-800 border border-slate-600 text-white focus:border-sky-500 focus:ring-0 shadow-none outline-none rounded-lg px-4 py-2",
    confirmButton:
      "shadow-none focus:shadow-none rounded-lg px-5 py-2.5 font-medium",
    cancelButton:
      "shadow-none focus:shadow-none rounded-lg px-5 py-2.5 font-medium",
  },
};

function objectToFormData(obj, fd = new FormData(), pre = "") {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];

    const propName = pre ? `${pre}[${key}]` : key;

    if (value instanceof File || value instanceof Blob) {
      fd.append(propName, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        // Listeler için: EgitimBilgileri[0][OkulAdi]
        const arrayKey = `${propName}[${index}]`;
        if (
          typeof item === "object" &&
          item !== null &&
          !(item instanceof File)
        ) {
          objectToFormData(item, fd, arrayKey);
        } else {
          fd.append(arrayKey, item === null || item === undefined ? "" : item);
        }
      });
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Date)
    ) {
      // Objeler için: KisiselBilgiler[Ad]
      objectToFormData(value, fd, propName);
    } else {
      // Normal değerler (string, number, bool, date)
      let finalValue = value;
      if (value instanceof Date) {
        finalValue = value.toISOString();
      } else if (value === null || value === undefined) {
        finalValue = "";
      }
      fd.append(propName, finalValue);
    }
  }
  return fd;
}

const DEFAULT_VALUES = {
  personal: {
    ad: "",
    soyad: "",
    eposta: "",
    telefon: "",
    whatsapp: "",
    adres: "",
    cinsiyet: "",
    medeniDurum: "",
    dogumTarihi: "",
    cocukSayisi: "",
    foto: null,
    VesikalikDosyasi: null,
    DogumUlkeId: null,
    DogumUlkeAdi: "",
    DogumSehirId: null,
    DogumSehirAdi: "",
    DogumIlceId: null,
    DogumIlceAdi: "",
    IkametgahUlkeId: null,
    IkametgahUlkeAdi: "",
    IkametgahSehirId: null,
    IkametgahSehirAdi: "",
    IkametgahIlceId: null,
    IkametgahIlceAdi: "",
    UyrukId: null,
    UyrukAdi: "",
  },
  otherInfo: {
    kktcGecerliBelge: "",
    davaDurumu: "",
    davaNedeni: "",
    sigara: "",
    kaliciRahatsizlik: "",
    rahatsizlikAciklama: "",
    ehliyet: "",
    ehliyetTurleri: [],
    askerlik: "",
    boy: "",
    kilo: "",
  },
  jobDetails: {
    subeler: [],
    alanlar: [],
    departmanlar: [],
    programlar: [],
    departmanPozisyonlari: [],
    kagitOyunlari: [],
    lojman: "",
    tercihNedeni: "",
  },
  education: [],
  certificates: [],
  computer: [],
  languages: [],
  experience: [],
  references: [],
};

// --- YARDIMCI: URL'den Dosya Oluşturma ---
const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;

  let cleanPath = path
    .replace(/\\/g, "/")
    .replace(/^wwwroot\/?/i, "")
    .replace(/^\/+/, "");

  // Eğer path zaten 'uploads' ile başlamıyorsa varsayılan yolu ekle
  if (!cleanPath.startsWith("uploads")) {
    // IMAGE_UPLOAD_PATH başında '/' varsa temizle
    const basePath = IMAGE_UPLOAD_PATH.startsWith("/")
      ? IMAGE_UPLOAD_PATH.substring(1)
      : IMAGE_UPLOAD_PATH;
    cleanPath = `${basePath}/${cleanPath}`;
  }

  return `${API_BASE_URL}/${cleanPath}`;
};
async function urlToFile(url, filename, mimeType) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Resim indirilemedi! Status: ${res.status}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength === 0) throw new Error("Dosya boyutu 0 byte.");
    const file = new File([buf], filename, { type: mimeType });
    return file;
  } catch (error) {
    console.error("Resim dosyaya çevrilirken hata:", error);
    return null;
  }
}

// --- Backend DTO'dan Forma Veri Dönüştürücü ---
function mapBackendToForm(dto) {
  if (!dto) return null;
  const k = dto.kisiselBilgiler || {};
  const dk = dto.digerKisiselBilgiler || {};
  const d = dto.isBasvuruDetay || {};

  const toDateInputValue = (dateStr) => (dateStr ? dateStr.split("T")[0] : "");

  return {
    personal: {
      ad: k.ad ?? "",
      soyad: k.soyadi ?? "",
      eposta: k.email ?? "",
      telefon: k.telefon ?? "",
      whatsapp: k.telefonWhatsapp ?? "",
      adres: k.adres ?? "",
      cinsiyet: k.cinsiyet || "",
      medeniDurum: k.medeniDurum || "",
      dogumTarihi: toDateInputValue(k.dogumTarihi),
      cocukSayisi: k.cocukSayisi?.toString() ?? "",
      DogumUlkeId: k.dogumUlkeId,
      DogumUlkeAdi: k.dogumUlkeAdi,
      DogumSehirId: k.dogumSehirId,
      DogumSehirAdi: k.dogumSehirAdi,
      DogumIlceId: k.dogumIlceId,
      DogumIlceAdi: k.dogumIlceAdi,
      IkametgahUlkeId: k.ikametgahUlkeId,
      IkametgahUlkeAdi: k.ikametgahUlkeAdi,
      IkametgahSehirId: k.ikametgahSehirId,
      IkametgahSehirAdi: k.ikametgahSehirAdi,
      IkametgahIlceId: k.ikametgahIlceId,
      IkametgahIlceAdi: k.ikametgahIlceAdi,
      UyrukId: k.uyrukId,
      UyrukAdi: k.uyrukAdi,
      foto: resolveImageUrl(k.fotografYolu || k.vesikalikFotograf),
      VesikalikDosyasi: null,
    },
    otherInfo: {
      kktcGecerliBelge: dk.kktcBelgeId?.toString() ?? "",
      davaDurumu: dk.davaDurumu?.toString() ?? "",
      davaNedeni: dk.davaNedeni ?? "",
      sigara: dk.sigaraKullanimi?.toString() ?? "",
      askerlik: dk.askerlikDurumu?.toString() ?? "",
      kaliciRahatsizlik: dk.kaliciRahatsizlik?.toString() ?? "",
      rahatsizlikAciklama: dk.kaliciRahatsizlikAciklama ?? "",
      ehliyet: dk.ehliyetDurumu?.toString() ?? "",
      ehliyetTurleri: (dto.personelEhliyetler || []).map((x) =>
        x.ehliyetTuruId?.toString(),
      ),
      boy: dk.boy?.toString() ?? "",
      kilo: dk.kilo?.toString() ?? "",
    },
    jobDetails: {
      subeler: (d.basvuruSubeler || []).map((x) => ({ value: String(x.id) })),
      alanlar: (d.basvuruAlanlar || []).map((x) => ({ value: String(x.id) })),
      departmanlar: (d.basvuruDepartmanlar || []).map((x) => ({
        value: String(x.id),
      })),
      departmanPozisyonlari: (d.basvuruPozisyonlar || []).map((x) => ({
        value: String(x.id),
      })),
      programlar: (d.basvuruProgramlar || []).map((x) => ({
        value: String(x.id),
      })),
      kagitOyunlari: (d.basvuruOyunlar || []).map((x) => ({
        value: String(x.id),
      })),
      lojman: d.lojmanTalebiVarMi?.toString() ?? "",
      tercihNedeni: d.nedenBiz ?? "",
    },
    education: (dto.egitimBilgileri || []).map((e) => ({
      id: e.id,
      seviye: e.egitimSeviyesi,
      okul: e.okulAdi,
      bolum: e.bolum,
      notSistemi: e.notSistemi,
      gano: e.gano,
      baslangic: toDateInputValue(e.baslangicTarihi),
      bitis: toDateInputValue(e.bitisTarihi),
      diplomaDurum: e.diplomaDurum,
    })),
    certificates: (dto.sertifikaBilgileri || []).map((s) => ({
      id: s.id,
      ad: s.sertifikaAdi,
      kurum: s.kurumAdi,
      sure: s.suresi,
      verilisTarihi: toDateInputValue(s.verilisTarihi),
      gecerlilikTarihi: toDateInputValue(s.gecerlilikTarihi),
    })),
    computer: (dto.bilgisayarBilgileri || []).map((c) => ({
      id: c.id,
      programAdi: c.programAdi,
      yetkinlik: c.yetkinlik,
    })),
    languages: (dto.yabanciDilBilgileri || []).map((l) => ({
      id: l.id,
      dilId: l.dilId,
      digerDilAdi: l.digerDilAdi,
      konusma: l.konusmaSeviyesi,
      yazma: l.yazmaSeviyesi,
      okuma: l.okumaSeviyesi,
      dinleme: l.dinlemeSeviyesi,
      ogrenilenKurum: l.nasilOgrenildi,
    })),
    experience: (dto.isDeneyimleri || []).map((exp) => ({
      id: exp.id,
      isAdi: exp.sirketAdi,
      departman: exp.departman,
      pozisyon: exp.pozisyon,
      gorev: exp.gorev,
      ucret: exp.ucret,
      baslangicTarihi: toDateInputValue(exp.baslangicTarihi),
      bitisTarihi: toDateInputValue(exp.bitisTarihi),
      ayrilisSebebi: exp.ayrilisSebep,
      ulkeId: exp.ulkeId,
      ulkeAdi: exp.ulkeAdi,
      sehirId: exp.sehirId,
      sehirAdi: exp.sehirAdi,
    })),
    references: (dto.referansBilgileri || []).map((r) => ({
      id: r.id,
      calistigiKurum: r.calistigiKurum,
      referansAdi: r.referansAdi,
      referansSoyadi: r.referansSoyadi,
      referansIsYeri: r.isYeri,
      referansGorevi: r.gorev,
      referansTelefon: r.referansTelefon,
    })),
    PersonelEhliyetler: (dto.personelEhliyetler || []).map((x) => ({
      id: x.id,
      ehliyetTuruId: x.ehliyetTuruId,
    })),
  };
}

// --- Payload Oluşturucu ---
function buildPersonelCreateDtoPayload(t, data, currentId, kvkkId) {
  const p = data.personal ?? {};
  const oi = data.otherInfo ?? {};
  const jd = data.jobDetails ?? {};
  const safeInt = (val) => getSafeValue(val);
  const idVal = Number(currentId) || 0;

  return {
    Id: idVal,
    BasvuruOnay: {
      KvkkId: kvkkId,
      OnayDurum: true,
    },
    SubeIds: mapArrayToIntList(jd.subeler),
    SubeAlanIds: mapArrayToIntList(jd.alanlar),
    DepartmanIds: mapArrayToIntList(jd.departmanlar),
    DepartmanPozisyonIds: mapArrayToIntList(jd.departmanPozisyonlari),
    ProgramIds: mapArrayToIntList(jd.programlar),
    OyunIds: mapArrayToIntList(jd.kagitOyunlari),
    NedenBiz: safeStr(jd.tercihNedeni),
    LojmanTalebi: safeInt(jd.lojman),
    VesikalikDosyasi:
      p.VesikalikDosyasi instanceof File ? p.VesikalikDosyasi : null,

    KisiselBilgiler: {
      Id: idVal,
      PersonelId: idVal,
      Ad: safeStr(p.ad),
      Soyadi: safeStr(p.soyad),
      Email: safeStr(p.eposta),
      Telefon: safeStr(p.telefon),
      TelefonWhatsapp: safeStr(p.whatsapp),
      Adres: safeStr(p.adres),
      DogumTarihi: toApiDate(p.dogumTarihi),
      Cinsiyet: safeEnum(p.cinsiyet),
      MedeniDurum: safeEnum(p.medeniDurum),
      CocukSayisi: p.cocukSayisi === "7+" ? 7 : toIntOrNull(p.cocukSayisi),
      VesikalikFotograf: "",
      DogumUlkeId: toIntOrNull(p.DogumUlkeId),
      DogumUlkeAdi: safeStr(p.DogumUlkeAdi),
      DogumSehirId: toIntOrNull(p.DogumSehirId),
      DogumSehirAdi: safeStr(p.DogumSehirAdi),
      DogumIlceId: toIntOrNull(p.DogumIlceId),
      DogumIlceAdi: safeStr(p.DogumIlceAdi),
      IkametgahUlkeId: toIntOrNull(p.IkametgahUlkeId),
      IkametgahUlkeAdi: safeStr(p.IkametgahUlkeAdi),
      IkametgahSehirId: toIntOrNull(p.IkametgahSehirId),
      IkametgahSehirAdi: safeStr(p.IkametgahSehirAdi),
      IkametgahIlceId: toIntOrNull(p.IkametgahIlceId),
      IkametgahIlceAdi: safeStr(p.IkametgahIlceAdi),
      UyrukId: toIntOrNull(p.UyrukId),
      UyrukAdi: safeStr(p.UyrukAdi),
    },
    DigerKisiselBilgiler: {
      Id: idVal,
      PersonelId: idVal,
      KktcBelgeId: safeEnum(oi.kktcGecerliBelge),
      DavaDurumu: safeEnum(oi.davaDurumu),
      DavaNedeni: safeEnum(oi.davaDurumu) === 2 ? safeStr(oi.davaNedeni) : null,
      SigaraKullanimi: safeEnum(oi.sigara),
      AskerlikDurumu: safeEnum(oi.askerlik),
      KaliciRahatsizlik: safeEnum(oi.kaliciRahatsizlik),
      KaliciRahatsizlikAciklama:
        safeEnum(oi.kaliciRahatsizlik) === 2
          ? safeStr(oi.rahatsizlikAciklama)
          : null,
      EhliyetDurumu: safeEnum(oi.ehliyet),
      Boy: Number(oi.boy) || 0,
      Kilo: Number(oi.kilo) || 0,
    },
    EgitimBilgileri: (data.education || []).map((edu) => ({
      Id: Number(edu.id) || 0,
      PersonelId: idVal,
      EgitimSeviyesi: safeInt(edu.seviye),
      OkulAdi: safeStr(edu.okul),
      Bolum: safeStr(edu.bolum),
      BaslangicTarihi: toApiDate(edu.baslangic),
      BitisTarihi: edu.bitis ? toApiDate(edu.bitis) : null,
      DiplomaDurum: safeInt(edu.diplomaDurum),
      NotSistemi: safeInt(edu.notSistemi),
      Gano: toFloat(edu.gano),
    })),
    SertifikaBilgileri: (data.certificates || []).map((cert) => ({
      Id: cert.id || 0,
      PersonelId: idVal,
      SertifikaAdi: safeStr(cert.ad),
      KurumAdi: safeStr(cert.kurum),
      Suresi: safeStr(cert.sure),
      VerilisTarihi: toApiDate(cert.verilisTarihi),
      GecerlilikTarihi: cert.gecerlilikTarihi
        ? toApiDate(cert.gecerlilikTarihi)
        : null,
    })),
    BilgisayarBilgileri: (data.computer || []).map((comp) => ({
      Id: comp.id || 0,
      PersonelId: idVal,
      ProgramAdi: safeStr(comp.programAdi),
      Yetkinlik: Number(comp.yetkinlik),
    })),
    YabanciDilBilgileri: (data.languages || []).map((lang) => ({
      Id: lang.id || 0,
      PersonelId: idVal,
      DilId: lang.dilId,
      DigerDilAdi: safeStr(lang.digerDilAdi),
      KonusmaSeviyesi: Number(lang.konusma),
      YazmaSeviyesi: Number(lang.yazma),
      OkumaSeviyesi: Number(lang.okuma),
      DinlemeSeviyesi: Number(lang.dinleme),
      NasilOgrenildi: safeStr(lang.ogrenilenKurum),
    })),
    IsDeneyimleri: (data.experience || []).map((exp) => ({
      Id: exp.id || 0,
      PersonelId: idVal,
      SirketAdi: safeStr(exp.isAdi),
      Departman: safeStr(exp.departman),
      Pozisyon: safeStr(exp.pozisyon),
      Gorev: safeStr(exp.gorev),
      Ucret: Number(exp.ucret),
      BaslangicTarihi: toApiDate(exp.baslangicTarihi),
      BitisTarihi: exp.bitisTarihi ? toApiDate(exp.bitisTarihi) : null,
      AyrilisSebep: safeStr(exp.ayrilisSebebi),
      UlkeId: exp.ulkeId,
      UlkeAdi: safeStr(exp.ulkeAdi),
      SehirId: exp.sehirId,
      SehirAdi: safeStr(exp.sehirAdi),
    })),
    ReferansBilgileri: (data.references || []).map((ref) => ({
      Id: ref.id || 0,
      PersonelId: idVal,
      CalistigiKurum: Number(ref.calistigiKurum),
      ReferansAdi: safeStr(ref.referansAdi),
      ReferansSoyadi: safeStr(ref.referansSoyadi),
      IsYeri: safeStr(ref.referansIsYeri),
      Gorev: safeStr(ref.referansGorevi),
      ReferansTelefon: safeStr(ref.referansTelefon),
    })),
    PersonelEhliyetler: (oi.ehliyetTurleri || []).map((id) => ({
      EhliyetTuruId: Number(id),
      PersonelId: idVal,
    })),
  };
}

export default function JobApplicationForm() {
  const { t } = useTranslation();
  const [resetKey, setResetKey] = useState(0);

  // STATELER
  const [existingId, setExistingId] = useState(null);
  const [skipOtp, setSkipOtp] = useState(false);

  useEffect(() => {
    try {
      localStorage.removeItem("job_application_draft");
    } catch (err) {
      console.warn("Draft temizlenemedi:", err);
    }
  }, []);

  const educationTableRef = useRef(null);
  const certificatesTableRef = useRef(null);
  const computerInformationTableRef = useRef(null);
  const languageTableRef = useRef(null);
  const jobExperiencesTableRef = useRef(null);
  const referencesTableRef = useRef(null);

  const [isReturningUser, setIsReturningUser] = useState(false);
  const [returningEmail, setReturningEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [definitionData, setDefinitionData] = useState({
    ulkeler: [],
    sehirler: [],
    ilceler: [],
    uyruklar: [],
    departmanlar: [],
    pozisyonlar: [],
    subeler: [],
    subeAlanlar: [],
    programlar: [],
    kagitOyunlari: [],
    ehliyetler: [],
    diller: [],
    kktcBelgeler: [],
  });

  const safeCall = async (fn, ...args) => {
    try {
      if (typeof fn !== "function") return [];
      const res = await fn(...args);
      return res?.data ?? res ?? [];
    } catch {
      return [];
    }
  };

  const mainSchema = useMemo(() => createMainApplicationSchema(t, {}), [t]);
  const methods = useForm({
    resolver: zodResolver(mainSchema),
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });
  const { handleSubmit, trigger, reset, control, setValue } = methods;

  useEffect(() => {
    const loadDefinitions = async () => {
      try {
        const [
          ulkeler,
          sehirler,
          ilceler,
          uyruklar,
          departmanlar,
          pozisyonlar,
          subeler,
          ehliyetler,
          diller,
          subeAlanlar,
          programlar,
          kagitOyunlari,
          kktcBelgeler,
          kvkkListesi,
        ] = await Promise.all([
          safeCall(tanimlamaService.getUlkeler),
          safeCall(tanimlamaService.getSehirler),
          safeCall(tanimlamaService.getIlceler),
          safeCall(tanimlamaService.getUyruklar),
          safeCall(tanimlamaService.getDepartmanlar),
          safeCall(tanimlamaService.getPozisyonlar),
          safeCall(tanimlamaService.getSubeler),
          safeCall(tanimlamaService.getEhliyetTurleri),
          safeCall(tanimlamaService.getDiller),
          safeCall(tanimlamaService.getSubeAlanlar),
          safeCall(tanimlamaService.getProgramlar),
          safeCall(tanimlamaService.getOyunlar),
          safeCall(tanimlamaService.getKktcBelgeler),
          safeCall(tanimlamaService.getKvkks),
        ]);
        setDefinitionData({
          ulkeler,
          sehirler,
          ilceler,
          uyruklar,
          departmanlar,
          pozisyonlar,
          subeler,
          ehliyetler,
          diller,
          subeAlanlar,
          programlar,
          kagitOyunlari,
          kktcBelgeler,
          kvkkListesi,
        });
      } catch (error) {
        console.error("Tanımlamalar yüklenemedi:", error);
      }
    };
    loadDefinitions();
  }, [trigger]);

  const personalData = useWatch({ control, name: "personal" });
  const educationData = useWatch({ control, name: "education" });
  const otherInfoData = useWatch({ control, name: "otherInfo" });
  const jobDetailsData = useWatch({ control, name: "jobDetails" });

  const statusState = useMemo(() => {
    return {
      personalOk: createPersonalSchema(t, {
        ulkeler: definitionData.ulkeler,
        uyruklar: definitionData.uyruklar,
        sehirler: definitionData.sehirler,
        ilceler: definitionData.ilceler,
      }).safeParse(personalData).success,
      educationOk: Array.isArray(educationData) && educationData.length > 0,
      otherOk: createOtherInfoSchema(t).safeParse(otherInfoData).success,
      jobDetailsOk: createJobDetailsSchema(t, {}).safeParse(jobDetailsData)
        .success,
    };
  }, [
    personalData,
    educationData,
    otherInfoData,
    jobDetailsData,
    t,
    definitionData,
  ]);

  const allRequiredOk =
    statusState.personalOk &&
    statusState.educationOk &&
    statusState.otherOk &&
    statusState.jobDetailsOk;

  const scrollToSection = useCallback((targetId, offset = 100) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const y =
      el.getBoundingClientRect().top + window.scrollY - Math.max(offset, 0);
    window.scrollTo({ top: y, behavior: "smooth" });
    el.classList.add(
      "ring-1",
      "ring-sky-500",
      "ring-offset-1",
      "ring-offset-[#0f172a]",
      "transition-all",
      "duration-500",
    );
    setTimeout(() => {
      el.classList.remove(
        "ring-1",
        "ring-sky-500",
        "ring-offset-1",
        "ring-offset-[#0f172a]",
        "transition-all",
        "duration-500",
      );
    }, 1600);
  }, []);

  const SECTION_IDS = {
    personal: "section-personal",
    education: "section-education",
    other: "section-other",
    jobDetails: "section-jobdetails",
  };
  const onAddWithScrollLock = (fn) => () => {
    lockScroll();
    fn?.();
  };

  // --- BİLGİLERİ GETİR ---
  const handleFetchProfile = async () => {
    setEmailError("");
    const emailSchema = z.string().email(t("personal.errors.email.invalid"));
    const result = emailSchema.safeParse(returningEmail);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return;
    }

    try {
      setIsLoadingProfile(true);
      const sendRes = await authService.sendCode(returningEmail, true);
      setIsLoadingProfile(false);

      if (!sendRes.success) {
        toast.error(sendRes.message || "Kod gönderilemedi.", { theme: "dark" });
        return;
      }

      const { value: otpCode } = await MySwal.fire({
        ...swalSkyConfig,
        title: "Güvenlik Doğrulaması",
        html: `
          <div style="text-align: center; color: #cbd5e1;">
            <p style="margin-bottom: 10px; font-size: 0.95rem;">
              Lütfen <strong style="color: #38bdf8;">${returningEmail}</strong> adresine gönderilen <br/>6 haneli doğrulama kodunu aşağıya giriniz.
            </p>
          </div>
        `,
        input: "text",
        inputAttributes: {
          maxlength: 6,
          oninput: "this.value = this.value.replace(/[^0-9]/g, '')",
          style:
            "text-align: center; letter-spacing: 12px; font-size: 28px; font-weight: bold; color: white; background: #0f172a; border: 1px solid #334155; border-radius: 8px; width: 220px; margin: 0 auto; display: block; height: 50px;",
        },
        showCancelButton: true,
        confirmButtonText: "Doğrula ve Getir",
        cancelButtonText: "Vazgeç",
        showLoaderOnConfirm: true,
        preConfirm: async (code) => {
          if (!code || code.length < 6) {
            Swal.showValidationMessage(
              "Lütfen 6 haneli kodu eksiksiz giriniz.",
            );
            return false;
          }
          try {
            const verifyRes = await authService.verifyCode(
              returningEmail,
              code,
            );
            if (!verifyRes.success) {
              Swal.showValidationMessage(
                verifyRes.message || "Girdiğiniz kod hatalı.",
              );
              return false;
            }
            return true;
          } catch (e) {
            console.error("Doğrulama Hatası:", e);
            const errorMessage =
              e.response?.data?.message || e.response?.data?.Errors?.[0];

            if (errorMessage) {
              Swal.showValidationMessage(errorMessage);
            } else {
              Swal.showValidationMessage("Doğrulama servisine erişilemedi.");
            }
            return false;
          }
        },
      });

      if (otpCode) {
        const loadingToast = toast.loading("Bilgileriniz yükleniyor...", {
          theme: "dark",
        });
        const response = await basvuruService.getByEmail(returningEmail);
        toast.dismiss(loadingToast);

        if (response.success && response.data) {
          // 1. ID'yi kaydet
          setExistingId(response.data.id);

          // 2. 30 dakika OTP sormama kuralını başlat
          setSkipOtp(true);
          setTimeout(() => setSkipOtp(false), 30 * 60 * 1000);

          const formData = mapBackendToForm(response.data);
          reset(formData);

          // 3. Resmi indir ve forma ekle
          if (formData.personal.foto) {
            const fileName = formData.personal.foto;
            const fullUrl = fileName.startsWith("http")
              ? fileName
              : `${API_BASE_URL}${IMAGE_UPLOAD_PATH}/${fileName}`;

            urlToFile(fullUrl, fileName, "image/png").then((file) => {
              if (file) {
                setValue("personal.VesikalikDosyasi", file, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              } else {
                toast.warn(
                  "Mevcut fotoğrafınız görüntülendi ancak sunucudan fiziksel olarak çekilemedi. Lütfen fotoğrafınızı 'Değiştir' butonuna basarak tekrar yükleyiniz.",
                  { autoClose: 10000, theme: "dark" },
                );
              }
            });
          }

          toast.success("Bilgileriniz başarıyla yüklendi.", {
            position: "top-right",
            theme: "dark",
          });
          trigger();
        } else {
          toast.warn("Bu e-posta adresiyle kayıtlı bir başvuru bulunamadı.", {
            theme: "dark",
          });
        }
      }
    } catch (e) {
      setIsLoadingProfile(false);
      console.error("Hata:", e);

      const errorMessage =
        e.response?.data?.message || e.response?.data?.Errors?.[0];

      if (errorMessage) {
        toast.warn(errorMessage, { theme: "dark" });
      } else if (e.response && e.response.status === 401) {
        toast.error("Yetkilendirme hatası (401).", { theme: "dark" });
      } else {
        toast.error(t("common.error"), { theme: "dark" });
      }
    }
  };

  // --- FORMU GÖNDER (KAYIT veya GÜNCELLEME) ---
  const handleFormSubmit = async (data) => {
    try {
      const applicantEmail = data.personal?.eposta;
      if (!applicantEmail) {
        toast.error(t("personal.errors.email.required"), { theme: "dark" });
        return;
      }

      let isVerified = false;

      // 🔥 OTP KONTROLÜ
      if (skipOtp && existingId) {
        isVerified = true;
      } else {
        Swal.fire({
          ...swalSkyConfig,
          title: "Doğrulama Kodu Gönderiliyor...",
          text: `${applicantEmail} adresine kod gönderiliyor.`,
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        try {
          const sendResponse = await authService.sendCode(
            applicantEmail,
            false,
          );
          if (!sendResponse.success)
            throw new Error(sendResponse.message || "Kod gönderilemedi.");
        } catch (err) {
          await MySwal.fire({
            ...swalSkyConfig,
            icon: "error",
            title: "Kod Gönderilemedi",
            text: err?.response?.data?.message || "Mail hatası.",
          });
          return;
        }

        const otpResult = await MySwal.fire({
          ...swalSkyConfig,
          title: t("confirm.otp.title"),
          html: `<div style="text-align: center;"><p>${t("confirm.otp.text", { email: applicantEmail })}</p></div>`,
          input: "text",
          inputAttributes: {
            maxlength: 6,
            style:
              "text-align: center; letter-spacing: 12px; font-size: 24px; font-weight: bold; color: white; background: #0f172a; border: 1px solid #334155; width: 220px; margin: 0 auto; display: block; height: 50px;",
          },
          showCancelButton: true,
          confirmButtonText: existingId
            ? "Doğrula ve Güncelle"
            : "Doğrula ve Başvur",
          cancelButtonText: t("actions.cancel"),
          showLoaderOnConfirm: true,
          preConfirm: async (inputCode) => {
            if (!inputCode) {
              Swal.showValidationMessage("Lütfen kodu giriniz.");
              return false;
            }
            try {
              const verifyRes = await authService.verifyCode(
                applicantEmail,
                inputCode,
              );
              if (!verifyRes.success) {
                Swal.showValidationMessage(
                  verifyRes.message || "Geçersiz kod.",
                );
                return false;
              }
              return true;
            } catch (err) {
              Swal.showValidationMessage(
                err?.response?.data?.message || "Hata.",
              );
              return false;
            }
          },
        });
        isVerified = otpResult.value;
      }

      if (isVerified) {
        const aktifKvkkId = definitionData?.kvkkListesi?.[0]?.id || 1;
        const dtoPayload = buildPersonelCreateDtoPayload(
          t,
          data,
          existingId,
          aktifKvkkId,
        );

        if (existingId) {
          dtoPayload.Id = existingId;
          if (dtoPayload.KisiselBilgiler)
            dtoPayload.KisiselBilgiler.Id = existingId;
          if (dtoPayload.DigerKisiselBilgiler)
            dtoPayload.DigerKisiselBilgiler.Id = existingId;
        }

        const formDataToSend = objectToFormData(dtoPayload);

        if (existingId) {
          formDataToSend.set("Id", existingId);
        }
        Swal.fire({
          ...swalSkyConfig,
          title: existingId
            ? "Bilgiler Güncelleniyor..."
            : "Başvuru Kaydediliyor...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        let response;
        if (existingId) {
          response = await basvuruService.update(existingId, formDataToSend);
        } else {
          response = await basvuruService.create(formDataToSend);
        }

        if (
          response?.success ||
          response?.status === 200 ||
          response?.status === 201
        ) {
          await MySwal.fire({
            ...swalSkyConfig,
            icon: "success",
            title: t("confirm.success.title"),
            html: `<div style='font-size:1.1em'>${existingId ? "Bilgileriniz başarıyla güncellendi." : t("confirm.success.submit")}</div>`,
            confirmButtonText: "Tamam",
          });

          reset(DEFAULT_VALUES);
          setExistingId(null);
          setSkipOtp(false);
          setResetKey((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } catch (e) {
      let errorMsg =
        e?.response?.data?.message || e?.message || t("confirm.error.submit");
      if (errorMsg.includes("Duplicate entry"))
        errorMsg =
          "Bu e-posta adresi veya telefon numarası ile daha önce başvuru yapılmış.";
      await MySwal.fire({
        ...swalSkyConfig,
        icon: "error",
        title: "İşlem Başarısız",
        text: errorMsg,
      });
    }
  };

  return (
    <FormProvider {...methods} key={t("langKey", { defaultValue: "" })}>
      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(2,6,23,1))] pb-12 sm:pb-16 border-x border-slate-800/40 shadow-2xl selection:bg-sky-500/30 selection:text-sky-100">
        <div className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-b-4xl text-center border-b border-slate-800/60">
          {/* Üst merkeze yerleştirilmiş devasa, çok yumuşak bir parlama efekti */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 sm:w-200 h-75 sm:h-100 bg-sky-600/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-sky-900/50 to-transparent" />

          {/* Çeviri / Language Switcher (Glassmorphism stili) */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
            <div className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-700/50 shadow-lg transition-all duration-300 hover:bg-slate-800/60 hover:border-sky-500/30">
              <FontAwesomeIcon
                icon={faGlobe}
                className="text-sky-400/80 group-hover:text-sky-400 transition-colors text-sm sm:text-base"
              />
              <div className="scale-90 sm:scale-100 origin-left text-sky-400/80">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
            {/* 2. LOGO (Hover efekti ve özel gölge) */}
            <img
              src={chIcon}
              alt="Brand Icon"
              className="w-24 h-24 sm:w-28 sm:h-28 mb-6 drop-shadow-[0_0_25px_rgba(14,165,233,0.3)] object-contain transition-transform duration-700 hover:scale-110"
            />

            {/* 3. ANA BAŞLIK (Gradient Text ve Gelişmiş Tracking) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-b from-white via-slate-100 to-slate-400 drop-shadow-sm leading-tight">
              {t("hero.brand")}
            </h1>

            {/* 4. ALT BAŞLIK (Daha zarif ve göze batmayan yapı) */}
            <h2 className="mt-4 text-sm sm:text-base font-bold text-sky-400/90 tracking-[0.3em] uppercase">
              {t("hero.formTitle")}
            </h2>

            {/* 5. BİLGİ KUTUSU (Glassmorphism & Daha yumuşak renkler) */}
            <div className="mt-10 flex items-center gap-3 text-sm sm:text-base text-slate-300 bg-slate-900/50 backdrop-blur-xl px-6 py-3.5 rounded-2xl border border-slate-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:border-slate-600/50">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-red-400 text-base"
                />
              </div>
              <p className="tracking-wide">
                <span className="text-red-400 font-semibold">
                  {t("hero.please")}
                </span>{" "}
                <span className="opacity-90">{t("hero.notice")}</span>{" "}
                <span className="text-red-400 font-black mx-0.5">*</span>{" "}
                <span className="opacity-90">{t("hero.requiredSuffix")}</span>
              </p>
            </div>

            {/* Alt Ayırıcı Çizgi (Eskisinden daha ince ve zarif) */}
            <div className="mt-12 w-32 h-px bg-linear-to-r from-transparent via-sky-500/40 to-transparent" />
          </div>
        </div>

        {/* Load Profile Section */}
        <div className="container mx-auto px-3 sm:px-6 lg:px-10 mt-8">
          <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-xl border border-sky-500/20 shadow-lg p-1 overflow-hidden relative group transition-all duration-300 hover:border-sky-500/40">
            <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
            <div className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-500/10 p-2 rounded-lg text-sky-500">
                    <FontAwesomeIcon icon={faRotateLeft} size="lg" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {t("loadProfile.title")}
                  </h3>
                </div>
                <p className="text-slate-400 text-sm pl-12 max-w-xl">
                  {t("loadProfile.description")}
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
                {!isReturningUser ? (
                  <button
                    type="button"
                    onClick={() => setIsReturningUser(true)}
                    className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all text-sm border border-slate-600 hover:border-sky-500/50 cursor-pointer"
                  >
                    {t("loadProfile.buttonYes")}
                  </button>
                ) : (
                  <div className="flex flex-col w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        <input
                          type="email"
                          placeholder={t("loadProfile.emailPlaceholder")}
                          value={returningEmail}
                          onChange={(e) => {
                            setReturningEmail(e.target.value);
                            if (emailError) setEmailError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (
                                !isLoadingProfile &&
                                returningEmail.trim() !== ""
                              ) {
                                handleFetchProfile();
                              }
                            }
                          }}
                          className={`pl-10 pr-4 py-2.5 w-full sm:w-64 bg-slate-950 border rounded-lg text-white placeholder-gray-500 outline-none text-sm  transition-colors ${emailError ? "border-red-500 focus:border-red-500" : "border-slate-600 focus:border-sky-500"}`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleFetchProfile}
                        disabled={isLoadingProfile}
                        className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-sm transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-900"
                      >
                        {isLoadingProfile ? (
                          <span className="animate-spin h-4 w-4 border border-t-transparent rounded-full"></span>
                        ) : (
                          <>
                            <span>{t("loadProfile.fetchBtn")}</span>
                            <FontAwesomeIcon icon={faShieldHalved} />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsReturningUser(false);
                          setEmailError("");
                          setReturningEmail("");
                        }}
                        className="px-3 py-2 text-slate-400 hover:text-white text-sm transition-colors cursor-pointer"
                      >
                        {t("actions.cancel")}
                      </button>
                    </div>
                    {emailError && (
                      <span className="text-red-400 text-xs mt-1 ml-1">
                        {emailError}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="sticky top-4 z-40 container mx-auto px-3 sm:px-6 lg:px-10 mt-6">
          <div className="bg-[#1e293b]/80 rounded-xl border border-slate-700/50 shadow-2xl px-3 py-2.5 sm:px-5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-300">
            {/* Sol Taraf (İkon ve Yazı) */}
            <div className="flex items-center gap-2 sm:gap-3 border-b md:border-b-0 border-slate-700 pb-2 md:pb-0 w-full md:w-auto justify-center md:justify-start">
              {/* İkon - Mobilde Küçültüldü */}
              <div
                className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 rounded-full border transition-colors ${allRequiredOk ? "border-green-500 bg-green-500/10 text-green-400" : "border-red-500 bg-red-500/10 text-red-400"}`}
              >
                <FontAwesomeIcon
                  icon={allRequiredOk ? faCheckCircle : faCircleXmark}
                  className="text-sm sm:text-xl"
                />
              </div>

              {/* Yazı Alanı - Mobilde Yan Yana, Ekranda Alt Alta */}
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-1.5 sm:gap-0">
                <span
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${allRequiredOk ? "text-green-400" : "text-red-400"}`}
                >
                  {t("statusBar.title")}
                </span>

                {/* Sadece mobilde görünen tire (-) işareti */}
                <span
                  className={`sm:hidden text-[10px] font-bold ${allRequiredOk ? "text-green-400" : "text-red-400"}`}
                >
                  -
                </span>

                <span
                  className={`text-xs sm:text-sm font-bold ${allRequiredOk ? "text-green-400" : "text-red-400"}`}
                >
                  {allRequiredOk
                    ? t("statusBar.completed")
                    : t("statusBar.missing")}
                </span>
              </div>
            </div>

            {/* Sağ Taraf (Hap Butonlar) - Mobilde boşluklar daraltıldı */}
            <div className="flex flex-wrap justify-center md:justify-end gap-1.5 sm:gap-2 w-full md:w-auto">
              <StatusPill
                ok={statusState.personalOk}
                label={t("sections.personal")}
                icon={faUser}
                onClick={() => scrollToSection(SECTION_IDS.personal)}
              />
              <StatusPill
                ok={statusState.educationOk}
                label={t("sections.education")}
                icon={faGraduationCap}
                onClick={() => scrollToSection(SECTION_IDS.education)}
              />
              <StatusPill
                ok={statusState.otherOk}
                label={t("sections.other")}
                icon={faUserCog}
                onClick={() => scrollToSection(SECTION_IDS.other)}
              />
              <StatusPill
                ok={statusState.jobDetailsOk}
                label={t("sections.jobDetails")}
                icon={faFileSignature}
                onClick={() => scrollToSection(SECTION_IDS.jobDetails)}
              />
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-8 mt-5"
        >
          <Section
            id={SECTION_IDS.personal}
            icon={faUser}
            title={t("sections.personal")}
            required
            content={<PersonalInformation definitions={definitionData} />}
          />
          <Section
            id={SECTION_IDS.education}
            icon={faGraduationCap}
            title={t("sections.education")}
            required
            onAdd={onAddWithScrollLock(() =>
              educationTableRef.current?.openCreate(),
            )}
            content={<EducationTable ref={educationTableRef} />}
          />
          <Section
            icon={faAward}
            title={t("sections.certificates")}
            onAdd={onAddWithScrollLock(() =>
              certificatesTableRef.current?.openCreate(),
            )}
            content={<CertificateTable ref={certificatesTableRef} />}
          />
          <Section
            icon={faLaptopCode}
            title={t("sections.computer")}
            onAdd={onAddWithScrollLock(() =>
              computerInformationTableRef.current?.openCreate(),
            )}
            content={
              <ComputerInformationTable ref={computerInformationTableRef} />
            }
          />
          <Section
            icon={faLanguage}
            title={t("sections.languages")}
            onAdd={onAddWithScrollLock(() =>
              languageTableRef.current?.openCreate(),
            )}
            content={
              <LanguageTable
                ref={languageTableRef}
                definitions={definitionData}
              />
            }
          />
          <Section
            icon={faBriefcase}
            title={t("sections.experience")}
            onAdd={onAddWithScrollLock(() =>
              jobExperiencesTableRef.current?.openCreate(),
            )}
            content={
              <JobExperiencesTable
                ref={jobExperiencesTableRef}
                definitions={definitionData}
              />
            }
          />
          <Section
            icon={faPhoneVolume}
            title={t("sections.references")}
            onAdd={onAddWithScrollLock(() =>
              referencesTableRef.current?.openCreate(),
            )}
            content={<ReferencesTable ref={referencesTableRef} />}
          />
          <Section
            id={SECTION_IDS.other}
            icon={faUserCog}
            title={t("sections.other")}
            required
            content={
              <OtherPersonalInformationTable definitions={definitionData} />
            }
          />
          <Section
            id={SECTION_IDS.jobDetails}
            icon={faFileSignature}
            title={t("sections.jobDetails")}
            required
            content={<JobApplicationDetails definitions={definitionData} />}
          />

          <ApplicationConfirmSection
            key={resetKey}
            onSubmit={() => handleSubmit(handleFormSubmit)()}
            isValidPersonal={statusState.personalOk}
            isValidEducation={statusState.educationOk}
            isValidOtherInfo={statusState.otherOk}
            isValidJobDetails={statusState.jobDetailsOk}
            customButtonText={
              existingId
                ? t("confirm.modal.update")
                : t("confirm.modal.complete")
            }
            customButtonIcon={existingId ? faPenToSquare : faPaperPlane}
          />
        </form>
      </div>
    </FormProvider>
  );
}

function StatusPill({ ok, label, icon, onClick }) {
  let colors =
    "bg-[#1e293b] border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white";
  if (ok === true)
    colors =
      "bg-green-900/20 border-green-500/30 text-green-400 hover:bg-green-900/30 hover:text-green-300";
  else if (ok === false)
    colors =
      "bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-900/30 hover:text-red-300";
  return (
    <button
      type="button"
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 select-none focus:outline-none cursor-pointer active:scale-95 ${colors}`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="text-sm" />{" "}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function Section({ id, icon, title, required = false, onAdd, content }) {
  const { t } = useTranslation();
  return (
    <div
      id={id}
      className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-lg overflow-hidden transition-all hover:border-slate-600"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 px-5 sm:px-6 py-5 border-b border-slate-700/80">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900/50 border border-slate-700 shadow-inner">
            <FontAwesomeIcon
              icon={icon}
              className="text-slate-300 text-lg sm:text-xl shrink-0"
            />
          </div>
          <h4 className="text-base sm:text-lg md:text-xl font-bold text-slate-100 truncate flex items-center gap-2 tracking-tight">
            {title}{" "}
            {required && (
              <span className="text-red-400 text-sm align-top">*</span>
            )}
          </h4>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none text-sm active:scale-95 border border-sky-500/20"
          >
            <FontAwesomeIcon icon={faPlus} /> <span>{t("actions.add")}</span>
          </button>
        )}
      </div>
      <div className="overflow-x-auto bg-slate-50 text-slate-800 border-t border-slate-200/50">
        {content}
      </div>
    </div>
  );
}
