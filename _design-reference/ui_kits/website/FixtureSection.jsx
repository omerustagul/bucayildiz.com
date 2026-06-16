// Buca Yıldız — Güncel fikstür section (navy band)
const { SectionHeading, FixtureCard, Button, Badge } = window.BucaYLdZTasarMSistemi_45a34f;
const CREST = '../../assets/logo-emblem.png';

function FixtureSection() {
  return (
    <section style={{ background: 'var(--grad-navy-deep)', position: 'relative', overflow: 'hidden' }}>
      <span style={{ position: 'absolute', right: -80, top: -60, fontSize: 420, lineHeight: 1, color: 'rgba(201,162,39,0.04)', pointerEvents: 'none' }}>★</span>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 32px', position: 'relative' }}>
        <SectionHeading kicker="Fikstür" title="Güncel Maç Programı" onDark
          action={<Button variant="on-navy" size="sm">Tüm Fikstür</Button>}
          style={{ marginBottom: 32 }} />
        <div className="hp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'stretch' }}>
          {/* Next match feature */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 'var(--radius-xl)', padding: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge tone="gold">Sıradaki Maç</Badge>
              <span style={{ fontSize: 13, color: 'var(--navy-200)', fontWeight: 500 }}>U-17 Gelişim Ligi · 22. Hafta</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <img src={CREST} alt="" style={{ width: 84, height: 84, objectFit: 'contain' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase', color: '#fff', textAlign: 'center', lineHeight: 1 }}>Buca Yıldız</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 44, color: 'var(--gold-400)', fontVariantNumeric: 'tabular-nums' }}>19:00</span>
                <span style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--navy-200)' }}>14 Haziran Cmt</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 84, height: 84, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.18)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 30, color: '#fff' }}>KS</div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase', color: '#fff', textAlign: 'center', lineHeight: 1 }}>Karşıyaka SK</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: 20 }}>
              <span style={{ fontSize: 13.5, color: 'var(--navy-100)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <i data-lucide="map-pin" style={{ width: 15, height: 15 }}></i> Buca Yıldız Tesisleri · Saha 1
              </span>
              <Button variant="accent" size="sm">Maç Detayı</Button>
            </div>
          </div>
          {/* Recent / upcoming compact */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16 }}>
            <FixtureCard competition="U-15 Bölgesel" status="finished" venue="Sonuç · İskenderun Stadı"
              home={{ name: 'Buca Yıldız', crest: CREST, score: 3 }} away={{ name: 'Altay', score: 1 }} />
            <FixtureCard competition="U-18 Gelişim" date="21 Haz · 17:30" status="upcoming" venue="Deplasman · Bornova"
              home={{ name: 'Göztepe', }} away={{ name: 'Buca Yıldız', crest: CREST, time: '17:30' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
window.FixtureSection = FixtureSection;
