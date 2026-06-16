import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose, FeatureGrid } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Vizyon & Misyon" };

export default function VizyonMisyonPage() {
  return (
    <>
      <PageHero
        kicker="Vizyon & Misyon"
        title="Sahaya ve Hayata Hazırlıyoruz"
        breadcrumb={[{ label: "Kurumsal", href: "/kurumsal" }, { label: "Vizyon & Misyon" }]}
      />
      <Section>
        <Prose>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--text-h3)", textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>
            Vizyonumuz
          </h2>
          <p>
            Bölgemizin en güvenilir altyapı akademisi olmak; yetiştirdiğimiz sporcuları üst yapıya ve profesyonel futbola
            taşırken, onlara ömür boyu sürecek disiplin ve takım ruhu kazandırmak.
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--text-h3)", textTransform: "uppercase", color: "var(--text-strong)", margin: "12px 0 0" }}>
            Misyonumuz
          </h2>
          <p>
            Her sporcunun bireysel potansiyelini bilimsel yöntemlerle ortaya çıkarmak; saygı, çalışkanlık ve fair-play
            değerlerini sahanın içinde ve dışında yaşatmak.
          </p>
        </Prose>
      </Section>
      <Section background="subtle">
        <FeatureGrid
          items={[
            { icon: "shield-check", title: "Saygı", text: "Rakibe, hakeme, takım arkadaşına ve emeğe saygı temel değerimizdir." },
            { icon: "trophy", title: "Çalışkanlık", text: "Yetenek kadar emeğin ve istikrarın da kazandığına inanırız." },
            { icon: "users", title: "Takım Ruhu", text: "Bireysel parlamadan önce takımın başarısını önceleriz." },
          ]}
        />
      </Section>
    </>
  );
}
