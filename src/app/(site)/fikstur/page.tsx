import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { mapFixture } from "@/lib/publicData";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { FixtureTabs } from "@/components/content/FixtureTabs";
import { MatchList } from "@/components/content/MatchList";

export const metadata: Metadata = { title: "Fikstür" };

export default async function FiksturPage() {
  const fixtures = await prisma.fixture.findMany({ where: { status: "upcoming" }, orderBy: { date: "asc" } });
  const rows = fixtures.map(mapFixture);

  return (
    <>
      <PageHero kicker="Fikstür" title="Maç Programı" lead="Tüm takımlarımızın yaklaşan maçları." breadcrumb={[{ label: "Fikstür" }]} />
      <Section>
        <FixtureTabs active="program" />
        {rows.length === 0 ? <p style={{ color: "var(--text-muted)" }}>Yaklaşan maç bulunmuyor.</p> : <MatchList fixtures={rows} />}
      </Section>
    </>
  );
}
