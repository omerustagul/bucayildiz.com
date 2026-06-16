// Buca Yıldız Admin — shell: grouped navy sidebar + topbar
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { IconButton, Badge } = NS;
  const ic = (n, sz = 18) => React.createElement('i', { 'data-lucide': n, style: { width: sz, height: sz } });
  const SLOGO = '../../assets/logo-emblem.png';

  const NAV = [
    { group: 'Genel', items: [
      { id: 'dashboard', label: 'Genel Bakış', icon: 'layout-dashboard' },
    ] },
    { group: 'Kulüp', items: [
      { id: 'athletes', label: 'Sporcular', icon: 'users' },
      { id: 'teams', label: 'Takımlar', icon: 'shield' },
      { id: 'training', label: 'Antrenmanlar', icon: 'dumbbell' },
      { id: 'fixtures', label: 'Fikstür', icon: 'calendar-days' },
    ] },
    { group: 'İçerik & Site', items: [
      { id: 'blog', label: 'Haberler / Blog', icon: 'newspaper' },
      { id: 'media', label: 'Medya Kütüphanesi', icon: 'images' },
      { id: 'jerseys', label: 'Formalar', icon: 'shirt' },
    ] },
  ];

  function Sidebar({ active, onNav, collapsed }) {
    return (
      <aside style={{ width: collapsed ? 76 : 256, flex: 'none', background: 'var(--navy-950)', borderRight: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', transition: 'width var(--dur-base) var(--ease-out)' }}>
        <div style={{ padding: collapsed ? '20px 0' : '20px 22px 18px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 12, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <img src={SLOGO} alt="" style={{ width: 38, height: 38, objectFit: 'contain' }} />
          {!collapsed && (
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: '#fff', textTransform: 'uppercase', letterSpacing: '.02em' }}>Buca Yıldız</div>
              <div style={{ fontSize: 9.5, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold-400)', marginTop: 3, fontWeight: 600 }}>Yönetim Paneli</div>
            </div>
          )}
        </div>
        <nav style={{ padding: collapsed ? '10px 10px' : 12, display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
          {NAV.map((sec) => (
            <div key={sec.group} style={{ marginBottom: 6 }}>
              {!collapsed && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--navy-400)', padding: '10px 14px 6px' }}>{sec.group}</div>}
              {sec.items.map((n) => {
                const on = active === n.id;
                return (
                  <a key={n.id} href="#" onClick={(e) => { e.preventDefault(); onNav(n.id); }} title={n.label}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '12px 0' : '11px 14px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: on ? 600 : 500, fontSize: 14.5, color: on ? '#fff' : 'var(--navy-200)', background: on ? 'rgba(255,255,255,.07)' : 'transparent' }}
                    onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
                    onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                    {on && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: 'var(--grad-gold)', borderRadius: '0 2px 2px 0' }} />}
                    <span style={{ color: on ? 'var(--gold-400)' : 'var(--navy-300)', display: 'inline-flex' }}>{ic(n.icon, 18)}</span>
                    {!collapsed && n.label}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <a href="../website/index.html" title="Siteyi görüntüle" style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 12, padding: '11px 14px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: 'var(--navy-200)' }}>
            {ic('external-link', 18)}{!collapsed && 'Siteyi Görüntüle'}
          </a>
        </div>
      </aside>
    );
  }

  function Topbar({ onToggle, breadcrumb }) {
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconButton label="Menü" variant="ghost" onClick={onToggle}>{ic('panel-left', 18)}</IconButton>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-500)' }}>
              <span style={{ fontWeight: 600, color: 'var(--ink-700)' }}>Yönetim</span>
              {ic('chevron-right', 14)}
              <span style={{ color: 'var(--navy-700)', fontWeight: 600 }}>{breadcrumb}</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <IconButton label="Bildirimler" variant="outline">{ic('bell', 18)}</IconButton>
              <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: 'var(--red-600)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center', border: '2px solid #fff' }}>3</span>
            </div>
            <span style={{ width: 1, height: 30, background: 'var(--ink-200)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--grad-gold)', display: 'grid', placeItems: 'center', color: 'var(--navy-900)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15 }}>MK</div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, color: 'var(--text-strong)' }}>M. Koç</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-400)' }}>Yönetici</div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function AdminShell({ active, onNav, breadcrumb, children }) {
    const [collapsed, setCollapsed] = React.useState(false);
    React.useEffect(() => {
      const mq = window.matchMedia('(max-width: 900px)');
      const on = () => setCollapsed(mq.matches);
      on(); mq.addEventListener('change', on);
      return () => mq.removeEventListener('change', on);
    }, []);
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-subtle)' }}>
        <Sidebar active={active} onNav={onNav} collapsed={collapsed} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Topbar onToggle={() => setCollapsed((c) => !c)} breadcrumb={breadcrumb} />
          <main style={{ padding: '28px 28px 56px', display: 'flex', flexDirection: 'column', gap: 22, width: '100%', maxWidth: 1380, margin: '0 auto' }}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  window.AdminShell = AdminShell;
  window.ADMIN_NAV = NAV;
})();
