import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { fmtTrDate } from "@/lib/publicData";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Haberler" };

export default async function HaberlerPage() {
  // Listede gövde (body) kullanılmıyor — sadece gerekli alanları çek (perf).
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: { id: true, slug: true, coverUrl: true, category: true, publishedAt: true, title: true, excerpt: true },
    take: 48,
  });

  return (
    <>
      <PageHero kicker="Kulüpten" title="Haberler" lead="Kulübümüzden son gelişmeler, maç sonuçları ve duyurular." breadcrumb={[{ label: "Haberler" }]} />
      <Section>
        {posts.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Henüz yayınlanmış haber yok.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/haberler/${p.slug}`}
                className="link-card"
                style={{ display: "flex", flexDirection: "column", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)", textDecoration: "none" }}
              >
                <div style={{ position: "relative", aspectRatio: "16 /9", background: "var(--grad-navy)", display: "grid", placeItems: "center" }}>
                  {p.coverUrl ? <Image src={p.coverUrl} alt="" fill style={{ objectFit: "cover" }} sizes="(max-width: 600px) 100vw, 360px" /> : <span style={{ color: "rgba(255,255,255,0.10)", fontFamily: "var(--font-heading)", fontSize: 72 }}>★</span>}
                </div>
                <div style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)" }}>
                    {p.category || "Haber"} · {fmtTrDate(p.publishedAt)}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 21, lineHeight: 1.1, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{p.title}</h3>
                  {p.excerpt && <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
