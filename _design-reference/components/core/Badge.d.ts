import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'navy' | 'gold' | 'neutral' | 'outline' | 'live' | 'success' | 'on-navy';
  /** Show a leading status dot (pulses when tone="live"). */
  dot?: boolean;
  uppercase?: boolean;
}

/** Compact status/label pill — "CANLI", "YENİ", category tags. */
export function Badge(props: BadgeProps): JSX.Element;
