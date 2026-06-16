import React from 'react';

/**
 * Buca Yıldız — AgeGroupCard
 * Yaş grubu kartı (A Takım, U-15…U-18). Photo + navy scrim + big label.
 */
export function AgeGroupCard({
  label, title, count, image, href = '#', style = {}, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} style={{
      position: 'relative', display: 'block', overflow: 'hidden',
      aspectRatio: '3 / 4', borderRadius: 'var(--radius-lg)',
      textDecoration: 'none', border: '1px solid var(--navy-700)',
      background: image ? `center/cover no-repeat url("${image}")` : 'var(--grad-navy)',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transition: 'box-shadow var(--dur-base) var(--ease-out)', ...style,
    }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...rest}>
      {/* monogram watermark when no image */}
      {!image && <div style={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        color: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-heading)',
        fontWeight: 700, fontSize: 120, textTransform: 'uppercase',
      }}>★</div>}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-navy)' }} />
      {/* gold top edge on hover */}
      <span style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'var(--grad-gold)',
        transform: hover ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left',
        transition: 'transform var(--dur-base) var(--ease-out)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <span style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 40,
          lineHeight: 0.95, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#fff',
        }}>{label}</span>
        {title && <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--navy-100)' }}>{title}</span>}
        <span style={{
          marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 7,
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--gold-400)',
        }}>
          {count ? `${count} Sporcu` : 'Kadroyu Gör'}
          <span style={{ transition: 'transform var(--dur-fast)', transform: hover ? 'translateX(4px)' : 'none' }}>→</span>
        </span>
      </div>
    </a>
  );
}
