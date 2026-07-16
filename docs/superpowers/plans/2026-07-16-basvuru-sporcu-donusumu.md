# Başvuru → Sporcu Dönüşümü + Rıza Taşıma — Uygulama Planı

> **For agentic workers:** Spec: `docs/superpowers/specs/2026-07-16-basvuru-sporcu-donusumu-design.md`
> (Prisma bloğu + alan eşleme tablosu ORADA — birebir uygulanır). Kontratlar bu
> planda. Builder ajanları API'leri yazmadan ÖNCE dosyadan doğrular.

**Goal:** Admin, başvurudan takım seçerek sporcu oluşturur; başvurunun denetim izli
rıza kayıtları (foto-video dahil) **aynı satıra `athleteId` işlenerek** sporcuya
bağlanır; başvuru "Kayıtlandı" olur. Böylece velinin başvuruda verdiği foto-video
rızası public kadroda geçerli olur (panel hesabı gerekmeden).

**Her görevde:** yetki kapısı aksiyonun kendi sorumluluğu (`requirePermission`);
Zod `safeParse` + Türkçe hata; tarih `String`; `npm run typecheck` temiz olmadan
commit yok; UI görevi tarayıcıda doğrulanmadan bitmiş sayılmaz.

**Tarayıcı doğrulama uyarısı:** preview panelinde IntersectionObserver + scroll
ÖLÜ (yanlış teşhis riski) ve Chrome eklentisi bağlı değil → görsel doğrulama için
scratchpad'e geçici Playwright kur (`npm i playwright && npx playwright install
chromium`), dev server'ı `preview_start` ile başlat. Admin oturumu için şifreyi
hiçbir forma GİRME; dev `AUTH_SECRET` ile programatik JWT üretip çerez olarak ver
(bkz. bu oturumda kullanılan yöntem).

---

## FAZ A — Şema

### A1: Yedek + şema + migration
- **ÖNCE:** `npm run db:backup` (migration kuralı — zorunlu).
- **Kullanıcıya özet + onay** (migration kuralı): eklenen = `Athlete.applicationId
  String? @unique` + FK + `Application.athlete Athlete?` ters ilişkisi. Salt-ekleme;
  mevcut tablo/veri değişmez, kolon düşmez.
- `prisma/schema.prisma`: spec'teki bloğu birebir uygula.
- Migration adı: `athlete_application_link`.
  `npx prisma migrate dev --create-only --name athlete_application_link` → **SQL'i
  incele** (yalnız `ALTER TABLE ADD COLUMN` + `CREATE UNIQUE INDEX` + FK olmalı;
  DROP/ALTER-mevcut YOKSA) → `npx prisma migrate deploy` + `npx prisma generate`.
- Commit: `feat(db): Athlete↔Application bağı (başvurudan sporcu dönüşümü için)`

---

## FAZ B — Aksiyon + durum (TDD)

### B1: Başvuru durumu — `registered`
- `src/lib/applicationStatus.ts`: `APPLICATION_STATUSES`'a 5. değer
  `{ value: "registered", label: "Kayıtlandı", tint: <yeşil-altın tint>, accent: <...> }`.
  Mevcut `value`'lara DOKUNMA (dosyanın kendi kuralı: stored string'ler değişmez).
  Renk anlamı: başarı/terminal — `closed` (nötr arşiv) ile karışmamalı.
- Filtre sekmeleri + satır renklendirmesi bu tek kaynaktan beslendiği için (Faz 4)
  ek iş YOK — doğrula.

### B2: Aksiyon — `createAthleteFromApplication`
Yer: `src/app/admin/(panel)/basvurular/actions.ts` (başvuru bağlamı; sporcu
oluşturma yan etkisi).

**Kontrat:**
```ts
export async function createAthleteFromApplication(
  applicationId: unknown,
  input: unknown, // { teamId: string; number?: number|null }
): Promise<{ ok: true; athleteId: string } | { ok: false; error: string }>
```
**Sıra (DEĞİŞMEZ):**
1. `await requirePermission("basvurular.manage")` **VE**
   `await requirePermission("sporcular.manage")` — iki varlıkta da mutasyon.
2. Zod: `applicationId` `idSchema`; `teamId` `idSchema`; `number` opsiyonel int
   (mevcut `sporcular` şemasındaki kuralı yeniden kullan).
3. Başvuruyu çek (`include: { athlete: { select: { id: true, name: true } } }`).
   Yoksa → `{ ok:false, error:"Başvuru bulunamadı." }`.
   **Zaten dönüştürülmüşse** → `{ ok:false, error:"Bu başvurudan zaten sporcu
   oluşturulmuş." }` (dostane ön-kontrol; `@unique` yine son kapı).
4. **TEK `prisma.$transaction`** (KRİTİK — spec §Güvenlik/2):
   a. `tx.athlete.create({ data: { name: app.athleteName, birthDate: app.birthDate,
      position: app.position ?? "", parentPhone: app.phone, teamId, number,
      applicationId: app.id } })`
   b. `tx.consentRecord.updateMany({ where: { applicationId: app.id },
      data: { athleteId: athlete.id } })` — **YALNIZ `athleteId` yazılır**;
      `granted`/`withdrawnAt`/`textHash`/`documentVersion`/`ipAddress`/`userAgent`/
      `createdAt`/`granterRelation` ASLA değişmez. `applicationId` KALIR (soykütük).
   c. `tx.application.update({ where: { id: app.id }, data: { status: "registered" } })`
5. `writeAudit(...)` — kim, hangi başvuru → hangi sporcu, IP (mevcut
   `kullanicilar/actions.ts` deseni).
6. `revalidatePath("/admin/basvurular")`, `revalidatePath("/admin/sporcular")`.
   **Ayrıca** sporcunun takım sayfası: `revalidatePath("/takimlar/<slug>")` —
   başvuruda foto-video onaylıysa ve foto sonradan eklenirse public kadro ISR'li
   (`(site)/layout.tsx` `revalidate=60`); dönüşümde foto henüz yok, bu yüzden
   ZORUNLU değil — atlanabilir (gereksiz invalidasyon yapma).

### B3: Testler (B2 ile TDD — önce kırmızı)
`src/app/admin/(panel)/basvurular/actions.test.ts` (yeni veya mevcut dosyaya ek).
Mevcut mock deseni: `medya/actions.test.ts` (vi.hoisted + `vi.mock("@/lib/prisma")`)
ve **atomiklik modeli için** `basvuru/actions.test.ts` (stage/rollback taklidi) —
ikisini örnek al.
Kapsanacaklar:
1. **Rıza satırları sporcuya bağlanır ve `applicationId` KORUNUR** (updateMany yalnız
   `athleteId` yazar — `data` içeriğini assert et).
2. **Reddedilen rızalar da taşınır** (granted:false satırları da güncellenir —
   `where` yalnız `applicationId`'ye bakmalı, `granted`'a DEĞİL).
3. **Atomiklik:** consent updateMany throw ederse **sporcu YAZILMAZ** (rollback) —
   `basvuru/actions.test.ts`'teki stage/commit taklidiyle.
4. **Mükerrer:** başvuru zaten sporcuya bağlıysa `{ok:false}` + hiçbir yazma yok.
5. **Durum:** başarıda `application.status = "registered"`.
6. **Yetki:** `requirePermission` mock'u reddederse hiçbir yazma olmaz (iki anahtar
   da çağrılıyor mu assert et).
