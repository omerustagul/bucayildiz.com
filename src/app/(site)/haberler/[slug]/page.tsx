import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { fmtTrDate } from "@/lib/publicData";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findFirst({ where: { slug, status: "published" } });
  return { title: post ? post.title : "Haber" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({ where: { slug, status: "published" } });
  if (!post) notFound();

  const paragraphs = post.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <PageHero kicker={`${post.category || "Haber"} · ${fmtTrDate(post.publishedAt)}`} title={post.title} breadcrumb={[{ label: "Haberler", href: "/haberler" }, { label: post.category || "Haber" }]} />
      <Section>
        {post.coverUrl && (
          <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border-subtle)", marginBottom: 32, maxWidth: 880 }}>
            <Image src={post.coverUrl} alt={post.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 100vw, 880px" priority />
          </div>
        )}
        <Prose>
          {post.excerpt && <p style={{ fontWeight: 600, color: "var(--text-strong)" }}>{post.excerpt}</p>}
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </Prose>
        <div style={{ marginTop: 32 }}>
          <Button as="a" href="/haberler" variant="secondary" size="sm" leftIcon={<Icon name="arrow-left" size={15} />}>
            Tüm Haberler
          </Button>
        </div>
      </Section>
    </>
  );
}
