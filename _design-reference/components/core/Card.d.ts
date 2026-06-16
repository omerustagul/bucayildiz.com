import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Lift + stronger shadow on hover. */
  interactive?: boolean;
  /** Gold top-accent rule. */
  accent?: boolean;
  variant?: 'surface' | 'subtle' | 'navy';
}

/** Generic surface container — sharp corners, hairline border, navy-tinted shadow. */
export function Card(props: CardProps): JSX.Element;
