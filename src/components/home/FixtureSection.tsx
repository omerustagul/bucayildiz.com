import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { fmtTrDate } from "@/lib/publicData";
import { SectionHeading } from "./SectionHeading";
import { FixtureCard } from "./FixtureCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { logoSrc } from "@/lib/branding";
import { getSettings } from "@/lib/settings";


type Fx = {
  id: string; competition: string; opponent: string; opponentLogo: string | null; isHome: boolean;
  date: string; time: string; venue: string; status: string; ourScore: number | null; oppScore: number | null;
};

function toCard(f: Fx, crest: string) {
  const us = { name: "Buca Yıldız", crest, score: f.ourScore ?? undefined };
  const them = { name: f.opponent, crest: f.opponentLogo ?? undefined, score: f.oppScore ?? undefined, time: f.time };
  return {
    competition: f.competition,
    status: (f.status === "finished" ? "finished" : "upcoming") as "finished" | "upcoming",
    date: `${fmtTrDate(f.date)} · ${f.time}`,
    venue: (f.isHome ? "Ev · " : "Deplasman · ") + (f.venue || "—"),
    home: f.isHome ? us : them,
    away: f.isHome ? them : us,
  };
}

export async function FixtureSection() {
  const CREST = logoSrc((await getSettings()).logoUrl);
  const fixtures = (await prisma.fixture.findMany({ orderBy: { date: "asc" } })) as Fx[];
  if (fixtures.length === 0) return null;

  const upcoming = fixtures.filter((f) => f.status === "upcoming");
  const finished = fixtures.filter((f) => f.status === "finished");
  const next = upcoming[0];
  const compact = [finished[finished.length - 1], upcoming[1]].filter(Boolean).slice(0, 2) as Fx[];

  return (
    <section className="by-navy-sec" style={{ background: "var(--grad-navy-deep)", position: "relative", overflow: "hidden" }}>
      <span style={{ position: "absolute", right: -80, top: -60, fontSize: 420, lineHeight: 1, color: "rgba(201,162,39,0.04)", pointerEvents: "none" }}>★</span>
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "38px clamp(16px, 5vw, 32px)", position: "relative" }}>
        <SectionHeading
          kicker="Fikstür"
          title="Güncel Maç Programı"
          onDark
          action={<Button as="a" href="/fikstur" variant="on-navy" size="sm">Tüm Fikstür</Button>}
          style={{ marginBottom: 32 }}
        />
        <div className="hp-grid-2" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "stretch" }}>
          {/* Next match feature */}
          {next && (
            <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(3px)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "var(--radius-xl)", padding: "clamp(20px, 5vw, 36px)", display: "flex", flexDirection: "column", gap: 24, justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Badge tone="gold">Sıradaki Maç</Badge>
                <span style={{ fontSize: 13, color: "var(--navy-200)", fontWeight: 500 }}>{next.competition}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <Image src={CREST} alt="Buca Yıldız" width={84} height={84} style={{ objectFit: "contain" }} />
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, textTransform: "uppercase", color: "#fff", textAlign: "center", lineHeight: 1 }}>Buca Yıldız</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 34, color: "var(--gold-400)", fontVariantNumeric: "tabular-nums" }}>{next.time || "—"}</span>
                  <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy-200)" }}>{fmtTrDate(next.date)}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  {next.opponentLogo ? (
                    <Image src={next.opponentLogo} alt={next.opponent} width={84} height={84} style={{ objectFit: "contain" }} />
                  ) : (
                    <div style={{ width: 84, height: 84, borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.18)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 30, color: "#fff" }}>
                      {next.opponent.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                  )}
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, textTransform: "uppercase", color: "#fff", textAlign: "center", lineHeight: 1 }}>{next.opponent}</span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 20 }}>
                <span style={{ fontSize: 13.5, color: "var(--navy-100)", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="map-pin" size={15} /> {next.isHome ? "Ev Sahibi · " : "Deplasman · "}{next.venue || "—"}
                </span>
                <Button as="a" href="/fikstur" variant="accent" size="sm">Maç Detayı</Button>
              </div>
            </div>
          )}
          {/* Recent / upcoming compact */}
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
            {compact.map((f) => (
              <FixtureCard key={f.id} {...toCard(f, CREST)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
