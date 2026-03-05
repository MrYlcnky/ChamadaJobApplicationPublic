import { z } from "zod";

export const createJobDetailsSchema = (t) => {
  // ✅ DÜZELTME: Label opsiyonel yapıldı.
  // Backend'den veri çekerken sadece {value: "1"} gelebilir, bu durumda hata vermesin.
  const optionSchema = z.object({
    value: z.string().min(1), // Value (ID) her zaman olmalı ve boş olmamalı
    label: z.string().optional(), // Label olmak zorunda değil
  });

  // Array'in boş olmamasını kontrol eden yardımcı fonksiyon
  const arrayNonEmpty = (s, msg) => z.array(s).min(1, msg);

  return z
    .object({
      subeler: arrayNonEmpty(
        optionSchema,
        t("jobDetails.errors.branchRequired") || "Şube seçimi zorunludur",
      ),
      alanlar: arrayNonEmpty(
        optionSchema,
        t("jobDetails.errors.areaRequired") || "Alan seçimi zorunludur",
      ),
      departmanlar: arrayNonEmpty(
        optionSchema,
        t("jobDetails.errors.departmentRequired") ||
          "Departman seçimi zorunludur",
      ),

      programlar: z.array(optionSchema).optional().default([]),

      departmanPozisyonlari: z.array(optionSchema).optional().default([]),

      kagitOyunlari: z.array(optionSchema).optional().default([]),

      lojman: z
        .string()
        .refine(
          (v) => ["1", "2"].includes(v),
          t("jobDetails.errors.housingRequired") || "Lojman tercihi yapınız",
        ),

      tercihNedeni: z
        .string()
        .min(
          1,
          t("jobDetails.errors.reasonRequired") || "Tercih nedeni zorunludur",
        )
        .max(500, t("jobDetails.errors.reasonMax") || "En fazla 500 karakter")
        .regex(
          /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s.,!?:;\-_()"' ]+$/,
          t("jobDetails.errors.invalidChars") || "Özel karakterler içeriyor",
        ),
    })
    .superRefine((data, ctx) => {
      // Departman etiketinde "canlı" veya "live" geçiyorsa oyun seçimi zorunludur.
      // Label opsiyonel olduğu için ?. (optional chaining) kullanmalıyız.
      const canliOyun = data.departmanlar.some(
        (d) =>
          d.label &&
          (d.label.toLowerCase().includes("canlı") ||
            d.label.toLowerCase().includes("live")),
      );

      if (
        canliOyun &&
        (!data.kagitOyunlari || data.kagitOyunlari.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["kagitOyunlari"],
          message:
            t("jobDetails.errors.cardGamesRequired") ||
            "Canlı oyun seçimi zorunludur",
        });
      }
    });
};
