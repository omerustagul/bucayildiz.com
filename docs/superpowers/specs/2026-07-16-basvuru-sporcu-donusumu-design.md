# Tasarım: Başvuru → Sporcu Dönüşümü + KVKK Rıza Taşıma

Tarih: 2026-07-16 · Durum: **Onaylandı**

Başvuruda velinin verdiği KVKK rızalarını, başvurudan oluşturulan sporcuya
taşıyarak rıza zincirindeki kopukluğu kapatır. Admin, başvuru ekranından takım
seçip sporcuyu oluşturur; başvurunun denetim izli rıza kayıtları sporcuya bağlanır.

## Problem (bu oturumda haritalandı)

1. `/basvuru` bir `Application` yaratır ve `recordConsents` ile **aktif tüm
   belgeler** için `ConsentRecord` satırı yazar (verilen + reddedilen) — ama
   **yalnız `applicationId`** ile.
2. **Application → Athlete dönüşümü YOK.** Admin sporcuyu elle yaratır
   (`admin/(panel)/sporcular/actions.ts` `createAthlete`), **sıfır rıza kaydıyla**.
   `Athlete`'te `applicationId` alanı yok; iki varlık arasında hiçbir bağ yok.
3. Sonuç: **başvuruda verilen foto-video / sağlık rızaları sporcuya asla ulaşmaz.**
4. Bu, 2026-07-16'da eklenen kapılarla birleşince somut etki yaratır:
   - `photoConsentedAthleteIds` (fail-closed) → rıza kaydı olmayan sporcunun
     fotoğrafı **public kadroda görünmez**.
   - `hasHealthConsent` → beslenme günlüğü kapalı.
   Yani bugün admin'in yarattığı her sporcu, veli `/panel/izinler`'e girip rıza
   vermedikçe bu özelliklerden yararlanamaz (panel hesabı provision edilmiş olmalı).

## Karar kaydı (kullanıcı onaylı)

1. **Rıza taşıma = mevcut satıra `athleteId` İŞLE** (kopyalama YOK).
   `applicationId` de KALIR → tam soykütük: *"bu rıza, X başvurusunda şu
   an/IP/UA/metin-hash ile verildi ve artık Y sporcusuna ait."* Orijinal denetim
   izi (an, IP, UA, sürüm, metin-hash, `granterRelation`) **birebir korunur**.
   Şema zaten buna göre tasarlanmış (`applicationId` ve `athleteId` ayrı, ikisi de
   nullable, birbirini dışlamıyor).
   *Değişmezlik notu:* "append-only / kayıtlar değişmez" kuralı **rıza DURUMU**
   içindir (ver/geri-al → yeni satır). Bağlantı alanı eklemek neyin onaylandığını
   değiştirmez, bu yüzden kuralı ihlal etmez.
   *Bonus:* reddedilen rızalar da taşınır → "reddetti" ile "hiç sorulmadı" karışmaz.
2. **Başvuru durumu:** `APPLICATION_STATUSES`'a 5. değer — `registered`
   ("Kayıtlandı"). **Migration gerekmez** (status zaten `String`). Başarı
   (`registered`), arşiv/ret (`closed`) ile karışmaz.
3. **Dönüşüm manueldir** — tercih değil, şemanın dayatması: `Athlete.teamId`
   ZORUNLU, `Application`'da takım yok (yalnız `ageGroup`). Takım ataması
   antrenör kararıdır.

## Veri modeli (Prisma — proje kuralları: enum yok, tarih String)

Tek eklemeli değişiklik; mevcut tablo/veri değişmez.

```prisma
model Athlete {
  // ... mevcut alanlar
  /// Bu sporcu hangi başvurudan oluşturuldu (varsa). @unique → bir başvurudan
  /// EN FAZLA bir sporcu (mükerrer dönüşüm DB seviyesinde engellenir).
  /// Admin'in elle yarattığı sporcularda null.
  applicationId String?      @unique
  application   Application? @relation(fields: [applicationId], references: [id], onDelete: SetNull)
}

model Application {
  // ... mevcut alanlar
  athlete Athlete? // ters ilişki (1:1 opsiyonel)
}
```

`onDelete: SetNull` — mevcut `ConsentRecord` deseniyle tutarlı: başvuru silinse
bile sporcu ve rıza kayıtları yaşamaya devam eder.

## Alan eşlemesi (Application → Athlete)

