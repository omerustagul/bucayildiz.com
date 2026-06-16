// Buca Yıldız — Program Takvimi (section 2): interactive weekly ⇄ monthly calendar
const { Badge, IconButton } = window.BucaYLdZTasarMSistemi_45a34f;
const CI = (n, sz = 16) => React.createElement('i', { 'data-lucide': n, style: { width: sz, height: sz } });

const TODAY = new Date(2026, 5, 12); // 12 Haziran 2026
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const DOW = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const TYPES = {
  saha:      { label: 'Saha Antrenmanı', color: 'var(--navy-600)', soft: 'var(--navy-50)' },
  kondisyon: { label: 'Kondisyon',       color: 'var(--gold-600)', soft: 'var(--gold-100)' },
  taktik:    { label: 'Taktik',          color: 'var(--green-600)', soft: 'var(--green-100)' },
  mac:       { label: 'Maç',             color: 'var(--red-600)',  soft: 'var(--red-100)' },
  bireysel:  { label: 'Bireysel',        color: 'var(--navy-400)', soft: 'var(--ink-100)' },
  izin:      { label: 'İzin',            color: 'var(--ink-300)',  soft: 'var(--ink-50)' },
};

// Deterministic weekly training pattern → any date gets a program
function eventsFor(date) {
  const d = date.getDay(); // 0 Sun .. 6 Sat
  const P = {
    1: [['17:00', 'saha'], ['18:30', 'kondisyon']],
    2: [['17:30', 'taktik']],
    3: [['17:00', 'saha'], ['19:00', 'bireysel']],
    4: [['17:30', 'kondisyon']],
    5: [['17:00', 'saha'], ['18:30', 'taktik']],
    6: [['11:00', 'mac']],
    0: [['—', 'izin']],
  }[d] || [];
  return P.map(([time, type]) => ({ time, type }));
}

const startOfWeek = (d) => { const x = new Date(d); const wd = (x.getDay() + 6) % 7; x.setDate(x.getDate() - wd); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n, 1); return x; };
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function EventChip({ ev, compact }) {
  const t = TYPES[ev.type];
  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--ink-700)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <span style={{ width: 6, height: 6, borderRadius: 2, background: t.color, flex: 'none' }} />
        <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--ink-400)' }}>{ev.time}</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: t.soft, borderLeft: `3px solid ${t.color}` }}>
      <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 12.5, color: 'var(--ink-700)', fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-800)', lineHeight: 1.15 }}>{t.label}</span>
    </div>
  );
}

function WeekView({ anchor }) {
  const mon = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
      {days.map((day, i) => {
        const today = sameDay(day, TODAY);
        const evs = eventsFor(day);
        return (
          <div key={i} style={{ background: today ? 'var(--navy-50)' : 'var(--surface-card)', border: `1px solid ${today ? 'var(--navy-300)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', overflow: 'hidden', minHeight: 188, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: today ? 'var(--navy-700)' : 'transparent' }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: today ? '#fff' : 'var(--ink-400)' }}>{DOW[i]}</span>
              <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 16, color: today ? 'var(--gold-400)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{day.getDate()}</span>
            </div>
            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              {evs.map((ev, j) => <EventChip key={j} ev={ev} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MonthView({ anchor, onPickDay }) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = startOfWeek(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
        {DOW.map((d) => <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-400)', padding: '2px 0' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', gap: 6 }}>
        {cells.map((day, i) => {
          const inMonth = day.getMonth() === anchor.getMonth();
          const today = sameDay(day, TODAY);
          const evs = eventsFor(day);
          return (
            <button key={i} onClick={() => onPickDay(day)} style={{
              textAlign: 'left', cursor: 'pointer', font: 'inherit',
              background: today ? 'var(--navy-50)' : 'var(--surface-card)',
              border: `1px solid ${today ? 'var(--navy-300)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-sm)', padding: '7px 8px', minHeight: 92,
              opacity: inMonth ? 1 : 0.42, display: 'flex', flexDirection: 'column', gap: 5,
            }}>
              <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 14, color: today ? 'var(--navy-700)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', alignSelf: today ? 'flex-start' : 'auto', background: today ? 'var(--gold-300)' : 'transparent', borderRadius: 3, padding: today ? '0 5px' : 0 }}>{day.getDate()}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, overflow: 'hidden' }}>
                {evs.slice(0, 2).map((ev, j) => <EventChip key={j} ev={ev} compact />)}
                {evs.length > 2 && <span style={{ fontSize: 10.5, color: 'var(--ink-400)', fontWeight: 600 }}>+{evs.length - 2} daha</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 14 }}>
      {Object.entries(TYPES).map(([k, t]) => (
        <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-500)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: t.color }} />{t.label}
        </span>
      ))}
    </div>
  );
}

function TrainingCalendar() {
  const [view, setView] = React.useState('week');
  const [anchor, setAnchor] = React.useState(new Date(TODAY));

  const go = (dir) => setAnchor((a) => view === 'week' ? addDays(a, dir * 7) : addMonths(a, dir));
  const mon = startOfWeek(anchor);
  const title = view === 'week'
    ? `${mon.getDate()} – ${addDays(mon, 6).getDate()} ${MONTHS[addDays(mon, 6).getMonth()]} ${anchor.getFullYear()}`
    : `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;

  const Seg = ({ id, label }) => (
    <button onClick={() => setView(id)} style={{
      font: 'inherit', cursor: 'pointer', padding: '7px 16px', borderRadius: 'var(--radius-sm)', border: 'none',
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '.02em',
      background: view === id ? 'var(--navy-700)' : 'transparent', color: view === id ? '#fff' : 'var(--ink-500)',
    }}>{label}</button>
  );

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ width: 18, height: 2, background: 'var(--gold-500)' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-600)', margin: 0 }}>Program Takvimi</h2>
      </div>
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconButton label="Önceki" variant="outline" size="sm" onClick={() => go(-1)}>{CI('chevron-left', 16)}</IconButton>
            <IconButton label="Sonraki" variant="outline" size="sm" onClick={() => go(1)}>{CI('chevron-right', 16)}</IconButton>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 21, textTransform: 'uppercase', color: 'var(--text-strong)', margin: 0 }}>{title}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--ink-100)', borderRadius: 'var(--radius-md)' }}>
              <Seg id="week" label="Hafta" />
              <Seg id="month" label="Ay" />
            </div>
            <IconButton label={view === 'week' ? 'Aylık görünüme büyüt' : 'Haftalık görünüme küçült'} variant="outline" size="sm"
              onClick={() => setView((v) => v === 'week' ? 'month' : 'week')}>
              {CI(view === 'week' ? 'maximize-2' : 'minimize-2', 16)}
            </IconButton>
          </div>
        </div>
        {view === 'week'
          ? <WeekView anchor={anchor} />
          : <MonthView anchor={anchor} onPickDay={(d) => { setAnchor(d); setView('week'); }} />}
        <Legend />
      </div>
    </section>
  );
}
window.TrainingCalendar = TrainingCalendar;
