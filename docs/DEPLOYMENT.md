# Buca Yıldız — Dağıtım & Üretim Rehberi (Faz 4)

Bu belge siteyi **Türkiye'de barındırılan PostgreSQL** ile canlıya almak için
gereken adımları içerir. KVKK gereği veritabanı ve yedekler Türkiye'de tutulur.

---

## 1. Mimari özet

- **Uygulama:** Next.js 16 (Node.js 20+ çalışma zamanı)
- **Veritabanı:** PostgreSQL (dev: bu makinede native PG18 `:5432`, prod: Türkiye)
- **ORM:** Prisma 6 — şema tek (`prisma/schema.prisma`), migration'lar
  `prisma/migrations/` altında sürümlenir.
- **Dosya yükleme:** Şu an yerel disk (`public/uploads`). Prod'da Türkiye'deki
  bir nesne depolama (S3 uyumlu) veya kalıcı disk ile değiştirilmeli
  (`src/lib/storage.ts` tek nokta).

---

## 2. Yerel geliştirme (dev)

Bu makinede (Windows) PostgreSQL 18 **native** olarak **5432** portunda çalışır
(Docker/5433 kullanılmıyor — Docker Desktop bu makinede bozuk).

```bash
# Bağlantı testi (PG18 bin dizini PATH'te ise)
pg_isready -h 127.0.0.1 -p 5432

# Şema + örnek veri
npm run db:migrate     # bekleyen migration'ları uygular
npm run db:seed        # admin + takım + sporcu örnek verisi
npm run dev            # http://localhost:3000
```

Dev veritabanı bağlantısı (`.env`):
```
DATABASE_URL="postgresql://bucayildiz:DEV_DB_PAROLA@127.0.0.1:5432/bucayildiz?schema=public"
```

> Not: eski dokümanlardaki "Homebrew :5433" macOS ortamına aitti; artık geçerli değil.

Faydalı komutlar:
| Komut | İş |
|---|---|
| `npm run db:migrate` | Yeni migration üret + uygula (dev) |
| `npm run db:deploy`  | Mevcut migration'ları uygula (prod) |
| `npm run db:seed`    | Örnek/ilk veriyi yükle |
| `npm run db:studio`  | Tarayıcıda veri görüntüleyici (Prisma Studio) |
| `npm run db:generate`| Prisma Client'ı yeniden üret |

---

## 3. Üretim veritabanı (Türkiye)

### 3.1. Sağlayıcı seçenekleri (KVKK — TR veri merkezi)
Aşağıdakilerin tümü Türkiye'de veri merkezine sahiptir. Yönetilen PostgreSQL
veya üzerinde Postgres kuracağınız bir sunucu/VPS sunarlar:

- **Turkcell Bulut / GiSP** — kurumsal, KVKK/ISO sertifikalı
- **Türk Telekom Bulut**
- **Radore, Veriteknik, DorukNet** — TR datacenter, VPS/sunucu
- **Natro, Turhost, İsimtescil, Hostzone** — paylaşımlı/VPS, kolay başlangıç

> Öneri: Başlangıç için TR veri merkezinde bir **VPS** (2 vCPU / 4 GB) üzerinde
> PostgreSQL + uygulamayı birlikte çalıştırmak en ekonomik ve kontrollü yoldur.
> Trafik artınca DB ayrı sunucuya alınır.

### 3.2. Üretim PostgreSQL kurulumu (VPS örneği, Ubuntu)
```bash
sudo apt update && sudo apt install -y postgresql-16
sudo -u postgres psql <<'SQL'
CREATE ROLE bucayildiz LOGIN PASSWORD 'GUCLU_PAROLA';
CREATE DATABASE bucayildiz OWNER bucayildiz;
SQL
# Uzak bağlantı gerekiyorsa pg_hba.conf + postgresql.conf'ta TLS açın.
```

### 3.3. Bağlantı dizesi
`.env` (veya hosting paneli) içinde:
```
DATABASE_URL="postgresql://bucayildiz:GUCLU_PAROLA@DB_HOST:5432/bucayildiz?schema=public&sslmode=require"
```
`.env.production.example` dosyasını şablon olarak kullanın.

---

## 4. Dağıtım adımları

```bash
# 1) Bağımlılıklar
npm ci

# 2) Prisma Client + migration'ları uygula (prod)
npm run db:generate
npm run db:deploy           # prisma migrate deploy — yeni şemayı kurar

# 3) İlk kurulumda örnek/ilk admin (yalnızca bir kez)
npm run db:seed

# 4) Derle ve başlat
npm run build
npm run start               # PORT=3000 (reverse proxy arkasında)
```

