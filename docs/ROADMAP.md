# Buca Yıldız — Yol Haritası

Bu dosya projenin nerede olduğunu, neyin tamamlandığını ve bundan sonra
yapılacakları özetler. Teknik dağıtım detayları için bkz. `docs/DEPLOYMENT.md`.

Son güncelleme: 2026-06-16

---

## ✅ Tamamlananlar

### Faz 0–1 — Kurulum + Public Website
- Next.js 16 (App Router, Turbopack) + TypeScript + Prisma kurulumu
- Tüm halka açık sayfalar (kurumsal, takımlar, altyapı, haberler, fikstür,
  medya, iletişim, başvuru, ücretsiz deneme, KVKK/gizlilik/çerez)
- Tasarım sistemi token'ları, Barlow fontları (self-hosted), bileşen kütüphanesi
- Public sayfalar veritabanına bağlı (haber, fikstür, takım, forma, medya)

### Faz 2 — Yönetim Paneli (admin)
- Genel bakış, başvurular, sporcular, takımlar, antrenmanlar, fikstür,
  haberler/blog (sihirbaz), medya kütüphanesi, formalar
- Claude Design'a birebir uyumlu UI (drawer / tabs / wizard + kit/controls)
- Görsel yükleme (FileDrop → /api/upload → storage soyutlaması)

### Faz 3 — Sporcu Paneli
- Sporcu kartı, antrenman takvimi (hafta/ay), performans matrisi (gerçek model)
- Admin'den performans girişi (PerformanceModal)

### Faz 4 — Cilalama & Altyapı (TÜM KOD ADIMLARI TAMAM)
- **PWA:** manifest + apple meta; panellerde "Ana Ekrana Ekle" (iOS dahil),
  sporcu panelinde InstallHint ipucu kartı
- **Mobil uyumluluk:** tüm sayfalar 375/320px'de taşmasız; iOS Safari
  `-webkit-text-size-adjust` kök neden düzeltmesi
- **PostgreSQL geçişi:** dev (native :5432) + prod-hazır; migration'lar
- **KVKK dijital onay sistemi:** ayrı belgeler (aydınlatma/açık-rıza/sağlık/
  foto-video/pazarlama), denetim izi (hash+IP+veli), admin onay görünümü,
  veli geri-alma sayfası (`/panel/izinler`), sözleşme metin sayfaları
- **E-posta (SMTP):** başvuru bildirimleri (`lib/mail.ts`, non-blocking)
- **Web Push:** model + VAPID + service worker + abone/iptal API + panel
  toggle + admin "Bildirimler" göndericisi
- **Dosya depolama:** S3-uyumlu adaptör (`lib/storage.ts`, env-driven)
- **SMS altyapısı:** `lib/sms.ts` (OTP üretici + gönderim, sağlayıcı bekliyor)
- **Özel scrollbar:** ince, yarı-saydam, tasarım çizgisi
- **Dağıtım rehberi:** `docs/DEPLOYMENT.md`

> Tüm Faz 4 servisleri **env-driven**: ilgili kimlik bilgisi boşken sessizce
> devre dışı, doldurulunca aktifleşir.

---

## 🔜 Sıradaki adımlar

### ⭐ AKTİF — Birleşik Yol Haritası (2026-07-17): KVKK denetimi + özellik listesi

3 paralel KVKK denetimi (rıza uygulama · veri sahibi hakları · minimizasyon/çerez/bildirim)
+ kullanıcının 14 maddelik özellik listesi harmanlandı. Sıra: KVKK yasal riski → ucuz
görünür düzeltmeler → tamamlayıcı KVKK → büyük özellikler → cila.
Sahip: 🤖 orkestratör(+builder) · 🧑 kullanıcı(karar/tasarım/cihaz) · ⚖️ avukat(metin). Büyük: S/M/L

**Durum (2026-07-18) — HEPSİ CANLIDA:** ✅ Faz 0.1 panel ilk-giriş sözleşme kapısı ·
✅ Faz 1 (favicon+logo, panel takvimi bu hafta, mobil A-takım [zaten çalışıyordu], footer
adres/tel, "Bildirimleri Aç" durumu) · ✅ Faz 2.1 çerez bilgilendirme banner'ı + politika
hizalama · ✅ Faz 2.2 bülten aboneliği + pazarlama rızası (NewsletterSubscriber, çift opt-in) ·
✅ Faz 2.3 rıza sürüm kayması kapısı · ✅ Faz 2.4/A imha mekaniği (ödeme SetNull+snapshot,
User+dosya silme, silme audit).
**✅ Ek düzeltmeler (2026-07-18, canlı):** bayat-chunk crash otomatik-kurtarma (React #130 /
deploy sürüm-kayması → sessiz yenile; kullanıcı raporu) · mobil A-takım kartı iOS Safari 0×0
düzeltmesi (WebKit reprosu) · çerez politikası PROFESYONEL metin yazıldı.

