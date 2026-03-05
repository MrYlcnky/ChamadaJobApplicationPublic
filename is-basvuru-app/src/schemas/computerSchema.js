import { z } from "zod";

// Program adı için izin verilen karakterler (Alfanümerik + . # + - _)
const PROG_NAME_REGEX = /^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ\s.#+\-_]+$/u;

export const createComputerSchema = (t) => {
  return z.object({
    programAdi: z
      .string()
      .trim()
      .min(1, t("computer.validations.program.required"))
      .max(60, t("computer.validations.program.max"))
      .regex(PROG_NAME_REGEX, {
        message:
          t("computer.validations.alphaNum") ||
          "Geçersiz karakter (İzin verilenler: . # + - _)",
      }),

    // Yetkinlik Enum ID'leri: "1", "2", "3", "4", "5"
    yetkinlik: z
      .string()
      .min(1, t("computer.validations.level.required"))
      .refine(
        (v) => ["1", "2", "3", "4", "5"].includes(v),
        t("computer.validations.level.invalid") ||
          "Geçerli bir seviye seçiniz.",
      ),
  });
};
