import Link from "next/link";
import { Icon, type IconName } from "@/lib/icons";

/** Reusable content blocks for inner pages. All stateless (server components). */

export function LinkCardGrid({
  items,
}: {
  items: { title: string; text: string; href: string; icon?: IconName }[];
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
      {items.map((it) => (
        <Link
          key={it.title}
          href={it.href}
          className="link-card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            boxShadow: "var(--shadow-sm)",
            textDecoration: "none",
          }}
        >
          {it.icon && (
            <span style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--navy-50)", color: "var(--navy-700)", display: "grid", placeItems: "center" }}>
              <Icon name={it.icon} size={22} />
            </span>
          )}
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>
            {it.title}
          </h3>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-muted)", margin: 0, flex: 1 }}>{it.text}</p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)" }}>
            İncele <Icon name="arrow-right" size={15} />
          </span>
        </Link>
      ))}
    </div>
  );
}

const BG: Record<string, string> = {
  page: "var(--surface-page)",
  subtle: "var(--surface-subtle)",
  navy: "var(--grad-navy)",
};

export function Section({
  background = "page",
  children,
  style = {},
}: {
  background?: keyof typeof BG;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section style={{ background: BG[background], ...style }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(48px,6vw,88px) 32px" }}>{children}</div>
    </section>
  );
}

export function Prose({ children, maxWidth = 760 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-lg)",
        lineHeight: 1.75,
        color: "var(--text-body)",
        maxWidth,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {children}
    </div>
  );
}

export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: { icon: IconName; title: string; text: string }[];
  columns?: number;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))`, gap: 20 }} data-cols={columns}>
      {items.map((it) => (
        <div
          key={it.title}
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: "var(--radius-sm)",
              background: "var(--navy-50)",
              color: "var(--navy-700)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name={it.icon} size={22} />
          </span>
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>
            {it.title}
          </h3>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{it.text}</p>
        </div>
      ))}
    </div>
  );
}

export function StatStrip({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`, gap: 1, background: "var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
      {stats.map((s) => (
        <div key={s.label} style={{ background: "var(--surface-card)", padding: "28px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 40, color: "var(--navy-700)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 12.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 8, fontWeight: 600 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/** A navy feature panel (icon list / highlight box). */
export function NavyPanel({
  title,
  items,
}: {
  title: string;
  items: { icon: IconName; text: string }[];
}) {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--grad-navy-deep)", borderRadius: "var(--radius-xl)", padding: "clamp(28px,4vw,44px)", color: "#fff" }}>
      <span aria-hidden style={{ position: "absolute", right: -40, bottom: -40, fontSize: 280, color: "rgba(201,162,39,0.05)", lineHeight: 1 }}>
        ★
      </span>
      <div style={{ position: "relative" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--text-h3)", textTransform: "uppercase", color: "#fff", margin: "0 0 20px" }}>
          {title}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map((it) => (
            <div key={it.text} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
              <span style={{ flex: "none", width: 34, height: 34, borderRadius: "var(--radius-sm)", background: "rgba(201,162,39,0.14)", color: "var(--gold-400)", display: "grid", placeItems: "center" }}>
                <Icon name={it.icon} size={17} />
              </span>
              <span style={{ fontSize: 15, lineHeight: 1.5, color: "#fff", paddingTop: 6 }}>{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
