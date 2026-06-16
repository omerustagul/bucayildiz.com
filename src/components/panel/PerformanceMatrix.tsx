import { StatTile } from "@/components/admin/kit";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { MetricBar } from "@/components/ui/MetricBar";
import { Icon, type IconName } from "@/lib/icons";

export type Perf = {
  vo2: number | null;
  vo2History: number[];
  percentile: number | null;
  bodyFat: number | null;
  muscle: number | null;
  speed: number | null;
  endurance: number | null;
  power: number | null;
  technique: number | null;
  tactic: number | null;
  passing: number | null;
  sprint30: number | null;
  verticalJump: number | null;
  maxHr: number | null;
  trainingLoad: number | null;
  measuredAt: string | null;
};

const MONTHS_SHORT = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const cardStyle: React.CSSProperties = { background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", padding: 22, display: "flex", flexDirection: "column" };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ width: 18, height: 2, background: "var(--gold-500)" }} />
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", margin: 0 }}>{children}</h2>
    </div>
  );
}

function CardHead({ icon, title, right }: { icon: IconName; title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ width: 30, height: 30, borderRadius: "var(--radius-sm)", background: "var(--navy-50)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}><Icon name={icon} size={16} /></span>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 18, color: "var(--text-strong)", margin: 0 }}>{title}</h3>
      </div>
      {right}
    </div>
  );
}