7. **Alan eşlemesi:** `athleteName→name`, `phone→parentPhone`, `position` null → `""`.
- **Mutasyon kontrolü** (bu oturumda kanıtlanmış yöntem): testleri yazdıktan sonra
  ilgili guard'ı geçici boz → testler KIRMIZI olmalı; geri al → yeşil. Boş test yazma.
- Commit: `feat(basvuru): başvurudan sporcu oluştur + KVKK rıza taşıma (atomik)`

---

## FAZ C — UI

### C1: Başvurular ekranı — dönüşüm eylemi
`src/components/admin/BasvurularView.tsx` (+ `basvurular/page.tsx` veri).
- `page.tsx`: başvuruları çekerken `include: { athlete: { select: { id, name } } }`;
  takım listesi (`team.findMany`) ve yöneticinin izinleri (`getAdminPermissions`)
  view'e geçir. Satır tipine `athlete: {id,name} | null` + `ageGroup` ekle.
- Drawer/satırda:
  - `athlete` VARSA → **"Sporcu: <ad>"** linki (`/admin/sporcular`), eylem yok.
  - YOKSA ve yöneticide `basvurular.manage` + `sporcular.manage` VARSA →
    **"Sporcu Oluştur"** butonu → küçük form: **Takım (zorunlu, `ageGroup`'a uyan
    takım ön-seçili)** + **Forma No (opsiyonel)**; başvurudan gelen ad/doğum
    tarihi/mevki/veli telefonu salt-okunur özet.
  - Formda KVKK notu: *"Başvurudaki rıza kayıtları (foto-video dahil) sporcuya
    bağlanacak."*
