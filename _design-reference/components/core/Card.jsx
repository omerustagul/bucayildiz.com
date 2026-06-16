import React from 'react';

/**
 * Buca Yıldız — Card
 * Corporate surface container. Sharp corners, hairline border,
 * navy-tinted shadow. Optional gold top-accent rule.
 */
export function Card({
  children, padding = 'md', interactive = false, accent = false,
  variant = 'surface', style = {}, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pads = { none: 0, sm: 'var(--space-4)', md: 'var(--space-6)', lg: 'var(--space-8)' };
  const variants = {
    surface: { background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-body)' },
    subtle:  { background: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-body)' },
    navy:    { background: 'var(--grad-navy)', border: '1px solid var(--navy-600)', color: '#fff' },
  };
  const v = variants[variant] || variants.surface;
  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      padding: pads[padding] ?? pads.md,
      boxShadow: hover && interactive ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover && interactive ? 'translateY(-3px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...v, ...style,
    }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...rest}>
      {accent && <span style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'var(--grad-gold)',
      }} />}
      {children}
    </div>
  );
}
