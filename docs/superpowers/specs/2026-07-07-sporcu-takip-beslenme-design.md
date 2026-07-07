# Tasarım: Sporcu Takip Modülü — Beslenme Programı + Mesaj/Doküman Atama

Tarih: 2026-07-07 · Durum: **Onaylandı**

Antrenörün (şimdilik admin) sporcuyu birebir izleyebildiği sistemin ilk ayağı:
öğün bazlı beslenme programı + sporcunun fotoğraflı öğün günlüğü + mesaj/doküman
atama. Sporcu, sporcu panelinden takip eder.

## Karar kaydı (kullanıcı onaylı)
1. **Kapsam:** Tek spec, üç faz (A şema → B beslenme → C mesaj/doküman).
2. **KVKK:** Öğün günlüğü sağlık-ilişkili veri sayılır → günlük GİRİŞİ yalnız
   `saglik-verisi` onayı aktif (granted && !withdrawnAt) sporcularda açık;
   onaysızda sporcu panelinde bilgilendirme gösterilir, program salt-okunur
   görüntülenebilir. Görünürlük: yalnız admin + sporcunun kendisi.
3. **Roller:** Atamaları admin yapar (coach rolü ileride ayrı faz).
4. **Makrolar:** Öğün planında opsiyonel HEDEF (kcal/protein/karb/yağ);
   sporcu günlüğünde opsiyonel GERÇEKLEŞEN değerler.

## Veri modeli (Prisma — proje kuralları: enum yok, tarih String)

```prisma
/// Sporcuya atanan içerik: mesaj/direktif veya doküman.
model AthleteAssignment {
  id        String    @id @default(cuid())
  athleteId String
  athlete   Athlete   @relation(fields: [athleteId], references: [id], onDelete: Cascade)
  kind      String    @default("message") // message | document
  title     String
  body      String    @default("")
  fileUrl   String?   // doküman (storage.ts üzerinden)
  readAt    DateTime? // sporcu ilk görüntülediğinde
  createdAt DateTime  @default(now())

  @@index([athleteId, createdAt])
}

/// Beslenme programı — sporcuya atanır; öğünler günlük şablondur.
model NutritionPlan {
  id        String          @id @default(cuid())
  athleteId String
  athlete   Athlete         @relation(fields: [athleteId], references: [id], onDelete: Cascade)
  title     String
  startDate String // "YYYY-MM-DD"
  endDate   String? // boş = açık uçlu
  notes     String          @default("")
  active    Boolean         @default(true)
  meals     NutritionMeal[]
  createdAt DateTime        @default(now())

  @@index([athleteId, active])
}

/// Program öğünü (günlük şablon satırı) + hedef makrolar (opsiyonel).
model NutritionMeal {
  id      String        @id @default(cuid())
  planId  String
  plan    NutritionPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  name    String // Kahvaltı | Ara Öğün | Öğle | Akşam | ...
  time    String        @default("") // "08:00"
  content String        @default("") // ne yenecek (serbest metin)
  kcal    Int?
  protein Int? // gram
  carbs   Int?
  fat     Int?
  sort    Int           @default(0)
  logs    MealLog[]

  @@index([planId])
}

/// Sporcunun öğün günlüğü — öğün+gün başına TEK kayıt (upsert).
model MealLog {
  id        String        @id @default(cuid())
  mealId    String
  meal      NutritionMeal @relation(fields: [mealId], references: [id], onDelete: Cascade)
  athleteId String
  athlete   Athlete       @relation(fields: [athleteId], references: [id], onDelete: Cascade)
  date      String // "YYYY-MM-DD"
  photoUrl  String? // öğün fotoğrafı
  note      String        @default("")
  kcal      Int? // gerçekleşen (opsiyonel)
  protein   Int?
  carbs     Int?
  fat       Int?
  createdAt DateTime      @default(now())

  @@unique([mealId, athleteId, date])
  @@index([athleteId, date])
}
```
`Athlete` ters ilişkiler: `assignments AthleteAssignment[]`,
`nutritionPlans NutritionPlan[]`, `mealLogs MealLog[]`.

## Güvenlik / KVKK kuralları
- Admin action'ları `requireAdmin`; sporcu action'ları `requireAthlete` +
  **sahiplik** (meal → plan.athleteId === session.athleteId; assignment.athleteId
  === session.athleteId) + **sağlık onayı** (MealLog yazma).
- `hasHealthConsent(athleteId)` yardımcısı `lib/consent.server.ts`'e eklenir
  (yoksa): son `saglik-verisi` ConsentRecord'u granted && withdrawnAt null.
- Fotoğraf yükleme: mevcut `/api/upload` hattı (magic-byte). Route şu an yalnız
  admin ise sporcu oturumuna da (yalnız görsel) izin verecek şekilde güncellenir.
- MealLog.date: bugünden en fazla 14 gün geriye, 1 gün ileriye kabul (sağduyu guard).

## Ekranlar
### Admin — `/admin/beslenme` ("Beslenme", Kulüp nav grubu)
- Sporcu seçici (takım filtreli) → aktif plan(lar):
  - Plan oluştur/düzenle: başlık, tarih aralığı, not; öğün satırları
    (ad+saat+içerik+hedef makrolar; ekle/sil/sırala — madde listesi deseni).
  - **Günlük takip:** gün gezinme (‹ bugün ›): öğün başına sporcu log'u
    (fotoğraf büyütülebilir, not, gerçekleşen vs hedef makro karşılaştırması).
- Plan pasifleştir / sil.

### Admin — `/admin/mesajlar` ("Mesaj & Doküman", İletişim nav grubu)
- Gönder: sporcu çoklu seçim (Tümünü Seç/Temizle desenli) + tür (Mesaj|Doküman)
  + başlık + metin + (doküman ise FileDrop) → her seçili sporcuya kayıt.
- Gönderilenler listesi: sporcu, tür, başlık, tarih, **okundu** durumu; sil.

### Sporcu — `/panel/beslenme` ("Beslenme", panel nav)
- Aktif plan yoksa boş durum. Varsa: gün gezinme (bugün varsayılan);
  öğün kartları: plan içeriği + saat + hedef makrolar; altında günlük formu:
  fotoğraf çek/yükle + not + gerçekleşen makrolar → kaydet (upsert).
- Sağlık onayı yoksa: bilgilendirme kutusu, günlük formu kapalı
  (plan görüntüleme açık).

### Sporcu — `/panel/mesajlar` ("Mesajlar", panel nav)
- Atananlar listesi (yeni olanlar vurgulu); açınca `readAt` işlenir;
  doküman ise indirme/görüntüleme linki.

## Fazlar
| Faz | Kapsam | Teslim kriteri |
|---|---|---|
| **A** | `db:backup` → şema+migration → Zod şemaları (TDD) + consent yardımcısı + upload route sporcu izni | typecheck+test temiz; migration status up-to-date |
| **B** | Beslenme: admin actions+sayfa+view, sporcu actions+sayfa+view, nav'lar | Uçtan uca: plan ata → sporcu log girer (foto+makro) → admin günlük görür; KVKK kapısı çalışır |
| **C** | Mesaj/Doküman: admin+sporcu | Gönder → sporcu görür → okundu admin'e yansır |

Her fazda: typecheck+lint+test + Playwright görsel doğrulama (masaüstü+375px).
UI kuralları: min-width:0, portal overlay'ler, by-anim-* animasyonları, Türkçe.
