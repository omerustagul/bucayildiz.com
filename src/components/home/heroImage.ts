/**
 * Trial hero arka plan görselleri (CSS url() değerleri).
 * - Masaüstü: 16:9 `heroImageUrl` (boşsa varsayılan yatay marka görseli).
 * - Mobil: 1:1 `heroMobileImageUrl`; SEÇİLMEMİŞSE masaüstü görseline, o da yoksa
 *   varsayılan kare görsele DÜŞER (boş duruma karşı güvenli fallback).
 */
/** Ham görsel URL'leri (CSS url() sarmalayıcısı olmadan) — LCP preload için.
 *  Fallback mantığı heroImageVars ile AYNI (tek kaynak). */
export function heroImageSrcs(heroImageUrl?: string | null, heroMobileImageUrl?: string | null): { desktop: string; mobile: string } {
  return {
    desktop: heroImageUrl || "/brand/hero-trial.jpg",
    mobile: heroMobileImageUrl || heroImageUrl || "/brand/hero-trial-square.jpg",
  };
}

export function heroImageVars(heroImageUrl?: string | null, heroMobileImageUrl?: string | null): { desktop: string; mobile: string } {
  const { desktop, mobile } = heroImageSrcs(heroImageUrl, heroMobileImageUrl);
  return {
    desktop: `url("${desktop}")`,
    mobile: `url("${mobile}")`,
  };
}
