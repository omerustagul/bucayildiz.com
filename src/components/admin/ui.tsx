import { Icon, type IconName } from "@/lib/icons";

/** Admin görünümleri için paylaşılan yapı taşları. */

export function ViewHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 28, textTransform: "uppercase", color: "var(--text-strong)", margin: 0, letterSpacing: "-0.01em" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const TONES: Record<string, { bg: string; fg: string }> = {
  navy: { bg: "var(--navy-50)", fg: "var(--navy-700)" },
  gold: { bg: "var(--gold-100)", fg: "var(--gold-700)" },
  green: { bg: "var(--green-100)", fg: "var(--green-600)" },
  red: { bg: "var(--red-100)", fg: "var(--red-600)" },
};

export function StatCard({ label, value, icon, tone = "navy" }: { label: string; value: string | number; icon: IconName; tone?: keyof typeof TONES }) {
  const t = TONES[tone] ?? TONES.navy;
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ flex: "none", width: 48, height: 48, borderRadius: "var(--radius-md)", background: t.bg, color: t.fg, display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={24} />
      </span>
      <div>
        <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 30, color: "var(--text-strong)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</div>
        <div style={{ fontSize: 12.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: 5, fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

export function Panel({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      {(title || action) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
          {title && <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

const STATUS_TONES: Record<string, { bg: string; fg: string; label: string }> = {
  new: { bg: "var(--gold-100)", fg: "var(--gold-800)", label: "Yeni" },
  contacted: { bg: "var(--navy-50)", fg: "var(--navy-700)", label: "İletişime Geçildi" },
  scheduled: { bg: "var(--green-100)", fg: "var(--green-600)", label: "Randevu Verildi" },
  closed: { bg: "var(--ink-100)", fg: "var(--ink-600)", label: "Kapandı" },
};

export const APPLICATION_STATUSES = Object.keys(STATUS_TONES);

export function statusLabel(status: string) {
  return STATUS_TONES[status]?.label ?? status;
}

export function StatusBadge({ status }: { status: string }) {
  const t = STATUS_TONES[status] ?? STATUS_TONES.new;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 11.5, letterSpacing: "0.04em", padding: "4px 9px", borderRadius: "var(--radius-sm)", background: t.bg, color: t.fg }}>
      {t.label}
    </span>
  );
}
