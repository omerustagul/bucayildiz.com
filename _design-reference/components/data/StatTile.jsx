import React from 'react';

/**
 * Buca Yıldız — StatTile
 * Metric tile: label, big value, optional unit, delta/trend, icon.
 */
const TONES = {
  up:      { color: 'var(--green-600)', bg: 'var(--green-100)', sign: '▲' },
  down:    { color: 'var(--red-600)',   bg: 'var(--red-100)',   sign: '▼' },
  neutral: { color: 'var(--ink-500)',   bg: 'var(--ink-100)',   sign: '•' },
};

export function StatTile({
  label, value, unit, delta, deltaTone = 'up', icon, sub, accent = false, style = {}, ...rest
}) {
  const t = TONES[deltaTone] || TONES.neutral;
  return (
    <div style={{
      position: 'relative', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', gap: 10, ...style,
    }} {...rest}>
      {accent && <span style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: 'var(--grad-gold)' }} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>{label}</span>
        {icon && <span style={{ display: 'inline-flex', color: 'var(--navy-400)' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 34, lineHeight: 1, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {unit && <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 600, fontSize: 15, color: 'var(--ink-400)' }}>{unit}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {delta != null && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: t.color, background: t.bg, padding: '3px 7px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: 9 }}>{t.sign}</span>{delta}
          </span>
        )}
        {sub && <span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>{sub}</span>}
      </div>
    </div>
  );
}
