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
