/** Buca Yıldız — MetricBar. Horizontal labeled progress bar. */
export function MetricBar({
  label,
  value = 0,
  max = 100,
  display,
  color = "var(--navy-700)",
}: {
  label: string;
  value?: number;
  max?: number;
  display?: string;
  color?: string;
}) {
  const pct = Math.max(0, Math.min(1, value / max)) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13.5, color: "var(--ink-700)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 14, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{display ?? value}</span>
      </div>
      <div style={{ height: 8, borderRadius: "var(--radius-pill)", background: "var(--ink-100)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "var(--radius-pill)" }} />
      </div>
    </div>
  );
}
