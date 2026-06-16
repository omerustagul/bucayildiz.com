import React from 'react';

export interface AgeGroupCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /** Big label, e.g. "U-17" or "A TAKIM". */
  label: string;
  /** Sub-line, e.g. "2009 doğumlular". */
  title?: string;
  /** Optional squad size; shown as "{count} Sporcu". */
  count?: number;
  image?: string;
  href?: string;
}

/**
 * Yaş grubu (age group) card — tall photo tile with navy scrim and big label.
 * @startingPoint section="Club" subtitle="Age group tile" viewport="300x400"
 */
export function AgeGroupCard(props: AgeGroupCardProps): JSX.Element;
