// Buca Yıldız — Medya (görseller & videolar) section
const { SectionHeading, Button, Badge } = window.BucaYLdZTasarMSistemi_45a34f;

function PhotoTile({ label, tall }) {
  return (
    <a href="#" style={{ position: 'relative', display: 'block', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--grad-navy)', border: '1px solid var(--navy-700)', minHeight: tall ? 0 : 130, textDecoration: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.08)' }}>
        <i data-lucide="image" style={{ width: 30, height: 30 }}></i>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-bottom)' }} />
      <span style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: '.02em' }}>{label}</span>
    </a>
  );
}

function MediaSection() {
  return (
    <section style={{ background: 'var(--surface-subtle)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 32px' }}>
        <SectionHeading kicker="Medya" title="Görseller & Videolar"
          action={<Button variant="secondary" size="sm">Galeriye Git</Button>}
          style={{ marginBottom: 32 }} />
        <div className="hp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          {/* Featured video */}
          <a href="#" style={{ position: 'relative', display: 'block', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 360, background: 'var(--grad-navy)', border: '1px solid var(--navy-700)', textDecoration: 'none' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <span style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--grad-gold)', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-lg)' }}>
                <i data-lucide="play" style={{ width: 30, height: 30, color: 'var(--navy-900)', fill: 'var(--navy-900)' }}></i>
              </span>
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-bottom)' }} />
            <div style={{ position: 'absolute', left: 28, bottom: 24, right: 28 }}>
              <Badge tone="live" dot>Öne Çıkan</Badge>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 28, textTransform: 'uppercase', color: '#fff', margin: '12px 0 0', lineHeight: 1 }}>Sezon 2025/26 — Akademi Özeti</h3>
              <span style={{ fontSize: 13, color: 'var(--navy-100)', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6 }}><i data-lucide="clock" style={{ width: 14, height: 14 }}></i> 4:12</span>
            </div>
          </a>
          {/* Photo grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 14 }}>
            <PhotoTile label="Antrenman" tall />
            <PhotoTile label="Maç Günü" tall />
            <PhotoTile label="Ödül Töreni" tall />
            <PhotoTile label="Tesisler" tall />
          </div>
        </div>
      </div>
    </section>
  );
}
window.MediaSection = MediaSection;
