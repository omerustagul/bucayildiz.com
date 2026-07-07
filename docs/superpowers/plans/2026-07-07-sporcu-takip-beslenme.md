# Sporcu Takip Modülü (Beslenme + Mesaj/Doküman) — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development.
> Spec: `docs/superpowers/specs/2026-07-07-sporcu-takip-beslenme-design.md` (şema
> Prisma blokları ORADA — birebir uygulanır). Kontratlar bu planda; UI görevleri
> depodaki kanıtlanmış desenlere referansla yürür (builder ajanları API'leri
> yazmadan önce dosyadan doğrular — önceki fazlarda kanıtlanmış yöntem).

**Goal:** Öğün bazlı beslenme programı + sporcunun fotoğraflı öğün günlüğü +
mesaj/doküman atama; admin ve sporcu panelleri uçtan uca.

**Her görevde:** requireAdmin/requireAthlete + Zod `safeParse` + Türkçe hata;
tarih `String`; min-width:0 kuralı; overlay'ler portal + `by-anim-*`;
`npm run typecheck` temiz olmadan commit yok; UI görevleri Playwright doğrulamalı.

---

## FAZ A — Temel (şema + kontratlar)

### A1: Yedek + şema + migration
- `npm run db:backup` (YAPILDI: bucayildiz_2026-07-07_135855.dump)
- `prisma/schema.prisma`: spec'teki 4 modeli birebir ekle; `Athlete`'e
  `assignments AthleteAssignment[]`, `nutritionPlans NutritionPlan[]`,
  `mealLogs MealLog[]` ters ilişkileri.
- Migration adı: `athlete_tracking_nutrition`. Salt-ekleme (kolon düşmez) →
  data-loss uyarısı beklenmez; `npm run db:migrate -- --name athlete_tracking_nutrition`.
  Non-interactive sorun çıkarsa B1'deki fallback reçetesi (migrate diff → deploy).
- Commit: `feat(db): beslenme programı + öğün günlüğü + sporcu atama modelleri`

### A2: Zod şemaları (TDD) + sağlık onayı yardımcısı + upload sporcu izni
`src/lib/validation.ts`'e ekle (önce test yaz → fail → uygula → pass):

```ts
// --- Sporcu Takip: Beslenme + Atama ---
const macroField = z.number().int().min(0).max(10000).nullable().optional();

export const nutritionMealSchema = z.object({
  name: z.string().trim().min(1, "Öğün adı zorunlu.").max(60),
  time: z.string().trim().max(5).optional().or(z.literal("")),
  content: z.string().trim().max(500).optional().or(z.literal("")),
  kcal: macroField, protein: macroField, carbs: macroField, fat: macroField,
});

export const nutritionPlanSchema = z.object({
  athleteId: z.string().min(1, "Sporcu seçiniz."),
  title: z.string().trim().min(1, "Başlık zorunlu.").max(120),
  startDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
  endDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  meals: z.array(nutritionMealSchema).min(1, "En az bir öğün ekleyin.").max(12),
});

export const mealLogSchema = z.object({
  mealId: z.string().min(1),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
  photoUrl: z.string().trim().nullable().optional(),
  note: z.string().trim().max(400).optional().or(z.literal("")),
  kcal: macroField, protein: macroField, carbs: macroField, fat: macroField,
});

export const assignmentCreateSchema = z.object({
  athleteIds: z.array(z.string().min(1)).min(1, "En az bir sporcu seçiniz.").max(60),
  kind: z.enum(["message", "document"] as const).default("message"),
  title: z.string().trim().min(1, "Başlık zorunlu.").max(120),
  body: z.string().trim().max(2000).optional().or(z.literal("")),
  fileUrl: z.string().trim().nullable().optional(),
}).superRefine((v, ctx) => {
  if (v.kind === "document" && !v.fileUrl)
    ctx.addIssue({ code: "custom", message: "Doküman için dosya yükleyiniz.", path: ["fileUrl"] });
});
```
Testler `src/lib/validation.tracking.test.ts` (node env): plan öğünsüz red;
geçersiz tarih red; document+dosyasız red; message+dosyasız kabul; makro -1 red.

- `src/lib/consent.server.ts`: `hasHealthConsent(athleteId)` — athlete'in
  `saglik-verisi` kayıtlarından en YENİSİ granted && withdrawnAt null → true.
  (Dosyayı oku; benzer yardımcı varsa yeniden kullan/uydur.)
- `src/app/api/upload/route.ts`: oku; yalnız-admin ise sporcu oturumuna da izin
  ver (görsel türleri; mevcut magic-byte korunur). Sporcu yüklemeleri "meals"
  klasör/prefix'ine gider (storage.ts API'sine göre uyarla).
