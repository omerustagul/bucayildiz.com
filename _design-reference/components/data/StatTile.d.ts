import React from 'react';

export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  unit?: string;
  /** Trend value, e.g. "3.2%" or "0.4". */
  delta?: React.ReactNode;
  deltaTone?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  /** Secondary caption next to the delta. */
  sub?: string;
  /** Gold left accent rule. */
  accent?: boolean;
}

/**
 * Compact metric tile for dashboards — big tabular value + trend delta.
 * @startingPoint section="Data" subtitle="Metric / KPI tile" viewport="280x150"
 */
export function StatTile(props: StatTileProps): JSX.Element;
