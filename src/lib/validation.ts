import { z } from "zod";
import { REQUIRED_CONSENT_KEYS } from "@/lib/consent";

export const AGE_GROUPS = ["U-15", "U-16", "U-17", "U-18", "A Takım"] as const;

/** Başvuru formu doğrulama şeması (istemci + sunucu ortak). */
export const applicationSchema = z.object({
  athleteName: z.string().trim().min(2, "Sporcu adını giriniz.").max(120),
  birthDate: z.string().trim().min(1, "Doğum tarihini giriniz."),
  ageGroup: z.enum(AGE_GROUPS, { message: "Yaş grubu seçiniz." }),
  position: z.string().trim().max(60).optional().or(z.literal("")),
  parentName: z.string().trim().min(2, "Veli adını giriniz.").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Geçerli bir telefon giriniz.")
    .max(20)
    .regex(/^[0-9+\s()-]+$/, "Telefon yalnızca rakam ve +()- içerebilir."),
  email: z.string().trim().email("Geçerli bir e-posta giriniz.").optional().or(z.literal("")),
  // Ayrı KVKK onayları — { [docKey]: boolean }. Zorunlu olanlar true olmalı
  // (battaniye "hepsini kabul" yok; her belge ayrı işaretlenir).
  consents: z
    .record(z.string(), z.boolean())
    .default({})
    .refine((c) => REQUIRED_CONSENT_KEYS.every((k) => c[k] === true), {
      message: "Devam etmek için zorunlu KVKK onaylarını işaretleyin.",
    }),
});

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ApplicationData = z.output<typeof applicationSchema>;