- Desen: mevcut drawer/form bileşenleri (`controls.tsx`, `form.tsx`, `kit.tsx`);
  grid/flex içinde ellipsis kullanılan her öğeye **`min-width: 0`** (proje kuralı).
- Başarıda: `router.refresh()`; durum "Kayıtlandı" sekmesine düşer.

### C2: Görsel doğrulama (ZORUNLU)
- Scratchpad Playwright + programatik admin JWT (şifre girme YOK).
- Doğrula: (a) eylem butonu görünüyor + form açılıyor, (b) takım ön-seçimi
  `ageGroup`'a uyuyor, (c) dönüşüm sonrası satır "Kayıtlandı" + sporcu linki,
  (d) zaten dönüştürülmüşte buton YOK, (e) 375px'te form taşmıyor, (f) konsol temiz.
- **Uçtan uca kanıt (KVKK — asıl amaç):** dönüşümden sonra sporcuya foto ekle →
  başvuruda foto-video onaylıysa **public kadroda görünmeli**; başvuruda
  reddedildiyse **görünmemeli**. Bu, rıza zincirinin gerçekten kapandığının kanıtıdır.
  (Bu oturumdaki `gatetest.mjs` yöntemi: gerçek HTTP + DB, sonunda geri al.)
- Commit: `feat(admin): başvurudan sporcu oluşturma akışı (UI)`

---

## Faz sonu doğrulamaları

- `npm run typecheck` + `npx vitest run` + `npm run lint` temiz.
- Deploy: `git push` → `deploy.sh` migration'ı görüp **otomatik pg_dump + migrate
  deploy** yapar; deploy sırasında `/iletisim` probe'u **0×503** olmalı (zero-downtime
  regresyonu olmasın).
- Prod duman testi: `/admin/basvurular` 200, `/takimlar/<slug>` 200.

## Riskler / dikkat

- **Atomiklik testi en kritik test** — kaçarsa "sporcu var, rızası yok" hayalet
  durumu sessizce oluşur ve foto/sağlık kapıları sebebi görünmeden kapalı kalır.
- `updateMany`'nin `where`'i **yalnız `applicationId`** olmalı; `granted: true`
  filtresi eklemek reddedilen rızaların taşınmasını engeller → "reddetti" ile "hiç
  sorulmadı" karışır (fail-closed olduğu için sessizce aynı sonucu verir ama denetim
  izi eksik kalır).
- `Athlete.applicationId` `@unique` → aynı başvurudan ikinci sporcu DB hatası verir;
  aksiyon bunu dostane mesaja çevirmeli (ham Prisma hatası kullanıcıya gitmesin).