Önerilen çalıştırma:
- **systemd servisi** veya **PM2** ile `npm run start` süreklilik.
- Önünde **Nginx/Caddy** reverse proxy + **TLS** (Let's Encrypt veya TR SSL).
- `AUTH_SECRET` = `openssl rand -hex 32` (her ortamda farklı, gizli).

---

## 5. Yedekleme + izleme (KVKK + iş sürekliliği + felaket kurtarma)

**Katmanlar:** (1) her migration ÖNCESİ otomatik `pg_dump` (deploy.sh) · (2) günlük
off-site yedek (cron) · (3) saatlik sağlık kontrolü + e-posta uyarı · (4) owner-only
`/admin/sistem` paneli (son yedekler, disk/DB durumu, indirme).

### Off-site yedek (KRİTİK — sunucu-dışı kopya)
Yerel yedekler VPS diskinde; sunucu/disk kaybında DB ile birlikte giderler. Bu yüzden
**S3-uyumlu bir kovaya** off-site kopya şart. Env boşsa yalnız yerel yedek alınır (sessiz
devre dışı) — bu durumda `/admin/sistem` sarı uyarı gösterir.

**`.env.production`'a eklenecek (değerleri SEN gir, git'e commit ETME):**
```
BACKUP_S3_BUCKET=bucayildiz-yedek          # ayrı, PRIVATE kova (app storage'dan farklı)
BACKUP_S3_ENDPOINT=https://s3.<sağlayıcı>  # Backblaze B2 / iDrive e2 / Wasabi vb.
BACKUP_S3_REGION=<bölge>
BACKUP_S3_ACCESS_KEY_ID=***
BACKUP_S3_SECRET_ACCESS_KEY=***
```
> Kova AYRI ve PRIVATE olmalı (uploads kovasıyla karıştırma; yedekler herkese açık olamaz).
> Sağlayıcıda "object lock / versioning" açmak fidye yazılımına karşı ekstra koruma verir.

### Cron (sunucuda, `crontab -e`)
Sırlar crontab'da tutulmaz — script'ler `.env.production`'ı kendisi okur.
```bash
# Günlük off-site yedek — 03:30
30 3 * * * cd /var/www/bucayildiz.com && /usr/bin/node --env-file=.env.production scripts/backup-offsite.mjs >> /var/log/bucayildiz-backup.log 2>&1
# Saatlik sağlık kontrolü (disk/DB/yedek tazeliği/PM2) — sorunda e-posta
0 * * * * cd /var/www/bucayildiz.com && /usr/bin/node --env-file=.env.production scripts/health-check.mjs >> /var/log/bucayildiz-health.log 2>&1
```
(`npm run backup:offsite` / `npm run health:check` elle çalıştırma için.)

### Geri yükleme
```bash
pg_restore -d "$DATABASE_URL" --clean --no-owner backups/bucayildiz_TARIH.dump
# off-site'tan: önce S3'ten .dump indir (veya /admin/sistem → İndir), sonra üstteki komut.
```
Yedekler **Türkiye'de / KVKK-uyumlu** sağlayıcıda saklanmalı. Sağlık uyarıları için
Ayarlar → E-posta (SMTP) dolu olmalı; alarm `mailToAdmin`'e gider.

---

## 6. Canlı öncesi kontrol listesi

