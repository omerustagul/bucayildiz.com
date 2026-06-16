import type { Fixture } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";

/** A responsive list of matches (program / results). */
export function MatchList({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {fixtures.map((f, i) => {
        const finished = f.status === "finished";
        const home = f.home === "Buca Yıldız";
        const ours = home || f.away === "Buca Yıldız";
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(120px, 0.8fr) 1.6fr auto",
              alignItems: "center",
              gap: 16,
              background: "var(--surface-card)",
              border: `1px solid ${ours ? "var(--gold-300)" : "var(--border-subtle)"}`,
              borderLeft: `3px solid ${ours ? "var(--gold-500)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-md)",
              padding: "14px 18px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)" }}>{f.comp}</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {f.date} · {f.time}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, textTransform: "uppercase", color: "var(--text-strong)" }}>
              <span style={{ flex: 1, textAlign: "right" }}>{f.home}</span>
              <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, color: finished ? "var(--navy-800)" : "var(--navy-400)", minWidth: 54, textAlign: "center" }}>
                {finished ? `${f.hs}–${f.as}` : f.time}
              </span>
              <span style={{ flex: 1 }}>{f.away}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <Badge tone={finished ? "neutral" : "gold"}>{finished ? "Bitti" : "Yaklaşan"}</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
