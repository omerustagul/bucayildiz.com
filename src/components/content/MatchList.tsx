import type { Fixture } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";

/** Maç listesi — mobil öncelikli; dar ekranda kaydırmasız iki satırlı kart. */
export function MatchList({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {fixtures.map((f, i) => {
        const finished = f.status === "finished";
        const ours = f.home === "Buca Yıldız" || f.away === "Buca Yıldız";
        return (
          <div
            key={i}
            className="match-card"
            style={{
              background: "var(--surface-card)",
              border: `1px solid ${ours ? "var(--gold-300)" : "var(--border-subtle)"}`,
              borderLeft: `3px solid ${ours ? "var(--gold-500)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="match-meta">
              <span className="match-comp">{f.comp}</span>
              <span className="match-date">{f.date} · {f.time}</span>
              <span className="match-badge">
                <Badge tone={finished ? "neutral" : "gold"}>{finished ? "Bitti" : "Yaklaşan"}</Badge>
              </span>
            </div>
            <div className="match-teams">
              <span className="match-team match-team-home">{f.home}</span>
              <span className="match-score">{finished ? `${f.hs ?? "-"}–${f.as ?? "-"}` : f.time}</span>
              <span className="match-team">{f.away}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
