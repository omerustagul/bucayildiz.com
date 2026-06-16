import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Çerez Politikası" };

export default function CerezPolitikasiPage() {
  return (
    <>
      <PageHero kicker="Yasal" title="Çerez Politikası" breadcrumb={[{ label: "Çerez Politikası" }]} />
      <Section>
        <Prose>
          <p style={{ padding: "14px 16px", background: "var(--amber-100)", border: "1px solid var(--amber-600)", borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--ink-700)" }}>
            <strong>Not:</strong> Bu metin taslaktır ve nihai hâli için hukuki danışmanlık alınmalıdır.
          </p>
          <p>
            Web sitemiz, deneyiminizi iyileştirmek için çerezler kullanır. Çerezler; sitenin temel işlevleri, tercihlerinizin
            hatırlanması ve anonim kullanım istatistikleri için kullanılır.
          </p>
          <p>
            Tarayıcı ayarlarınızdan çerezleri yönetebilir veya engelleyebilirsiniz. Zorunlu olmayan çerezler yalnızca onayınızla
            etkinleştirilir.
          </p>
        </Prose>
      </Section>
    </>
  );
}
