import React from 'react';

export interface MetricBarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: number;
  max?: number;
  /** Override the shown number (e.g. "8.4 sn"). */
  display?: React.ReactNode;
  color?: string;
}

/** Horizontal labeled progress bar — attributes, comparisons, percentages. */
export function MetricBar(props: MetricBarProps): JSX.Element;
