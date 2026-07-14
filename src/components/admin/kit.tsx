import { Icon, type IconName } from "@/lib/icons";

/** Buca Yıldız Admin — durumsuz yapı taşları (server + client uyumlu). */

export const cardStyle: React.CSSProperties = {
  background: "var(--surface-card)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-sm)",
};

export function ViewHeader({ title, subtitle, actions, tabs }: { title: string; subtitle?: string; actions?: React.ReactNode; tabs?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 30, textTransform: "uppercase", color: "var(--text-strong)", margin: 0, lineHeight: 1 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 14, color: "var(--ink-500)", margin: "8px 0 0" }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>}
      </div>
      {tabs}
    </div>
  );
}

export function Panel({ title, action, children, pad = 22, style = {} }: { title?: string; action?: React.ReactNode; children: React.ReactNode; pad?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ ...cardStyle, ...style }}>
      {(title || action) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
          {title && <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 17, color: "var(--text-strong)", margin: 0 }}>{title}</h3>}
          {action}
        </div>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </div>
  );
}

export function Toolbar({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", ...style }}>{children}</div>;
}

export function Field({ label, required, hint, children, style = {} }: { label?: string; required?: boolean; hint?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, ...style }}>
      {label && (
        <label style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)" }}>
          {label}
          {required && <span style={{ color: "var(--gold-600)" }}> *</span>}
        </label>
      )}
      {children}
      {hint && <span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{hint}</span>}
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} style={{ display: "contents" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  flex: "none",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-stat)",
                  fontWeight: 700,
                  fontSize: 14,
                  background: active ? "var(--navy-700)" : done ? "var(--green-600)" : "var(--ink-100)",
                  color: active || done ? "#fff" : "var(--ink-400)",
                  border: active ? "2px solid var(--gold-400)" : "none",
                }}
              >
                {done ? <Icon name="check" size={15} /> : i + 1}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontWeight: active ? 600 : 500, fontSize: 13.5, color: active ? "var(--text-strong)" : "var(--ink-500)", whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <span style={{ flex: 1, height: 2, background: done ? "var(--green-600)" : "var(--ink-200)", margin: "0 14px", minWidth: 24 }} />}
          </div>
        );
      })}
    </div>
  );
}

const STAT_TONES: Record<string, { color: string; bg: string; sign: string }> = {
  up: { color: "var(--green-600)", bg: "var(--green-100)", sign: "▲" },
  down: { color: "var(--red-600)", bg: "var(--red-100)", sign: "▼" },
  neutral: { color: "var(--ink-500)", bg: "var(--ink-100)", sign: "•" },
};

export function StatTile({
  label,
  value,
  unit,
  delta,
  deltaTone = "up",
  icon,
  sub,
  accent = false,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  icon?: IconName;
  sub?: string;
  accent?: boolean;
}) {
  const t = STAT_TONES[deltaTone] ?? STAT_TONES.neutral;
  return (
    <div style={{ position: "relative", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)", overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
      {accent && <span style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: "var(--grad-gold)" }} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-500)" }}>{label}</span>
        {icon && <span style={{ display: "inline-flex", color: "var(--navy-400)" }}><Icon name={icon} size={18} /></span>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 34, lineHeight: 1, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
        {unit && <span style={{ fontFamily: "var(--font-stat)", fontWeight: 600, fontSize: 15, color: "var(--ink-400)" }}>{unit}</span>}
      </div>
      {(delta != null || sub) && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {delta != null && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: t.color, background: t.bg, padding: "3px 7px", borderRadius: "var(--radius-sm)" }}>
              <span style={{ fontSize: 9 }}>{t.sign}</span>
              {delta}
            </span>
          )}
          {sub && <span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}
