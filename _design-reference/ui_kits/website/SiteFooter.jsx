// Buca Yıldız — Footer with crest overhanging the top edge
const { IconButton, Button, Input } = window.BucaYLdZTasarMSistemi_45a34f;
const FLOGO = '../../assets/logo-emblem.png';
const FICON = (n) => React.createElement('i', { 'data-lucide': n, style: { width: 17, height: 17 } });
const F_BRAND = {
  instagram: 'M12 2c-2.7 0-3 0-4.1.1-1 0-1.8.2-2.4.5-.7.2-1.3.6-1.8 1.1S2.8 4.8 2.6 5.5c-.3.6-.4 1.4-.5 2.4C2 9 2 9.3 2 12s0 3 .1 4.1c0 1 .2 1.8.5 2.4.2.7.6 1.3 1.1 1.8s1.1.9 1.8 1.1c.6.3 1.4.4 2.4.5C9 22 9.3 22 12 22s3 0 4.1-.1c1 0 1.8-.2 2.4-.5.7-.2 1.3-.6 1.8-1.1s.9-1.1 1.1-1.8c.3-.6.4-1.4.5-2.4 0-1.1.1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.8-.5-2.4-.2-.7-.6-1.3-1.1-1.8s-1.1-.9-1.8-1.1c-.6-.3-1.4-.4-2.4-.5C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1.9 0 1.5.2 1.8.3.5.2.8.4 1.1.7.3.3.6.6.7 1.1.1.3.3.9.3 1.8.1 1 .1 1.3.1 4s0 3-.1 4c0 .9-.2 1.5-.3 1.8-.2.5-.4.8-.7 1.1-.3.3-.6.6-1.1.7-.3.1-.9.3-1.8.3-1 .1-1.3.1-4 .1s-3 0-4-.1c-.9 0-1.5-.2-1.8-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.6-.6-.7-1.1-.1-.3-.3-.9-.3-1.8-.1-1-.1-1.3-.1-4s0-3 .1-4c0-.9.2-1.5.3-1.8.2-.5.4-.8.7-1.1.3-.3.6-.6 1.1-.7.3-.1.9-.3 1.8-.3 1-.1 1.3-.1 4-.1zm0 3.1a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z',
  facebook: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z',
  youtube: 'M23 8.2a3 3 0 0 0-2.1-2.1C19 5.5 12 5.5 12 5.5s-7 0-8.9.6A3 3 0 0 0 1 8.2 31 31 0 0 0 .7 12 31 31 0 0 0 1 15.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z',
  x: 'M17.5 3h3.1l-6.7 7.7L21.7 21h-6.1l-4.8-6.3L5.3 21H2.2l7.2-8.2L2 3h6.3l4.4 5.8L17.5 3zm-1.1 16.2h1.7L7.4 4.7H5.6l10.8 14.5z',
};
const FGlyph = (k) => React.createElement('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true }, React.createElement('path', { d: F_BRAND[k] }));

function Col({ title, links }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-400)', margin: 0 }}>{title}</h4>
      {links.map((l) => (
        <a key={l} href="#" style={{ fontSize: 14, color: 'var(--navy-100)', textDecoration: 'none' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--navy-100)'}>{l}</a>
      ))}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer style={{ position: 'relative', background: 'var(--navy-950)', marginTop: 80 }}>
      {/* Overhanging crest */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%,-50%)', width: 92, height: 92, borderRadius: '50%', background: 'var(--navy-950)', display: 'grid', placeItems: 'center', border: '1px solid var(--navy-700)' }}>
        <img src={FLOGO} alt="Buca Yıldız" style={{ width: 78, height: 78, objectFit: 'contain' }} />
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '78px 32px 28px' }}>
        <div className="hp-grid-footer" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1.4fr', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: '#fff', letterSpacing: '.02em' }}>Buca Yıldız<span style={{ display: 'block', fontSize: 10.5, letterSpacing: '.26em', color: 'var(--gold-400)', marginTop: 4 }}>Futbol Akademisi</span></div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--navy-200)', margin: 0, maxWidth: 320 }}>İzmir Buca'da geleceğin futbolcularını disiplin, saygı ve takım ruhuyla yetiştiren altyapı kulübü.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <IconButton label="Instagram" variant="on-navy">{FGlyph('instagram')}</IconButton>
              <IconButton label="Facebook" variant="on-navy">{FGlyph('facebook')}</IconButton>
              <IconButton label="YouTube" variant="on-navy">{FGlyph('youtube')}</IconButton>
              <IconButton label="X" variant="on-navy">{FGlyph('x')}</IconButton>
            </div>
          </div>
          <Col title="Kurumsal" links={['Hakkımızda', 'Antrenörler', 'Tesisler', 'Kariyer']} />
          <Col title="Akademi" links={['A Takım', 'U-18', 'U-17', 'Seçmeler']} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-400)', margin: 0 }}>Bülten</h4>
            <p style={{ fontSize: 14, color: 'var(--navy-200)', margin: 0 }}>Kulüpten haberler ve maç duyuruları için kayıt olun.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Input placeholder="E-posta adresiniz" containerStyle={{ flex: 1 }} />
              <Button variant="accent">Katıl</Button>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--navy-200)', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>{FICON('map-pin')} Buca, İzmir</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>{FICON('phone')} +90 232 000 00 00</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 44, paddingTop: 22 }}>
          <span style={{ fontSize: 13, color: 'var(--navy-300)' }}>© 2026 Buca Yıldız Futbol Akademisi. Tüm hakları saklıdır.</span>
          <div style={{ display: 'flex', gap: 22 }}>
            <a href="#" style={{ fontSize: 13, color: 'var(--navy-300)', textDecoration: 'none' }}>KVKK</a>
            <a href="#" style={{ fontSize: 13, color: 'var(--navy-300)', textDecoration: 'none' }}>Gizlilik</a>
            <a href="#" style={{ fontSize: 13, color: 'var(--navy-300)', textDecoration: 'none' }}>Çerez Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
window.SiteFooter = SiteFooter;
