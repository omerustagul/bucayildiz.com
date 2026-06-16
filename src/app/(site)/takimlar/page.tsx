import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { AgeGroupCard } from "@/components/home/AgeGroupCard";

export const metadata: Metadata = { title: "Takımlar" };

export default async function TakimlarPage() {
  const teams = await prisma.team.findMany({ orderBy: { sort: "asc" }, include: { _count: { select: { athletes: true } } } });

  return (
    <>
      <PageHero kicker="Akademi" title="Takımlarımız" lead="A Takım'dan U-15'e, her yaş grubunda gelişim ve rekabet." breadcrumb={[{ label: "Takımlar" }]} />
      <Section>
        <div className="hp-grid-ages" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
          {teams.map((t) => (
            <AgeGroupCard key={t.id} label={t.name} title={`${t.born === "Üst yapı" ? "Üst yapı" : t.born} · ${t.coach}`} count={t._count.athletes} href={`/takimlar/${t.slug}`} />
          ))}
        </div>
      </Section>
    </>
  );
}
