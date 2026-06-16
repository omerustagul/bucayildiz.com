import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Gizlilik Politikası" };

export default function GizlilikPage() {
  return (
    <>
      <PageHero kicker="Yasal" title="Gizlilik Politikası" breadcrumb={[{ label: "Gizlilik" }]} />
      <Section>
        <Prose>
          <p style={{ padding: "14px 16px", background: "var(--amber-100)", border: "1px solid var(--amber-600)", borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--ink-700)" }}>
            <strong>Not:</strong> Bu metin taslaktır ve nihai hâli için hukuki danışmanlık alınmalıdır.
          </p>
          <p>
            Buca Yıldız Futbol Akademisi olarak kullanıcılarımızın gizliliğine önem veriyoruz. Web sitemiz üzerinden topladığımız
            bilgiler yalnızca belirtilen amaçlar doğrultusunda ve KVKK&apos;ya uygun olarak işlenir.
          </p>
          <p>
            Kişisel verileriniz, açık rızanız olmaksızın üçüncü taraflarla paylaşılmaz; yasal yükümlülükler saklıdır. Verilerin
            güvenliği için uygun teknik ve idari tedbirler uygulanır.
          </p>
        </Prose>
      </Section>
    </>
  );
}
