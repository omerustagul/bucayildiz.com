// Buca Yıldız — Sporcu Paneli shell: navy sidebar + top header
const { IconButton, Badge } = window.BucaYLdZTasarMSistemi_45a34f;
const PLOGO = '../../assets/logo-emblem.png';
const PI = (n, sz = 18) => React.createElement('i', { 'data-lucide': n, style: { width: sz, height: sz } });

const NAV = [
  { ic: 'layout-dashboard', label: 'Genel Bakış', active: true },
  { ic: 'calendar-days', label: 'Antrenmanlar' },
  { ic: 'activity', label: 'Performans' },
  { ic: 'swords', label: 'Maçlar' },
  { ic: 'credit-card', label: 'Ödemeler' },
  { ic: 'user-round', label: 'Profil' },
];

function Sidebar() {
  return (
    <aside style={{ width: 252, flex: 'none', background: 'var(--navy-950)', borderRight: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ padding: '22px 22px 18px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <img src={PLOGO} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 17, color: '#fff', textTransform: 'uppercase', letterSpacing: '.02em' }}>Buca Yıldız</div>
          <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold-400)', marginTop: 3, fontWeight: 600 }}>Sporcu Paneli</div>
        </div>
      </div>
      <nav style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        {NAV.map((n) => (
          <a key={n.label} href="#" style={{
            position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
            borderRadius: 'var(--radius-sm)', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: n.active ? 600 : 500, fontSize: 14.5,
            color: n.active ? '#fff' : 'var(--navy-200)',
            background: n.active ? 'rgba(255,255,255,.07)' : 'transparent',
          }}
            onMouseEnter={(e) => { if (!n.active) e.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
            onMouseLeave={(e) => { if (!n.active) e.currentTarget.style.background = 'transparent'; }}>
            {n.active && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: 'var(--grad-gold)', borderRadius: '0 2px 2px 0' }} />}
            <span style={{ color: n.active ? 'var(--gold-400)' : 'var(--navy-300)', display: 'inline-flex' }}>{PI(n.ic, 18)}</span>
            {n.label}
          </a>
        ))}
      </nav>
      <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <a href="../website/panel-giris.html" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14.5, color: 'var(--navy-200)' }}>
          {PI('log-out', 18)} Çıkış Yap
        </a>
      </div>
    </aside>
  );
}

function PanelHeader({ title, subtitle }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, textTransform: 'uppercase', color: 'var(--text-strong)', margin: 0, lineHeight: 1 }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 13.5, color: 'var(--ink-500)', marginTop: 4 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <IconButton label="Bildirimler" variant="outline">{PI('bell', 18)}</IconButton>
          <span style={{ width: 1, height: 30, background: 'var(--ink-200)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--grad-navy)', display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16 }}>AY</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--text-strong)' }}>Arda Yılmaz</div>
              <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>U-17 · 10 Numara</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function PanelShell({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-subtle)' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <PanelHeader title={title} subtitle={subtitle} />
        <main style={{ padding: '28px 32px 48px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1240, width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
window.PanelShell = PanelShell;
