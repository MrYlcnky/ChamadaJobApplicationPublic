import { z } from "zod";

// Yardımcı fonksiyonlar
const isValidISODate = (s) => {
  if (!s) return false;
  const d = new Date(s + "T00:00:00");
  return !Number.isNaN(d.getTime());
};

const toDate = (s) => (s ? new Date(s + "T00:00:00") : null);

export const createEducationSchema = (t) => {
  return z
    .object({
      seviye: z.string().min(1, t("education.validations.levelRequired")),
      okul: z
        .string()
        .trim()
        .regex(
          /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u,
          t("education.validations.schoolFormat"),
        )
        .min(5, t("education.validations.schoolRequired"))
        .max(100, t("education.validations.schoolMax")),
      bolum: z
        .string()
        .trim()
        .regex(
          /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s]+$/u,
          t("education.validations.deptFormat"),
        )
        .min(1, t("education.validations.deptRequired"))
        .max(100, t("education.validations.deptMax")),

      //  Backend Enum ID'leri (1=Yüzlük, 2=Dörtlük)
      notSistemi: z.enum(["1", "2"], {
        errorMap: () => ({ message: t("education.validations.gradeSystem") }),
      }),

      gano: z
        .string()
        .optional()
        .refine((v) => v === "" || (!isNaN(v) && Number(v) >= 0), {
          message: t("education.validations.gpaNumber"),
        }),
      baslangic: z.string().min(1, t("education.validations.startRequired")),
      bitis: z.string().optional().default(""),

      //  Diploma Durumu ID'leri (1,2,3,4)
      diplomaDurum: z
        .string()
        .min(1, t("education.validations.diplomaRequired"))
        .refine(
          (v) => ["1", "2", "3", "4"].includes(v),
          t("education.validations.diplomaValid"),
        ),
    })
    .superRefine((data, ctx) => {
      // 1. Başlangıç Tarihi Kontrolü
      if (!isValidISODate(data.baslangic)) {
        ctx.addIssue({
          path: ["baslangic"],
          code: z.ZodIssueCode.custom,
          message: t("education.validations.startInvalid"),
        });
        return;
      }
      const start = toDate(data.baslangic);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start > today) {
        ctx.addIssue({
          path: ["baslangic"],
          code: z.ZodIssueCode.custom,
          message: t("education.validations.startFuture"),
        });
      }

      // 2. Bitiş Tarihi Kontrolü
      // ID kontrolü (1=Mezun, 3=Ara Verdi)
      const requiresEnd = ["1", "3"].includes(data.diplomaDurum);

      if (requiresEnd) {
        if (!data.bitis || data.bitis.trim() === "") {
          ctx.addIssue({
            path: ["bitis"],
            code: z.ZodIssueCode.custom,
            message: t("education.validations.endRequired"),
          });
          return;
        }
        if (!isValidISODate(data.bitis)) {
          ctx.addIssue({
            path: ["bitis"],
            code: z.ZodIssueCode.custom,
            message: t("education.validations.endInvalid"),
          });
          return;
        }
        const end = toDate(data.bitis);

        if (end > today) {
          ctx.addIssue({
            path: ["bitis"],
            code: z.ZodIssueCode.custom,
            message: t("education.validations.endFuture"),
          });
        }
        if (start && end) {
          if (
            start.getFullYear() === end.getFullYear() &&
            start.getMonth() === end.getMonth() &&
            start.getDate() === end.getDate()
          ) {
            ctx.addIssue({
              path: ["bitis"],
              code: z.ZodIssueCode.custom,
              message: t("education.validations.sameDay"),
            });
          }
          if (end.getTime() < start.getTime()) {
            ctx.addIssue({
              path: ["bitis"],
              code: z.ZodIssueCode.custom,
              message: t("education.validations.endBeforeStart"),
            });
          }
        }
      }

      // 3. GANO Kontrolü
      if (data.gano && data.gano !== "") {
        const n = Number(data.gano);

        //Enum ID'lerine göre max değer (1=Yüzlük, 2=Dörtlük)
        const max = data.notSistemi === "1" ? 100 : 4;

        if (n > max) {
          ctx.addIssue({
            path: ["gano"],
            code: z.ZodIssueCode.custom,
            message: t("education.validations.gpaRange", { max }),
          });
        }

        // Ondalık kontrolü sadece 4'lük (ID="2") sistemde
        if (data.notSistemi === "2" && String(n).includes(".")) {
          const decimals = String(n).split(".")[1];
          if (decimals && decimals.length > 2) {
            ctx.addIssue({
              path: ["gano"],
              code: z.ZodIssueCode.custom,
              message: t("education.validations.gpaDecimals"),
            });
          }
        }
      }
    });
};
