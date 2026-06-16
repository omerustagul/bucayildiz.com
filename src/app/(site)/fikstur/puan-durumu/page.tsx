import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { FixtureTabs } from "@/components/content/FixtureTabs";
import { StandingsTable } from "@/components/content/StandingsTable";
import { STANDINGS } from "@/lib/data";

export const metadata: Metadata = { title: "Puan Durumu" };

export default function PuanDurumuPage() {
  return (
    <>
      <PageHero kicker="Fikstür" title="Puan Durumu" lead="A Takım — Bölgesel Lig güncel sıralaması." breadcrumb={[{ label: "Fikstür", href: "/fikstur" }, { label: "Puan Durumu" }]} />
      <Section>
        <FixtureTabs active="puan-durumu" />
        <StandingsTable rows={STANDINGS} />
        <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>
          Puan durumu kulüp tarafından güncellenmektedir. O: Oynanan, G: Galibiyet, B: Beraberlik, M: Mağlubiyet, P: Puan.
        </p>
      </Section>
    </>
  );
}
