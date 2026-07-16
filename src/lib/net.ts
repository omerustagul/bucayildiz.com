/** İstek ağ yardımcıları. `server-only` İÇERMEZ — middleware (edge) da kullanır. */

type HeaderGetter = { get(name: string): string | null };

/**
 * Güvenilir istemci IP'si. Üretim topolojisi (bkz. docs/DEPLOYMENT.md):
 * Cloudflare `CF-Connecting-IP` → nginx `X-Real-IP`. Bunlar proxy tarafından
 * set edilir ve istemci tarafından ezilemez. `X-Forwarded-For` yalnızca son
 * çare fallback'tir (istemci sahteleyebilir) — KVKK audit için tercih edilmez.
 */
export function clientIp(h: HeaderGetter): string | null {
  return (
    h.get("cf-connecting-ip")?.trim() ||
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null
  );
}

/**
 * CSRF SAVUNMA DERİNLİĞİ — çerezle yetkilendirilen POST route handler'ları için.
 * Tarayıcı, çapraz-origin bir POST'ta `Origin` başlığını ZORUNLU gönderir ve sayfa
 * JS'i bunu EZEMEZ → Origin varsa isteğin kendi host'uyla eşleşmelidir.
 *
 * Neden gerekli (çerezler zaten `sameSite: "lax"`): SameSite *SİTE* kapsamlıdır
 * (eTLD+1), origin değil → ele geçmiş/unutulmuş bir ALT ALAN (ör. eski bir vhost,
 * XSS'li bir subdomain) kurbanın çerezleriyle POST atabilir. Bu kontrol onu keser.
 * (Server Action'ları Next 16 kendi origin kontrolüyle korur; route handler'lar HARİÇ.)
 *
 * `Host` neden güvenilir: nginx `proxy_set_header Host $host` ile İSTEMCİNİN host'unu
 * geçirir; tarayıcı onu adres çubuğundaki URL'den türetir ve sayfadaki JS değiştiremez.
 * `X-Forwarded-Host` KULLANILMAZ: nginx onu SET ETMEZ → istemci uydurabilir; ona
 * güvenseydik saldırgan kendi Origin'ini "eşleştirip" kapıyı aşardı.
 *
 * Origin YOKSA `true`: tarayıcı-dışı istemciler (curl vb.) göndermez — ama onlarda
 * kurbanın çerezi de olmaz, yani CSRF değildir. Birincil savunma sameSite=lax'tır.
 */
export function isSameOrigin(h: HeaderGetter): boolean {
  const origin = h.get("origin");
  if (!origin) return true;
  const host = h.get("host"); // YALNIZ gerçek Host — bkz. X-Forwarded-Host notu
  if (!host) return false;
  try {
    return new URL(origin).host === host; // host = hostname + (varsa) port
  } catch {
    return false; // "null" / bozuk Origin → fail-closed
  }
}
