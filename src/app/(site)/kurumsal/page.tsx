import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, LinkCardGrid } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Kurumsal" };

export default function KurumsalPage() {
  return (
    <>
      <PageHero
        kicker="Kurumsal"
        title="Kulübümüzü Tanıyın"
        lead="Buca Yıldız Futbol Akademisi'nin kuruluş hikâyesi, yönetim kadrosu, tesisleri ve geleceğe dair vizyonu."
        breadcrumb={[{ label: "Kurumsal" }]}
      />
      <Section>
        <LinkCardGrid
          items={[
            { title: "Hakkımızda", text: "Kuruluşumuz, değerlerimiz ve akademimizin gelişim felsefesi.", href: "/kurumsal/hakkimizda", icon: "shield-check" },
            { title: "Yönetim", text: "Kulübümüzü yöneten ve geleceğe taşıyan kadromuz.", href: "/kurumsal/yonetim", icon: "users" },
            { title: "Tesisler", text: "Antrenman sahalarımız ve sporcu gelişim alanlarımız.", href: "/kurumsal/tesisler", icon: "map-pin" },
            { title: "Vizyon & Misyon", text: "Genç yetenekleri sahaya ve hayata hazırlama amacımız.", href: "/kurumsal/vizyon-misyon", icon: "trophy" },
            { title: "Kariyer", text: "Ekibimize katılın; birlikte yıldızlar yetiştirelim.", href: "/kurumsal/kariyer", icon: "clipboard-list" },
          ]}
        />
      </Section>
    </>
  );
}
