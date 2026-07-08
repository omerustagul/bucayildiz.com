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
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "88px clamp(16px, 5vw, 32px)" }}>
        <SectionHeading
          kicker="Akademi"
          title="Takımlarımız"
          action={
            <Button as="a" href="/takimlar" variant="secondary" size="sm">
              Tüm Takımlar
            </Button>
          }
          style={{ marginBottom: 32 }}
        />
        {/* Ana takım (isMain) 2 sütun kaplar; sütun sayısı = takım + 1 → satır
            tam genişliği doldurur, diğer kartların 2:3 oranı bozulmaz. */}
        <div
          className="hp-grid-ages"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${teams.length + (teams.some((t) => t.isMain) ? 1 : 0)}, 1fr)`,
            gap: 12,
          }}
        >
          {teams.map((t) => (
            <AgeGroupCard
              key={t.id}
              label={t.name}
              wide={t.isMain}
              image={t.coverImage ?? undefined}
              href={`/takimlar/${t.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
