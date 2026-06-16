import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { Icon } from "@/lib/icons";

export const metadata: Metadata = { title: "Videolar" };

const VIDEOS = [
  { title: "Sezon 2025/26 — Akademi Özeti", len: "4:12" },
  { title: "Final Maçı Özeti", len: "3:48" },
  { title: "U-17 Kamp Günlüğü", len: "6:20" },
  { title: "Antrenör Röportajı", len: "8:05" },
];

export default function VideolarPage() {
  return (
    <>
      <PageHero kicker="Medya" title="Videolar" breadcrumb={[{ label: "Medya", href: "/medya" }, { label: "Videolar" }]} />
      <Section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {VIDEOS.map((v) => (
            <div key={v.title} className="link-card" style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ position: "relative", aspectRatio: "16 / 9", background: "var(--grad-navy)", display: "grid", placeItems: "center" }}>
                <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--grad-gold)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-lg)" }}>
                  <Icon name="play" size={26} style={{ color: "var(--navy-900)", fill: "var(--navy-900)" }} />
                </span>
                <span style={{ position: "absolute", right: 12, bottom: 10, fontSize: 12, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>{v.len}</span>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{v.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
