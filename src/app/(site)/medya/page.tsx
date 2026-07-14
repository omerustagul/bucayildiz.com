import { getPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section, LinkCardGrid } from "@/components/content/blocks";

export const generateMetadata = () => getPageMetadata("/medya");

export default function MedyaPage() {
  return (
    <>
      <PageHero
        kicker="Medya"
        title="Görseller & Videolar"
        lead="Antrenmanlardan maç günlerine, kulübümüzden kareler ve videolar."
        breadcrumb={[{ label: "Medya" }]}
      />
      <Section>
        <LinkCardGrid
          items={[
            { title: "Fotoğraflar", text: "Antrenman, maç günü, ödül töreni ve tesis fotoğrafları.", href: "/medya/fotograflar", icon: "image" },
            { title: "Videolar", text: "Maç özetleri, röportajlar ve akademi tanıtım videoları.", href: "/medya/videolar", icon: "play" },
            { title: "Basında Biz", text: "Kulübümüzle ilgili basın haberleri ve röportajlar.", href: "/medya/basinda-biz", icon: "clipboard-list" },
          ]}
        />
      </Section>
    </>
  );
}
