import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogView, type PostRow } from "@/components/admin/views/BlogView";

export const metadata: Metadata = { title: "Haberler / Blog" };

export default async function HaberlerPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return <BlogView posts={posts as PostRow[]} />;
}
