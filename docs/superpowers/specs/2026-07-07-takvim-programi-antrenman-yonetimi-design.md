# Tasarım: Responsive Fikstür Tabloları + Takvim Programı + Antrenman Yönetimi

Tarih: 2026-07-07 · Durum: **Onaylandı** (kullanıcı onayı alındı)

Üç özellik tek tasarımda; fazlara bölünerek uygulanır. Sporcu paneli
görünürlüğü (sporcunun kendi antrenman detayını/yoklamasını görmesi) bu
kapsamın **dışında** — sonraki faz.

---

## Karar kaydı (kullanıcı ile netleştirilen)

1. **Maç → Takvim: otomatik gösterim.** Maçlar için ayrı takvim kaydı
   OLUŞTURULMAZ. Takvim, `Fixture` tablosundaki yaklaşan maçları otomatik ve
   salt-okunur gösterir. "Program Ata" kartındaki **Maç** sekmesi yalnızca
   yaklaşan fikstürleri listeleyen bilgi/kısayol panelidir ("Fikstür'de
   Yönet" linki); kayıt yaratmaz.
2. **Bireysel antrenman kapsamı:** bir VEYA birden çok sporcu seçilebilir.
3. **Tür taksonomisi:** eski Saha/Kondisyon/Taktik türleri kaldırılır.
   Program Türü yalnızca: **Takım Antrenmanı / Bireysel Antrenman / Maç**.
   Antrenman içeriğini serbest **madde listesi** anlatır.
4. **Durum sözlüğü (kurumsal):** Planlandı / Tamamlandı / İptal Edildi /
   Yarım Kaldı (`planned | completed | cancelled | partial`).

---

## Veri modeli (Prisma)

### `Training` — güncellenir

| Alan | Değişiklik |
|---|---|
| `type` | **Kaldırılır** → yerine `scope String @default("team")` — `team \| individual` |
| `status` | **Eklenir** `String @default("planned")` — `planned \| completed \| cancelled \| partial` |
| `teamId, date, time, duration, pitch, notes` | Aynen kalır |
| `drills` | Yeni ilişki → `TrainingDrill[]` |
| `attendance` | Yeni ilişki → `TrainingAttendance[]` |

Migration notu: mevcut kayıtlar `scope="team"`, `status="planned"` alır;
`type` kolonu düşürülür (eski değer bilgisi korunmayacak — kullanıcı onayı ile).

### `TrainingDrill` — yeni

```prisma
model TrainingDrill {
  id         String   @id @default(cuid())
  trainingId String
  training   Training @relation(fields: [trainingId], references: [id], onDelete: Cascade)
  text       String
  done       Boolean  @default(false)
  sort       Int      @default(0)
  createdAt  DateTime @default(now())

  @@index([trainingId])
}
```

### `TrainingAttendance` — yeni (yoklama + sporcuya özel not)

```prisma
model TrainingAttendance {
  id         String   @id @default(cuid())
  trainingId String
  training   Training @relation(fields: [trainingId], references: [id], onDelete: Cascade)
  athleteId  String
  athlete    Athlete  @relation(fields: [athleteId], references: [id], onDelete: Cascade)
  status     String   @default("unknown") // present | absent | excused | unknown
  note       String   @default("") // sporcuya özel direktif/not
  createdAt  DateTime @default(now())

  @@unique([trainingId, athleteId])
  @@index([athleteId])
}
```

`Athlete` modeline ters ilişki eklenir: `attendance TrainingAttendance[]`.

- **Takım antrenmanı:** yoklama satırları takım kadrosundan türetilir;
  admin yoklamayı kaydettikçe upsert edilir (önceden satır açılmaz).
- **Bireysel antrenman:** oluşturma sırasında seçilen sporcular için
  attendance satırları hemen açılır (katılımcı tanımı görevi görür).

Şema sadeliği korunur: enum yok, `String` status; tarihler `String`
("YYYY-MM-DD") — proje kuralı.

---

## Feature 1 — Responsive fikstür tabloları (şema değişikliği yok)

**Amaç:** mobilde yatay kaydırma olmadan tek bakışta okunur maç listeleri.

### `panel/maclar` → `MatchList` yeniden düzenlenir
- Mevcut 3-kolonlu grid (`minmax(120px,.8fr) 1.6fr auto`) dar ekranda taşıyor.
- Yeni: mobil-öncelikli kart — üst satır **lig rozeti + tarih·saat**, orta
  satır **ev — skor/saat — deplasman** (esnek, kısaltmalı), alt/sağ **durum
  rozeti**. Masaüstünde mevcut yatay düzen korunur (CSS breakpoint).

### `admin/fikstur` → `FixturesView`
- Generic `Table` masaüstünde aynen kalır. `<~560px` altında satırlar
  **kart** olarak render edilir (fikstüre özel; diğer admin tabloları
  etkilenmez). Kart tıklanınca aynı `FixtureDrawer` açılır.

---

## Feature 2 — Takvim Programı (`/admin/takvim-programi`)

### Rota / ad değişikliği
- `/admin/antrenmanlar` → **`/admin/takvim-programi`** (sayfa: "Takvim
  Programı"). AdminShell nav, breadcrumb, ikon güncellenir.
- Eski `/admin/antrenmanlar` slug'ı **Feature 3'ün** yeni sayfası olur.

### Sol kart: "Program Ata"
Program Türü segmenti: **[Takım Antrenmanı | Bireysel Antrenman | Maç]**

- **Takım Antrenmanı:** takım + tarih/saat/süre/saha + **madde listesi**
  ("Madde ekle" ile sınırsız satır, sil/sırala) + bildirim anahtarı.
- **Bireysel Antrenman:** takım seçimi → o takımın sporcularından
  **çok-seçim** + aynı alanlar + madde listesi.
- **Maç:** yalnızca `status="upcoming"` fikstürler listelenir; seçilen maçın
  detayı gösterilir + "Fikstür'de Yönet" linki. **Kayıt oluşturmaz.**

### Sağ takvim
- Hafta görünümü (mevcut yapı üzerine). Kartlarda YALNIZ: saat, program
  türü, saha, süre.
- **Masaüstü:** hover → modern **popover** (maddeler, katılımcılar/takım,
  not, durum). **Mobil:** tıkla → alttan açılan **sheet** aynı içerikle.
- **Maçlar** takvime `Fixture`'dan otomatik düşer: ayrı görsel stil,
  salt-okunur, tıklayınca fikstür detayı + Fikstür'e link.

---

## Feature 3 — Antrenman Yönetimi (`/admin/antrenmanlar`)

- **Liste:** Training kayıtları; takım + durum filtreleri; tarih sıralı.
- **Detay (drawer):**
  - **Durum yönetimi:** Planlandı / Tamamlandı / İptal Edildi / Yarım Kaldı.
  - **Madde kontrol listesi:** `TrainingDrill.done` tikleri.
  - **Yoklama tablosu:** takım kadrosu (team scope) veya seçili sporcular
    (individual scope) — Katıldı / Katılmadı / İzinli + sporcu başına not.
- Maçlar bu sayfada YOK (Fikstür'de yönetilir).

### Server actions (yeni/güncellenen) — tümü `requireAdmin` + Zod
- `createTraining` — scope, maddeler[], (individual ise) athleteIds[] alır.
- `updateTraining`, `deleteTraining` — mevcut, yeni alanlara uyarlanır.
- `setTrainingStatus(id, status)`
- `toggleDrill(drillId, done)` / `addDrill` / `removeDrill`
- `saveAttendance(trainingId, rows[])` — upsert.

---

## Geriye uyumluluk

- Sporcu paneli `TrainingCalendar` bugün `Training.type` kullanıyor.
  `type` kalkınca **kırılmaması için** bileşen `scope`'a uyarlanır
  (görünüm: "Takım Antrenmanı"/"Bireysel Antrenman" etiketi + saat/süre).
  Tam sporcu-paneli özellikleri (madde/yoklama görünürlüğü) sonraki faz.
- `TRAINING_TYPES` enum'u (`lib/enums.ts`) kullanımdan kalkar; ölü kod
  temizlenir.

---

## Fazlar

| Faz | Kapsam | Şema | Teslim kriteri |
|---|---|---|---|
| **A** | Feature 1 (iki responsive tablo) | Yok | 320/375px'de kaydırmasız; masaüstü regresyonsuz |
| **B** | Migration + Takvim Programı sayfası | **Evet** | Atama (takım/bireysel + maddeler) çalışır; takvim popover/sheet; maçlar otomatik görünür; eski sayfa yeni slug'da |
| **C** | Antrenman Yönetimi sayfası | Yok | Durum + madde tik + yoklama/not uçtan uca |

Her fazda: `npm run typecheck` + `npm run lint` temiz; kritik akışa birim
test (en az: createTraining validasyonu, saveAttendance upsert davranışı).

## Test yaklaşımı
- Birim (Vitest): action şema validasyonları; drill/attendance yardımcıları.
- Manuel/E2E (Playwright MCP): 375px'te panel/maclar + admin/fikstur;
  takvim atama akışı; yoklama kaydı.
