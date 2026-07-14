import "server-only";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { SEO_PAGES } from "@/lib/page-seo";

const DEFAULT_DESCRIPTION =
  "Buca Yıldız Futbol Akademisi — İzmir Buca'da disiplin, saygı ve takım ruhuyla genç yetenekleri geliştiren altyapı futbol akademisi.";

/**
 * Bir sayfanın NİHAİ metadata'sı (Madde 6): önce PageSeo override'ı (path'e bağlı),
 * yoksa mevcut varsayılan davranış korunur (regresyon yok):
 *   - Başlık: override varsa AYNEN (absolute); yoksa anasayfada site başlığı,
 *     diğer sayfalarda "Etiket — Kısa ad" (eski `title:"İletişim"` + layout şablonu
 *     davranışının aynısı). Etiket SEO_PAGES'ten path ile bulunur.
 *   - Açıklama/OG: override → SiteSetting site-geneli → sabit varsayılan.
 *
 * title `absolute` verilir; kök layout'un "%s — Buca Yıldız" şablonu tekrar
 * uygulanıp çift-marka olmaz. Sayfa: `export const generateMetadata = () => getPageMetadata("/path")`.
 */
export async function getPageMetadata(path: string): Promise<Metadata> {
  const [seo, s] = await Promise.all([
    prisma.pageSeo.findUnique({ where: { path } }).catch(() => null),
    getSettings(),
  ]);
  const short = s.clubShortName || "Buca Yıldız";
  const full = s.clubName || "Buca Yıldız Futbol Akademisi";
  const siteTitle = s.metaTitle?.trim() || full;
  const label = SEO_PAGES.find((p) => p.path === path)?.label ?? "";

  const defaultTitle = path === "/" || !label ? siteTitle : `${label} — ${short}`;
  const title = seo?.title?.trim() || defaultTitle;
  const description = seo?.description?.trim() || s.metaDescription?.trim() || DEFAULT_DESCRIPTION;
  const ogImage = seo?.ogImageUrl?.trim() || s.ogImageUrl?.trim() || undefined;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "tr_TR",
      siteName: full,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}
