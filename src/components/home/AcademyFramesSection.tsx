import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FramesStrip } from "@/components/home/FramesStrip";
import { fmtTrDateShort } from "@/lib/format";

/** Ana sayfa "Akademiden Kareler" — medya kütüphanesinden fotoğraf şeridi.
 *  Ayarlardaki homeGalleryCategoryId doluysa yalnız o kategorinin medyası,
 *  boşsa kütüphanedeki son fotoğraflar gösterilir. */
export async function AcademyFramesSection() {
  const settings = await getSettings();
  const featuredUrl = settings.homeGalleryFeaturedUrl;
  const catFilter = settings.homeGalleryCategoryId ? { categoryId: settings.homeGalleryCategoryId } : {};
  const select = { id: true, url: true, createdAt: true, category: { select: { name: true } } };
  // Seçilen öne çıkan görsel HER ZAMAN ilk sırada gösterilir (varsa); gerisi
  // kategorinin son fotoğrafları — öne çıkan tekilleştirilir (dup yok).
  const featured = featuredUrl ? await prisma.mediaAsset.findFirst({ where: { url: featuredUrl }, select }) : null;
  const rest = await prisma.mediaAsset.findMany({
    where: { kind: "photo", ...catFilter, ...(featured ? { url: { not: featuredUrl! } } : {}) },
    orderBy: { createdAt: "desc" },
    take: featured ? 5 : 6,
    select,
  });
  const photos = featured ? [featured, ...rest] : rest;
  if (photos.length === 0) return null;
  // "Tüm Galeri" seçili kategorinin sayfasına gider; kategori yoksa fotoğraflara
  const galleryHref = settings.homeGalleryCategoryId
    ? `/medya/kategori/${settings.homeGalleryCategoryId}`
    : "/medya/fotograflar";

  return (
    <section style={{ background: "var(--surface-page)" }}>
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "38px clamp(16px, 5vw, 32px)" }}>
        <SectionHeading kicker="Galeri" title="Akademiden Kareler" action={<Button as="a" href={galleryHref} variant="secondary" size="sm">Tüm Galeri</Button>} />
        <FramesStrip photos={photos.map((p) => ({ id: p.id, url: p.url, kind: "photo", title: [p.category?.name, fmtTrDateShort(p.createdAt)].filter(Boolean).join(" · ") }))} />
      </div>
    </section>
  );
}
