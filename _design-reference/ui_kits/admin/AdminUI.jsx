// Buca Yıldız Admin — shared UI building blocks → window.AdminUI
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { Button, IconButton } = NS;

  const ic = (n, sz = 18) => React.createElement('i', { 'data-lucide': n, style: { width: sz, height: sz } });
  const cardStyle = { background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' };

  // ---- View header (title + actions) ----
  function ViewHeader({ title, subtitle, actions, tabs }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 30, textTransform: 'uppercase', color: 'var(--text-strong)', margin: 0, lineHeight: 1 }}>{title}</h1>
            {subtitle && <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: '8px 0 0' }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
        </div>
        {tabs}
      </div>
    );
  }

  // ---- Toolbar (search + filters row) ----
  function Toolbar({ children, style }) {
    return <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', ...style }}>{children}</div>;
  }

  function SearchBox({ placeholder = 'Ara…', value, onChange, width = 260 }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0 12px', height: 40, width }}>
        <span style={{ color: 'var(--ink-400)', display: 'inline-flex' }}>{ic('search', 16)}</span>
        <input value={value} onChange={(e) => onChange && onChange(e.target.value)} placeholder={placeholder}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-800)', minWidth: 0 }} />
      </div>
    );
  }

  // ---- Field wrapper (label over control) ----
  function Field({ label, required, hint, children, style }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
        {label && <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-600)' }}>{label}{required && <span style={{ color: 'var(--gold-600)' }}> *</span>}</label>}
        {children}
        {hint && <span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>{hint}</span>}
      </div>
    );
  }

  // ---- Plain styled text input (uncontrolled-friendly) ----
  function TextInput({ style, ...rest }) {
    const [f, setF] = React.useState(false);
    return <input {...rest} onFocus={(e) => { setF(true); rest.onFocus && rest.onFocus(e); }} onBlur={(e) => { setF(false); rest.onBlur && rest.onBlur(e); }}
      style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--ink-900)', background: '#fff', border: `1.5px solid ${f ? 'var(--navy-700)' : 'var(--ink-200)'}`, borderRadius: 'var(--radius-sm)', padding: '11px 12px', outline: 'none', boxShadow: f ? 'var(--ring-focus)' : 'none', transition: 'all var(--dur-fast)', ...style }} />;
  }

  function TextArea({ style, rows = 4, ...rest }) {
    const [f, setF] = React.useState(false);
    return <textarea rows={rows} {...rest} onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-900)', background: '#fff', border: `1.5px solid ${f ? 'var(--navy-700)' : 'var(--ink-200)'}`, borderRadius: 'var(--radius-sm)', padding: '11px 12px', outline: 'none', resize: 'vertical', boxShadow: f ? 'var(--ring-focus)' : 'none', transition: 'all var(--dur-fast)', ...style }} />;
  }

  // ---- File / image drop placeholder ----
  function FileDrop({ label = 'Görsel yükle', hint, aspect = '16 / 10', filled = false, icon = 'image-up', compact = false, style }) {
    const [over, setOver] = React.useState(false);
    return (
      <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); }}
        style={{ position: 'relative', aspectRatio: aspect, borderRadius: 'var(--radius-md)', border: `1.5px dashed ${over ? 'var(--navy-700)' : 'var(--ink-300)'}`, background: filled ? 'var(--grad-navy)' : (over ? 'var(--navy-50)' : 'var(--ink-50)'), display: 'grid', placeItems: 'center', cursor: 'pointer', overflow: 'hidden', transition: 'all var(--dur-fast)', ...style }}>
        {filled ? (
          <React.Fragment>
            <span style={{ color: 'rgba(255,255,255,.18)' }}>{ic('image', compact ? 24 : 38)}</span>
            <span style={{ position: 'absolute', right: 8, top: 8, display: 'flex', gap: 6 }}>
              <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,.14)', display: 'grid', placeItems: 'center', color: '#fff' }}>{ic('pencil', 14)}</span>
            </span>
          </React.Fragment>
        ) : (
          <div style={{ textAlign: 'center', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 4 : 8 }}>
            <span style={{ width: compact ? 34 : 44, height: compact ? 34 : 44, borderRadius: '50%', background: 'var(--navy-50)', color: 'var(--navy-600)', display: 'grid', placeItems: 'center' }}>{ic(icon, compact ? 17 : 20)}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: compact ? 12.5 : 14, color: 'var(--ink-700)' }}>{label}</span>
            {hint && !compact && <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>{hint}</span>}
          </div>
        )}
      </div>
    );
  }

  // ---- Stepper ----
  function Stepper({ steps, current }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {steps.map((s, i) => {
          const done = i < current, active = i === current;
          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', flex: 'none', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 14, background: active ? 'var(--navy-700)' : done ? 'var(--green-600)' : 'var(--ink-100)', color: active || done ? '#fff' : 'var(--ink-400)', border: active ? '2px solid var(--gold-400)' : 'none' }}>
                  {done ? ic('check', 15) : i + 1}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 500, fontSize: 13.5, color: active ? 'var(--text-strong)' : 'var(--ink-500)', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < steps.length - 1 && <span style={{ flex: 1, height: 2, background: done ? 'var(--green-600)' : 'var(--ink-200)', margin: '0 14px', minWidth: 24 }} />}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // ---- Drawer (right side panel) ----
  // Conditional-mount, STATIC open state (no enter transition/animation) so the
  // panel is unconditionally on-screen in every environment.
  function Drawer({ open, onClose, title, subtitle, children, footer, width = 480 }) {
    if (!open) return null;
    return (
      <React.Fragment>
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(8,18,38,.45)', zIndex: 200 }} />
        <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(' + width + 'px, 94vw)', background: 'var(--surface-page)', boxShadow: 'var(--shadow-xl)', zIndex: 201, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase', color: 'var(--text-strong)', margin: 0, lineHeight: 1.05 }}>{title}</h2>
              {subtitle && <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '6px 0 0' }}>{subtitle}</p>}
            </div>
            <IconButton label="Kapat" variant="ghost" onClick={onClose}>{ic('x', 18)}</IconButton>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>{children}</div>
          {footer && <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10, justifyContent: 'flex-end', background: 'var(--surface-subtle)' }}>{footer}</div>}
        </aside>
      </React.Fragment>
    );
  }

  // ---- Modal (centered) ----
  function Modal({ open, onClose, title, children, footer, width = 460 }) {
    if (!open) return null;
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(8,18,38,.5)', display: 'grid', placeItems: 'center', zIndex: 210, padding: 20 }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(' + width + 'px, 96vw)', background: 'var(--surface-page)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 20, textTransform: 'uppercase', color: 'var(--text-strong)', margin: 0 }}>{title}</h2>
            <IconButton label="Kapat" variant="ghost" onClick={onClose}>{ic('x', 18)}</IconButton>
          </div>
          <div style={{ padding: 24 }}>{children}</div>
          {footer && <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10, justifyContent: 'flex-end', background: 'var(--surface-subtle)' }}>{footer}</div>}
        </div>
      </div>
    );
  }

  // ---- Section block (titled card) ----
  function Panel({ title, action, children, pad = 22, style }) {
    return (
      <div style={{ ...cardStyle, ...style }}>
        {(title || action) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 17, color: 'var(--text-strong)', margin: 0 }}>{title}</h3>
            {action}
          </div>
        )}
        <div style={{ padding: pad }}>{children}</div>
      </div>
    );
  }

  window.AdminUI = { ic, cardStyle, ViewHeader, Toolbar, SearchBox, Field, TextInput, TextArea, FileDrop, Stepper, Drawer, Modal, Panel };
})();
