import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Antrenörler" };

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export default async function AntrenorlerPage() {
  const coaches = await prisma.staffMember.findMany({
    where: { group: "antrenor" },
    orderBy: [{ sort: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <PageHero
        kicker="Altyapı"
        title="Antrenör Kadromuz"
        lead="Sporcularımızın gelişiminden sorumlu, lisanslı ve deneyimli teknik ekibimiz."
        breadcrumb={[{ label: "Altyapı", href: "/altyapi" }, { label: "Antrenörler" }]}
      />
      <Section>
        {coaches.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Henüz içerik eklenmedi.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {coaches.map((c) => (
              <div
                key={c.id}
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
                    position: "relative",
                    width: 84,
                    height: 84,
                    borderRadius: "50%",
                    background: c.photoUrl ? `center/cover no-repeat url("${c.photoUrl}")` : "var(--grad-navy)",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: 28,
                    textTransform: "uppercase",
                    border: "2px solid var(--gold-500)",
                    overflow: "hidden",
                  }}
                >
                  {!c.photoUrl && initials(c.name)}
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)" }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 3 }}>{c.title}</div>
                </div>
                {c.licence && <Badge tone="gold">{c.licence}</Badge>}
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
