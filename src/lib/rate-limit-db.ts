/** Cluster-güvenli, Postgres-backed rate limiter (sabit pencere) — NODE tarafı.
 *
 *  2+ PM2 instance ve restart'lar arasında TUTARLI sayım için paylaşılan DB kovası
 *  (RateLimitBucket) kullanır. Eski in-memory Map her worker'da AYRI sayıp cluster'da
 *  limiti ~2× gevşetiyor + her deploy sıfırlıyordu. Reverse-proxy (Nginx/Cloudflare)
 *  sınırlamasına EK savunma-derinliği katmanıdır — tek başına DDoS çözümü değildir.
 *
 *  DİKKAT: `@/lib/prisma` import eder → EDGE (middleware) İÇİN GÜVENLİ DEĞİL (Prisma
 *  edge runtime'da çalışmaz). Middleware'in kaba ön-filtresi edge-safe in-memory
 *  `@/lib/rate-limit`'i kullanmaya devam eder; asıl yetkili limitler (login/başvuru
 *  /iletişim/kariyer/upload/push) bu Node modülünü kullanır.
 *
 *  Atomiklik: tek `INSERT ... ON CONFLICT DO UPDATE ... RETURNING` ile artış/sıfırlama
 *  yarışsız yapılır (worker'lar aynı anda aynı key'e vursa bile tutarlı sayar).
 */
import { prisma } from "@/lib/prisma";

export type RateLimitResult = {
  /** true = izin ver; false = sınır aşıldı. */
  ok: boolean;
  /** Sınır aşıldıysa saniye cinsinden bekleme süresi (aksi halde 0). */
  retryAfter: number;
};

let lastSweep = 0;
/** Süresi dolmuş kovaları ara sıra (≥60sn'de bir) topluca sil — tablo şişmesin.
 *  Best-effort: hata/yokluk sessizce yutulur, rate-limit kararını ETKİLEMEZ. */
async function maybeSweep(now: number): Promise<void> {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  try {
    await prisma.$executeRaw`DELETE FROM "RateLimitBucket" WHERE "resetAt" < NOW()`;
  } catch {
    /* temizlik best-effort — başarısızlık önemli değil */
  }
}

/**
 * `key` (ör. "login:admin:1.2.3.4") için `windowMs` içinde en çok `limit` istek.
 * Cluster-güvenli: sayım paylaşılan Postgres kovasında (RateLimitBucket) tutulur.
 * DB erişilemezse FAIL-OPEN (isteği bloklamaz) — limiter savunma-derinliği katmanı;
 * DB arızasında meşru kullanıcıyı kilitlememek için (birincil koruma CF/Nginx'te).
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const now = Date.now();
  const resetAt = new Date(now + windowMs);
  void maybeSweep(now);
  try {
    // Pencere dolmuşsa (resetAt <= now) count=1 + resetAt yenilenir; değilse count++.
    const rows = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
      INSERT INTO "RateLimitBucket" ("key", "count", "resetAt")
      VALUES (${key}, 1, ${resetAt})
      ON CONFLICT ("key") DO UPDATE SET
        "count"   = CASE WHEN "RateLimitBucket"."resetAt" <= NOW() THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimitBucket"."resetAt" <= NOW() THEN ${resetAt} ELSE "RateLimitBucket"."resetAt" END
      RETURNING "count", "resetAt"
    `;
    const row = rows[0];
    if (row && Number(row.count) > limit) {
      return { ok: false, retryAfter: Math.max(1, Math.ceil((row.resetAt.getTime() - now) / 1000)) };
    }
    return { ok: true, retryAfter: 0 };
  } catch {
    return { ok: true, retryAfter: 0 }; // fail-open (DB erişilemez)
  }
}
