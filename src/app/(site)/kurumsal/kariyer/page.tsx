import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

export const metadata: Metadata = { title: "Kariyer" };

const OPENINGS = [
  { title: "Altyapı Antrenörü (UEFA C/B)", type: "Tam Zamanlı · İzmir" },
  { title: "Kaleci Antrenörü", type: "Yarı Zamanlı · İzmir" },
  { title: "Fizyoterapist", type: "Tam Zamanlı · İzmir" },
];

export default function KariyerPage() {
  return (
    <>
      <PageHero
        kicker="Kariyer"
        title="Ekibimize Katılın"
        lead="Genç yetenekleri birlikte yetiştirmek isteyen tutkulu profesyonelleri kadromuza bekliyoruz."
        breadcrumb={[{ label: "Kurumsal", href: "/kurumsal" }, { label: "Kariyer" }]}
      />
      <Section>
        <Prose>
          <p>
            Açık pozisyonlarımızı aşağıda bulabilirsiniz. Başvurmak için özgeçmişinizi iletişim kanallarımız üzerinden
            bize ulaştırabilirsiniz.
          </p>
        </Prose>
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, maxWidth: 760 }}>
          {OPENINGS.map((o) => (
            <div
              key={o.title}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "18px 22px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)" }}>{o.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{o.type}</div>
              </div>
              <Button as="a" href="/iletisim" variant="secondary" size="sm" rightIcon={<Icon name="arrow-right" size={15} />}>
                Başvur
              </Button>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
