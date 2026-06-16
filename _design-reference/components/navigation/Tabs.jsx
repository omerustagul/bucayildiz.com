import React from 'react';

/**
 * Buca Yıldız — Tabs
 * Underline tab bar. Gold active indicator.
 */
export function Tabs({ tabs = [], value, defaultValue, onChange, variant = 'underline', style = {}, ...rest }) {
  const isControlled = value !== undefined;
  const first = defaultValue ?? (tabs[0] && (tabs[0].id ?? tabs[0]));
  const [internal, setInternal] = React.useState(first);
  const active = isControlled ? value : internal;
  const pick = (id) => { if (!isControlled) setInternal(id); onChange && onChange(id); };

  const pill = variant === 'pill';
  return (
    <div role="tablist" style={{
      display: 'flex', gap: pill ? 4 : 2,
      borderBottom: pill ? 'none' : '1px solid var(--border-subtle)',
      background: pill ? 'var(--ink-100)' : 'transparent',
      padding: pill ? 3 : 0, borderRadius: pill ? 'var(--radius-md)' : 0,
      ...style,
    }} {...rest}>
      {tabs.map((t) => {
        const id = t.id ?? t;
        const label = t.label ?? t;
        const on = id === active;
        return (
          <button key={id} role="tab" aria-selected={on} onClick={() => pick(id)} style={{
            font: 'inherit', cursor: 'pointer', border: 'none', background: pill && on ? 'var(--surface-card)' : 'transparent',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
            letterSpacing: '.01em', color: on ? (pill ? 'var(--navy-800)' : 'var(--navy-700)') : 'var(--ink-500)',
            padding: pill ? '8px 16px' : '11px 16px',
            borderRadius: pill ? 'var(--radius-sm)' : 0,
            boxShadow: pill && on ? 'var(--shadow-xs)' : 'none',
            borderBottom: pill ? 'none' : `2px solid ${on ? 'var(--gold-500)' : 'transparent'}`,
            marginBottom: pill ? 0 : -1, transition: 'color var(--dur-fast), border-color var(--dur-fast)',
            display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            {t.icon}{label}
            {t.count != null && <span style={{ fontFamily: 'var(--font-stat)', fontSize: 11.5, fontWeight: 700, color: on ? 'var(--navy-700)' : 'var(--ink-400)', background: on ? 'var(--navy-50)' : 'var(--ink-100)', borderRadius: 'var(--radius-pill)', padding: '1px 7px' }}>{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
