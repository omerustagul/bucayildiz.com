import type { Metadata } from "next";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { Badge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/lib/icons";
import { getActiveConsentDocuments } from "@/lib/consent.server";

export const metadata: Metadata = {
  title: "Başvuru Formu",
  description: "Buca Yıldız Futbol Akademisi ücretsiz deneme antrenması başvuru formu.",
};

const BENEFITS: { icon: IconName; text: string }[] = [
  { icon: "shield-check", text: "UEFA lisanslı antrenörler eşliğinde profesyonel gelişim" },
  { icon: "calendar-check", text: "Ücretsiz tanışma antrenmanı ve seviye tespiti" },
  { icon: "users", text: "Yaş grubuna özel bireysel gelişim takibi" },
  { icon: "trophy", text: "Bölgesel ve gelişim liglerinde aktif rekabet" },
];

function IntroPanel() {
  return (
    <div style={{ background: "var(--grad-navy-deep)", color: "#fff", padding: "48px 44px", position: "relative", overflow: "hidden" }}>
      <span aria-hidden style={{ position: "absolute", right: -50, bottom: -40, fontSize: 300, color: "rgba(201,162,39,0.05)", lineHeight: 1 }}>
        ★
      </span>
      <div style={{ position: "relative" }}>
        <Badge tone="gold">Sezon 2026/27 Kayıtları</Badge>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(34px,4vw,52px)", lineHeight: 0.98, textTransform: "uppercase", color: "#fff", margin: "18px 0 14px" }}>
          Yıldız Adaylarını
          <br />
          Sahaya Bekliyoruz
        </h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--navy-100)", maxWidth: 380, margin: "0 0 30px" }}>
          Başvuru formunu doldurun, antrenörlerimiz en kısa sürede sizinle iletişime geçerek ücretsiz deneme antrenmanı için
          randevu oluştursun.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {BENEFITS.map((b) => (
            <div key={b.text} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
              <span style={{ flex: "none", width: 34, height: 34, borderRadius: "var(--radius-sm)", background: "rgba(201,162,39,0.14)", color: "var(--gold-400)", display: "grid", placeItems: "center" }}>
                <Icon name={b.icon} size={17} />
              </span>
              <span style={{ fontSize: 14.5, lineHeight: 1.5, color: "#fff", paddingTop: 6 }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function BasvuruPage() {
  const docs = await getActiveConsentDocuments();
  const consentDocs = docs.map((d) => ({
    key: d.key,
    title: d.title,
    summary: d.summary,
    required: d.required,
    isConsent: d.isConsent,
  }));

  return (
    <div style={{ maxWidth: 1160, margin: "40px auto", padding: "0 32px" }}>
      <div
        className="basvuru-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.3fr",
          background: "#fff",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <IntroPanel />
        <ApplicationForm consentDocs={consentDocs} />
      </div>
    </div>
  );
}
