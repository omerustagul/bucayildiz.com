import React from 'react';

/**
 * Buca Yıldız — Checkbox
 * Square check with navy fill and gold-free, sharp aesthetic.
 */
export function Checkbox({ label, checked, defaultChecked, onChange, disabled = false, style = {}, ...rest }) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = (e) => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on, e);
  };
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--ink-700)', ...style,
    }} {...rest}>
      <span onClick={toggle} style={{
        width: 20, height: 20, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-xs)',
        border: `1.5px solid ${on ? 'var(--navy-700)' : 'var(--ink-300)'}`,
        background: on ? 'var(--navy-700)' : '#fff',
        transition: 'all var(--dur-fast) var(--ease-out)',
      }}>
        {on && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}
