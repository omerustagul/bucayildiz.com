import { getPageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { mapFixture } from "@/lib/publicData";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { FixtureTabs } from "@/components/content/FixtureTabs";
import { MatchList } from "@/components/content/MatchList";

export const generateMetadata = () => getPageMetadata("/fikstur/sonuclar");

export default async function SonuclarPage() {
  const fixtures = await prisma.fixture.findMany({ where: { status: "finished" }, orderBy: { date: "desc" } });
  const rows = fixtures.map(mapFixture);

  return (
    <>
      <PageHero kicker="Fikstür" title="Sonuçlar" lead="Son oynanan maçların skorları." breadcrumb={[{ label: "Fikstür", href: "/fikstur" }, { label: "Sonuçlar" }]} />
      <Section>
        <FixtureTabs active="sonuclar" />
        {rows.length === 0 ? <p style={{ color: "var(--text-muted)" }}>Sonuç bulunmuyor.</p> : <MatchList fixtures={rows} />}
      </Section>
    </>
  );
}
