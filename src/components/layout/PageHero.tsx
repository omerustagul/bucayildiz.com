import Link from "next/link";
import { Icon } from "@/lib/icons";

export type Crumb = { label: string; href?: string };

/**
 * Buca Yıldız — PageHero
 * Standard navy banner at the top of every inner page: breadcrumb +
 * gold kicker + condensed uppercase title + optional lead paragraph.
 */
export function PageHero({
  title,
  kicker,
  lead,
  breadcrumb = [],
  badge,
}: {
  title: string;
  kicker?: string;
  lead?: string;
  breadcrumb?: Crumb[];
  /** Başlığın hemen üstünde gösterilen opsiyonel rozet (ör. "Son Dakika"). */
  badge?: React.ReactNode;
}) {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--grad-navy-deep)" }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: -70,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 360,
          lineHeight: 1,
          color: "rgba(201,162,39,0.05)",
          pointerEvents: "none",
        }}
      >
        ★
      </span>
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "clamp(36px,5vw,64px) 32px", position: "relative" }}>
        {breadcrumb.length > 0 && (
          <nav aria-label="breadcrumb" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            <Link href="/" className="footer-link" style={{ fontSize: 13, color: "var(--navy-200)" }}>
              Ana Sayfa
            </Link>
            {breadcrumb.map((c) => (
              <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon name="chevron-down" size={13} style={{ transform: "rotate(-90deg)", color: "var(--navy-300)" }} />
                {c.href ? (
                  <Link href={c.href} className="footer-link" style={{ fontSize: 13, color: "var(--navy-200)" }}>
                    {c.label}
                  </Link>
                ) : (
                  <span style={{ fontSize: 13, color: "var(--gold-400)", fontWeight: 600 }}>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {kicker && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--gold-400)",
              marginBottom: 12,
            }}
          >
            <span style={{ width: 22, height: 2, background: "var(--gold-500)" }} />
            {kicker}
          </span>
        )}

        {badge && <div style={{ marginBottom: 12 }}>{badge}</div>}

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "var(--text-h1)",
            lineHeight: 1.02,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "#fff",
            margin: 0,
            maxWidth: 900,
          }}
        >
          {title}
        </h1>

        {lead && (
          <p style={{ fontSize: "var(--text-lg)", lineHeight: 1.6, color: "var(--navy-100)", margin: "16px 0 0", maxWidth: 680 }}>
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
