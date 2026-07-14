import { getPageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { AgeGroupCard } from "@/components/home/AgeGroupCard";

export const generateMetadata = () => getPageMetadata("/takimlar");

export default async function TakimlarPage() {
  const teams = await prisma.team.findMany({ orderBy: { sort: "asc" }, include: { _count: { select: { athletes: true } } } });

  return (
    <>
      <PageHero kicker="Akademi" title="Takımlarımız" lead="A Takım'dan U-15'e, her yaş grubunda gelişim ve rekabet." breadcrumb={[{ label: "Takımlar" }]} />
      <Section>
        {/* Anasayfa ile aynı düzen: ana takım 2 sütun, diğerleri 2:3 */}
        <div
          className="hp-grid-ages"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${teams.length + (teams.some((t) => t.isMain) ? 1 : 0)}, 1fr)`,
            gap: 12,
          }}
        >
          {teams.map((t) => (
            <AgeGroupCard key={t.id} label={t.name} wide={t.isMain} image={t.coverImage ?? undefined} href={`/takimlar/${t.slug}`} />
          ))}
        </div>
      </Section>
    </>
  );
}
