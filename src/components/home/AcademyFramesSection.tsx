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
  const photos = await prisma.mediaAsset.findMany({
    where: {
      kind: "photo",
      ...(settings.homeGalleryCategoryId ? { categoryId: settings.homeGalleryCategoryId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { id: true, url: true, createdAt: true, category: { select: { name: true } } },
  });
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
