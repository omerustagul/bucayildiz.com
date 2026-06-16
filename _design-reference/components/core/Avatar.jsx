import React from 'react';

/**
 * Buca Yıldız — Avatar
 * Image or initials monogram. Navy gradient fallback.
 */
const A_SIZES = { xs: 26, sm: 32, md: 40, lg: 52, xl: 72 };

export function Avatar({ name = '', src, size = 'md', ring = false, square = false, style = {}, ...rest }) {
  const dim = A_SIZES[size] || (typeof size === 'number' ? size : 40);
  const initials = name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: dim, height: dim, flex: 'none',
      borderRadius: square ? 'var(--radius-sm)' : '50%',
      background: src ? `center/cover no-repeat url("${src}")` : 'var(--grad-navy)',
      display: 'grid', placeItems: 'center', overflow: 'hidden',
      color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 700,
      fontSize: dim * 0.4, letterSpacing: '.02em',
      boxShadow: ring ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--gold-400)' : 'none',
      ...style,
    }} {...rest}>
      {!src && (initials || '?')}
    </div>
  );
}
