import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogView, type PostRow } from "@/components/admin/views/BlogView";

export const metadata: Metadata = { title: "Haberler / Blog" };

export default async function HaberlerPage() {
  await requirePermission("haberler.view");
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return <BlogView posts={posts as PostRow[]} />;
}
