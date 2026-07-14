import { getPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose, FeatureGrid, NavyPanel } from "@/components/content/blocks";

export const generateMetadata = () => getPageMetadata("/altyapi/gelisim-programi");

export default function GelisimProgramiPage() {
  return (
    <>
      <PageHero
        kicker="Altyapı"
        title="Bireysel Gelişim Programı"
        lead="Her sporcunun potansiyelini bilimsel veri takibiyle en üst düzeye çıkaran bütünsel gelişim modeli."
        breadcrumb={[{ label: "Altyapı", href: "/altyapi" }, { label: "Gelişim Programı" }]}
      />
      <Section>
        <Prose>
          <p>
            Gelişim programımız; teknik, fiziksel, taktik ve zihinsel gelişimi tek bir plan altında birleştirir. Her sporcunun
            verileri düzenli aralıklarla ölçülür ve antrenörleriyle birlikte kişiye özel hedefler belirlenir.
          </p>
        </Prose>
        <div style={{ marginTop: 28 }}>
          <FeatureGrid
            items={[
              { icon: "shield-check", title: "Teknik Gelişim", text: "Top kontrolü, pas, şut ve oyun içi karar mekanizmalarının yaşa uygun çalışılması." },
              { icon: "users", title: "Atletik Performans", text: "Sürat, dayanıklılık ve kuvvet ölçümleriyle bireysel kondisyon takibi." },
              { icon: "calendar-check", title: "Maç Analizi", text: "Maç sonrası geri bildirim ve gelişim raporlarıyla sürekli ilerleme." },
            ]}
          />
        </div>
      </Section>
      <Section background="subtle">
        <NavyPanel
          title="Programın Kazanımları"
          items={[
            { icon: "trophy", text: "Yaş grubuna özel, ölçülebilir gelişim hedefleri." },
            { icon: "users", text: "Veliyle düzenli paylaşılan gelişim raporları." },
            { icon: "shield-check", text: "Sakatlık önleyici atletik gelişim ve fizyoterapi desteği." },
          ]}
        />
      </Section>
    </>
  );
}