**✅ KARARLAR ALINDI (🧑 2026-07-18):** Saklama süreleri — ödeme **10 yıl** · sağlık **derhal** ·
rıza kaydı **10 yıl** · başvuru **6-12 ay** · bülten (iptal sonrası) **3 yıl**. Rıza kaydı PII:
**ispat için TUT** (mevcut SetNull davranışı doğru). İYS: pazarlama GÖNDERİMİ için gerekli
(operasyonel, kod dışı) — rıza toplama tamam. → **Faz 2.4/B (otomatik periyodik imha) artık
KURULABİLİR.**

**✅ Faz 2.4/B TAMAM (canlı):** Ayarlar→"KVKK Saklama & İmha" paneli — kuru çalışma +
iki adımlı onay + `adminAuditLog` izi. Muafiyetler: dönüştürülmüş başvuru ve canlı bağlı
rıza asla silinmez. **FAZ 2 TAMAMEN BİTTİ.**

**✅ FAZ 3 TAMAM (canlı):** 3.1 fikstür fallback (yaklaşan maç yokken son 3 sonuç + puan
durumu yönlendirmesi; yan düzeltme: skorsuz bitmiş maç artık "0–0" uydurmuyor) · 3.2 örnek
rapor gerçek 9 teste bağlandı (tek kaynak `lib/performanceTests.ts`) · 3.3 header dropdown
animasyonu (kural globals.css'te tek yerde, yalnız opacity+transform, reduced-motion
destekli) · 3.4 tesislerde OpenStreetMap (Facility.latitude/longitude göçü + admin MapPicker).

**⏸ Bekleyen (⚖️ avukat):** `ConsentDocument.body` (5 sözleşme) nihai metinleri (taslak).
**⏭ Sıradaki — Faz 4 (kullanıcının 14 maddelik listesinin SON 3 kalemi):** 4.1 toplu/tekrarlı
takvim · 4.2 hatırlatma bildirimleri (2-3g + 1g) + gerçek mobil push · 4.3 header arama.
Ardından Faz 5 (cila/sertleştirme).

**Faz 0 — KVKK Kritik+Yüksek (gerçek kullanıcı öncesi ŞART)**
- **0.1 Giriş sözleşme modalı (L, 🤖):** sıfır-rızalı sporcu panele girince zorunlu
  sözleşmeleri (aşağı-kaydır-oku doğrulamalı) imzalatan SERVER-ENFORCED kapı; imzalanmadan
  panel açılmaz. Zorunlu belgeleri de toplayabilmeli (mevcut `/panel/izinler` toplayamıyor).
  Çözer: A1 panel kapısı yok · A2 `createAthlete` sıfır rıza · A3 `provisionAthleteLogin`
  sıfır rıza · A4 `/panel/performans` kapısız sağlık · A5 `/panel/profil` boy/kilo kapısız.
- **0.2 Silme/imha hakkı (M, 🤖):** `deleteAthlete` tam cascade + `Application` silme +
  öksüz `User` + yüklenen DOSYALARIN diskten silinmesi + silme denetim izi. (B1-B4)
  Karar: rıza kaydı saklama süresi (🧑/⚖️).

**Faz 1 — Hızlı düzeltmeler (S, 🤖):** 1.1 favicon+logo ayarı · 1.2 panel takvimi güncel
hafta · 1.3 mobil A-takım kartı · 1.4 footer adres/tel→ayarlar · 1.5 "Bildirimleri Aç"
buton durumu.

**Faz 2 — Tamamlayıcı KVKK:** 2.1 çerez onay popup'ı + politika metni hizalama (M, 🤖/⚖️,
=D3/C2) · 2.2 pazarlama rızası uygulama + bülten formu rıza (M, 🤖, =C1) · 2.3 rıza sürüm
kayması (M, 🤖, =C3) · 2.4 saklama/imha politikası (M, 🧑/⚖️ karar→🤖, =C4).

**Faz 3 — Ana sayfa + tesis haritası:** 3.1 fikstür fallback (puan/son-3-maç) (M) · 3.2
"NASIL ÇALIŞIYORUZ" örnek rapor→9 test (M, hissi🧑) · 3.3 header dropdown hover animasyonu
(M, perf-güvenli, hissi🧑) · 3.4 tesis OpenStreetMap (S; D1: CARTO IP politikaya).

