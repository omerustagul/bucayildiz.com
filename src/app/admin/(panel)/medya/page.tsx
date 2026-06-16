import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MediaView, type FolderNode, type AssetItem, type CategoryItem, type HomeCardItem } from "@/components/admin/views/MediaView";

export const metadata: Metadata = { title: "Medya Kütüphanesi" };

export default async function MedyaPage() {
  const [folders, assets, categories, cards] = await Promise.all([
    prisma.folder.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.mediaCategory.findMany({ orderBy: { sort: "asc" }, include: { _count: { select: { assets: true } } } }),
    prisma.homeMediaCard.findMany({ orderBy: { sort: "asc" } }),
  ]);

  const countByCat: Record<string, number> = {};
  for (const a of assets) if (a.categoryId) countByCat[a.categoryId] = (countByCat[a.categoryId] ?? 0) + 1;

  const folderNodes: FolderNode[] = folders.map((f) => ({ id: f.id, name: f.name, parentId: f.parentId }));
  const assetItems: AssetItem[] = assets.map((a) => ({ id: a.id, url: a.url, title: a.title, kind: a.kind, categoryId: a.categoryId, folderId: a.folderId }));
  const categoryItems: CategoryItem[] = categories.map((c) => ({ id: c.id, name: c.name, color: c.color, count: c._count.assets }));
  const cardItems: HomeCardItem[] = cards.map((c) => ({ id: c.id, title: c.title, categoryId: c.categoryId, kind: c.kind, featured: c.featured, coverUrl: c.coverUrl, count: c.categoryId ? countByCat[c.categoryId] ?? 0 : 0 }));

  return <MediaView folders={folderNodes} assets={assetItems} categories={categoryItems} cards={cardItems} />;
}
