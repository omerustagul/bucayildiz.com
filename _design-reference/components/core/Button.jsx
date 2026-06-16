import React from 'react';

/**
 * Buca Yıldız — Button
 * Corporate-sporty button. Navy primary, gold accent used sparingly.
 * Square-ish corners (radius-sm) to keep the sharp brand line.
 */
const SIZES = {
  sm: { fontSize: 13, padding: '8px 14px', gap: 7, minHeight: 34 },
  md: { fontSize: 14, padding: '11px 20px', gap: 8, minHeight: 42 },
  lg: { fontSize: 16, padding: '15px 28px', gap: 10, minHeight: 52 },
};

const VARIANTS = {
  primary: {
    background: 'var(--navy-700)', color: '#fff',
    border: '1px solid var(--navy-700)',
    hover: { background: 'var(--navy-800)', borderColor: 'var(--navy-800)' },
  },
  accent: {
    background: 'var(--grad-gold)', color: 'var(--navy-900)',
    border: '1px solid var(--gold-600)',
    hover: { filter: 'brightness(1.05)' },
  },
  secondary: {
    background: 'transparent', color: 'var(--navy-700)',
    border: '1.5px solid var(--navy-700)',
    hover: { background: 'var(--navy-50)' },
  },
  ghost: {
    background: 'transparent', color: 'var(--navy-700)',
    border: '1px solid transparent',
    hover: { background: 'var(--ink-100)' },
  },
  'on-navy': {
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.28)',
    hover: { background: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.5)' },
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  as = 'button',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const Comp = as;

  const base = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : 'auto',
    alignItems: 'center', justifyContent: 'center',
    gap: s.gap,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: s.fontSize,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: s.padding, minHeight: s.minHeight,
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap',
    ...v, ...(hover && !disabled ? v.hover : null),
    ...style,
  };
  delete base.hover;

  return (
    <Comp
      style={base}
      disabled={as === 'button' ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {leftIcon && <span style={{ display: 'inline-flex' }}>{leftIcon}</span>}
      {children}
      {rightIcon && <span style={{ display: 'inline-flex' }}>{rightIcon}</span>}
    </Comp>
  );
}
