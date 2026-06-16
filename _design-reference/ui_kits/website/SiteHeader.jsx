// Buca Yıldız — Site header: logo + social (left), panel/başvuru (right), mega menu (bottom)
// Responsive: collapses to a hamburger drawer under 900px. Optional `backHref` adds an "Ana Sayfa" button.
const { Button, IconButton } = window.BucaYLdZTasarMSistemi_45a34f;
const LOGO = '../../assets/logo-emblem.png';
const ICON = (n, sz = 17) => React.createElement('i', { 'data-lucide': n, style: { width: sz, height: sz } });

// Brand glyphs as inline SVG (Lucide dropped brand icons)
const BRAND = {
  instagram: 'M12 2c-2.7 0-3 0-4.1.1-1 0-1.8.2-2.4.5-.7.2-1.3.6-1.8 1.1S2.8 4.8 2.6 5.5c-.3.6-.4 1.4-.5 2.4C2 9 2 9.3 2 12s0 3 .1 4.1c0 1 .2 1.8.5 2.4.2.7.6 1.3 1.1 1.8s1.1.9 1.8 1.1c.6.3 1.4.4 2.4.5C9 22 9.3 22 12 22s3 0 4.1-.1c1 0 1.8-.2 2.4-.5.7-.2 1.3-.6 1.8-1.1s.9-1.1 1.1-1.8c.3-.6.4-1.4.5-2.4 0-1.1.1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.8-.5-2.4-.2-.7-.6-1.3-1.1-1.8s-1.1-.9-1.8-1.1c-.6-.3-1.4-.4-2.4-.5C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1.9 0 1.5.2 1.8.3.5.2.8.4 1.1.7.3.3.6.6.7 1.1.1.3.3.9.3 1.8.1 1 .1 1.3.1 4s0 3-.1 4c0 .9-.2 1.5-.3 1.8-.2.5-.4.8-.7 1.1-.3.3-.6.6-1.1.7-.3.1-.9.3-1.8.3-1 .1-1.3.1-4 .1s-3 0-4-.1c-.9 0-1.5-.2-1.8-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.6-.6-.7-1.1-.1-.3-.3-.9-.3-1.8-.1-1-.1-1.3-.1-4s0-3 .1-4c0-.9.2-1.5.3-1.8.2-.5.4-.8.7-1.1.3-.3.6-.6 1.1-.7.3-.1.9-.3 1.8-.3 1-.1 1.3-.1 4-.1zm0 3.1a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z',
  facebook: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z',
  youtube: 'M23 8.2a3 3 0 0 0-2.1-2.1C19 5.5 12 5.5 12 5.5s-7 0-8.9.6A3 3 0 0 0 1 8.2 31 31 0 0 0 .7 12 31 31 0 0 0 1 15.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z',
  x: 'M17.5 3h3.1l-6.7 7.7L21.7 21h-6.1l-4.8-6.3L5.3 21H2.2l7.2-8.2L2 3h6.3l4.4 5.8L17.5 3zm-1.1 16.2h1.7L7.4 4.7H5.6l10.8 14.5z',
};
const Glyph = (k) => React.createElement('svg', { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true }, React.createElement('path', { d: BRAND[k] }));

const MENU = [
  { label: 'Kurumsal', items: ['Hakkımızda', 'Yönetim', 'Tesisler', 'Vizyon & Misyon'] },
  { label: 'Takımlar', items: ['A Takım', 'U-18', 'U-17', 'U-16', 'U-15'] },
  { label: 'Altyapı', items: ['Antrenörler', 'Gelişim Programı', 'Seçmeler', 'Yaz Okulu'] },
  { label: 'Haberler', items: [] },
  { label: 'Fikstür', items: ['Maç Programı', 'Puan Durumu', 'Sonuçlar'] },
  { label: 'Medya', items: ['Fotoğraflar', 'Videolar', 'Basında Biz'] },
  { label: 'İletişim', items: [] },
];

function Brand({ homeHref, compact }) {
  return (
    <a href={homeHref} style={{ display: 'flex', alignItems: 'center', gap: compact ? 11 : 13, textDecoration: 'none' }}>
      <img src={LOGO} alt="Buca Yıldız" style={{ width: compact ? 42 : 50, height: compact ? 42 : 50, objectFit: 'contain' }} />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: compact ? 20 : 23, color: '#fff', textTransform: 'uppercase', letterSpacing: '.02em' }}>Buca Yıldız</span>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: compact ? 9.5 : 10.5, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold-400)', marginTop: 3 }}>Futbol Akademisi</span>
      </span>
    </a>
  );
}

