import React from 'react';

/**
 * Buca Yıldız — NewsCard
 * Haber kartı. Image (or navy placeholder) + category + date + title.
 */
export function NewsCard({
  image, category = 'Haber', date, title, excerpt, href = '#', style = {}, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} style={{
      display: 'flex', flexDirection: 'column', textDecoration: 'none',
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-3px)' : 'none',
      transition: 'all var(--dur-base) var(--ease-out)', ...style,
    }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...rest}>
      <div style={{
        position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden',
        background: image ? `center/cover no-repeat url("${image}")` : 'var(--grad-navy)',
      }}>
        {!image && <div style={{
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
          color: 'rgba(255,255,255,0.10)', fontFamily: 'var(--font-heading)',
          fontSize: 60, fontWeight: 700, textTransform: 'uppercase',
        }}>BY</div>}
        <span style={{
          position: 'absolute', top: 12, left: 12,
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          background: 'var(--gold-500)', color: 'var(--navy-900)',
          padding: '5px 9px', borderRadius: 'var(--radius-sm)',
        }}>{category}</span>
      </div>
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {date && <span style={{ fontSize: 12.5, color: 'var(--ink-400)', fontWeight: 500, letterSpacing: '0.02em' }}>{date}</span>}
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 21,
          lineHeight: 1.12, letterSpacing: '0', color: 'var(--text-strong)',
          margin: 0, textTransform: 'none',
        }}>{title}</h3>
        {excerpt && <p style={{
          fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-muted)', margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{excerpt}</p>}
        <span style={{
          marginTop: 'auto', paddingTop: 6, fontFamily: 'var(--font-body)', fontWeight: 600,
          fontSize: 12.5, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--navy-600)', display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>Haberi Oku <span style={{ transition: 'transform var(--dur-fast)', transform: hover ? 'translateX(3px)' : 'none' }}>→</span></span>
      </div>
    </a>
  );
}
