// Buca Yıldız — Sporcu Bilgileri Kartı (section 1)
const { Badge, Button } = window.BucaYLdZTasarMSistemi_45a34f;
const AI = (n, sz = 16) => React.createElement('i', { 'data-lucide': n, style: { width: sz, height: sz } });

function Metric({ label, value, unit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 18px', background: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', minWidth: 96 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 24, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {unit && <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 600, fontSize: 13, color: 'var(--ink-400)' }}>{unit}</span>}
      </span>
    </div>
  );
}

function AthleteCard() {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ width: 18, height: 2, background: 'var(--gold-500)' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-600)', margin: 0 }}>Sporcu Bilgileri</h2>
      </div>
      <div className="pl-athlete" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', display: 'flex', gap: 0 }}>
        {/* Photo */}
        <div className="pl-athlete-photo" style={{ width: 188, flex: 'none', position: 'relative', background: 'var(--grad-navy)', display: 'grid', placeItems: 'center', minHeight: 160 }}>
          <div style={{ color: 'rgba(255,255,255,.18)' }}>{AI('user-round', 64)}</div>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-bottom)' }} />
          <span style={{ position: 'absolute', left: 14, bottom: 12, fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 42, color: 'var(--gold-400)', lineHeight: 1 }}>10</span>
        </div>
        {/* Info */}
        <div style={{ flex: 1, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 34, textTransform: 'uppercase', color: 'var(--text-strong)', margin: 0, lineHeight: 1 }}>Arda Yılmaz</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge tone="navy">U-17</Badge>
                <Badge tone="gold">Ofansif Orta Saha</Badge>
                <Badge tone="neutral">2009 doğumlu</Badge>
              </div>
            </div>
            <Button variant="secondary" size="sm" leftIcon={AI('pencil', 15)}>Profili Düzenle</Button>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Metric label="Boy" value="178" unit="cm" />
            <Metric label="Kilo" value="68" unit="kg" />
            <Metric label="Ayak" value="Sağ" />
            <Metric label="VKİ" value="21.5" />
            <Metric label="Lisans" value="34721" />
          </div>
        </div>
      </div>
    </section>
  );
}
window.AthleteCard = AthleteCard;
