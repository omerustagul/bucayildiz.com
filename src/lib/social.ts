/** Sosyal medya platform kataloğu + bağlantı yardımcıları.
 *  İstemci-güvenli (server-only içermez) — SettingsForm ve site header/footer
 *  aynı kaynağı kullanır. Bağlantılar SiteSetting.socialLinks alanında
 *  JSON dizi olarak saklanır: [{ platform, url }]. */

export type SocialLink = { platform: string; url: string };

export const SOCIAL_PLATFORMS: { id: string; label: string; placeholder: string }[] = [
  { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/kullanici" },
  { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/sayfa" },
  { id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@kanal" },
  { id: "x", label: "X (Twitter)", placeholder: "https://x.com/kullanici" },
  { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@kullanici" },
  { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/kulup" },
  { id: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/905xxxxxxxxx" },
  { id: "telegram", label: "Telegram", placeholder: "https://t.me/kanal" },
];

export function platformLabel(id: string): string {
  return SOCIAL_PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

/** JSON alanını güvenle çözer; bozuksa boş liste döner. */
export function parseSocialLinks(json: string | null | undefined): SocialLink[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    // Boş URL SÜZÜLMEZ: form state'inde yeni eklenen satır URL yazılana dek
    // yaşamalı. Boşları eleme işi kayıtta (sanitize) ve site gösteriminde yapılır.
    return arr
      .filter((x): x is SocialLink => x && typeof x.platform === "string" && typeof x.url === "string")
      .filter((x) => SOCIAL_PLATFORMS.some((p) => p.id === x.platform));
  } catch {
    return [];
  }
}

/** Ayarlardan sosyal bağlantıları çıkarır; socialLinks boşsa eski dört
 *  sütundan (instagram/facebook/youtube/x) geriye dönük üretir. */
export function resolveSocialLinks(s: {
  socialLinks?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  xUrl?: string | null;
}): SocialLink[] {
  const parsed = parseSocialLinks(s.socialLinks).filter((l) => l.url.trim() !== "");
  if (parsed.length > 0) return parsed;
  const legacy: SocialLink[] = [];
  if (s.instagramUrl) legacy.push({ platform: "instagram", url: s.instagramUrl });
  if (s.facebookUrl) legacy.push({ platform: "facebook", url: s.facebookUrl });
  if (s.youtubeUrl) legacy.push({ platform: "youtube", url: s.youtubeUrl });
  if (s.xUrl) legacy.push({ platform: "x", url: s.xUrl });
  return legacy;
}
