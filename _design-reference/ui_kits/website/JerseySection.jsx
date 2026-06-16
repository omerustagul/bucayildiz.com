// Buca Yıldız — Formalar (jerseys) horizontal sliding showcase, transparent kits
const { SectionHeading } = window.BucaYLdZTasarMSistemi_45a34f;

const JERSEY_CLIP = 'polygon(30% 0,42% 8%,58% 8%,70% 0,100% 14%,87% 39%,78% 30%,78% 100%,22% 100%,22% 30%,13% 39%,0 14%)';

const KITS = [
  { no: '10', name: 'Yılmaz', kind: 'home' },
  { no: '7',  name: 'Demir', kind: 'away' },
  { no: '9',  name: 'Kaya', kind: 'third' },
  { no: '4',  name: 'Şahin', kind: 'home' },
  { no: '11', name: 'Aydın', kind: 'away' },
  { no: '1',  name: 'Çelik', kind: 'gk' },
];

const STYLES = {
  home:  { body: 'linear-gradient(160deg,#1D3568,#0E2148)', num: '#DDBA4E', trim: '#C9A227', label: 'İç Saha' },
  away:  { body: 'linear-gradient(160deg,#FFFFFF,#E8ECF3)', num: '#15295A', trim: '#15295A', label: 'Deplasman' },
  third: { body: 'linear-gradient(160deg,#E9CE79,#C9A227)', num: '#0E2148', trim: '#0E2148', label: 'Üçüncü' },
  gk:    { body: 'linear-gradient(160deg,#1E7D4F,#14543a)', num: '#F8EFD2', trim: '#F8EFD2', label: 'Kaleci' },
};

function Jersey({ no, name, kind }) {
  const s = STYLES[kind];
  return (
    <div className="by-jersey">
      <div style={{ position: 'relative', width: 180, height: 210, filter: 'drop-shadow(0 22px 30px rgba(0,0,0,.35))' }}>
        <div style={{ position: 'absolute', inset: 0, clipPath: JERSEY_CLIP, background: s.body }} />
        {/* collar */}
        <div style={{ position: 'absolute', top: '7%', left: '42%', width: '16%', height: '5%', background: s.trim, borderRadius: '0 0 40% 40%' }} />
        {/* number */}
        <span style={{ position: 'absolute', top: '34%', left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 64, color: s.num, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{no}</span>
        {/* name */}
        <span style={{ position: 'absolute', top: '20%', left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14, letterSpacing: '.12em', textTransform: 'uppercase', color: s.num, opacity: .85 }}>{name}</span>
      </div>
      <span className="by-jersey-label">{s.label}</span>
    </div>
  );
}

function JerseySection() {
  const loop = [...KITS, ...KITS];
  return (
    <section style={{ background: 'var(--grad-navy)', borderTop: '1px solid var(--navy-600)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px 24px' }}>
        <SectionHeading kicker="Mağaza" title="2025/26 Formalarımız" onDark
          style={{ marginBottom: 8, color: 'rgb(255, 255, 255)' }} />
      </div>
      <div className="by-marquee">
        <div className="by-marquee-track">
          {loop.map((k, i) => <Jersey key={i} {...k} />)}
        </div>
      </div>
      <div style={{ textAlign: 'center', paddingBottom: 64 }}>
        <span style={{ fontSize: 13, color: 'var(--navy-200)', letterSpacing: '.04em' }}>Resmi formalar yakında kulüp mağazasında · Üzerine gelin, kayma durur</span>
      </div>
    </section>
  );
}
window.JerseySection = JerseySection;
