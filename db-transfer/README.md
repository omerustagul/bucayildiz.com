# Dev Veritabanı Transferi

`bucayildiz-dev.dump` — geliştirme veritabanının anlık görüntüsü
(pg_dump custom format, 2026-07-07). Yeni makinede geliştirmeye kaldığın
yerden devam etmek içindir. **Üretim verisi değildir.**

## Yeni makinede kurulum

```bash
# 1) Bağımlılıklar
npm ci

# 2) .env oluştur (.env.example'ı kopyala; DATABASE_URL'i yerel Postgres'e göre ayarla)
#    Örn: postgresql://bucayildiz:DEV_DB_PAROLA@127.0.0.1:5432/bucayildiz?schema=public

# 3) Rol + boş veritabanı (psql ile, postgres süper kullanıcısıyla)
#    CREATE ROLE bucayildiz LOGIN PASSWORD 'DEV_DB_PAROLA' CREATEDB;
#    CREATE DATABASE bucayildiz OWNER bucayildiz;

# 4) Dump'ı geri yükle
pg_restore -d "postgresql://bucayildiz:DEV_DB_PAROLA@127.0.0.1:5432/bucayildiz" --clean --if-exists --no-owner db-transfer/bucayildiz-dev.dump

# 5) Prisma client + doğrulama
npm run db:generate
npx prisma migrate status   # "Database schema is up to date!" beklenir

# 6) Çalıştır
npm run dev
```

Alternatif (dump kullanmadan sıfırdan): `npm run db:migrate && npm run db:seed`.

> Not: `backups/` klasörü gitignore'dadır (yerel rotasyonlu yedekler);
> bu klasör yalnız makineler arası taşıma içindir. Üretime geçişte bu
> dosya repodan kaldırılabilir.
