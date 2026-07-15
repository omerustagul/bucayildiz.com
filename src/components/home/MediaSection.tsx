import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "./SectionHeading";
import { CoverVideo } from "./CoverVideo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

type Card = { id: string; title: string; kind: string; featured: boolean; coverUrl: string | null; coverVideoUrl: string | null; categoryId: string | null };

/** Kompakt medya kartı — eşit boyutlu 4:3 tile. Öne çıkan altın çerçeve + rozet,
 *  video ise küçük oynat düğmesi. Tümü tek yatay satırda kaydırılır. */
function MediaCard({ card, featured }: { card: Card; featured?: boolean }) {
  const href = card.categoryId
    ? `/medya/kategori/${card.categoryId}`
    : card.kind === "video" ? "/medya/videolar" : "/medya/fotograflar";
  return (
    <Link
      href={href}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "4 / 3",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--grad-navy)",
        textDecoration: "none",
        border: featured ? "2px solid var(--gold-500)" : "1px solid var(--border-subtle)",
        boxShadow: featured ? "var(--shadow-md)" : "var(--shadow-sm)",
      }}
    >
      {card.kind === "video" && card.coverVideoUrl ? (
        // Kapak videosu: sessiz, döngü, otomatik oynar; coverUrl poster/yedek.
        // CoverVideo (client) ekran dışında duraklatır — boşuna decode/CPU olmasın.
        <CoverVideo
          src={card.coverVideoUrl}
          poster={card.coverUrl ?? undefined}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : card.coverUrl ? (
        <Image src={card.coverUrl} alt={card.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 72vw, 290px" />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "rgba(255,255,255,0.10)" }}>
          <Icon name={card.kind === "video" ? "play" : "image"} size={28} />
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />

      {/* Kapak videosu YOKSA video kartında oynat ipucu kalır; varsa zaten oynuyor. */}
      {card.kind === "video" && !card.coverVideoUrl && (
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 44, height: 44, borderRadius: "50%", background: "var(--grad-gold)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-md)" }}>
          <Icon name="play" size={18} style={{ color: "var(--navy-900)", fill: "var(--navy-900)" }} />
        </span>
      )}

      {featured && (
        <span style={{ position: "absolute", top: 10, left: 10 }}>
          <Badge tone="gold">Öne Çıkan</Badge>
        </span>
      )}

      <span style={{ position: "absolute", left: 14, right: 14, bottom: 12, fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15, textTransform: "uppercase", letterSpacing: ".01em", color: "#fff", lineHeight: 1.05 }}>
        {card.title}
      </span>
    </Link>
  );
}

export async function MediaSection() {
  const cards = (await prisma.homeMediaCard.findMany({ orderBy: { sort: "asc" } })) as Card[];
  if (cards.length === 0) return null;

  // Birden ÇOK kart öne çıkarılabilir: tüm öne çıkanlar vurgulu ve başta
  // (sort sırasıyla), ardından diğerleri. Hiçbiri işaretli değilse hepsi normal.
  const ordered = [...cards.filter((c) => c.featured), ...cards.filter((c) => !c.featured)];

  return (
    <section style={{ background: "var(--surface-subtle)" }}>
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "32px clamp(16px, 5vw, 32px)" }}>
        <SectionHeading
          kicker="Medya"
          title="Görseller & Videolar"
          action={<Button as="a" href="/medya" variant="secondary" size="sm">Galeriye Git</Button>}
          style={{ marginBottom: 20 }}
        />
        <div className="hp-media-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory" }}>
          {ordered.map((c) => (
            <div key={c.id} style={{ flex: "0 0 auto", width: "clamp(230px, 72vw, 290px)", scrollSnapAlign: "start" }}>
              <MediaCard card={c} featured={c.featured} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
