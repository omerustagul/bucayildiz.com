import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";
import { confirmNewsletter } from "@/lib/newsletter";

export const metadata: Metadata = { title: "Bülten Onayı", robots: { index: false } };
export const dynamic = "force-dynamic"; // jetonla DB işlemi — önbelleğe alınmaz

export default async function BultenDogrulaPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const res = await confirmNewsletter(token ?? "");
  return (
    <>
      <PageHero
        kicker="Bülten"
        title={res.ok ? "Aboneliğiniz onaylandı" : "Bağlantı geçersiz"}
        breadcrumb={[{ label: "Bülten Onayı" }]}
      />
      <Section>
        <Prose>
          {res.ok ? (
            <p>
              Teşekkürler! E-posta bülten aboneliğiniz onaylandı. Kulüpten haber ve duyuruları artık e-posta ile
              alacaksınız. Dilediğiniz zaman, gönderdiğimiz her e-postanın altındaki bağlantıdan abonelikten
              çıkabilirsiniz.
            </p>
          ) : (
            <p>
              Bu onay bağlantısı geçersiz veya daha önce kullanılmış. Lütfen ana sayfamızın altındaki bülten
              formundan yeniden abone olmayı deneyin.
            </p>
          )}
        </Prose>
      </Section>
    </>
  );
}