**Faz 4 — Büyük özellikler:** 4.1 toplu takvim/haftalık tekrar (L) · 4.2 hatırlatma
bildirimleri (2-3g+1g) + GERÇEK mobil push (L, 🧑 cihaz testi; D2: gövdeye sağlık YAZMA;
bağımlı: 4.1+push altyapısı) · 4.3 header arama (L).

**Faz 5 — Düşük sertleştirme:** D4 public kadroya tam doğum tarihi→yıl · D5 rıza geri-alım
gerçek veli adı · D6/D7 rıza geçmişi+export · D8 4 noktada ham hata logu (`errLabel`).

**Zaten güvenli (denetim pozitif kontrolleri):** append-only rıza denetim izi + atomik
taşıma + başvuru zorunlu-rıza zorlaması; foto/sağlık fail-closed kapıları; bayat JWT bir
sonraki istekte kapanır; sağlık/ölçüm/ödeme sporcu silininde CASCADE ile imha; analytics/
tracker/pixel YOK; fontlar self-hosted; loglar çoğunlukla PII-güvenli (`errLabel`).

---

### A. Canlıya alma blokerleri (dış kaynak/karar gerektirir)
1. **Prod barındırma seçimi** — Türkiye'de bir sağlayıcı (Turkcell Bulut,
   Radore, Natro vb. — bkz DEPLOYMENT §3). `DATABASE_URL` + `AUTH_SECRET`.
2. **Alan adı + TLS** — `bucayildiz.com` alınması, DNS, Let's Encrypt/Caddy.
3. **KVKK metin onayı** — `ConsentDocument` gövdeleri şu an TASLAK; avukat
   yazıp onaylayınca yeni sürüm olarak güncellenir. VERBİS kaydı.
4. **Servis kimlikleri** — SMTP, S3 (object storage), prod VAPID anahtarları,
   (opsiyonel) SMS sağlayıcı.
5. **Gerçek içerik** — müşteriden sporcu listesi, fotoğraflar, kadro, metinler.

### B. Yarım kalan / geçici (placeholder) noktalar
- **Puan durumu** (`/fikstur/puan-durumu`) hâlâ `lib/data.ts`'teki sahte
  STANDINGS verisini kullanıyor → gerçek bir `Standing` modeli + admin girişi.
- **SMS-OTP entegrasyonu** — `lib/sms.ts` hazır; veli kimlik doğrulamasının
  başvuru/onay akışına "kapı" olarak eklenmesi sağlayıcı bağlanınca yapılacak.
- **Ana ekran ikonları** placeholder — müşteriden yüksek çözünürlüklü logo
  gelince `public/icons/*` değiştirilecek.
- **Header arka plan deseni** — denendi, beğenilmedi, geri alındı; ileride
  farklı bir yaklaşımla (daha silik / filigran / kulüp yıldızı) tekrar bakılacak.

### C. Panelde "Yakında" bölümler — ✅ TAMAMLANDI (2026-06-16)
- ✅ **Ödemeler** — `/panel/odemeler` (sporcu görünümü) + `/admin/odemeler`
  (aidat yönetimi); yeni `Payment` modeli.
- ✅ **Maçlar** — `/panel/maclar` (kulübün yaklaşan maçları + sonuçları).
- ✅ **Profil** — `/panel/profil` (bilgi görüntüleme + veli telefonu + şifre değiştirme).
  > Not: Fixture'a `teamId` ilişkisi yok; Maçlar kulüp geneli gösteriyor.
  > Takım-bazlı filtre ileride eklenebilir (admin fikstür formu + şema).

### Güvenlik/performans düzeltmeleri — ✅ TAMAMLANDI (2026-06-16)
A'dan Z'ye tarama sonrası tüm majör + minör bulgular giderildi: admin action
yetkilendirme (rol kontrolü), oturum fail-open varsayılanı, dosya yükleme
magic-byte doğrulaması, public içerik ISR (revalidate), URL whitelist, çift-submit
guard'ları, Modal/Drawer Escape+scroll-lock, erişilebilirlik, ölü kod temizliği.
typecheck/lint/build temiz.

### Performans ölçümleri — ✅ periyodik modele geçti (2026-06-16)
`PerformanceMeasurement` (tarihli, çok-kayıtlı). Admin `/admin/performans`'tan
periyodik ölçüm girer; geçmiş korunur. **Sıradaki fırsat:** biriken seriden
**raporlama** (sporcu gelişim grafikleri, takım/dönem karşılaştırmaları, dışa
aktarma) — artık veri buna hazır.

