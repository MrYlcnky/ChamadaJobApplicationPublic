import { z } from "zod";

// Regex sabitleri
const TEXT_ONLY_TR = /^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/u;
// Zod için JavaScript uyumlu Regex
const PHONE_REGEX = /^\+?[1-9](?:[\s]?\d){6,14}$/;

// Yardımcılar
const isFilled = (v) => (v ?? "").toString().trim().length > 0;

const isFileSizeValid = (v, maxMB = 2) => {
  const file = v instanceof FileList ? v[0] : v instanceof File ? v : v?.file;
  if (!file) return true;
  return file.size <= maxMB * 1024 * 1024;
};

// Sayı veya Null (Boş string gelirse null yapar)
const numOrNull = z.preprocess((v) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}, z.number().nullable());

// File kontrolü (Sadece yeni dosya yüklemesini kontrol eder)
const hasRealFile = (v) => {
  if (!v) return false;
  if (v instanceof File) return true;
  if (typeof FileList !== "undefined" && v instanceof FileList)
    return v.length > 0;
  if (Array.isArray(v)) return v.length > 0 && v[0] instanceof File;
  if (typeof v === "object" && v?.file instanceof File) return true;
  return false;
};

// Seçilen şehre ait ilçe var mı kontrolü
const hasDistrictsForCity = (cityId, ilceler = []) => {
  if (cityId == null) return false;
  const cid = Number(cityId);
  if (!Number.isFinite(cid)) return false;

  return (ilceler ?? []).some((x) => {
    const sid = x?.SehirId ?? x?.sehirId ?? x?.CityId ?? x?.cityId;
    const n = Number(sid);
    return Number.isFinite(n) && n === cid;
  });
};

