import React from 'react';

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  /** Uppercase caption below the ring. */
  label?: string;
  /** Small caption inside the ring under the value. */
  sublabel?: string;
  /** Override the centered text (defaults to rounded percentage). */
  display?: React.ReactNode;
}

/** Circular progress gauge — body composition, readiness, percentile. */
export function ProgressRing(props: ProgressRingProps): JSX.Element;
