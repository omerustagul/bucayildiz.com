import { getPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { Icon } from "@/lib/icons";

export const generateMetadata = () => getPageMetadata("/medya/basinda-biz");

const PRESS = [
  { source: "İzmir Spor Gazetesi", date: "12 Haziran 2026", title: "Buca Yıldız altyapıda fark yaratıyor" },
  { source: "Ege Futbol", date: "5 Haziran 2026", title: "Akademiden çıkan yetenekler üst yapıya hazırlanıyor" },
  { source: "Yerel Haber", date: "28 Mayıs 2026", title: "Yeni tesis yatırımı bölgeye değer katıyor" },
];

export default function BasindaBizPage() {
  return (
    <>
      <PageHero kicker="Medya" title="Basında Biz" breadcrumb={[{ label: "Medya", href: "/medya" }, { label: "Basında Biz" }]} />
      <Section>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 820 }}>
          {PRESS.map((p) => (
            <div key={p.title} className="link-card" style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 22px", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ flex: "none", width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--navy-50)", color: "var(--navy-700)", display: "grid", placeItems: "center" }}>
                <Icon name="clipboard-list" size={22} />
              </span>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)" }}>{p.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{p.source} · {p.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
