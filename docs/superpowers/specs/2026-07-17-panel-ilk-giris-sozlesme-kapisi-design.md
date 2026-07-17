# Tasarım: Panel İlk-Giriş Sözleşme Kapısı (KVKK Faz 0.1)

Tarih: 2026-07-17 · Durum: **Onaylandı**

Admin'in elle yarattığı (sıfır rıza kayıtlı) sporcu/veli panele ilk girdiğinde,
zorunlu KVKK sözleşmelerini **aşağı-kaydır-oku doğrulamalı** imzalamadan paneli
kullanamaz. Server-enforced kapı.

## Problem (3 paralel KVKK denetiminden — 2026-07-17)

`createAthlete` + `provisionAthleteLogin` sporcuyu/panel hesabını **sıfır
ConsentRecord** ile yaratır; panel giriş zinciri (`middleware` / `panel/layout` /
`getPanelSession`) yalnız oturuma bakar, rızaya değil. Sonuç: sıfır-rızalı sporcu
özel-nitelikli sağlık verisini (performans/profil) rıza olmadan görür. Mevcut
`/panel/izinler` ZORUNLU rızaları TOPLAYAMAZ (`izinler/actions.ts:30` reddeder,
`ConsentManager` buton çizmez) → bu boşluğu kapatan hiçbir yol yok.
Denetim kapsamı: A1-A5 (ve D5 imzalayan-doğruluğu).

## Karar kaydı (kullanıcı onaylı)

1. **Kapı yeri = `panel/layout.tsx` (server-enforced).** Zorunlu rıza eksikse
   layout, `{children}` yerine tam-ekran bloklayan `<ConsentGate>` render eder.
   Panel sayfaları imza olmadan HİÇ render olmaz → JS kapatılarak bile aşılamaz.
   Ayrı route/redirect YOK (döngü riski yok); imza sonrası `router.refresh()` →
   layout yeniden çalışır → eksik kalmaz → panel açılır.
2. **Tüm sözleşmeler gösterilir** (kullanıcı: "tüm sözleşmelerimiz"): 3 ZORUNLU
   (`aydinlatma`, `acik-riza`, `saglik-verisi`) — sonuna kaydırıp onaylanmadan
   "Panele Giriş" pasif; 2 OPSİYONEL (`foto-video`, `pazarlama`) — sunulur,
   isteğe bağlı (KVKK: opsiyonel zorlanamaz). Reddedilen opsiyonel de kaydedilir
   (`granted:false`) → "reddetti" ≠ "sorulmadı".
3. **İmzalayan (denetim doğruluğu, D5 fix):** minör (`ageFromBirthDate < CONSENT_AGE`)
   ise "Veli olarak onaylıyorsunuz" + **veli adı** alanı zorunlu → `granterName=veli`,
   `granterRelation="veli"`. Yetişkinse kendi adına (`granterRelation="kendisi"`).
   Doğum tarihi boşsa veli/kendisi seçtirilir + ad. Sunucu, minörde `veli`yi ZORLAR.
4. **Kilitlenmez:** kapıda "Çıkış Yap" (panelLogout) her zaman var.
5. **Aşağı-kaydır-oku** başvuru formundaki `ConsentModal` deseniyle AYNI
   (`scrollTop+clientHeight ≥ scrollHeight-8` → onay aktif). Kısa metin hemen aktif.

## Veri modeli

Şema DEĞİŞMEZ — mevcut `ConsentDocument`/`ConsentRecord` yeterli. Yalnız kod.

## Kontratlar

```ts
// src/lib/consent.server.ts
/** Sporcunun EKSİK zorunlu rıza anahtarları (aktif granted+geri-alınmamış olmayanlar).
 *  Boş dizi = tüm zorunlular tam → kapı tetiklenmez. */
export async function missingRequiredConsents(athleteId: string): Promise<string[]>

// src/app/panel/actions.ts (veya panel/onay/actions.ts)
/** İlk-giriş kapısında rızaları yazar. requireAthlete → sunucuda zorunluları
 *  yeniden doğrula (istemciye güvenme) → minörde granterRelation="veli" zorla →
 *  recordConsents({athleteId}, {granterName, granterRelation, channel:"panel-ilk-giris",
 *  ip, ua}). Zorunlu eksikse {ok:false}. */
export async function captureInitialConsents(input: unknown):
  Promise<{ ok: true } | { ok: false; error: string }>
// input: { consents: Record<string,boolean>, granterName: string, granterRelation: "veli"|"kendisi" }
```

## Ekranlar

### `panel/layout.tsx` — kapı
- `athlete` yüklendikten sonra: `missingRequiredConsents(athlete.id)` +
  `getActiveConsentDocuments()`. Eksik varsa `<ConsentGate docs athleteName birthDate />`
  döndür (PanelShell İÇİNE ALMADAN — arkada panel görünmesin). Yoksa panel normal.

### `<ConsentGate>` (client, yeni) — `src/components/panel/ConsentGate.tsx`
- Markalı tam-ekran interstitial (logo + "Devam etmeden önce sözleşmeleri onaylayın").
- Her aktif belge kartı: başlık + özet + durum (onaylandı ✓ / opsiyonel) + tıkla→
  `ConsentModal` (aşağı-kaydır-oku, `ApplicationForm`'daki bileşenin paylaşılan hali).
- İmzalayan bölümü: minör/bilinmiyor → ad alanı (+ gerekirse veli/kendisi radio).
- "Panele Giriş" (tüm zorunlular onaylı + ad dolu değilse pasif) → `captureInitialConsents`
  → `router.refresh()`. Hata → mesaj. "Çıkış Yap" → `panelLogout`.
- `ConsentModal`'ı `ApplicationForm`'dan `src/components/forms/ConsentReaderModal.tsx`'e
  çıkarıp İKİ yerde paylaş (kopya-yapıştır değil).

## Güvenlik / KVKK

- Kapı server-enforced (layout kararı) — istemci baypası imkânsız.
- Aksiyon zorunluları SUNUCUDA doğrular (istemci `consents` map'ine güvenmez).
- Minörde `granterRelation="veli"` sunucuda zorlanır (istemci "kendisi" gönderse de).
- Denetim izi: `recordConsents` zaten hash/sürüm/IP/UA yazıyor; `channel="panel-ilk-giris"`.
- Opsiyonel belgeler bloklamaz (KVKK); reddedilen `granted:false` kaydedilir.

## Fazlar (tek oturumda)
- **1:** `missingRequiredConsents` + `captureInitialConsents` (TDD, mutasyon kontrolü).
- **2:** `ConsentReaderModal` çıkar + `ConsentGate` + layout kapısı.
- **3:** Playwright e2e (sıfır-rıza sporcu → kapı bloklar → imza → panel açılır;
  minör → veli adı zorunlu; opsiyonel atlanabilir; çıkış çalışır; başvurudan gelen
  sporcu kapı GÖRMEZ). Deploy + probe.

## Kapsam dışı (bilinçli)
- Rıza SÜRÜM kayması (Faz 2.3) — bu kapı yalnız "hiç yok" durumunu yakalar; sürüm
  güncellenince yeniden-onay ayrı faz.
- Sözleşme METİNLERİ hâlâ TASLAK (avukat) — altyapı placeholder metinle çalışır.
