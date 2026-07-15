import { getPageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { MediaGallery, type GalleryAsset } from "@/components/content/MediaGallery";
import { fmtTrDateShort } from "@/lib/format";

export const generateMetadata = () => getPageMetadata("/medya/videolar");

/** Medya kütüphanesindeki TÜM videolar — tıklanınca tam ekranda oynatılır. */
export default async function VideolarPage() {
  const videos = await prisma.mediaAsset.findMany({
    where: { kind: "video" },
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, title: true, kind: true, createdAt: true, category: { select: { name: true } } },
    // P1: sınırsız sorgu koruması — en yeni 120 kayıt (veri büyürse OOM/yavaşlama önlenir)
    take: 120,
  });

  return (
    <>
      <PageHero kicker="Medya" title="Videolar" breadcrumb={[{ label: "Medya", href: "/medya" }, { label: "Videolar" }]} />
      <Section>
        {videos.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Henüz video eklenmedi.</p>
        ) : (
          <MediaGallery items={videos.map((a): GalleryAsset => ({ id: a.id, url: a.url, title: a.title, kind: a.kind, category: a.category?.name ?? null, date: fmtTrDateShort(a.createdAt) }))} />
        )}
      </Section>
    </>
  );
}
