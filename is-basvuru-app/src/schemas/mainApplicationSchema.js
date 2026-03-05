// src/schemas/mainApplicationSchema.js
import { z } from "zod";
import { createPersonalSchema } from "./personalInfoSchema";
import { createOtherInfoSchema } from "./otherInfoSchema";
import { createJobDetailsSchema } from "./jobDetailsSchema";

export const createMainApplicationSchema = (t, departmentRoles) => {
  return z.object({
    // Personal Information Bölümü
    personal: createPersonalSchema(t),

    // Other Information Bölümü
    otherInfo: createOtherInfoSchema(t),

    // Job Details Bölümü
    jobDetails: createJobDetailsSchema(t, departmentRoles),
    
    // Listeler (Eğitim, Sertifika vb.) - Bunları şimdilik basit array olarak tutalım
    // Detaylı validasyonları Modallarda yapılıyor zaten.
    education: z.array(z.any()).optional(),
    certificates: z.array(z.any()).optional(),
    computer: z.array(z.any()).optional(),
    languages: z.array(z.any()).optional(),
    experience: z.array(z.any()).optional(),
    references: z.array(z.any()).optional(),
  });
};