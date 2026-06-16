import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { Icon } from "@/lib/icons";

export const metadata: Metadata = { title: "Fotoğraflar" };

const ALBUMS = ["Antrenman", "Maç Günü", "Ödül Töreni", "Tesisler", "U-17 Kamp", "Final Maçı"];

export default function FotograflarPage() {
  return (
    <>
      <PageHero kicker="Medya" title="Fotoğraflar" breadcrumb={[{ label: "Medya", href: "/medya" }, { label: "Fotoğraflar" }]} />
      <Section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
          {ALBUMS.map((a) => (
            <div
              key={a}
              className="link-card"
              style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--grad-navy)", border: "1px solid var(--navy-700)", display: "grid", placeItems: "center" }}
            >
              <Icon name="image" size={34} style={{ color: "rgba(255,255,255,0.12)" }} />
              <div style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />
              <span style={{ position: "absolute", left: 16, bottom: 14, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "#fff" }}>{a}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>Albümler gerçek fotoğraflarla yakında doldurulacak.</p>
      </Section>
    </>
  );
}
