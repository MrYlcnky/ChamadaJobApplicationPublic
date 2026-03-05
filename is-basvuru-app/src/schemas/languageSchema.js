import { z } from "zod";

const TEXT_REGEX = /^[a-zA-ZığüşöçİĞÜŞÖÇ\s.-]+$/;

export const createLanguageSchema = (t) => {
  return z
    .object({
      // Select Box (ID veya "other" stringi tutar)
      dilSelect: z.string().min(1, t("languages.validations.languageRequired")),

      // Input Alanı (Sadece "other" seçildiyse zorunlu olacak)
      dilOther: z.string().optional(),

      konusma: z.string().min(1, t("languages.validations.speakingRequired")),
      yazma: z.string().min(1, t("languages.validations.writingRequired")),
      okuma: z.string().min(1, t("languages.validations.readingRequired")),
      dinleme: z.string().min(1, t("languages.validations.listeningRequired")),

      ogrenilenKurum: z
        .string()
        .trim()
        .min(1, t("languages.validations.learnedHowRequired"))
        .max(80, t("languages.validations.learnedHowMax"))
        .regex(TEXT_REGEX, t("languages.validations.learnedHowRegex")),
    })
    .superRefine((data, ctx) => {
      // Eğer Select'te "other" seçildiyse, Input boş olamaz
      if (data.dilSelect === "other") {
        if (!data.dilOther || data.dilOther.trim().length === 0) {
          ctx.addIssue({
            path: ["dilOther"],
            code: z.ZodIssueCode.custom,
            message:
              t("languages.validations.otherLanguageRequired") ||
              "Lütfen dili belirtiniz.",
          });
        } else if (data.dilOther.length > 40) {
          ctx.addIssue({
            path: ["dilOther"],
            code: z.ZodIssueCode.custom,
            message: t("languages.validations.languageMax"),
          });
        } else if (!TEXT_REGEX.test(data.dilOther)) {
          ctx.addIssue({
            path: ["dilOther"],
            code: z.ZodIssueCode.custom,
            message: t("languages.validations.languageRegex"),
          });
        }
      }
    });
};
