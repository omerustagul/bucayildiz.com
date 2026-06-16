import React from 'react';

/**
 * Buca Yıldız — Switch
 * On/off toggle. Navy when on. For publish state, featured, settings.
 */
export function Switch({ checked, defaultChecked, onChange, disabled = false, label, size = 'md', style = {}, ...rest }) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const W = size === 'sm' ? 36 : 44, H = size === 'sm' ? 20 : 24, K = H - 6;
  const toggle = (e) => { if (disabled) return; if (!isControlled) setInternal(!on); onChange && onChange(!on, e); };
  const control = (
    <span onClick={toggle} role="switch" aria-checked={on} style={{
      width: W, height: H, flex: 'none', borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--navy-700)' : 'var(--ink-300)',
      position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-out)', opacity: disabled ? 0.5 : 1,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? W - K - 3 : 3, width: K, height: K,
        borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)',
        transition: 'left var(--dur-fast) var(--ease-out)',
      }} />
    </span>
  );
  if (!label) return control;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-700)', ...style }} {...rest}>
      {control}{label}
    </label>
  );
}
