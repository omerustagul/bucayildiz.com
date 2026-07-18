import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";
import { unsubscribeNewsletter } from "@/lib/newsletter";

export const metadata: Metadata = { title: "Bülten Aboneliğinden Çıkış", robots: { index: false } };
export const dynamic = "force-dynamic"; // jetonla DB işlemi — önbelleğe alınmaz

export default async function BultenIptalPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const res = await unsubscribeNewsletter(token ?? "");
  return (
    <>
      <PageHero
        kicker="Bülten"
        title={res.ok ? "Abonelikten çıktınız" : "Bağlantı geçersiz"}
        breadcrumb={[{ label: "Bülten Aboneliğinden Çıkış" }]}
      />
      <Section>
        <Prose>
          {res.ok ? (
            <p>
              E-posta bülten aboneliğiniz sonlandırıldı; artık pazarlama/duyuru e-postası almayacaksınız. Bu işlemi
              siz yapmadıysanız veya fikrinizi değiştirirseniz, ana sayfamızdaki bülten formundan yeniden abone
              olabilirsiniz.
            </p>
          ) : (
            <p>Bu bağlantı geçersiz. Aboneliğiniz zaten sonlandırılmış olabilir.</p>
          )}
        </Prose>
      </Section>
    </>
  );
}
