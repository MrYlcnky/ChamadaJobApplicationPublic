import { z } from "zod";

export const createOtherInfoSchema = (t) => {
  const reqMsg = (key) => ({
    invalid_type_error: t(`otherInfo.errors.${key}`),
    required_error: t(`otherInfo.errors.${key}`),
  });

  const stringToNumberSchema = (
    min,
    max,
    minMsg,
    maxMsg,
    intMsg,
    invalidMsg,
  ) => {
    return z
      .string()
      .or(z.number())
      .transform((val) => String(val).trim())
      .refine((val) => val !== "", { message: invalidMsg })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), { message: invalidMsg })
      .refine((val) => Number.isInteger(val), { message: intMsg })
      .refine((val) => val >= min, { message: minMsg })
      .refine((val) => val <= max, { message: maxMsg });
  };

  return z
    .object({
      kktcGecerliBelge: z
        .string(reqMsg("kktcDoc"))
        .min(1, t("otherInfo.errors.kktcDoc")),
      davaDurumu: z
        .string(reqMsg("lawsuit"))
        .min(1, t("otherInfo.errors.lawsuit")),
      davaNedeni: z
        .string()
        .trim()
        .max(250, t("otherInfo.errors.lawsuitReason"))
        .optional(),
      sigara: z.string(reqMsg("smoke")).min(1, t("otherInfo.errors.smoke")),
      kaliciRahatsizlik: z
        .string(reqMsg("permanentDisease"))
        .min(1, t("otherInfo.errors.permanentDisease")),
      rahatsizlikAciklama: z
        .string()
        .trim()
        .max(250, t("otherInfo.errors.diseaseDesc"))
        .optional(),
      ehliyet: z
        .string(reqMsg("license"))
        .min(1, t("otherInfo.errors.license")),
      ehliyetTurleri: z.array(z.string()).optional().default([]),
      askerlik: z
        .string(reqMsg("military"))
        .min(1, t("otherInfo.errors.military")),
      boy: stringToNumberSchema(
        50,
        250,
        t("otherInfo.errors.heightMin"),
        t("otherInfo.errors.heightMax"),
        t("otherInfo.errors.heightInt"),
        t("otherInfo.errors.heightNum"),
      ),
      kilo: stringToNumberSchema(
        30,
        300,
        t("otherInfo.errors.weightMin"),
        t("otherInfo.errors.weightMax"),
        t("otherInfo.errors.weightInt"),
        t("otherInfo.errors.weightNum"),
      ),
    })
    .superRefine((data, ctx) => {
      // ✅ Sadece değer "2" (Evet) ise zorunlu tut

      // Dava Nedeni
      if (
        String(data.davaDurumu) === "2" &&
        (!data.davaNedeni || data.davaNedeni.trim().length < 3)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["davaNedeni"],
          message: t("otherInfo.errors.lawsuitReason"),
        });
      }

      // Rahatsızlık Açıklama
      if (
        String(data.kaliciRahatsizlik) === "2" &&
        (!data.rahatsizlikAciklama ||
          data.rahatsizlikAciklama.trim().length < 3)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rahatsizlikAciklama"],
          message: t("otherInfo.errors.diseaseDesc"),
        });
      }

      // Ehliyet Türleri
      if (
        String(data.ehliyet) === "2" &&
        (!data.ehliyetTurleri || data.ehliyetTurleri.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ehliyetTurleri"],
          message: t("otherInfo.errors.licenseTypes"),
        });
      }
    });
};
