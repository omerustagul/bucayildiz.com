import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Yönetim" };

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export default async function YonetimPage() {
  const people = await prisma.staffMember.findMany({
    where: { group: "yonetim" },
    orderBy: [{ sort: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <PageHero
        kicker="Yönetim"
        title="Kulübümüzü Yöneten Kadro"
        lead="Akademimizi vizyonuyla geleceğe taşıyan yönetim ekibimiz."
        breadcrumb={[{ label: "Kurumsal", href: "/kurumsal" }, { label: "Yönetim" }]}
      />
      <Section>
        {people.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Henüz içerik eklenmedi.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {people.map((p) => (
              <div
                key={p.id}
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
                  gap: 14,
                }}
              >
                <span
                  style={{
                    position: "relative",
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background: p.photoUrl ? `center/cover no-repeat url("${p.photoUrl}")` : "var(--grad-navy)",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: 30,
                    textTransform: "uppercase",
                    border: "2px solid var(--gold-500)",
                    overflow: "hidden",
                  }}
                >
                  {!p.photoUrl && initials(p.name)}
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 19, textTransform: "uppercase", color: "var(--text-strong)" }}>{p.name}</div>
                  <div style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)", fontWeight: 600, marginTop: 4 }}>{p.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
