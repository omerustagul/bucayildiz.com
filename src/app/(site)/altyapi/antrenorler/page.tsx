import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { Badge } from "@/components/ui/Badge";
import { COACHES } from "@/lib/data";

export const metadata: Metadata = { title: "Antrenörler" };

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export default function AntrenorlerPage() {
  return (
    <>
      <PageHero
        kicker="Altyapı"
        title="Antrenör Kadromuz"
        lead="Sporcularımızın gelişiminden sorumlu, lisanslı ve deneyimli teknik ekibimiz."
        breadcrumb={[{ label: "Altyapı", href: "/altyapi" }, { label: "Antrenörler" }]}
      />
      <Section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {COACHES.map((c) => (
            <div
              key={c.name}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  background: "var(--grad-navy)",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: 28,
                  textTransform: "uppercase",
                  border: "2px solid var(--gold-500)",
                }}
              >
                {initials(c.name)}
              </span>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)" }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 3 }}>{c.role}</div>
              </div>
              <Badge tone="gold">{c.license}</Badge>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
