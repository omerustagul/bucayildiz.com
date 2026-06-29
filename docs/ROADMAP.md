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
- **PostgreSQL geçişi:** dev (yerel Homebrew :5433) + prod-hazır; migration'lar
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

### D. İyileştirme fikirleri (öncelik sonrası)
- Push bildirim tetikleyicileri (yeni antrenman/maç otomatik bildirim)
- E-posta şablonlarının zenginleştirilmesi
- Analitik/erişilebilirlik geçişi, SEO meta iyileştirmeleri
- Test kapsamı (kritik akışlar: başvuru, giriş, onay)

---

## 🛠️ Çalışma notları (geliştirici)

- **Veritabanı (dev):** Homebrew PostgreSQL 16, **port 5433** (5432'de başka
  bir Postgres var). Başlat: `brew services start postgresql@16`.
  Bağlantı: `postgresql://bucayildiz:bucayildiz_dev@127.0.0.1:5433/bucayildiz`.
- **Komutlar:** `npm run dev` · `db:migrate` · `db:seed` · `db:deploy` ·
  `db:studio` · `build` · `typecheck`.
- **Admin giriş (dev):** admin@bucayildiz.com / BucaYildiz2026!
- **Sporcu giriş (dev):** arda.yilmaz / Sporcu2026!
- **Gizli dosyalar:** `.env` git'e girmez; şablonlar `.env.example` ve
  `.env.production.example`.