- Commit: `feat(lib): beslenme/atama şemaları (TDD) + sağlık onayı yardımcısı + sporcu upload izni`

## FAZ B — Beslenme

### B1: Admin actions — `src/app/admin/(panel)/beslenme/actions.ts`
`createNutritionPlan(input)` (nested meals create, sort=index),
`updatePlanBasics(id, {title,startDate,endDate,notes})`,
`setPlanActive(id, active)`, `deletePlan(id)`,
`addMeal(planId, input)`, `updateMeal(mealId, input)`, `removeMeal(mealId)`.
Hepsi requireAdmin + safeParse + revalidatePath("/admin/beslenme") &&
revalidatePath("/panel/beslenme").

### B2: Sporcu actions — `src/app/panel/beslenme/actions.ts`
`saveMealLog(input)`: requireAthlete → mealLogSchema → sahiplik (meal.plan.athleteId
=== session.athleteId ve plan.active) → `hasHealthConsent` değilse Türkçe hata →
tarih penceresi (bugün-14 gün … bugün+1) → upsert (mealId_athleteId_date).
`deleteMealLog(mealId, date)`: sahiplikle sil.

### B3: Admin sayfa+view — `/admin/beslenme` (`NutritionAdminView`)
- Sol: sporcu seçici (takım filtreli; AthletesView/ScheduleAssignCard desenleri).
- Orta/sağ: seçili sporcunun planları; plan editörü Drawer'da (öğün satırları =
  ScheduleAssignCard madde-listesi deseni + makro grid'i); günlük takip:
  gün gezinme + öğün başına log kartı (foto thumbnail → Modal'da büyüt,
  hedef vs gerçekleşen makro satırı).
- Nav (AdminShell, Kulüp grubu, Performans'tan sonra):
  `{ href: "/admin/beslenme", label: "Beslenme", icon: <mevcut IconName'den seç: önce "heart-pulse" DEĞİL (Performans'ta); icons.tsx'ten uygun olanı doğrula (örn. "clipboard-list" veya varsa yemekle ilgili)>, ready: true }`

### B4: Sporcu sayfa+view — `/panel/beslenme` (`NutritionPanelView`)
- Veri: aktif plan(lar) + meals + sporcunun o güne ait logları + hasHealthConsent.
- Gün gezinme (‹ Bugün ›); öğün kartı: ad+saat+içerik+hedef makrolar; günlük
  formu: FileDrop benzeri foto yükleme (upload API), not, gerçekleşen makrolar,
  Kaydet. Onay yoksa: bilgilendirme kutusu (`/panel/izinler` linkli), form kapalı.
- PanelShell nav'a "Beslenme" (dosyayı oku, mevcut desene uy).

## FAZ C — Mesaj/Doküman

### C1: Actions — admin `mesajlar/actions.ts`: `createAssignments(input)`
(assignmentCreateSchema; athleteIds map → createMany), `deleteAssignment(id)`.
Sporcu `panel/mesajlar/actions.ts`: `markAssignmentRead(id)` (sahiplik; readAt
boşsa now()).

### C2: Admin sayfa+view — `/admin/mesajlar` (`AssignmentsAdminView`)
Gönderim formu (çoklu sporcu + Tümünü Seç/Temizle, tür segmenti Mesaj|Doküman,
başlık, metin, FileDrop) + gönderilenler listesi (sporcu adı, tür Badge, başlık,
tarih, okundu ✓/—, sil). Nav: İletişim grubu, Bildirimler'in üstü:
"Mesaj & Doküman", icon "inbox" DEĞİL (Başvurular'da) → icons.tsx'ten doğrula
(örn. "mail"/"send" varsa).

### C3: Sporcu sayfa+view — `/panel/mesajlar` (`AssignmentsPanelView`)
Liste (okunmamış vurgulu); karta tıkla → detay (Modal/sheet) + markAssignmentRead;
doküman ise dosya linki. PanelShell nav "Mesajlar" + okunmamış sayacı (badge).

## Faz sonu doğrulamaları
- A: typecheck+test; migrate status up-to-date.
- B: uçtan uca Playwright: admin plan atar (2 öğün+makro) → sporcu (arda.yilmaz)
  bugüne foto'suz log + makro girer → admin günlükte görür; onay kapısı: sağlık
  onayı olmayan senaryoda form kapalı (seed'de Arda'nın onayları var — test için
  geri-al/ver akışı yerine kod incelemesi yeterli). 375px kontrol.
- C: gönder → sporcu görür → okundu işlenir → admin listede ✓. 375px.
- ROADMAP güncelle (ayrı commit).
