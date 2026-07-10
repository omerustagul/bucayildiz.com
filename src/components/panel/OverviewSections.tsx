import Link from "next/link";
import { Icon, type IconName } from "@/lib/icons";

/** Genel Bakış — rapor kartları ve hızlı erişim ızgarası.
 *  Server-render dostu (hook yok); mobil uygulama hissi için dokunma
 *  hedefleri büyük, ızgaralar auto-fit ile ekrana uyum sağlar. */

export type ReportItem = {
  href: string;
  icon: IconName;
  label: string;
  value: string;
  sub?: string;
  /** dikkat çekmesi gereken kart (ör. geciken ödeme, okunmamış mesaj) */
  accent?: boolean;
};

export function ReportCards({ items }: { items: ReportItem[] }) {
  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ width: 18, height: 2, background: "var(--gold-500)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", margin: 0 }}>Durum Özeti</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        {items.map((it) => (
          <Link
            key={it.href + it.label}
            href={it.href}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: "16px 16px 14px",
              minWidth: 0,
              textDecoration: "none",
              background: it.accent ? "var(--grad-navy)" : "var(--surface-card)",
              border: `1px solid ${it.accent ? "var(--navy-600)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 30, height: 30, flex: "none", borderRadius: 10, display: "grid", placeItems: "center", background: it.accent ? "rgba(233,200,96,.16)" : "var(--navy-50)", color: it.accent ? "var(--gold-300)" : "var(--navy-700)" }}>
                <Icon name={it.icon} size={16} />
              </span>
              <span style={{ minWidth: 0, fontSize: 11, fontWeight: 700, lineHeight: 1.25, letterSpacing: ".06em", textTransform: "uppercase", color: it.accent ? "rgba(255,255,255,.65)" : "var(--ink-500)" }}>
                {it.label}
              </span>
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 21, lineHeight: 1.15, color: it.accent ? "#fff" : "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>
                {it.value}
              </span>
              {it.sub && (
                <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12.5, marginTop: 2, color: it.accent ? "rgba(255,255,255,.55)" : "var(--ink-500)" }}>
                  {it.sub}
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export type QuickLink = { href: string; icon: IconName; label: string; badge?: number };

export function QuickAccess({ items }: { items: QuickLink[] }) {
  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ width: 18, height: 2, background: "var(--gold-500)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", margin: 0 }}>Hızlı Erişim</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(86px, 1fr))", gap: 10 }}>
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "14px 6px 12px",
              minWidth: 0,
              minHeight: 84,
              textDecoration: "none",
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span style={{ width: 40, height: 40, flex: "none", borderRadius: 13, display: "grid", placeItems: "center", background: "var(--grad-navy)", color: "var(--gold-300)" }}>
              <Icon name={it.icon} size={19} />
            </span>
            <span style={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, fontWeight: 700, color: "var(--text-strong)" }}>
              {it.label}
            </span>
            {it.badge != null && it.badge > 0 && (
              <span style={{ position: "absolute", top: 8, right: 8, minWidth: 18, padding: "3px 5px", borderRadius: "var(--radius-pill)", textAlign: "center", fontSize: 10.5, fontWeight: 700, lineHeight: 1, color: "var(--navy-900)", background: "var(--grad-gold)" }}>
                {it.badge > 99 ? "99+" : it.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
