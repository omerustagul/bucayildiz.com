/**
 * Trial hero arka plan görselleri (CSS url() değerleri).
 * - Masaüstü: 16:9 `heroImageUrl` (boşsa varsayılan yatay marka görseli).
 * - Mobil: 1:1 `heroMobileImageUrl`; SEÇİLMEMİŞSE masaüstü görseline, o da yoksa
 *   varsayılan kare görsele DÜŞER (boş duruma karşı güvenli fallback).
 */
export function heroImageVars(heroImageUrl?: string | null, heroMobileImageUrl?: string | null): { desktop: string; mobile: string } {
  const desktopSrc = heroImageUrl || "/brand/hero-trial.jpg";
  const mobileSrc = heroMobileImageUrl || heroImageUrl || "/brand/hero-trial-square.jpg";
  return {
    desktop: `url("${desktopSrc}")`,
    mobile: `url("${mobileSrc}")`,
  };
}
