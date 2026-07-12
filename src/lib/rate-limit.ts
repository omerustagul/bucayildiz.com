/** Basit, bağımlılıksız in-memory rate limiter (sabit pencere).
 *
 *  Tek örnekli (single-VPS) dağıtım için yeterli; birden çok örneğe/edge'e
 *  ölçeklenirse Redis/Upstash'e taşınmalı. Reverse-proxy (nginx/Cloudflare)
 *  seviyesindeki sınırlamaya EK bir savunma derinliği katmanıdır — tek başına
 *  DDoS çözümü değildir. `server-only` İÇERMEZ: middleware (edge) de kullanabilir.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

let lastSweep = 0;
/** Süresi dolmuş kovaları ara sıra temizle (bellek sızıntısını önler). */
function sweep(now: number): void {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
}

export type RateLimitResult = {
  /** true = izin ver; false = sınır aşıldı. */
  ok: boolean;
  /** Sınır aşıldıysa saniye cinsinden bekleme süresi (aksi halde 0). */
  retryAfter: number;
};

/**
 * `key` (ör. "login:1.2.3.4") için `windowMs` içinde en çok `limit` istek.
 * Aynı pencerede limit aşılırsa ok:false + retryAfter döner.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > limit) return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  return { ok: true, retryAfter: 0 };
}

/** Test yardımcısı — kovaları sıfırlar (üretim kodunda çağrılmaz). */
export function __resetRateLimit(): void {
  buckets.clear();
  lastSweep = 0;
}
