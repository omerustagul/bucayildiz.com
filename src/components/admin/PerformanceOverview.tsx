import Link from "next/link";
import { StatTile } from "@/components/admin/kit";
import { Icon } from "@/lib/icons";

type Pending = { id: string; name: string; teamName: string; lastDate: string | null };
type Recent = { id: string; athleteId: string; athleteName: string; teamName: string; measuredAt: string; note: string | null };

const panel: React.CSSProperties = {
  background: "var(--surface-card)", border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)", overflow: "hidden", display: "flex", flexDirection: "column",
};
const panelHead: React.CSSProperties = {
  padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)",
  display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10,
};
const panelTitle: React.CSSProperties = {
  fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: ".04em",
  textTransform: "uppercase", color: "var(--text-strong)",
};
const rowLink: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, padding: "11px 18px",
  borderTop: "1px solid var(--border-subtle)", textDecoration: "none", color: "inherit",
};
const nameStyle: React.CSSProperties = { fontWeight: 600, fontSize: 13.5, color: "var(--text-strong)" };
const subStyle: React.CSSProperties = { fontSize: 12, color: "var(--ink-400)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };

/** Sporcu seçilmeden önce gösterilen takım-geneli performans özeti. */
export function PerformanceOverview({
  athletesTotal, measuredCount, thisMonthCount, totalRecords, pending, recent,
}: {
  athletesTotal: number; measuredCount: number; thisMonthCount: number; totalRecords: number;
  pending: Pending[]; recent: Recent[];
}) {
  const never = pending.filter((p) => p.lastDate === null).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <StatTile label="Toplam Sporcu" value={athletesTotal} icon="users" />
        <StatTile label="Ölçülen Sporcu" value={`${measuredCount}/${athletesTotal}`} icon="heart-pulse" sub={never > 0 ? `${never} sporcu hiç ölçülmedi` : "tümü en az bir kez ölçüldü"} />
        <StatTile label="Bu Ay Ölçüm" value={thisMonthCount} icon="calendar-days" accent />
        <StatTile label="Toplam Kayıt" value={totalRecords} icon="clipboard-list" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
        {/* Ölçüm bekleyenler */}
        <div style={panel}>
          <div style={panelHead}>
            <span style={panelTitle}>Ölçüm Bekleyenler</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>en uzun süredir ölçülmeyenler</span>
          </div>
          {pending.length === 0 ? (
            <div style={{ padding: "28px 18px", textAlign: "center", fontSize: 13.5, color: "var(--text-muted)" }}>Henüz sporcu yok.</div>
          ) : (
            pending.map((p) => (
              <Link key={p.id} href={`/admin/performans?athlete=${p.id}`} style={rowLink}>
                <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
                  <div style={nameStyle}>{p.name}</div>
                  <div style={subStyle}>{p.teamName}</div>
                </div>
                {p.lastDate ? (
                  <span style={{ fontSize: 12.5, color: "var(--ink-500)", whiteSpace: "nowrap" }}>Son: {p.lastDate}</span>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase", color: "var(--red-600)", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", padding: "2px 8px", whiteSpace: "nowrap" }}>Hiç ölçülmedi</span>
                )}
                <span style={{ color: "var(--ink-300)", display: "inline-flex" }}><Icon name="chevron-right" size={16} /></span>
              </Link>
            ))
          )}
        </div>

        {/* Son ölçümler */}
        <div style={panel}>
          <div style={panelHead}>
            <span style={panelTitle}>Son Ölçümler</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>son eklenen kayıtlar</span>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: "28px 18px", textAlign: "center", fontSize: 13.5, color: "var(--text-muted)" }}>Henüz ölçüm girilmedi.</div>
          ) : (
            recent.map((r) => (
              <Link key={r.id} href={`/admin/performans?athlete=${r.athleteId}`} style={rowLink}>
                <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
                  <div style={nameStyle}>{r.athleteName}</div>
                  <div style={subStyle}>{r.teamName}{r.note ? ` · ${r.note}` : ""}</div>
                </div>
                <span style={{ fontSize: 12.5, color: "var(--ink-500)", whiteSpace: "nowrap" }}>{r.measuredAt}</span>
                <span style={{ color: "var(--ink-300)", display: "inline-flex" }}><Icon name="chevron-right" size={16} /></span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
