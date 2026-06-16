import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon, type IconName } from "@/lib/icons";

export const metadata: Metadata = { title: "İletişim" };

const INFO: { icon: IconName; label: string; value: string }[] = [
  { icon: "map-pin", label: "Adres", value: "Buca Yıldız Tesisleri, Buca / İzmir" },
  { icon: "phone", label: "Telefon", value: "+90 232 000 00 00" },
  { icon: "mail", label: "E-posta", value: "info@bucayildiz.com" },
  { icon: "clock", label: "Çalışma Saatleri", value: "Hafta içi 09:00 – 20:00" },
];

export default function IletisimPage() {
  return (
    <>
      <PageHero
        kicker="İletişim"
        title="Bize Ulaşın"
        lead="Sorularınız, başvurularınız ve iş birlikleri için bizimle iletişime geçin."
        breadcrumb={[{ label: "İletişim" }]}
      />
      <Section>
        <div className="hp-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 40, alignItems: "start" }}>
          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {INFO.map((it) => (
              <div key={it.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ flex: "none", width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--navy-50)", color: "var(--navy-700)", display: "grid", placeItems: "center" }}>
                  <Icon name={it.icon} size={20} />
                </span>
                <div>
                  <div style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)", fontWeight: 600 }}>{it.label}</div>
                  <div style={{ fontSize: 15.5, color: "var(--text-body)", marginTop: 2 }}>{it.value}</div>
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 8,
                position: "relative",
                minHeight: 220,
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                background: "var(--grad-navy)",
                border: "1px solid var(--navy-700)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="map-pin" size={40} style={{ color: "rgba(255,255,255,0.16)" }} />
              <span style={{ position: "absolute", bottom: 14, left: 16, fontSize: 13, color: "var(--navy-100)" }}>Harita yakında eklenecek</span>
            </div>
          </div>
          {/* Form */}
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-xl)", padding: "clamp(24px,3vw,36px)", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 26, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 6px" }}>Mesaj Gönderin</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 22px" }}>Formu doldurun, en kısa sürede dönüş yapalım.</p>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
