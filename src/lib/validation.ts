import { z } from "zod";
import { REQUIRED_CONSENT_KEYS } from "@/lib/consent";

export const AGE_GROUPS = ["U-15", "U-16", "U-17", "U-18", "A Takım"] as const;

/** Genel kayıt id doğrulaması (cuid). Boş/aşırı uzun değeri reddeder. */
export const idSchema = z.string().trim().min(1, "Geçersiz kayıt.").max(60);

/** Site içi (same-origin) yol — bildirim tıklama hedefi vb. `//evil.com`,
 *  `https://...`, `javascript:` gibi harici/phishing hedeflerini reddeder;
 *  tek `/` ile başlayan göreli yolu kabul eder. */
export const internalPath = z
  .string()
  .trim()
  .regex(/^\/(?!\/)/, "Bağlantı yalnız site içi bir yol olabilir (/ ile başlamalı).")
  .max(512);

/** "YYYY-MM-DD" gerçek bir takvim tarihi mi (2026-02-31 reddedilir), gelecekte
 *  değil ve makul aralıkta mı (>=1940). birthDate gibi tarih alanlarında kullanılır. */
export function isValidIsoDate(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  // Ay/gün taşması (ör. 02-31) round-trip'te değişir → reddet.
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return false;
  if (y < 1940) return false;
  if (dt.getTime() > Date.now()) return false; // doğum tarihi gelecekte olamaz
  return true;
}

/** Reşit sınırı — bu yaşın ALTINDA KVKK rızasını hukuken VELİ verir. */
export const CONSENT_AGE = 18;

/** "YYYY-MM-DD"tan bugüne göre tam yaş (yıl). Geçersiz tarihte null.
 *  Doğum günü bu yıl henüz gelmediyse 1 eksiltir (gerçek yaş). */
export function ageFromBirthDate(birthDate: string): number | null {
  if (!isValidIsoDate(birthDate)) return null;
  const [y, mo, d] = birthDate.split("-").map(Number);
  const now = new Date();
  let age = now.getFullYear() - y;
  const beforeBirthday = now.getMonth() + 1 < mo || (now.getMonth() + 1 === mo && now.getDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}

/** Yaş grubunu (U-15…A Takım) doğum tarihinden TÜRETİR — form'da seçilmez,
 *  admin paneli + e-posta bildirimi bunu kullanır. Yaş bazlı: ≤14→U-15,
 *  15→U-16, 16→U-17, 17→U-18, ≥18→A Takım. Geçersiz tarihte "". */
export function ageGroupFromBirthDate(birthDate: string): string {
  const age = ageFromBirthDate(birthDate);
  if (age === null) return "";
  if (age <= 14) return "U-15";
  if (age === 15) return "U-16";
  if (age === 16) return "U-17";
  if (age === 17) return "U-18";
  return "A Takım";
}

/** Başvuru formu doğrulama şeması (istemci + sunucu ortak).
 *  Yaş grubu artık gönderilmez (doğum tarihinden türetilir). Veli adı yalnız
 *  minör (<18) başvurusunda zorunludur — superRefine yaşı doğum tarihinden hesaplar. */
export const applicationSchema = z
  .object({
    athleteName: z.string().trim().min(2, "Sporcu adını giriniz.").max(120),
    birthDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Doğum tarihini giriniz.")
      .refine(isValidIsoDate, "Geçerli bir doğum tarihi giriniz."),
    position: z.string().trim().max(60).optional().or(z.literal("")),
    // Mevcut kulüp (var ise) — GERÇEKTEN opsiyonel; boş geçilebilir.
    currentClub: z.string().trim().max(120).optional().or(z.literal("")),
    // Veli adı: base'te opsiyonel; minörde superRefine ZORUNLU kılar. Yetişkinde
    // istenmez (audit sporcunun kendisine yazılır — bkz. basvuru/actions.ts).
    parentName: z.string().trim().max(120).optional().or(z.literal("")),
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
  })
  .superRefine((v, ctx) => {
    // Yaş dalı HUKUKİ, sadece UX değil: <18 ise rızayı veli verir → veli adı ZORUNLU.
    const age = ageFromBirthDate(v.birthDate);
    if (age !== null && age < CONSENT_AGE && (v.parentName ?? "").trim().length < 2) {
      ctx.addIssue({ code: "custom", message: "Veli adını giriniz.", path: ["parentName"] });
    }
  });

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ApplicationData = z.output<typeof applicationSchema>;

/** İletişim formu doğrulama şeması (istemci + sunucu ortak). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Adınızı giriniz.").max(120),
  email: z.string().trim().email("Geçerli bir e-posta giriniz.").max(160),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\s()-]*$/, "Telefon yalnızca rakam ve +()- içerebilir.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(5, "Mesajınızı yazınız.").max(2000),
});

/** Bülten aboneliği (public). `consent` boolean gelir; zorunlu onay kontrolü
 *  action'da yapılır (Türkçe mesaj için — Zod literal'e bağlı kalmadan). */
export const newsletterSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta giriniz.").max(160),
  consent: z.boolean(),
});

