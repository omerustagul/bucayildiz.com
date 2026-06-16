import React from 'react';

/**
 * Buca Yıldız — Input
 * Labeled text field. Sharp corners, gold focus ring.
 */
export function Input({
  label, hint, error, leftIcon, id, required = false,
  style = {}, containerStyle = {}, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const borderColor = error ? 'var(--red-600)' : focus ? 'var(--navy-700)' : 'var(--ink-200)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5,
          letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-600)',
        }}>
          {label}{required && <span style={{ color: 'var(--gold-600)' }}> *</span>}
        </label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--radius-sm)', padding: '0 12px',
        boxShadow: focus ? 'var(--ring-focus)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-out)',
      }}>
        {leftIcon && <span style={{ display: 'inline-flex', color: 'var(--ink-400)' }}>{leftIcon}</span>}
        <input id={inputId} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-900)',
            padding: '11px 0', minWidth: 0, ...style,
          }} {...rest} />
      </div>
      {error
        ? <span style={{ fontSize: 12.5, color: 'var(--red-600)', fontWeight: 500 }}>{error}</span>
        : hint && <span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>{hint}</span>}
    </div>
  );
}
