import { getPageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { FixtureTabs } from "@/components/content/FixtureTabs";
import { StandingsTable, type PublicStandingRow } from "@/components/content/StandingsTable";

export const generateMetadata = () => getPageMetadata("/fikstur/puan-durumu");

export default async function PuanDurumuPage() {
  const rows = await prisma.standingRow.findMany({ orderBy: { sort: "asc" } });

  return (
    <>
      <PageHero kicker="Fikstür" title="Puan Durumu" lead="A Takım — Bölgesel Lig güncel sıralaması." breadcrumb={[{ label: "Fikstür", href: "/fikstur" }, { label: "Puan Durumu" }]} />
      <Section>
        <FixtureTabs active="puan-durumu" />
        {rows.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Puan durumu yakında güncellenecek.</p>
        ) : (
          <>
            <StandingsTable rows={rows as PublicStandingRow[]} />
            <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>
              Puan durumu kulüp tarafından güncellenmektedir. O: Oynanan, G: Galibiyet, B: Beraberlik, M: Mağlubiyet, Av: Averaj, P: Puan.
            </p>
          </>
        )}
      </Section>
    </>
  );
}
