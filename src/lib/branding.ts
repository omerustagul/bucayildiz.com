/** Marka görselleri — tek kaynak. Ayarlardan (SiteSetting.logoUrl) özel logo
 *  seçilmişse o, seçilmemişse varsayılan kulüp arması kullanılır.
 *  İstemci-güvenli (server-only içermez). */

export const DEFAULT_LOGO = "/brand/logo_color.webp";

/** Ayarlardaki logo varsa onu, yoksa varsayılanı döndürür. */
export function logoSrc(logoUrl?: string | null): string {
  return logoUrl && logoUrl.trim() !== "" ? logoUrl : DEFAULT_LOGO;
}