| Application | Athlete | Not |
|---|---|---|
| `athleteName` | `name` | |
| `birthDate` | `birthDate` | ikisi de "YYYY-MM-DD" String |
| `position` | `position` | null → `""` (Athlete'te default "") |
| `phone` | `parentPhone` | |
| `ageGroup` | — | takım **ön-seçimi** için ipucu (admin onaylar) |
| — | `teamId` | **admin seçer (zorunlu)** |
| — | `number` | admin (opsiyonel) |
| `parentName`, `email`, `currentClub` | — | Athlete karşılığı yok; sporcu başvuruya bağlı olduğu için erişilebilir kalır → **yeni alan eklenmez** |

## Güvenlik / KVKK kuralları

1. **Yetki:** aksiyon başında **`basvurular.manage` VE `sporcular.manage`** —
   iki varlıkta da mutasyon var, en az ayrıcalık. (Server action'lar middleware'i
   baypas eden POST uçlarıdır; kapı aksiyonun kendi sorumluluğu.)
2. **Atomiklik (kritik):** sporcu oluşturma + rıza bağlama + durum güncelleme
   **TEK `prisma.$transaction`** içinde. Yarıda kalırsa hepsi geri alınır.
   Aksi halde "sporcu var ama rızası yok" hayalet durumu oluşur ve foto/sağlık
   kapıları sessizce kapalı kalır — üstelik sebebi görünmez. (Aynı gerekçe:
   `basvuru/actions.ts` "yetim Application kalmaz" deseni.)
3. **Mükerrer dönüşüm:** `@unique` DB kapısı + aksiyonda dostane ön-kontrol
   ("Bu başvurudan zaten sporcu oluşturulmuş" + sporcuya link).
4. **Rıza satırları:** yalnız `athleteId` alanı yazılır; `granted`, `withdrawnAt`,
   `textHash`, `documentVersion`, `ipAddress`, `userAgent`, `createdAt`,
   `granterRelation` **ASLA** değiştirilmez.
5. **Denetim izi:** dönüşüm `AdminAuditLog`'a yazılır (kim, hangi başvuru → hangi
   sporcu, IP) — mevcut `writeAudit` deseni (bkz. `kullanicilar/actions.ts`).

## Ekranlar

### Admin — `/admin/basvurular` (mevcut ekran)
- Başvuru satırı/drawer'ında **"Sporcu Oluştur"** eylemi.
  Görünürlük: yalnız `basvurular.manage` + `sporcular.manage` olan yöneticiye;
  başvuru zaten dönüştürülmüşse yerine **"Sporcu: <ad>"** linki (→ `/admin/sporcular`).
- Küçük form: **Takım (zorunlu, `ageGroup`'a uyan takım ön-seçili)** + **Forma No
  (opsiyonel)**. Ad/doğum tarihi/mevki/veli telefonu başvurudan gelir (salt-okunur
  özet olarak gösterilir; düzeltme sporcu ekranında yapılır).
- Başarıda: başvuru durumu **"Kayıtlandı"** olur, satırda sporcuya link çıkar.
- Formda KVKK bilgisi: *"Başvurudaki rıza kayıtları (foto-video dahil) sporcuya
  bağlanacak."* — yönetici ne olduğunu bilerek onaylasın.

### Admin — `/admin/sporcular` (mevcut ekran)
- Başvurudan gelen sporcuda foto-video rozeti (2026-07-16'da eklendi) artık
  **başvurudaki gerçek rızayı** yansıtır → veli başvuruda onayladıysa fotoğraf
  panel hesabı gerekmeden public kadroda görünür.

## Fazlar

- **A — Şema:** `Athlete.applicationId` (+ ters ilişki) migration'ı.
  *Migration kuralı: önce özet + `db:backup` + kullanıcı onayı.*
- **B — Aksiyon + durum:** `createAthleteFromApplication` (transaction, yetki,
  mükerrer kapısı, audit) + `APPLICATION_STATUSES`'a `registered` + testler.
- **C — UI:** başvurular ekranında eylem + form + dönüştürülmüş durum görünümü;
  tarayıcıda görsel doğrulama.

## Kapsam dışı (bilinçli)

- **Mevcut sporcuyu geçmiş başvuruya bağlama** ("ilişkilendir" akışı). Prod'daki
  4 sporcunun rıza kaydı yok; bu özellik yalnız BUNDAN SONRAKİ dönüşümleri kapsar.
  Gerekirse ayrı iş.
- **Dönüşümde panel hesabı provision** — mevcut `sporcular` ekranındaki akış kullanılır.
- **Aynı ad + doğum tarihli mükerrer sporcu uyarısı** (DB'de zorlanamaz; soft kontrol
  ileride).
- **Rıza sürüm kayması:** başvuru v1 metnini onayladıysa ve belge v2'ye geçtiyse,
  eski sürüm onayı geçerli sayılmaya devam eder (mevcut `hasHealthConsent` /
  `photoConsentedAthleteIds` davranışıyla AYNI). Sürüm politikası ayrı bir konudur.
- Onay metni gövdeleri (`ConsentDocument.body`) hâlâ TASLAK — avukat onayı bekliyor.