function Social({ size = 'sm' }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton label="Instagram" variant="on-navy" size={size}>{Glyph('instagram')}</IconButton>
      <IconButton label="Facebook" variant="on-navy" size={size}>{Glyph('facebook')}</IconButton>
      <IconButton label="YouTube" variant="on-navy" size={size}>{Glyph('youtube')}</IconButton>
      <IconButton label="X" variant="on-navy" size={size}>{Glyph('x')}</IconButton>
    </div>
  );
}

function SiteHeader({ onApply, onLogin, active = 'Haberler', backHref }) {
  const [open, setOpen] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [acc, setAcc] = React.useState(null);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const on = () => { setIsMobile(mq.matches); if (!mq.matches) setMobileOpen(false); };
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const homeHref = backHref || '#';
  const go = (href) => () => { window.location.href = href; };

  // ---------- MOBILE ----------
  if (isMobile) {
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--navy-800)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Brand homeHref={homeHref} compact />
          <IconButton label="Menü" variant="on-navy" onClick={() => setMobileOpen((v) => !v)}>{ICON(mobileOpen ? 'x' : 'menu', 20)}</IconButton>
        </div>
        {mobileOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', maxHeight: 'calc(100vh - 66px)', overflowY: 'auto' }}>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {backHref && <Button as="a" href={backHref} variant="on-navy" size="md" fullWidth leftIcon={ICON('arrow-left', 16)}>Ana Sayfa</Button>}
              <Button variant="on-navy" size="md" fullWidth leftIcon={ICON('lock', 16)} onClick={onLogin}>Panele Giriş</Button>
              <Button variant="accent" size="md" fullWidth leftIcon={ICON('clipboard-list', 16)} onClick={onApply}>Başvuru Formu</Button>
            </div>
            <nav style={{ padding: '8px 10px' }}>
              {MENU.map((m) => {
                const expandable = !!m.items.length;
                const isOpen = acc === m.label;
                return (
                  <div key={m.label}>
                    <a href="#" onClick={(e) => { if (expandable) { e.preventDefault(); setAcc(isOpen ? null : m.label); } }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 12px', textDecoration: 'none', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, textTransform: 'uppercase', letterSpacing: '.03em', color: m.label === active ? 'var(--gold-400)' : '#fff' }}>
                      {m.label}{expandable && <span style={{ color: 'var(--navy-300)', display: 'inline-flex', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>{ICON('chevron-down', 16)}</span>}
                    </a>
                    {expandable && isOpen && (
                      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 6 }}>
                        {m.items.map((it) => (
                          <a key={it} href="#" style={{ padding: '10px 12px 10px 24px', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--navy-200)' }}>{it}</a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}><Social size="md" /></div>
          </div>
        )}
      </header>
    );
  }

  // ---------- DESKTOP ----------
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--navy-800)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <Brand homeHref={homeHref} />
          <span style={{ width: 1, height: 34, background: 'rgba(255,255,255,0.12)' }} />
          <Social />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {backHref && <Button as="a" href={backHref} variant="on-navy" size="sm" leftIcon={ICON('arrow-left')}>Ana Sayfa</Button>}
          <Button variant="on-navy" size="sm" leftIcon={ICON('lock')} onClick={onLogin}>Panele Giriş</Button>
          <Button variant="accent" size="sm" leftIcon={ICON('clipboard-list')} onClick={onApply}>Başvuru Formu</Button>
        </div>
      </div>
      <nav style={{ background: 'var(--navy-900)', borderTop: '1px solid rgba(255,255,255,0.06)' }} onMouseLeave={() => setOpen(null)}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {MENU.map((m) => {
            const isActive = m.label === active;
            const isOpen = open === m.label;
            return (
              <div key={m.label} style={{ position: 'relative' }} onMouseEnter={() => setOpen(m.items.length ? m.label : null)}>
                <a href="#" style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '14px 18px',
                  fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16, letterSpacing: '.04em',
                  textTransform: 'uppercase', color: isActive ? '#fff' : 'var(--navy-200)',
                  borderBottom: `2px solid ${isActive || isOpen ? 'var(--gold-500)' : 'transparent'}`,
                  transition: 'color .15s, border-color .15s', textDecoration: 'none',
                }}>
                  {m.label}
                  {!!m.items.length && ICON('chevron-down')}
                </a>
                {isOpen && !!m.items.length && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, minWidth: 210, background: '#fff',
                    border: '1px solid var(--ink-200)', borderTop: '2px solid var(--gold-500)',
                    borderRadius: '0 0 var(--radius-md) var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: 6, zIndex: 60,
                  }}>
                    {m.items.map((it) => (
                      <a key={it} href="#" style={{
                        display: 'block', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14.5,
                        fontWeight: 500, color: 'var(--ink-700)', textDecoration: 'none', borderRadius: 'var(--radius-sm)',
                      }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--navy-50)'; e.currentTarget.style.color = 'var(--navy-800)'; }}
                         onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-700)'; }}>
                        {it}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
window.SiteHeader = SiteHeader;
