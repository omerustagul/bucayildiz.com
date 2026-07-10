import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { MediaGallery, type GalleryAsset } from "@/components/content/MediaGallery";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const category = await prisma.mediaCategory.findUnique({ where: { id } });
  return { title: category ? category.name : "Medya Kategorisi" };
}

export default async function MediaCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.mediaCategory.findUnique({ where: { id } });
  if (!category) notFound();

  const assets = await prisma.mediaAsset.findMany({ where: { categoryId: id }, orderBy: { createdAt: "desc" } });
  const items: GalleryAsset[] = assets.map((a) => ({ id: a.id, url: a.url, title: a.title, kind: a.kind }));

  return (
    <>
      <PageHero kicker="Medya" title={category.name} breadcrumb={[{ label: "Medya", href: "/medya" }, { label: category.name }]} />
      <Section>
        {items.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Bu kategoride henüz medya bulunmuyor.</p>
        ) : (
          <MediaGallery items={items} />
        )}
      </Section>
    </>
  );
}
