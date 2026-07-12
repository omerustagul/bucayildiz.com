import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { fmtTrDate } from "@/lib/publicData";
import { SectionHeading } from "./SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/** Buca Yıldız — Haberler section. Yayındaki haberlerden beslenir. */
export async function NewsSection() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 6,
    // Listede yalnız kart alanları — ağır `body`/`templateData` çekilmez (perf).
    select: { id: true, slug: true, title: true, excerpt: true, coverUrl: true, category: true, publishedAt: true, featured: true },
  });

  if (posts.length === 0) return null;

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const items = posts.filter((p) => p.id !== featured.id).slice(0, 3);

  return (
    <section style={{ background: "var(--surface-page)" }}>
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "38px clamp(16px, 5vw, 32px)" }}>
        <SectionHeading
          kicker="Blog Yazıları"
          title="Son Haberler"
          action={
            <Button as="a" href="/haberler" variant="secondary" size="sm">
              Tüm Haberler
            </Button>
          }
          style={{ marginBottom: 32 }}
        />
        <div className="hp-grid-2" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          {/* Featured */}
          <Link
            href={`/haberler/${featured.slug}`}
            style={{ position: "relative", display: "block", borderRadius: "var(--radius-lg)", overflow: "hidden", minHeight: 420, background: "var(--grad-navy)", border: "1px solid var(--navy-700)", textDecoration: "none" }}
          >
            {featured.coverUrl ? (
              <Image src={featured.coverUrl} alt="" fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 100vw, 760px" />
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "rgba(201,162,39,0.08)", fontFamily: "var(--font-heading)", fontSize: 200 }}>★</div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "var(--scrim-navy)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 32, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {featured.category && <Badge tone="gold">{featured.category}</Badge>}
                <Badge tone="on-navy">{fmtTrDate(featured.publishedAt)}</Badge>
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 36, lineHeight: 1, textTransform: "uppercase", color: "#fff", margin: 0, maxWidth: 540 }}>{featured.title}</h3>
              {featured.excerpt && <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--navy-100)", margin: 0, maxWidth: 520 }}>{featured.excerpt}</p>}
            </div>
          </Link>
          {/* Side list */}
          <div style={{ display: "grid", gridTemplateRows: "repeat(3, 1fr)", gap: 16 }}>
            {items.map((it) => (
              <Link
                key={it.id}
                href={`/haberler/${it.slug}`}
                style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 14, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden", textDecoration: "none" }}
              >
                <div style={{ position: "relative", background: "var(--grad-navy)", display: "grid", placeItems: "center", color: "rgba(255,255,255,0.10)", fontFamily: "var(--font-heading)", fontSize: 44 }}>
                  {it.coverUrl ? <Image src={it.coverUrl} alt="" fill style={{ objectFit: "cover" }} sizes="120px" /> : "BY"}
                </div>
                <div style={{ padding: "14px 14px 14px 0", display: "flex", flexDirection: "column", gap: 5, justifyContent: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)" }}>
                    {it.category || "Haber"} · {fmtTrDate(it.publishedAt)}
                  </span>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 18, lineHeight: 1.1, color: "var(--text-strong)", margin: 0 }}>{it.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