### E. Takvim Programı + Antrenman Yönetimi — ✅ TAMAMLANDI (2026-07-07)
Antrenman altyapısı yeniden kurgulandı (spec: `docs/superpowers/specs/2026-07-07-*`):
- **Responsive fikstür tabloları:** `/panel/maclar` (`MatchList`) ve `/admin/fikstur`
  (`FixturesView`) mobilde (≤560px) kaydırmasız kart görünümü.
- **Şema:** `Training.type` kaldırıldı → `scope` (team|individual) + `status`
  (planned|completed|cancelled|partial); yeni `TrainingDrill` (içerik maddeleri)
  ve `TrainingAttendance` (yoklama + sporcuya özel not) modelleri. Maçlar takvimde
  ayrı kayıt tutulmaz — `Fixture`'dan otomatik yansır.
- **`/admin/takvim-programi`** (eski "Antrenmanlar" sayfası): Program Türü
  (Takım/Bireysel/Maç), madde listesi, çok-seçimli sporcu; haftalık takvim +
  masaüstü hover popover / mobil bottom-sheet; fikstürden otomatik maç çipleri.
- **`/admin/antrenmanlar`** (yeni): durum yönetimi, madde kontrol listesi (tik),
  yoklama tablosu (Katıldı/Katılmadı/İzinli) + sporcu başına not.
- 13 commit, subagent-driven; her görevde spec+kalite incelemesi; typecheck +
  10/10 test temiz. **Sonraki faz:** sporcu panelinde antrenman detay görünürlüğü.

### F. Sporcu Takip Modülü (Beslenme + Mesaj/Doküman) — ✅ TAMAMLANDI (2026-07-07)
Antrenörün sporcuyu birebir izlediği sistemin ilk ayağı
(spec: `docs/superpowers/specs/2026-07-07-sporcu-takip-beslenme-design.md`):
- **Şema:** `NutritionPlan`/`NutritionMeal` (hedef makrolu öğün şablonu),
  `MealLog` (öğün+gün başına tek fotoğraflı günlük, gerçekleşen makrolar),
  `AthleteAssignment` (mesaj/doküman + okundu takibi).
- **Admin:** `/admin/beslenme` (plan editörü + gün gezinmeli günlük takip),
  `/admin/mesajlar` (toplu gönderim + okundu durumu).
- **Sporcu:** `/panel/beslenme` (öğün kartları, fotoğraf çek/yükle, gerçekleşen
  makrolar; **KVKK kapısı:** sağlık onayı yoksa günlük kapalı, program salt-okunur),
  `/panel/mesajlar` (okunmamış rozeti, açınca okundu).
- Güvenlik: sahiplik session'dan, upload URL'leri whitelist'li (`javascript:`
  engelli), tarih penceresi (−14/+1 gün), sporcu upload izni magic-byte korumalı.
- Uçtan uca Playwright ile doğrulandı; bütünsel inceleme: SHIP.
- **Sonraki fırsatlar:** antrenör rolü, beslenme uyum raporları, mesajlara
  push bildirimi tetikleyicisi, PDF doküman desteği (upload şu an yalnız görsel).

### D. İyileştirme fikirleri (öncelik sonrası)
- Push bildirim tetikleyicileri (yeni antrenman/maç otomatik bildirim)
- E-posta şablonlarının zenginleştirilmesi
- Analitik/erişilebilirlik geçişi, SEO meta iyileştirmeleri
- Test kapsamı (kritik akışlar: başvuru, giriş, onay)

---

## 🛠️ Çalışma notları (geliştirici)

- **Veritabanı (dev, bu makine — Windows):** native **PostgreSQL 18, port 5432**
  (Docker/5433 kullanılmıyor; Docker Desktop bu makinede bozuk).
  Bağlantı: `postgresql://bucayildiz:DEV_DB_PAROLA@127.0.0.1:5432/bucayildiz`.
  > Not: eski notlarda geçen "Homebrew :5433" macOS ortamına aittir; bu depo
  > artık Windows'ta 5432 üzerinde çalışıyor.
- **Komutlar:** `npm run dev` · `db:migrate` · `db:seed` · `db:deploy` ·
  `db:studio` · `build` · `typecheck`.
- **Admin giriş (dev):** admin@bucayildiz.com / BucaYildiz2026!
- **Sporcu giriş (dev):** arda.yilmaz / Sporcu2026!
- **Gizli dosyalar:** `.env` git'e girmez; şablonlar `.env.example` ve
  `.env.production.example`.
