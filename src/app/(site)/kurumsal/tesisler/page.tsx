import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose, FeatureGrid } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Tesisler" };

export default function TesislerPage() {
  return (
    <>
      <PageHero
        kicker="Tesisler"
        title="Antrenman Tesislerimiz"
        lead="Sporcularımızın gelişimi için tasarlanmış modern saha ve gelişim alanları."
        breadcrumb={[{ label: "Kurumsal", href: "/kurumsal" }, { label: "Tesisler" }]}
      />
      <Section>
        <Prose>
          <p>
            Buca Yıldız Tesisleri; hibrit çim antrenman sahaları, kondisyon ve gelişim salonları ile sporcularımıza
            her mevsim kesintisiz çalışma imkânı sunar. Tüm alanlarımız yaş gruplarına uygun güvenlik standartlarında
            tasarlanmıştır.
          </p>
        </Prose>
        <div style={{ marginTop: 28 }}>
          <FeatureGrid
            items={[
              { icon: "shield-check", title: "Hibrit Çim Saha", text: "Her hava koşulunda oynanabilen, profesyonel ölçülerde ana antrenman sahası." },
              { icon: "users", title: "Gelişim Salonu", text: "Kondisyon, kuvvet ve esneklik çalışmaları için donanımlı kapalı alan." },
              { icon: "calendar-check", title: "Soyunma & Dinlenme", text: "Sporcu ve veliler için konforlu soyunma odaları ve bekleme alanları." },
            ]}
          />
        </div>
      </Section>
      <Section background="subtle">
        <div
          style={{
            position: "relative",
            minHeight: 320,
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            background: "var(--grad-navy)",
            border: "1px solid var(--navy-700)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.08)", fontFamily: "var(--font-heading)", fontSize: 180 }}>★</span>
          <span style={{ position: "absolute", bottom: 18, left: 22, fontSize: 13, color: "var(--navy-100)", letterSpacing: "0.04em" }}>
            Tesis fotoğrafları yakında eklenecek
          </span>
        </div>
      </Section>
    </>
  );
}
