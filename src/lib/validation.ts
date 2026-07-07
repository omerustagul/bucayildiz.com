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

// --- Takvim Programı / Antrenman ---
export const TRAINING_SCOPES = ["team", "individual"] as const;
export const TRAINING_STATUSES = ["planned", "completed", "cancelled", "partial"] as const;
export const ATTENDANCE_STATUSES = ["present", "absent", "excused", "unknown"] as const;

export const trainingCreateSchema = z
  .object({
    teamId: z.string().min(1, "Takım seçiniz."),
    scope: z.enum(TRAINING_SCOPES).default("team"),
    date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
    time: z.string().trim().max(5).optional().or(z.literal("")),
    duration: z.number().int().min(0).max(300).nullable().optional(),
    pitch: z.string().trim().max(80).optional().or(z.literal("")),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
    drills: z.array(z.string().trim().min(1, "Boş madde olamaz.").max(200)).max(30).default([]),
    athleteIds: z.array(z.string().min(1)).max(40).default([]),
  })
  .superRefine((v, ctx) => {
    if (v.scope === "individual" && v.athleteIds.length === 0) {
      ctx.addIssue({ code: "custom", message: "Bireysel antrenman için en az bir sporcu seçiniz.", path: ["athleteIds"] });
    }
  });

export const attendanceRowSchema = z.object({
  athleteId: z.string().min(1),
  status: z.enum(ATTENDANCE_STATUSES),
  note: z.string().trim().max(300).optional().or(z.literal("")),
});

export const attendanceSaveSchema = z.object({
  trainingId: z.string().min(1),
  rows: z.array(attendanceRowSchema).min(1, "En az bir satır gerekli.").max(60),
});
