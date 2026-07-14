import { getPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";
import { TrialBanner } from "@/components/home/TrialBanner";

export const generateMetadata = () => getPageMetadata("/altyapi/secmeler");

const STEPS = [
  { n: "1", title: "Başvuru", text: "Online başvuru formunu doldurun; ekibimiz sizinle iletişime geçsin." },
  { n: "2", title: "Tanışma Antrenmanı", text: "Ücretsiz tanışma antrenmanına katılın, sahada yeteneğinizi gösterin." },
  { n: "3", title: "Seviye Tespiti", text: "Antrenörlerimiz teknik ve fiziksel seviyenizi objektif olarak değerlendirir." },
  { n: "4", title: "Yerleştirme", text: "Uygun yaş grubuna yerleştirilir, gelişim programınız başlar." },
];

export default function SecmelerPage() {
  return (
    <>
      <PageHero
        kicker="Altyapı"
        title="Seçmeler & Seviye Tespiti"
        lead="Akademimize katılım süreci şeffaf ve adildir. Önemli olan yetenek ve çalışma isteğidir."
        breadcrumb={[{ label: "Altyapı", href: "/altyapi" }, { label: "Seçmeler" }]}
      />
      <Section>
        <Prose>
          <p>Seçme sürecimiz dört adımdan oluşur. Her aday, ücretsiz bir tanışma antrenmanı ve objektif bir seviye tespitiyle değerlendirilir.</p>
        </Prose>
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 40, color: "var(--gold-500)", lineHeight: 1 }}>{s.n}</div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 19, textTransform: "uppercase", color: "var(--text-strong)", margin: "10px 0 6px" }}>{s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section background="subtle">
        <TrialBanner />
      </Section>
    </>
  );
}
