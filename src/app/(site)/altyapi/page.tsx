import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, LinkCardGrid } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Altyapı" };

export default function AltyapiPage() {
  return (
    <>
      <PageHero
        kicker="Altyapı"
        title="Gelişim Yolculuğu"
        lead="Antrenör kadromuz, gelişim programımız, seçme süreçlerimiz ve yaz okulumuz."
        breadcrumb={[{ label: "Altyapı" }]}
      />
      <Section>
        <LinkCardGrid
          items={[
            { title: "Antrenörler", text: "UEFA lisanslı antrenör ve uzman gelişim kadromuz.", href: "/altyapi/antrenorler", icon: "shield-check" },
            { title: "Gelişim Programı", text: "Bireysel veri takibine dayalı bütünsel gelişim modelimiz.", href: "/altyapi/gelisim-programi", icon: "users" },
            { title: "Seçmeler", text: "Akademiye katılım için seçme ve seviye tespit süreci.", href: "/altyapi/secmeler", icon: "calendar-check" },
            { title: "Yaz Okulu", text: "7-14 yaş çocuklar için futbolla tanışma programı.", href: "/altyapi/yaz-okulu", icon: "trophy" },
          ]}
        />
      </Section>
    </>
  );
}
