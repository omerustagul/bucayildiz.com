import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";

export const metadata: Metadata = { title: "KVKK Aydınlatma Metni" };

export default function KvkkPage() {
  return (
    <>
      <PageHero kicker="Yasal" title="KVKK Aydınlatma Metni" breadcrumb={[{ label: "KVKK" }]} />
      <Section>
        <Prose>
          <p style={{ padding: "14px 16px", background: "var(--amber-100)", border: "1px solid var(--amber-600)", borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--ink-700)" }}>
            <strong>Not:</strong> Bu metin taslaktır. Nihai aydınlatma metni, kulübün bir KVKK/veri hukuku avukatı tarafından hazırlanıp onaylanmalıdır.
          </p>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında, veri sorumlusu sıfatıyla Buca Yıldız Futbol
            Akademisi olarak kişisel verilerinizi aşağıda açıklanan amaçlarla işliyoruz.
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--text-h3)", textTransform: "uppercase", color: "var(--text-strong)", margin: "8px 0 0" }}>İşlenen Veriler</h2>
          <p>Sporcu ve veli kimlik bilgileri, iletişim bilgileri, sağlık ve fiziksel ölçüm verileri ile görsel/işitsel kayıtlar.</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--text-h3)", textTransform: "uppercase", color: "var(--text-strong)", margin: "8px 0 0" }}>İşleme Amaçları</h2>
          <p>Akademi kayıt ve üyelik süreçleri, sportif gelişim takibi, iletişim ve yasal yükümlülüklerin yerine getirilmesi.</p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--text-h3)", textTransform: "uppercase", color: "var(--text-strong)", margin: "8px 0 0" }}>Haklarınız</h2>
          <p>KVKK m.11 kapsamında verilerinize erişme, düzeltme, silme ve işlemeye itiraz etme haklarına sahipsiniz.</p>
        </Prose>
      </Section>
    </>
  );
}
