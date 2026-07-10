/** Haber şablonlarına özgü yapılandırılmış veri (Post.templateData, JSON string).
 *  Admin sihirbazı (BlogView), sunucu eylemleri (haberler/actions.ts) ve site
 *  render'ı (haberler/[slug]) burayı paylaşır — tek doğruluk kaynağı. Dosyada
 *  "use client"/"use server" YOK, hem istemci hem sunucu tarafından içe
 *  aktarılabilir. */

export type GoalRow = { minute: string; player: string; team: "us" | "them" };

export type MacraporuData = {
  opponent: string;
  ourScore: string;
  oppScore: string;
  isHome: boolean;
  competition: string;
  matchDate: string; // "YYYY-MM-DD"
  goals: GoalRow[];
  gallery: string[]; // maç kareleri — görsel URL listesi
};

export type PhotoRow = { url: string; caption: string };
export type GaleriData = { photos: PhotoRow[] };

export type QaRow = { q: string; a: string };
export type RoportajData = { portraitUrl: string; quote: string; qa: QaRow[] };

export type DuyuruData = { contact: string };

/** Şablona göre boş/varsayılan yapılandırılmış veri. */
export function defaultTemplateData(template: string): Record<string, unknown> {
  switch (template) {
    case "macraporu":
      return { opponent: "", ourScore: "", oppScore: "", isHome: true, competition: "", matchDate: "", goals: [], gallery: [] } satisfies MacraporuData;
    case "galeri":
      return { photos: [] } satisfies GaleriData;
    case "roportaj":
      return { portraitUrl: "", quote: "", qa: [] } satisfies RoportajData;
    case "duyuru":
      return { contact: "" } satisfies DuyuruData;
    default:
      return {};
  }
}

/** Bozuk/eksik JSON'a dayanıklı ayrıştırma — hata durumunda varsayılana düşer. */
export function parseTemplateData(template: string, raw: string | null | undefined): Record<string, unknown> {
  const def = defaultTemplateData(template);
  if (!raw) return def;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return { ...def, ...(parsed as Record<string, unknown>) };
  } catch {
    // bozuk JSON — sessizce varsayılana düş
  }
  return def;
}