export const createPersonalSchema = (t, defs = {}) => {
  const reqMsg = (key) => ({
    required_error: t(`personal.errors.${key}.required`),
    invalid_type_error: t(`personal.errors.${key}.required`),
  });

  const ilceler = defs?.ilceler ?? [];

  return z
    .object({
      ad: z
        .string(reqMsg("firstName"))
        .min(1, t("personal.errors.firstName.required"))
        .max(30)
        .regex(TEXT_ONLY_TR, t("personal.errors.firstName.regex")),

      soyad: z
        .string(reqMsg("lastName"))
        .min(1, t("personal.errors.lastName.required"))
        .max(30)
        .regex(TEXT_ONLY_TR, t("personal.errors.lastName.regex")),

      eposta: z
        .string(reqMsg("email"))
        .email(t("personal.errors.email.invalid")),

      telefon: z
        .string(reqMsg("phone"))
        .min(1, t("personal.errors.phone.required"))
        .transform((v) => v.replace(/[\s()-]/g, ""))
        .refine((v) => PHONE_REGEX.test(v), {
          message: t("personal.errors.phone.format"),
        }),

      whatsapp: z
        .string(reqMsg("whatsapp"))
        .min(1, t("personal.errors.whatsapp.required"))
        .transform((v) => v.replace(/[\s()-]/g, ""))
        .refine((v) => PHONE_REGEX.test(v), {
          message: t("personal.errors.whatsapp.format"),
        }),

      adres: z
        .string(reqMsg("address"))
        .min(5, t("personal.errors.address.min"))
        .max(90, t("personal.errors.address.max")),

      cinsiyet: z.union([z.string(), z.number()], reqMsg("gender")),

      medeniDurum: z.union([z.string(), z.number()], reqMsg("marital")),

      dogumTarihi: z
        .string(reqMsg("birthDate"))
        .min(1, t("personal.errors.birthDate.required")),

      cocukSayisi: z.any().optional(),

      // --- DTO Alanları ---
      UyrukId: numOrNull,
      UyrukAdi: z.string().optional().nullable().or(z.literal("")),

      DogumUlkeId: numOrNull,
      DogumUlkeAdi: z.string().optional().nullable().or(z.literal("")),
      DogumSehirId: numOrNull,
      DogumSehirAdi: z.string().optional().nullable().or(z.literal("")),
      DogumIlceId: numOrNull,
      DogumIlceAdi: z.string().optional().nullable().or(z.literal("")),

      IkametgahUlkeId: numOrNull,
      IkametgahUlkeAdi: z.string().optional().nullable().or(z.literal("")),
      IkametgahSehirId: numOrNull,
      IkametgahSehirAdi: z.string().optional().nullable().or(z.literal("")),
      IkametgahIlceId: numOrNull,
      IkametgahIlceAdi: z.string().optional().nullable().or(z.literal("")),

      // Dosya ve Fotoğraf (Her ikisi de optional başlar, superRefine ile kontrol edilir)
      VesikalikDosyasi: z.any().optional(),
      foto: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      const yeniDosyaVarMi = hasRealFile(data.VesikalikDosyasi);
      const mevcutFotoVarMi =
        typeof data.foto === "string" && data.foto.length > 0;

      // Eğer ne yeni dosya var ne de eski fotoğraf varsa hata ver
      if (!yeniDosyaVarMi && !mevcutFotoVarMi) {
        ctx.addIssue({
          path: ["VesikalikDosyasi"], // Hatayı inputun altına bas
          code: z.ZodIssueCode.custom,
          message:
            t("personal.errors.photo.required") ||
            "Lütfen vesikalık fotoğraf yükleyiniz.",
        });
      }

      if (yeniDosyaVarMi && !isFileSizeValid(data.VesikalikDosyasi, 2.5)) {
        ctx.addIssue({
          path: ["VesikalikDosyasi"],
          code: z.ZodIssueCode.custom,
          message:
            t("personal.errors.photo.size") ||
            "Fotoğraf boyutu 2 MB'dan büyük olamaz.",
        });
      }

      // 2. Uyruk Kontrolü
      if (data.UyrukId == null && !isFilled(data.UyrukAdi)) {
        ctx.addIssue({
          path: ["UyrukId"],
          code: z.ZodIssueCode.custom,
          message: t("personal.errors.nationality"),
        });
      }

      // 3. Doğum Yeri Kontrolleri
      if (data.DogumUlkeId == null && !isFilled(data.DogumUlkeAdi)) {
        ctx.addIssue({
          path: ["DogumUlkeId"],
          code: z.ZodIssueCode.custom,
          message: t("personal.errors.birthCountry"),
        });
      }

      if (data.DogumSehirId == null && !isFilled(data.DogumSehirAdi)) {
        ctx.addIssue({
          path: ["DogumSehirId"],
          code: z.ZodIssueCode.custom,
          message: t("personal.errors.birthCity"),
        });
      }

      if (
        data.DogumSehirId != null &&
        hasDistrictsForCity(data.DogumSehirId, ilceler) &&
        data.DogumIlceId == null &&
        !isFilled(data.DogumIlceAdi)
      ) {
        ctx.addIssue({
          path: ["DogumIlceId"],
          code: z.ZodIssueCode.custom,
          message:
            t("personal.errors.birthDistrict") || "Doğum ilçesi zorunludur.",
        });
      }

      // 4. İkametgah Kontrolleri
      if (data.IkametgahUlkeId == null && !isFilled(data.IkametgahUlkeAdi)) {
        ctx.addIssue({
          path: ["IkametgahUlkeId"],
          code: z.ZodIssueCode.custom,
          message: t("personal.errors.resCountry"),
        });
      }

      if (data.IkametgahSehirId == null && !isFilled(data.IkametgahSehirAdi)) {
        ctx.addIssue({
          path: ["IkametgahSehirId"],
          code: z.ZodIssueCode.custom,
          message: t("personal.errors.resCity"),
        });
      }

      if (
        data.IkametgahSehirId != null &&
        hasDistrictsForCity(data.IkametgahSehirId, ilceler) &&
        data.IkametgahIlceId == null &&
        !isFilled(data.IkametgahIlceAdi)
      ) {
        ctx.addIssue({
          path: ["IkametgahIlceId"],
          code: z.ZodIssueCode.custom,
          message:
            t("personal.errors.resDistrict") || "İkamet ilçesi zorunludur.",
        });
      }
    });
};
