# Buca Yıldız — Canlıya Alma Rehberi (Adım Adım)

Mimari kararı: **Türkiye'de VPS** (uygulama + PostgreSQL + yüklenen dosyalar)
**+ Cloudflare önde** (DNS/CDN/WAF/TLS). Kişisel veri Cloudflare'de barınmaz.
Bu belge sıfırdan canlıya tüm adımları sırayla verir; teknik ayrıntılar için
`docs/DEPLOYMENT.md` yanınızda dursun.

Varsayımlar: Ubuntu 24.04 LTS VPS (min. 2 vCPU / 4 GB / 40 GB SSD), alan adı
`bucayildiz.com`, SSH erişimi. Komutlar root olmayan sudo'lu kullanıcıyla.

---

## 0. Satın alma / hesaplar (sen)

- [ ] TR veri merkezli VPS (öneriler DEPLOYMENT.md §3.1 — 2 vCPU/4 GB yeter)
- [ ] Alan adı (`bucayildiz.com`)
- [ ] Cloudflare hesabı (Free plan yeterli)
- [ ] SMTP hesabı (başvuru bildirimleri — kurumsal mail ya da TR sağlayıcı)

## 1. Sunucu temel güvenlik (10 dk)

```bash
# root ile ilk girişte
adduser deploy && usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy   # SSH anahtarını taşı

# deploy kullanıcısıyla devam
sudo apt update && sudo apt -y upgrade
sudo apt -y install ufw fail2ban unattended-upgrades git curl

# Güvenlik duvarı: yalnız SSH + HTTPS (80 yalnız certbot kullanılacaksa)
sudo ufw allow OpenSSH
sudo ufw allow 443/tcp
sudo ufw enable

# SSH sıkılaştırma: /etc/ssh/sshd_config → PasswordAuthentication no,
# PermitRootLogin no → sudo systemctl restart ssh
```

## 2. Node 20 + PostgreSQL (10 dk)

```bash
# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt -y install nodejs

# PostgreSQL 16 (Ubuntu 24.04 deposundan)
sudo apt -y install postgresql postgresql-contrib

# DB + kullanıcı (GÜÇLÜ ve benzersiz şifre üret: openssl rand -base64 24)
sudo -u postgres psql <<'SQL'
CREATE USER bucayildiz WITH PASSWORD 'BURAYA_GUCLU_SIFRE';
CREATE DATABASE bucayildiz OWNER bucayildiz;
SQL
```

PostgreSQL yalnız localhost dinler (varsayılan) — dışarı AÇMA.

## 3. Uygulama kurulumu (15 dk)

```bash
sudo mkdir -p /srv/bucayildiz && sudo chown deploy: /srv/bucayildiz
git clone https://github.com/omerustagul/bucayildiz.com.git /srv/bucayildiz
cd /srv/bucayildiz
npm ci
```

### 3.1. Ortam değişkenleri

```bash
cp .env.production.example .env
nano .env
```

Zorunlular:

