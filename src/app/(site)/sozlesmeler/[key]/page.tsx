import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { getConsentDocumentByKey } from "@/lib/consent.server";
import { CONSENT_DOCS } from "@/lib/consent";

// Sabit KVKK belge anahtarları — DB sorgusu gerekmez, hepsi build'de üretilir.
export function generateStaticParams() {
  return CONSENT_DOCS.map((d) => ({ key: d.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const doc = await getConsentDocumentByKey(key);
  return { title: doc ? doc.title : "Sözleşme" };
}

export default async function ConsentDocPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const doc = await getConsentDocumentByKey(key);
  if (!doc) notFound();

  return (
    <>
      <PageHero
        kicker={`KVKK · Sürüm ${doc.version}`}
        title={doc.title}
        breadcrumb={[{ label: "KVKK", href: "/kvkk" }, { label: doc.title }]}
      />
      <Section>
        <div style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-body)", whiteSpace: "pre-line", margin: 0 }}>
            {doc.body}
          </p>
          <p style={{ marginTop: 28, fontSize: 13, color: "var(--text-muted)" }}>
            Belge sürümü: <strong>{doc.version}</strong>
            {!doc.isConsent && " · Bu metin bir rıza beyanı değil, bilgilendirmedir."}
            {doc.isConsent && !doc.required && " · Bu onay opsiyoneldir ve dilediğiniz zaman geri alınabilir."}
          </p>
        </div>
      </Section>
    </>
  );
}
