import { z } from "zod";
import { toISODate } from "../components/Users/modalHooks/dateUtils";

// Harfler, Rakamlar, Türkçe Karakterler, Boşluk ve (. # + - _) işaretlerine izin verir.
// Örn: "C#", ".NET Core", "Node.js", "C++" geçerli olur.
const CERT_NAME_REGEX = /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s.#+\-_]+$/u;

export const createCertificateSchema = (t) => {
  return z
    .object({
      ad: z
        .string()
        .trim()
        .min(1, t("certificates.validations.name.required"))
        .max(100, t("certificates.validations.name.max"))
        .regex(CERT_NAME_REGEX, {
          message:
            t("certificates.validations.alphaNum") ||
            "Geçersiz karakter (İzin verilenler: . # + - _)",
        }),
      kurum: z
        .string()
        .trim()
        .min(1, t("certificates.validations.org.required"))
        .max(100, t("certificates.validations.org.max"))
        .regex(CERT_NAME_REGEX, {
          message:
            t("certificates.validations.alphaNum") ||
            "Geçersiz karakter (İzin verilenler: . # + - _)",
        }),
      sure: z
        .string()
        .trim()
        .min(1, t("certificates.validations.duration.required"))
        .max(50, t("certificates.validations.duration.max"))
        .regex(CERT_NAME_REGEX, {
          message:
            t("certificates.validations.alphaNum") ||
            "Geçersiz karakter (İzin verilenler: . # + - _)",
        }),

      // Tarihleri preprocess ile Date objesine çeviriyoruz
      verilisTarihi: z.preprocess(
        (v) => (v ? new Date(v) : null),
        z.date({
          required_error: t("certificates.validations.issuedAt.required"),
          invalid_type_error: t("certificates.validations.issuedAt.required"),
        }),
      ),
      gecerlilikTarihi: z.preprocess(
        (v) => (v ? new Date(v) : null),
        z.date().nullable().optional(),
      ),
    })
    .superRefine((data, ctx) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Veriliş Tarihi Zorunlu
      if (!data.verilisTarihi) {
        ctx.addIssue({
          path: ["verilisTarihi"],
          code: z.ZodIssueCode.custom,
          message: t("certificates.validations.issuedAt.required"),
        });
        return;
      }

      // Gelecek tarih olamaz
      if (data.verilisTarihi > today) {
        ctx.addIssue({
          path: ["verilisTarihi"],
          code: z.ZodIssueCode.custom,
          message: t("certificates.validations.issuedAt.future"),
        });
      }

      // Geçerlilik Tarihi varsa kontroller
      if (data.gecerlilikTarihi) {
        if (data.gecerlilikTarihi < data.verilisTarihi) {
          ctx.addIssue({
            path: ["gecerlilikTarihi"],
            code: z.ZodIssueCode.custom,
            message: t("certificates.validations.validUntil.beforeIssued"),
          });
        }

        if (
          toISODate(data.gecerlilikTarihi) === toISODate(data.verilisTarihi)
        ) {
          ctx.addIssue({
            path: ["gecerlilikTarihi"],
            code: z.ZodIssueCode.custom,
            message: t("certificates.validations.validUntil.sameDay"),
          });
        }
      }
    });
};
