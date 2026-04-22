import { z } from "zod";

export const createAdminUsersSchema = (isEditing = false) => {
  return z
    .object({
      adi: z
        .string()
        .min(2, "Ad en az 2 karakter olmalıdır")
        .max(50, "Ad çok uzun"),
      soyadi: z
        .string()
        .min(2, "Soyad en az 2 karakter olmalıdır")
        .max(50, "Soyad çok uzun"),
      kullaniciAdi: z
        .string()
        .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
        .max(20, "Kullanıcı adı en fazla 20 karakter olabilir")
        .regex(
          /^[a-zA-Z0-9_\-.]*$/,
          "Kullanıcı adı yalnızca İngilizce harf, rakam, alt çizgi (_), tire (-) ve nokta (.) içerebilir!",
        ),
      // Şifre alanı başlangıçta opsiyonel, ancak aşağıda mantıkla kontrol edilecek
      kullaniciSifre: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Eğer düzenleme modunda DEĞİLSEK (Yeni Kayıt), şifre zorunlu olmalı
      if (
        !isEditing &&
        (!data.kullaniciSifre || data.kullaniciSifre.length < 3)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Yeni kayıtlarda şifre en az 3 karakter olmalıdır!",
          path: ["kullaniciSifre"],
        });
      }

      // Düzenleme modunda şifre girilmişse en az 6 karakter olmalı
      if (isEditing && data.kullaniciSifre && data.kullaniciSifre.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Yeni şifre en az 3 karakter olmalıdır!",
          path: ["kullaniciSifre"],
        });
      }
    });
};
