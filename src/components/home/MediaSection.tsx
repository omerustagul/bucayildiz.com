import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "./SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

type Card = { id: string; title: string; kind: string; featured: boolean; coverUrl: string | null; categoryId: string | null };

function PhotoTile({ card }: { card: Card }) {
  return (
    <Link
      href={card.categoryId ? `/medya/kategori/${card.categoryId}` : "/medya/fotograflar"}
      style={{ position: "relative", display: "block", aspectRatio: "4 / 3", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--grad-navy)", textDecoration: "none" }}
    >
      {card.coverUrl ? (
        <Image src={card.coverUrl} alt={card.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 50vw, 240px" />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "rgba(255,255,255,0.08)" }}>
          <Icon name="image" size={30} />
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />
      <span style={{ position: "absolute", left: 12, bottom: 10, fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>{card.title}</span>
    </Link>
  );
}

export async function MediaSection() {
  const cards = (await prisma.homeMediaCard.findMany({ orderBy: { sort: "asc" } })) as Card[];
  if (cards.length === 0) return null;

  const featured = cards.find((c) => c.featured) ?? cards[0];
  // Kalan TÜM kartlar (artık 4 ile sınırlı değil) — hero altında yatay carousel.
  const rest = cards.filter((c) => c.id !== featured.id);
  const featuredHref = featured.categoryId
    ? `/medya/kategori/${featured.categoryId}`
    : featured.kind === "video" ? "/medya/videolar" : "/medya/fotograflar";

  return (
    <section style={{ background: "var(--surface-subtle)" }}>
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "38px clamp(16px, 5vw, 32px)" }}>
        <SectionHeading
          kicker="Medya"
          title="Görseller & Videolar"
          action={<Button as="a" href="/medya" variant="secondary" size="sm">Galeriye Git</Button>}
          style={{ marginBottom: 28 }}
        />

        {/* Öne çıkan — geniş hero (foto ise oynat düğmesi yok) */}
        <Link
          href={featuredHref}
          style={{ position: "relative", display: "block", borderRadius: "var(--radius-lg)", overflow: "hidden", minHeight: "clamp(240px, 38vw, 420px)", background: "var(--grad-navy)", textDecoration: "none", marginBottom: rest.length ? 16 : 0 }}
        >
          {featured.coverUrl && <Image src={featured.coverUrl} alt={featured.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 100vw, 1540px" />}
          {featured.kind === "video" && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <span style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--grad-gold)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-lg)" }}>
                <Icon name="play" size={30} style={{ color: "var(--navy-900)", fill: "var(--navy-900)" }} />
              </span>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />
          <div style={{ position: "absolute", left: 28, bottom: 24, right: 28 }}>
            <Badge tone="live" dot>Öne Çıkan</Badge>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(22px, 3vw, 30px)", textTransform: "uppercase", color: "#fff", margin: "12px 0 0", lineHeight: 1 }}>{featured.title}</h3>
          </div>
        </Link>

        {/* Kalan kartlar — yatay scroll-snap carousel; hepsi görünür, mobilde swipe */}
        {rest.length > 0 && (
          <div className="hp-media-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory" }}>
            {rest.map((c) => (
              <div key={c.id} style={{ flex: "0 0 auto", width: "clamp(200px, 66vw, 258px)", scrollSnapAlign: "start" }}>
                <PhotoTile card={c} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
