import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

/**
 * Buca Yıldız — TrialBanner
 * "Ücretsiz denemelere katıl" hero CTA card. Navy gradient + gold accents.
 */
export function TrialBanner({
  kicker = "Ücretsiz Deneme",
  title = "Ücretsiz Denemelerimize Katıl",
  text = "Yıldız adaylarını sahaya bekliyoruz. Antrenörlerimiz eşliğinde ücretsiz deneme antrenmanına kayıt ol, yeteneğini göster.",
  ctaLabel = "Hemen Kayıt Ol",
  href = "/ucretsiz-deneme",
  style = {},
}: {
  kicker?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  href?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="by-navy-sec"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--grad-navy)",
        border: "1px solid var(--navy-600)",
        borderRadius: "var(--radius-xl)",
        color: "#fff",
        boxShadow: "var(--shadow-lg)",
        ...style,
      }}
    >
      <span style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "var(--grad-gold)" }} />
      <span
        style={{
          position: "absolute",
          right: -20,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 240,
          lineHeight: 1,
          color: "rgba(201,162,39,0.07)",
          pointerEvents: "none",
        }}
      >
        ★
      </span>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-8)",
          flexWrap: "wrap",
          padding: "clamp(24px, 4vw, 44px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 620 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 12.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--gold-400)",
            }}
          >
            <span style={{ width: 22, height: 2, background: "var(--gold-500)" }} />
            {kicker}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(30px, 3.6vw, 46px)",
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: "#fff",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--navy-100)", margin: 0 }}>{text}</p>
        </div>
        <Button as="a" href={href} variant="accent" size="lg" rightIcon={<Icon name="arrow-right" size={18} />}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
