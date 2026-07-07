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
DATABASE_URL="postgresql://bucayildiz:bucayildiz_dev@127.0.0.1:5432/bucayildiz?schema=public"
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

## 5. Yedekleme (KVKK + iş sürekliliği)

```bash
# Günlük yedek (cron)
pg_dump -Fc -h DB_HOST -U bucayildiz bucayildiz > /yedek/bucayildiz_$(date +%F).dump
# Geri yükleme
pg_restore -h DB_HOST -U bucayildiz -d bucayildiz --clean /yedek/DOSYA.dump
```
Yedekler de **Türkiye'de** saklanmalı; en az 7 günlük rotasyon önerilir.

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

## 8. Alan adı + TLS (son ops adımı)

1. `bucayildiz.com` alan adını alın, DNS A/AAAA kaydını sunucu IP'sine yönlendirin.
2. Reverse proxy (Nginx/Caddy) + TLS:
   - **Caddy** otomatik Let's Encrypt: `bucayildiz.com { reverse_proxy 127.0.0.1:3000 }`
   - veya Nginx + `certbot --nginx -d bucayildiz.com -d www.bucayildiz.com`
3. `metadataBase` zaten `https://bucayildiz.com` (src/app/layout.tsx).
4. Push ve PWA "Ana Ekrana Ekle" yalnızca HTTPS'te tam çalışır.

## 9. KVKK — kalan (yazılım-dışı)

- Onay metinleri (`ConsentDocument.body`) şu an **taslak**; KVKK avukatı yazıp
  onaylayınca admin/seed üzerinden yeni sürüm olarak güncellenir.
- VERBİS kaydı (özel nitelikli veri) — hukuki süreç.