function Sparkline({ data, w = 340, h = 96 }: { data: number[]; w?: number; h?: number }) {
  if (data.length < 2) return <div style={{ height: h, display: "grid", placeItems: "center", color: "var(--ink-300)", fontSize: 12 }}>Yeterli geçmiş veri yok</div>;
  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  const px = (i: number) => (i / (data.length - 1)) * (w - 8) + 4;
  const py = (v: number) => h - 8 - ((v - min) / (max - min)) * (h - 20);
  const line = data.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  const area = `${line} L${px(data.length - 1).toFixed(1)} ${h} L${px(0).toFixed(1)} ${h} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vo2grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold-400)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="var(--gold-400)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#vo2grad)" />
      <path d={line} fill="none" stroke="var(--gold-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={px(data.length - 1)} cy={py(data[data.length - 1])} r="4.5" fill="var(--gold-600)" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

function Radar({ axes, size = 220 }: { axes: { label: string; value: number }[]; size?: number }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 28, n = axes.length;
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const ring = (frac: number) => axes.map((_, i) => pt(i, R * frac).join(",")).join(" ");
  const shape = axes.map((ax, i) => pt(i, R * (ax.value / 100)).join(",")).join(" ");
  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      {[0.33, 0.66, 1].map((f) => <polygon key={f} points={ring(f)} fill="none" stroke="var(--ink-200)" strokeWidth="1" />)}
      {axes.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--ink-200)" strokeWidth="1" />; })}
      <polygon points={shape} fill="rgba(21,41,90,0.16)" stroke="var(--navy-700)" strokeWidth="2" strokeLinejoin="round" />
      {axes.map((ax, i) => { const [x, y] = pt(i, R * (ax.value / 100)); return <circle key={i} cx={x} cy={y} r="3.5" fill="var(--gold-500)" stroke="#fff" strokeWidth="1.5" />; })}
      {axes.map((ax, i) => { const [x, y] = pt(i, R + 16); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, fill: "var(--ink-500)" }}>{ax.label}</text>; })}
    </svg>
  );
}

export function PerformanceMatrix({ perf }: { perf: Perf | null }) {
  if (!perf) {
    return (
      <section>
        <SectionTitle>Sporcu Performans Matrisi</SectionTitle>
        <div style={{ ...cardStyle, alignItems: "center", textAlign: "center", padding: "48px 24px", color: "var(--ink-400)" }}>
          <span style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: "50%", background: "var(--surface-subtle)", color: "var(--navy-400)", marginBottom: 14 }}><Icon name="heart-pulse" size={26} /></span>
          <p style={{ margin: 0, fontSize: 15, color: "var(--ink-600)" }}>Henüz performans ölçümü girilmedi.</p>
          <p style={{ margin: "6px 0 0", fontSize: 13 }}>Antrenörünüz ölçüm girdikçe gelişiminiz burada görünecek.</p>
        </div>
      </section>
    );
  }

  const history = perf.vo2History;
  const vo2delta = history.length >= 2 ? (((history[history.length - 1] - history[history.length - 2]) / history[history.length - 2]) * 100) : null;
  const measuredMonth = perf.measuredAt ? Number(perf.measuredAt.split("-")[1]) - 1 : new Date().getMonth();
  const monthLabels = history.map((_, i) => MONTHS_SHORT[(measuredMonth - (history.length - 1 - i) + 1200) % 12]);

  const radar = [
    { label: "Sürat", value: perf.speed ?? 0 },
    { label: "Dayanıklılık", value: perf.endurance ?? 0 },
    { label: "Güç", value: perf.power ?? 0 },
    { label: "Teknik", value: perf.technique ?? 0 },
    { label: "Taktik", value: perf.tactic ?? 0 },
    { label: "Pas", value: perf.passing ?? 0 },
  ];

  return (
    <section>
      <SectionTitle>Sporcu Performans Matrisi</SectionTitle>
      <div className="perf-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 1.25fr", gap: 18, alignItems: "stretch" }}>
        {/* VO2 Max */}
        <div style={cardStyle}>
          <CardHead icon="heart-pulse" title="VO2 Max" right={perf.vo2 ? <Badge tone="success">Ölçüldü</Badge> : undefined} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 46, lineHeight: 1, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{perf.vo2?.toFixed(1) ?? "—"}</span>
            <span style={{ fontFamily: "var(--font-stat)", fontWeight: 600, fontSize: 15, color: "var(--ink-400)" }}>ml/kg/dk</span>
            {vo2delta != null && (
              <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 700, color: vo2delta >= 0 ? "var(--green-600)" : "var(--red-600)", background: vo2delta >= 0 ? "var(--green-100)" : "var(--red-100)", padding: "3px 8px", borderRadius: "var(--radius-sm)" }}>
                {vo2delta >= 0 ? "▲" : "▼"} {Math.abs(vo2delta).toFixed(1)}%
              </span>
            )}
          </div>
          <div style={{ margin: "14px 0 6px" }}><Sparkline data={history} /></div>
          {monthLabels.length >= 2 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--ink-400)" }}>
              {monthLabels.map((m, i) => <span key={i}>{m}</span>)}
            </div>
          )}
          {perf.percentile != null && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
              <MetricBar label="Yaş grubu yüzdelik dilim" value={perf.percentile} display={`${perf.percentile}.`} color="var(--navy-700)" />
            </div>
          )}
        </div>

        {/* Body composition */}
        <div style={cardStyle}>
          <CardHead icon="heart-pulse" title="Vücut Kompozisyonu" />
          <div style={{ display: "flex", justifyContent: "space-around", gap: 12, flex: 1, alignItems: "center" }}>
            <ProgressRing value={perf.bodyFat ?? 0} max={30} display={`${perf.bodyFat?.toFixed(1) ?? "—"}%`} sublabel="yağ" label="Vücut Yağ" color="var(--gold-600)" size={118} stroke={11} />
            <ProgressRing value={perf.muscle ?? 0} max={60} display={`${perf.muscle?.toFixed(1) ?? "—"}%`} sublabel="kas" label="Kas Oranı" color="var(--navy-600)" size={118} stroke={11} />
          </div>
          {perf.measuredAt && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", fontSize: 12.5, color: "var(--ink-500)" }}>Son ölçüm: {perf.measuredAt}</div>
          )}
        </div>

        {/* Radar */}
        <div style={cardStyle}>
          <CardHead icon="trophy" title="Atletik Profil" right={<span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>0–100</span>} />
          <Radar axes={radar} />
        </div>
      </div>

      {/* KPI row */}
      <div className="perf-kpi" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 18 }}>
        <StatTile label="Sprint 30m" value={perf.sprint30?.toFixed(2) ?? "—"} unit="sn" accent />
        <StatTile label="Dikey Sıçrama" value={perf.verticalJump ?? "—"} unit="cm" />
        <StatTile label="Maks. Nabız" value={perf.maxHr ?? "—"} unit="bpm" />
        <StatTile label="Antrenman Yükü" value={perf.trainingLoad ?? "—"} unit="AU" sub="bu hafta" />
      </div>
    </section>
  );
}