// --- Kariyer: iş ilanı (admin) + iş başvurusu (public) ---
export const JOB_EMPLOYMENT = ["full-time", "part-time", "stajyer"] as const;
export const JOB_APPLICATION_STATUSES = ["new", "reviewing", "closed"] as const;

/** İş ilanı — admin CRUD. */
export const jobPostingSchema = z.object({
  title: z.string().trim().min(2, "İlan başlığı giriniz.").max(120),
  department: z.string().trim().max(80).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  employment: z.enum(JOB_EMPLOYMENT, { message: "Çalışma türü seçiniz." }).default("full-time"),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  active: z.boolean().default(true),
  sort: z.coerce.number().int().min(0).max(999).default(0),
});

/** İş başvurusu — PUBLIC form (sitenin ikinci PII-toplayan ucu; /basvuru
 *  korumaları miras alınır). E-posta zorunlu; consent GERÇEK onay kutusu (true olmalı). */
export const jobApplicationSchema = z.object({
  postingId: z.string().trim().max(60).optional().or(z.literal("")),
  name: z.string().trim().min(2, "Ad soyad giriniz.").max(120),
  email: z.string().trim().email("Geçerli bir e-posta giriniz.").max(160),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\s()-]*$/, "Telefon yalnızca rakam ve +()- içerebilir.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // cvUrl yalnız kendi depomuz olabilir — isOwnStorageUrl kontrolü action'da (harici/SSRF engeli).
  cvUrl: z.string().trim().max(500).optional().or(z.literal("")),
  // Gerçek onay kutusu: aydınlatma+rıza metnini onaylamadan başvuru gönderilemez.
  consent: z.literal(true, { message: "Devam etmek için aydınlatma metnini onaylayın." }),
});

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

// --- Sporcu Takip: Beslenme + Atama ---
const macroField = z
  .number({ message: "Sayı giriniz." })
  .int("Tam sayı giriniz (ondalık olamaz).")
  .min(0, "Negatif olamaz.")
  .max(10000, "En fazla 10000 olabilir.")
  .nullable()
  .optional();

/** Yükleme URL'i güvenlik kısıtı: yalnız kendi upload yolumuz (/uploads/...)
 *  veya https:// (S3 public base). javascript:/data: gibi şemaları engeller —
 *  bu alanlar sonradan <img src> / <a href> olarak render edilir. */
const uploadUrlField = z
  .string()
  .trim()
  .regex(/^(\/uploads\/|https:\/\/)/, "Geçersiz dosya adresi.")
  .nullable()
  .optional();

export const nutritionMealSchema = z.object({
  name: z.string().trim().min(1, "Öğün adı zorunlu.").max(60, "Öğün adı en fazla 60 karakter olabilir."),
  time: z.string().trim().max(5, "Geçersiz saat biçimi.").optional().or(z.literal("")),
  content: z.string().trim().max(500, "İçerik en fazla 500 karakter olabilir.").optional().or(z.literal("")),
  kcal: macroField, protein: macroField, carbs: macroField, fat: macroField,
});

export const nutritionPlanSchema = z.object({
  athleteId: z.string().min(1, "Sporcu seçiniz."),
  title: z.string().trim().min(1, "Başlık zorunlu.").max(120, "Başlık en fazla 120 karakter olabilir."),
  startDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
  endDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir bitiş tarihi giriniz.").optional().or(z.literal("")),
  notes: z.string().trim().max(500, "Not en fazla 500 karakter olabilir.").optional().or(z.literal("")),
  meals: z.array(nutritionMealSchema).min(1, "En az bir öğün ekleyin.").max(12, "En fazla 12 öğün eklenebilir."),
});

export const mealLogSchema = z.object({
  mealId: z.string().min(1, "Geçersiz öğün."),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
  photoUrl: uploadUrlField,
  note: z.string().trim().max(400, "Not en fazla 400 karakter olabilir.").optional().or(z.literal("")),
  kcal: macroField, protein: macroField, carbs: macroField, fat: macroField,
});

export const assignmentCreateSchema = z.object({
  athleteIds: z.array(z.string().min(1)).min(1, "En az bir sporcu seçiniz.").max(60),
  kind: z.enum(["message", "document"] as const).default("message"),
  title: z.string().trim().min(1, "Başlık zorunlu.").max(120),
  body: z.string().trim().max(2000).optional().or(z.literal("")),
  fileUrl: uploadUrlField,
}).superRefine((v, ctx) => {
  if (v.kind === "document" && !v.fileUrl)
    ctx.addIssue({ code: "custom", message: "Doküman için dosya yükleyiniz.", path: ["fileUrl"] });
});
