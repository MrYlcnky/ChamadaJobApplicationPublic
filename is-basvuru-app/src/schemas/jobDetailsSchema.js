import { z } from "zod";

export const createJobDetailsSchema = (t) => {
  const optionSchema = z.object({
    value: z.string().min(1),
    label: z.string().optional(),
  });

  const arrayNonEmpty = (s, msg) => z.array(s).min(1, msg);

  return z.object({
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

    // Oyunlar artık her durumda %100 opsiyonel
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
  });
};
