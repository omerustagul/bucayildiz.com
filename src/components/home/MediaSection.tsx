import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "./SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

type Card = { id: string; title: string; kind: string; featured: boolean; coverUrl: string | null };

function PhotoTile({ card }: { card: Card }) {
  return (
    <Link
      href="/medya/fotograflar"
      style={{ position: "relative", display: "block", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--grad-navy)", border: "1px solid var(--navy-700)", textDecoration: "none" }}
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
  const photos = cards.filter((c) => c.id !== featured.id).slice(0, 4);

  return (
    <section style={{ background: "var(--surface-subtle)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 32px" }}>
        <SectionHeading
          kicker="Medya"
          title="Görseller & Videolar"
          action={<Button as="a" href="/medya" variant="secondary" size="sm">Galeriye Git</Button>}
          style={{ marginBottom: 32 }}
        />
        <div className="hp-grid-2" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          {/* Featured */}
          <Link
            href="/medya/videolar"
            style={{ position: "relative", display: "block", borderRadius: "var(--radius-lg)", overflow: "hidden", minHeight: 360, background: "var(--grad-navy)", border: "1px solid var(--navy-700)", textDecoration: "none" }}
          >
            {featured.coverUrl && <Image src={featured.coverUrl} alt={featured.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 100vw, 760px" />}
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <span style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--grad-gold)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-lg)" }}>
                <Icon name="play" size={30} style={{ color: "var(--navy-900)", fill: "var(--navy-900)" }} />
              </span>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />
            <div style={{ position: "absolute", left: 28, bottom: 24, right: 28 }}>
              <Badge tone="live" dot>Öne Çıkan</Badge>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 28, textTransform: "uppercase", color: "#fff", margin: "12px 0 0", lineHeight: 1 }}>{featured.title}</h3>
            </div>
          </Link>
          {/* Photo grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 14 }}>
            {photos.map((c) => (
              <PhotoTile key={c.id} card={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