- [ ] `DATABASE_URL` Türkiye'deki Postgres'e işaret ediyor (`sslmode=require`)
- [ ] `AUTH_SECRET` güçlü ve gizli (dev değeri DEĞİL)
- [ ] `prisma migrate deploy` sorunsuz çalıştı
- [ ] İlk admin parolası güçlü; seed sonrası `SEED_ADMIN_*` kaldırıldı
- [ ] Dosya yükleme kalıcı depolamaya bağlandı (`src/lib/storage.ts`)
- [ ] Alan adı `bucayildiz.com` + TLS sertifikası
- [ ] KVKK metinleri (aydınlatma + açık rıza + foto/video izni) avukat onaylı
- [ ] Günlük yedekleme cron'u aktif (TR'de)
- [ ] Web Push VAPID anahtarları üretildi (prod'a özel) + `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- [ ] SMTP ayarları dolduruldu (başvuru bildirimleri)
- [ ] S3 depolama bağlandı (kalıcı görseller)
- [ ] SMS sağlayıcı (veli OTP) — opsiyonel, hukuki tercihe göre

---

## 7. Servis yapılandırması (env ile aktifleşir)

Aşağıdaki servisler KODDA HAZIR; ilgili env değişkenleri boşken sessizce
devre dışı kalır, doldurulunca aktifleşir. Tümü `.env.production.example`'da.

### 7.1. E-posta (SMTP) — başvuru bildirimleri
`SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM`, `MAIL_TO_ADMIN` doldurulunca: yeni
başvuruda yöneticiye bildirim + (veli e-postası varsa) teşekkür maili. Boşsa
başvuru yine kaydedilir, mail atlanır.

### 7.2. Web Push (bildirimler)
PROD için yeni VAPID anahtarları üretin:
```bash
node -e "console.log(require('web-push').generateVAPIDKeys())"
```
`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` ve
`NEXT_PUBLIC_VAPID_PUBLIC_KEY` (public ile aynı). Sporcu paneli → "Bildirimleri
Aç"; yönetici → **Bildirimler** sayfasından takıma/herkese gönderir.
> iOS: yalnızca "Ana Ekrana Ekle" ile kurulu PWA'da çalışır + **HTTPS şart**.
> KVKK: bildirim gövdesine sağlık/performans verisi yazılmaz.

### 7.3. Dosya depolama (S3-uyumlu, Türkiye)
`S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` (+ `S3_ENDPOINT`,
`S3_REGION`, `S3_PUBLIC_BASE_URL`) doldurulunca yüklemeler object storage'a
gider; boşsa yerel disk (`public/uploads`). Turkcell Object Storage / MinIO uyumlu.

### 7.4. SMS (veli OTP + bildirim)
`SMS_API_URL/USER/KEY/SENDER` — Netgsm vb. TR sağlayıcı. `lib/sms.ts` hazır
(`sendSms`, `sendOtpSms`, `generateOtp`). **Not:** OTP'nin başvuru/onay akışına
kapı olarak eklenmesi sağlayıcı bağlanınca yapılacak son entegrasyondur.

## 8. Alan adı + TLS + Cloudflare (son ops adımı)

**Karar (2026-07-10):** Üretim mimarisi = **TR VPS + Cloudflare önde**.
Backend, PostgreSQL ve yüklenen dosyalar Türkiye'deki VPS'te kalır (KVKK);
Cloudflare yalnız DNS/CDN/WAF/TLS katmanı olarak önde durur. Kişisel veri
Cloudflare'de BARINMAZ (yalnız geçer — proxy). Tam-Cloudflare (Workers/D1/R2)
bilinçli olarak reddedildi: sağlık verisi yurt dışında barınamaz + ciddi rework.

### 8.1. Sunucu tarafı (origin)

1. VPS'te uygulama `127.0.0.1:3000` (PM2/systemd), önünde Nginx/Caddy.
2. TLS: **Cloudflare Origin Certificate** üret (SSL/TLS → Origin Server →
   Create Certificate, 15 yıl) ve Nginx'e kur — Let's Encrypt yenileme derdi olmaz.
   Alternatif: certbot (o zaman 80 portu ACME için açık kalmalı).
3. Nginx'te gerçek ziyaretçi IP'si (KVKK denetim izleri IP kaydeder!):
   ```nginx
   # Cloudflare IP aralıkları: https://www.cloudflare.com/ips/
   set_real_ip_from 173.245.48.0/20;  # (tüm CF aralıklarını ekleyin)
   real_ip_header CF-Connecting-IP;
   ```
4. Güvenlik: origin'e yalnız Cloudflare IP'lerinden 443 kabul et (ufw/iptables) —
   Cloudflare'i atlayıp origin'e doğrudan erişim kapansın.

### 8.2. Cloudflare tarafı

1. `bucayildiz.com`'u Cloudflare'e ekle (Free plan yeterli başlangıç için),
   NS kayıtlarını registrar'da Cloudflare'e çevir.
2. DNS: `A bucayildiz.com → VPS_IP` ve `A www → VPS_IP`, ikisi de **Proxied** (turuncu bulut).
3. SSL/TLS modu: **Full (strict)** (origin sertifikası kuruluysa). Asla "Flexible" değil.
4. Hız: Speed → Optimization varsayılanları; Caching → Browser Cache TTL "Respect
   Existing Headers" (Next `_next/static` zaten immutable başlık gönderir).
5. **Cache Rules:**
   - `/_next/static/*` ve `/uploads/*` → Eligible for cache (statik varlıklar CDN'den)
   - `/admin/*`, `/panel/*`, `/api/*`, `/giris*` → **Bypass cache** (oturumlu içerik)
6. **WAF / güvenlik:**
   - Managed Rules (Free'de temel set) + Bot Fight Mode açık
   - Rate limiting: `/admin/giris`, `/giris`, `/api/upload` için (örn. 10 istek/dk/IP)
   - Security Level: Medium; Challenge Passage: 30 dk
7. HTTPS zorlaması: Always Use HTTPS + HSTS (alt alanlar dahil etmeden başla).

### 8.3. Uygulama notları

- Oturum çerezleri (`by_admin_session`, `by_panel_session`) httpOnly+secure —
  Cloudflare proxy'sinden etkilenmez.
- `metadataBase` zaten `https://bucayildiz.com` (src/app/layout.tsx).
- Push ve PWA "Ana Ekrana Ekle" yalnızca HTTPS'te tam çalışır — CF ile hazır.
- Web Push endpoint'leri (`/api/push/*`) cache bypass listesinde olmalı (üstte var).

## 9. KVKK — kalan (yazılım-dışı)

- Onay metinleri (`ConsentDocument.body`) şu an **taslak**; KVKK avukatı yazıp
  onaylayınca admin/seed üzerinden yeni sürüm olarak güncellenir.
- VERBİS kaydı (özel nitelikli veri) — hukuki süreç.

## 10. Web Push (VAPID)

```bash
cd /var/www/bucayildiz.com
npm run vapid:check        # mevcut yapılandırmayı DOĞRULAR (hiçbir şey değiştirmez)
npm run vapid:generate     # yalnız check başarısızsa: yeni çift üretir + yazar
```

`vapid:check` beş şeyi doğrular: iki public'in biçimi (**87 karakter, `B` ile
başlar**), istemci==sunucu public eşitliği, private uzunluğu (43) ve **private'ın
o public'i türetmesi** (çift tutarlılığı). Değerler asla ekrana basılmaz.

> ⚠️ **HANGİ DOSYA — en sık tuzak.** Next.js üretimde şu öncelikle okur:
> `.env.production.local` > `.env.local` > **`.env.production`** > `.env`.
> Bu sunucuda **`.env.production` vardır** → `.env`'e yazmak **hiçbir şeyi
> değiştirmez**. Araç en yüksek öncelikli dosyayı otomatik hedefler.

> ⚠️ **Ayrıştırma tuzağı.** `.env.production` satırlarında değerden sonra **inline
> yorum** olabilir (`KEY="deger"  # açıklama`). Naif `cut -d= -f2-` yorumu değere
> katar → geçerli 87 karakterlik anahtar "143 karakter geçersiz" görünür.
> 2026-07-18'de tam bu yanlış teşhise yol açtı; `vapid:check` doğru ayrıştırır.

> ⚠️ **Env-only değişiklik build gerektirir.** `NEXT_PUBLIC_*` **derleme anında**
> gömülür; yalnız env'i değiştirmek istemciyi güncellemez. Ayrıca `deploy.sh`,
> `HEAD == origin/main` ise "Zaten güncel" deyip **build'i atlar** → env
> değişikliğinden sonra yeni bir commit push'layıp deploy edin.

> ⚠️ **Env-only değişiklik build gerektirir.** `NEXT_PUBLIC_*` değişkenleri
> **derleme anında** gömülür; yalnız `.env`'i değiştirmek istemciyi güncellemez.
> Ayrıca `deploy.sh`, `HEAD == origin/main` ise "Zaten güncel" deyip **build'i
> atlar** → env değişikliğinden sonra yeni bir commit push'layıp deploy edin
> (veya sunucuda build+reload'u elle çalıştırın).

> ⚠️ Anahtar **değiştirmek** mevcut abonelikleri geçersiz kılar; kullanıcılar
> bildirimi yeniden açar (eski endpoint'ler gönderimde 410 alıp temizlenir).

**iOS:** Web Push iPhone/iPad'de **yalnızca "Ana Ekrana Ekle" ile kurulmuş PWA'da**
çalışır (Apple kısıtı). Safari sekmesinde API'ler var görünür ama `subscribe()`
patlar — panel bu durumda butonu gizleyip kurulum yönergesi gösterir.

**Masaüstü (Chrome/Edge/Firefox):** anahtar geçerliyse çalışır; kullanıcı tarayıcının
izin penceresinde **"İzin Ver"** demelidir. Reddedilir/kapatılırsa panel "İzin
verilmedi…" der (hata değil, kullanıcı eylemi). Chrome izin isteğini birkaç kez
kapatan kullanıcıya sessiz moda alabilir → site ayarlarından elle açılmalıdır.
