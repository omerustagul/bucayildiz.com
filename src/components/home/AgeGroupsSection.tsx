import { prisma } from "@/lib/prisma";
import { SectionHeading } from "./SectionHeading";
import { AgeGroupCard } from "./AgeGroupCard";
import { Button } from "@/components/ui/Button";

/** Buca Yıldız — Yaş grupları section. DB takımlarından beslenir. */
export async function AgeGroupsSection() {
  const teams = await prisma.team.findMany({
    orderBy: { sort: "asc" },
    include: { _count: { select: { athletes: true } } },
  });

  if (teams.length === 0) return null;

  return (
    <section style={{ background: "var(--surface-page)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 32px" }}>
        <SectionHeading
          kicker="Akademi"
          title="Yaş Grupları"
          action={
            <Button as="a" href="/takimlar" variant="secondary" size="sm">
              Tüm Takımlar
            </Button>
          }
          style={{ marginBottom: 32 }}
        />
        <div className="hp-grid-ages" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
          {teams.map((t) => (
            <AgeGroupCard
              key={t.id}
              label={t.name}
              title={t.born === "Üst yapı" ? "Üst yapı kadrosu" : t.born ? `${t.born} doğumlular` : t.coach}
              count={t._count.athletes}
              href={`/takimlar/${t.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
