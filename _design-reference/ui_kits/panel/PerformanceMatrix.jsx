// Buca Yıldız — Sporcu Performans Matrisi (section 3)
const { StatTile, ProgressRing, MetricBar, Badge } = window.BucaYLdZTasarMSistemi_45a34f;
const MI = (n, sz = 16) => React.createElement('i', { 'data-lucide': n, style: { width: sz, height: sz } });

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ width: 18, height: 2, background: 'var(--gold-500)' }} />
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-600)', margin: 0 }}>{children}</h2>
    </div>
  );
}

function CardHead({ icon, title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--navy-50)', color: 'var(--navy-600)', display: 'grid', placeItems: 'center' }}>{MI(icon, 16)}</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, color: 'var(--text-strong)', margin: 0 }}>{title}</h3>
      </div>
      {right}
    </div>
  );
}

const cardStyle = { background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 22, display: 'flex', flexDirection: 'column' };

// ---- VO2 Max trend sparkline ----
function Sparkline({ data, w = 340, h = 96 }) {
  const min = Math.min(...data) - 1, max = Math.max(...data) + 1;
  const px = (i) => (i / (data.length - 1)) * (w - 8) + 4;
  const py = (v) => h - 8 - ((v - min) / (max - min)) * (h - 20);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const area = `${line} L${px(data.length - 1).toFixed(1)} ${h} L${px(0).toFixed(1)} ${h} Z`;
  const lastX = px(data.length - 1), lastY = py(data[data.length - 1]);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="vo2grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold-400)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="var(--gold-400)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#vo2grad)" />
      <path d={line} fill="none" stroke="var(--gold-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="4.5" fill="var(--gold-600)" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

// ---- Atletik profil radar (hexagon) ----
function Radar({ axes, size = 220 }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 28;
  const n = axes.length;
  const pt = (i, r) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const ring = (frac) => axes.map((_, i) => pt(i, R * frac).join(',')).join(' ');
  const shape = axes.map((ax, i) => pt(i, R * (ax.value / 100)).join(',')).join(' ');
  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      {[0.33, 0.66, 1].map((f) => (
        <polygon key={f} points={ring(f)} fill="none" stroke="var(--ink-200)" strokeWidth="1" />
      ))}
      {axes.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--ink-200)" strokeWidth="1" />; })}
      <polygon points={shape} fill="rgba(21,41,90,0.16)" stroke="var(--navy-700)" strokeWidth="2" strokeLinejoin="round" />
      {axes.map((ax, i) => {
        const [x, y] = pt(i, R * (ax.value / 100));
        return <circle key={i} cx={x} cy={y} r="3.5" fill="var(--gold-500)" stroke="#fff" strokeWidth="1.5" />;
      })}
      {axes.map((ax, i) => {
        const [x, y] = pt(i, R + 16);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, fill: 'var(--ink-500)' }}>{ax.label}</text>;
      })}
    </svg>
  );
}

const VO2_HISTORY = [51.2, 52.8, 53.4, 54.1, 55.0, 56.4];
const RADAR = [
  { label: 'Sürat', value: 78 },
  { label: 'Dayanıklılık', value: 85 },
  { label: 'Güç', value: 70 },
  { label: 'Teknik', value: 88 },
  { label: 'Taktik', value: 82 },
  { label: 'Pas', value: 90 },
];

function PerformanceMatrix() {
  return (
    <section>
      <SectionTitle>Sporcu Performans Matrisi</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr 1.25fr', gap: 18, alignItems: 'stretch' }}>
        {/* VO2 Max */}
        <div style={cardStyle}>
          <CardHead icon="heart-pulse" title="VO2 Max" right={<Badge tone="success">Mükemmel</Badge>} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 46, lineHeight: 1, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>56.4</span>
            <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 600, fontSize: 15, color: 'var(--ink-400)' }}>ml/kg/dk</span>
            <span style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 700, color: 'var(--green-600)', background: 'var(--green-100)', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>▲ 3.1%</span>
          </div>
          <div style={{ margin: '14px 0 6px' }}><Sparkline data={VO2_HISTORY} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-400)' }}>
            <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
            <MetricBar label="Yaş grubu yüzdelik dilim" value={92} display="92." color="var(--navy-700)" />
          </div>
        </div>

        {/* Body composition */}
        <div style={cardStyle}>
          <CardHead icon="scale" title="Vücut Kompozisyonu" />
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: 12, flex: 1, alignItems: 'center' }}>
            <ProgressRing value={11.2} max={30} display="11.2%" sublabel="yağ" label="Vücut Yağ" color="var(--gold-600)" size={118} stroke={11} />
            <ProgressRing value={42.5} max={60} display="42.5%" sublabel="kas" label="Kas Oranı" color="var(--navy-600)" size={118} stroke={11} />
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ink-500)' }}>
            <span>Son ölçüm: 8 Haz 2026</span>
            <span style={{ color: 'var(--green-600)', fontWeight: 600 }}>Hedef aralığında</span>
          </div>
        </div>

        {/* Athletic radar */}
        <div style={cardStyle}>
          <CardHead icon="radar" title="Atletik Profil" right={<span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>0–100</span>} />
          <Radar axes={RADAR} />
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 18 }}>
        <StatTile label="Sprint 30m" value="4.18" unit="sn" delta="0.06" deltaTone="down" sub="daha hızlı" accent />
        <StatTile label="Dikey Sıçrama" value="58" unit="cm" delta="2" deltaTone="up" sub="cm" />
        <StatTile label="Maks. Nabız" value="196" unit="bpm" delta="0" deltaTone="neutral" sub="stabil" />
        <StatTile label="Antrenman Yükü" value="412" unit="AU" delta="8%" deltaTone="up" sub="bu hafta" />
      </div>
    </section>
  );
}
window.PerformanceMatrix = PerformanceMatrix;
