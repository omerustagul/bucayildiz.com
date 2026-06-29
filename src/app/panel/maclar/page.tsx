import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { mapFixture } from "@/lib/publicData";
import { MatchList } from "@/components/content/MatchList";

export const metadata: Metadata = { title: "Maçlar — Sporcu Paneli" };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 14px" }}>
      <span style={{ width: 22, height: 2, background: "var(--grad-gold)" }} />
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{children}</h2>
    </div>
  );
}

export default async function PanelMaclar() {
  const [upcoming, finished] = await Promise.all([
    prisma.fixture.findMany({ where: { status: "upcoming" }, orderBy: { date: "asc" }, take: 50 }),
    prisma.fixture.findMany({ where: { status: "finished" }, orderBy: { date: "desc" }, take: 50 }),
  ]);

  const up = upcoming.map(mapFixture);
  const fin = finished.map(mapFixture);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Maçlar</h1>
        <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: "6px 0 0" }}>Kulübümüzün yaklaşan maçları ve sonuçları.</p>
      </div>

      <section>
        <SectionTitle>Yaklaşan Maçlar</SectionTitle>
        {up.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Yaklaşan maç bulunmuyor.</p> : <MatchList fixtures={up} />}
      </section>

      <section>
        <SectionTitle>Son Sonuçlar</SectionTitle>
        {fin.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Henüz sonuç girilmemiş.</p> : <MatchList fixtures={fin} />}
      </section>
    </div>
  );
}
