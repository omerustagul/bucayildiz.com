import React from 'react';

/**
 * Buca Yıldız — Badge
 * Small status pill. "CANLI", "YENİ", "U-17", result states.
 */
const TONES = {
  navy:    { background: 'var(--navy-700)', color: '#fff', border: 'transparent' },
  gold:    { background: 'var(--gold-100)', color: 'var(--gold-800)', border: 'var(--gold-300)' },
  neutral: { background: 'var(--ink-100)', color: 'var(--ink-700)', border: 'var(--ink-200)' },
  outline: { background: 'transparent', color: 'var(--navy-700)', border: 'var(--ink-300)' },
  live:    { background: 'var(--red-600)', color: '#fff', border: 'transparent' },
  success: { background: 'var(--green-100)', color: 'var(--green-600)', border: 'transparent' },
  'on-navy': { background: 'rgba(255,255,255,0.10)', color: '#fff', border: 'rgba(255,255,255,0.22)' },
};

export function Badge({ children, tone = 'navy', dot = false, uppercase = true, style = {}, ...rest }) {
  const t = TONES[tone] || TONES.navy;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-body)', fontWeight: 600,
      fontSize: 11.5, letterSpacing: '0.08em',
      textTransform: uppercase ? 'uppercase' : 'none',
      lineHeight: 1, padding: '5px 9px',
      borderRadius: 'var(--radius-sm)',
      background: t.background, color: t.color,
      border: `1px solid ${t.border}`,
      ...style,
    }} {...rest}>
      {dot && <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: tone === 'live' ? '#fff' : 'currentColor',
        ...(tone === 'live' ? { animation: 'byPulse 1.4s var(--ease-in-out) infinite' } : null),
      }} />}
      {children}
    </span>
  );
}