| Değişken | Değer |
|---|---|
| `DATABASE_URL` | `postgresql://bucayildiz:SIFRE@127.0.0.1:5432/bucayildiz?schema=public` |
| `AUTH_SECRET` | `openssl rand -hex 32` çıktısı (dev'dekinden FARKLI, gizli) |
| `NODE_ENV` | `production` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | İlk admin (güçlü şifre — ilk girişten sonra bu satırları .env'den SİL) |

Servisler (boş bırakılırsa o servis sessizce kapalı kalır — sonradan doldurulabilir):

| Grup | Değişkenler |
|---|---|
| Web Push | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — üret: `node -e "console.log(require('web-push').generateVAPIDKeys())"` (PROD'a özel çift) |
| SMTP | `SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM`, `MAIL_TO_ADMIN` (admin panel Ayarlar → E-posta'dan da girilebilir) |
| S3 (ops.) | Boşsa yüklemeler `public/uploads`'a gider — bkz. §7 kalıcılık |
| SMS (ops.) | `SMS_API_URL/USER/KEY/SENDER` |

### 3.2. Veritabanı şeması + ilk veri

```bash
npm run db:deploy      # migration'ları uygular (migrate deploy)
npm run db:seed        # ilk admin + örnek yapı (yalnız boş DB'de doldurur)
node scripts/backfill-kadro.mjs   # teknik ekip/tesis statik içeriği (idempotent)
node scripts/backfill-puan.mjs    # puan durumu başlangıç satırları (idempotent)
```

### 3.3. Derle + süreç yöneticisi

```bash
npm run build
sudo npm i -g pm2
pm2 start npm --name bucayildiz -- start          # 127.0.0.1:3000
pm2 save && pm2 startup                           # açılışta otomatik başlat (çıkan komutu çalıştır)
```

Kontrol: `curl -I http://127.0.0.1:3000` → `200`.

## 4. Nginx + Cloudflare Origin sertifikası (15 dk)

```bash
sudo apt -y install nginx
```

Cloudflare panelinde: SSL/TLS → Origin Server → **Create Certificate**
(varsayılanlar, 15 yıl) → çıkan sertifikayı `/etc/ssl/cf-origin.pem`,
anahtarı `/etc/ssl/cf-origin.key` olarak kaydet (`chmod 600`).

`/etc/nginx/sites-available/bucayildiz`:

```nginx
server {
    listen 443 ssl http2;
    server_name bucayildiz.com www.bucayildiz.com;

    ssl_certificate     /etc/ssl/cf-origin.pem;
    ssl_certificate_key /etc/ssl/cf-origin.key;

    client_max_body_size 25m;                 # medya yüklemeleri

    # Gerçek ziyaretçi IP'si (KVKK denetim izleri IP kaydeder!)
    # Güncel liste: https://www.cloudflare.com/ips/ — tamamını ekleyin
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    real_ip_header CF-Connecting-IP;

    # Yüklenen medya doğrudan Nginx'ten (Node'u yormadan)
    location /uploads/ {
        alias /srv/bucayildiz/public/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/bucayildiz /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Origin'i kilitle: 443'ü yalnız Cloudflare IP'lerine aç (DEPLOYMENT.md §8.1/4 —
ufw ile aynı IP listesi; en son yap, önce her şeyin çalıştığını gör).

## 5. Cloudflare yapılandırması (15 dk)

1. Site ekle → `bucayildiz.com` → registrar'da NS kayıtlarını Cloudflare'e çevir.
2. **DNS**: `A bucayildiz.com → VPS_IP` ve `A www → VPS_IP`, ikisi de Proxied (turuncu).
3. **SSL/TLS** → mod: **Full (strict)**. Edge Certificates → Always Use HTTPS: On.
4. **Cache Rules**:
   - Bypass: URI Path starts with `/admin` OR `/panel` OR `/api` OR `/giris`
   - Eligible for cache: `/_next/static/*`, `/uploads/*`
5. **Security**: Bot Fight Mode On; Security Level Medium.
6. **Rate limiting** (Free'de 1 kural): URI Path `/admin/giris` VEYA `/giris`,
   10 istek/1 dk/IP → Block 10 dk.
7. Test: `https://bucayildiz.com` açılıyor, kilit simgesi Cloudflare sertifikalı.

## 6. Yedekleme (KVKK + iş sürekliliği)

```bash
sudo mkdir -p /var/backups/bucayildiz && sudo chown deploy: /var/backups/bucayildiz
crontab -e   # deploy kullanıcısına ekle:
```

```cron
# Her gece 03:15 DB + uploads yedeği; 14 gün rotasyon
15 3 * * * pg_dump -Fc "postgresql://bucayildiz:SIFRE@127.0.0.1:5432/bucayildiz" > /var/backups/bucayildiz/db_$(date +\%F).dump && find /var/backups/bucayildiz -name 'db_*.dump' -mtime +14 -delete
30 3 * * * tar czf /var/backups/bucayildiz/uploads_$(date +\%F).tgz -C /srv/bucayildiz/public uploads && find /var/backups/bucayildiz -name 'uploads_*.tgz' -mtime +14 -delete
```

Yedeklerin bir kopyasını sunucu DIŞINA da alın (TR'de kalmak şartıyla).

## 7. Canlı öncesi kontrol listesi

- [ ] `https://bucayildiz.com` ana sayfa + `/admin` + `/giris` açılıyor
- [ ] Admin'e girildi, **seed şifresi değiştirildi**, `.env`'den `SEED_ADMIN_*` silindi
- [ ] Ayarlar → Kulüp: logo, iletişim, sosyal medya hesapları dolduruldu
- [ ] Ayarlar → Görünüm: hero görseli + Akademiden Kareler kategorisi seçildi
- [ ] Medya: kategoriler oluşturuldu, gerçek fotoğraflar yüklendi
- [ ] Kadro/Tesisler/Puan Durumu gerçek verilerle güncellendi
- [ ] Başvuru formu test edildi (SMTP doluysa mail geldi)
- [ ] Sporcu paneli: sporcu hesabı açıldı, telefonda "Ana Ekrana Ekle" + push denendi
- [ ] **KVKK metinleri avukat onaylı sürümle değiştirildi** (ConsentDocument — canlı öncesi tek yasal zorunluluk)
- [ ] VERBİS kaydı süreci başlatıldı (özel nitelikli veri — hukuki)
- [ ] Yedek cron'u ilk çıktısını üretti
- [ ] Origin 443 yalnız Cloudflare IP'lerine kilitlendi

## 8. Güncelleme akışı (her yeni sürümde)

```bash
cd /srv/bucayildiz
git pull
npm ci                 # bağımlılık değiştiyse
npm run db:deploy      # yeni migration varsa (ÖNCE yedek: pg_dump)
npm run build
pm2 reload bucayildiz  # kesintisiz yeniden başlatma
```

## 9. Sorun giderme

| Belirti | Bak |
|---|---|
| 502 Bad Gateway | `pm2 logs bucayildiz` — uygulama ayakta mı; `.env` DATABASE_URL doğru mu |
| Giriş dönüyor/çerez tutmuyor | Cloudflare SSL modu **Full (strict)** mi (Flexible çerezleri bozar) |
| Admin değişikliği sitede görünmüyor | ISR 60 sn — bekle ya da ilgili action revalidate ediyor mu |
| Yükleme 413 | Nginx `client_max_body_size` |
| Push çalışmıyor | HTTPS + VAPID env'leri + iOS'ta yalnız kurulu PWA'da |
| Gerçek IP'ler hep Cloudflare | `set_real_ip_from` listesi eksik/bayat |
