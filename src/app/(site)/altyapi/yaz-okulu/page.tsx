import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose, FeatureGrid } from "@/components/content/blocks";
import { TrialBanner } from "@/components/home/TrialBanner";

export const metadata: Metadata = { title: "Yaz Okulu" };

export default function YazOkuluPage() {
  return (
    <>
      <PageHero
        kicker="Altyapı"
        title="Yaz Futbol Okulu"
        lead="7-14 yaş arası çocuklar için eğlenceli ve öğretici bir yaz dönemi programı."
        breadcrumb={[{ label: "Altyapı", href: "/altyapi" }, { label: "Yaz Okulu" }]}
      />
      <Section>
        <Prose>
          <p>
            Yaz okulumuz, çocukların futbolla sağlıklı bir şekilde tanışmasını; takım olma, paylaşma ve disiplin gibi değerleri
            oyunla öğrenmesini hedefler. Uzman antrenörlerimiz eşliğinde güvenli ve keyifli bir ortam sunarız.
          </p>
        </Prose>
        <div style={{ marginTop: 28 }}>
          <FeatureGrid
            items={[
              { icon: "calendar-check", title: "Esnek Program", text: "Hafta içi sabah ve akşam grupları ile uygun saat seçenekleri." },
              { icon: "users", title: "Küçük Gruplar", text: "Her çocuğa yeterli ilgi için sınırlı kontenjanlı gruplar." },
              { icon: "shield-check", title: "Güvenli Ortam", text: "Lisanslı antrenörler ve sağlık desteğiyle güvenli bir saha deneyimi." },
            ]}
          />
        </div>
      </Section>
      <Section background="subtle">
        <TrialBanner title="Yaz Okuluna Kayıt Ol" kicker="Yaz Okulu" ctaLabel="Hemen Başvur" text="Kontenjanlar sınırlıdır. Başvuru formunu doldurun, çocuğunuzun yerini ayırtalım." />
      </Section>
    </>
  );
}
