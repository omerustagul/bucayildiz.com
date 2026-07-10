export type PublicStandingRow = {
  id: string;
  teamName: string;
  isOurs: boolean;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  sort: number;
};

const TH: React.CSSProperties = {
  textAlign: "center",
  padding: "12px 8px",
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--navy-200)",
};

const TD: React.CSSProperties = {
  textAlign: "center",
  padding: "13px 8px",
  fontFamily: "var(--font-stat)",
  fontWeight: 600,
  fontSize: 15,
  fontVariantNumeric: "tabular-nums",
  color: "var(--text-body)",
};

export function StandingsTable({ rows }: { rows: PublicStandingRow[] }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620, background: "var(--surface-card)" }}>
        <thead>
          <tr style={{ background: "var(--navy-800)" }}>
            <th style={{ ...TH, textAlign: "center", width: 48 }}>#</th>
            <th style={{ ...TH, textAlign: "left", paddingLeft: 16 }}>Takım</th>
            <th style={TH}>O</th>
            <th style={TH}>G</th>
            <th style={TH}>B</th>
            <th style={TH}>M</th>
            <th style={TH}>Av</th>
            <th style={{ ...TH, color: "var(--gold-400)" }}>P</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const ours = r.isOurs;
            const av = r.goalsFor - r.goalsAgainst;
            return (
              <tr key={r.id} style={{ borderTop: "1px solid var(--border-subtle)", background: ours ? "var(--navy-50)" : "transparent" }}>
                <td style={{ ...TD, color: "var(--text-muted)" }}>{i + 1}</td>
                <td style={{ textAlign: "left", padding: "13px 8px 13px 16px", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, textTransform: "uppercase", color: ours ? "var(--navy-700)" : "var(--text-strong)" }}>
                  {r.teamName}
                </td>
                <td style={TD}>{r.played}</td>
                <td style={TD}>{r.wins}</td>
                <td style={TD}>{r.draws}</td>
                <td style={TD}>{r.losses}</td>
                <td style={TD}>{av > 0 ? `+${av}` : av}</td>
                <td style={{ ...TD, fontWeight: 700, color: "var(--navy-800)" }}>{r.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
