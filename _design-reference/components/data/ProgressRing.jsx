import React from 'react';

/**
 * Buca Yıldız — ProgressRing
 * Circular progress gauge. For body composition, VO2 percentile, readiness.
 */
export function ProgressRing({
  value = 0, max = 100, size = 132, stroke = 12,
  color = 'var(--navy-700)', track = 'var(--ink-100)',
  label, sublabel, display, style = {}, ...rest
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, ...style }} {...rest}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset var(--dur-slow) var(--ease-out)' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: size * 0.26, lineHeight: 1, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
            {display != null ? display : `${Math.round(pct * 100)}%`}
          </span>
          {sublabel && <span style={{ fontSize: 11, color: 'var(--ink-400)', fontWeight: 500 }}>{sublabel}</span>}
        </div>
      </div>
      {label && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-600)' }}>{label}</span>}
    </div>
  );
}
