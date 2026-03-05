import { z } from "zod";
import {
  fromISODateString,
  todayISO,
} from "../components/Users/modalHooks/dateUtils";

// İsim Regex (Harf, rakam, boşluk, nokta ve bazı özel karakterler)
const NAME_RE = /^[-a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s.&()'/]+$/u;
const TEXT_RE = /^[-a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s.,&()'/%]+$/u;

export const createJobExpSchema = (t, anotherActiveExists = false) =>
  z
    .object({
      isAdi: z
        .string()
        .trim()
        .regex(NAME_RE, t("jobExp.err.invalid"))
        .min(2, t("jobExp.err.min2"))
        .max(100, t("jobExp.err.max100")),
      departman: z
        .string()
        .trim()
        .regex(NAME_RE, t("jobExp.err.invalid"))
        .min(2, t("jobExp.err.min2"))
        .max(100, t("jobExp.err.max100")),
      pozisyon: z
        .string()
        .trim()
        .regex(NAME_RE, t("jobExp.err.invalid"))
        .min(2, t("jobExp.err.min2"))
        .max(100, t("jobExp.err.max100")),
      gorev: z
        .string()
        .trim()
        .regex(NAME_RE, t("jobExp.err.invalid"))
        .min(2, t("jobExp.err.min2"))
        .max(120, t("jobExp.err.max120")),

      ucret: z
        .string()
        .trim()
        .min(1, t("jobExp.err.salaryReq"))
        .refine(
          (v) => !isNaN(Number(String(v).replace(",", "."))),
          t("jobExp.err.salaryNum"),
        ),

      baslangicTarihi: z.string().min(1, t("jobExp.err.startReq")),
      bitisTarihi: z.string().optional().default(""),

      // --- Select / Input Alanları (Validasyon logic'i aşağıda ve isUlke/isSehir'de) ---
      ulkeSelect: z.string().optional(),
      sehirSelect: z.string().optional(),
      ulkeOther: z.string().optional(),
      sehirOther: z.string().optional(),

      // ✅ ASIL KONTROL BURADA (Modal'daki buildCandidate burayı dolduruyor)
      isUlke: z.string().min(1, t("jobExp.err.countryReq")),
      isSehir: z.string().min(1, t("jobExp.err.cityReq")),

      ayrilisSebebi: z
        .string()
        .trim()
        .max(150, t("jobExp.err.max150"))
        .regex(TEXT_RE, t("jobExp.err.invalid"))
        .optional()
        .or(z.literal("")),

      halenCalisiyor: z.boolean(),
    })
    .superRefine((data, ctx) => {
      const TODAY = todayISO();

      // --- TARİH KONTROLLERİ ---
      const startOk = !!fromISODateString(data.baslangicTarihi);
      if (!startOk)
        ctx.addIssue({
          path: ["baslangicTarihi"],
          code: z.ZodIssueCode.custom,
          message: t("jobExp.err.startInvalid"),
        });
      else if (data.baslangicTarihi >= TODAY)
        ctx.addIssue({
          path: ["baslangicTarihi"],
          code: z.ZodIssueCode.custom,
          message: t("jobExp.err.startInFuture"),
        });

      if (anotherActiveExists && data.halenCalisiyor) {
        ctx.addIssue({
          path: ["halenCalisiyor"],
          code: z.ZodIssueCode.custom,
          message: t("jobExp.err.alreadyActive"),
        });
      }

      if (!data.halenCalisiyor) {
        const endOk =
          !!data.bitisTarihi && !!fromISODateString(data.bitisTarihi);
        if (!endOk)
          ctx.addIssue({
            path: ["bitisTarihi"],
            code: z.ZodIssueCode.custom,
            message: t("jobExp.err.endReq"),
          });
        else if (data.bitisTarihi > TODAY)
          ctx.addIssue({
            path: ["bitisTarihi"],
            code: z.ZodIssueCode.custom,
            message: t("jobExp.err.endInFuture"),
          });

        if (!data.ayrilisSebebi || data.ayrilisSebebi.trim().length === 0) {
          ctx.addIssue({
            path: ["ayrilisSebebi"],
            code: z.ZodIssueCode.custom,
            message: t("jobExp.err.leaveReq"),
          });
        }
      }

      const s = fromISODateString(data.baslangicTarihi);
      const e = fromISODateString(data.bitisTarihi || "");
      if (s && e && e.getTime() < s.getTime()) {
        ctx.addIssue({
          path: ["bitisTarihi"],
          code: z.ZodIssueCode.custom,
          message: t("jobExp.err.endBeforeStart"),
        });
      }
      if (data.ulkeSelect === "other") {
        if (!data.ulkeOther || data.ulkeOther.trim().length === 0) {
          ctx.addIssue({
            path: ["ulkeOther"],
            code: z.ZodIssueCode.custom,
            message: t("jobExp.err.countryReq"),
          });
        }
      }

      // 2. Şehir "Diğer" seçildiyse Input zorunlu
      if (data.sehirSelect === "other") {
        if (!data.sehirOther || data.sehirOther.trim().length === 0) {
          ctx.addIssue({
            path: ["sehirOther"],
            code: z.ZodIssueCode.custom,
            message: t("jobExp.err.cityReq"),
          });
        }
      }
    });
