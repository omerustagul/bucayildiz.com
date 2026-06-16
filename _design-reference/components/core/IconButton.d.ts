import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label (also used as tooltip). */
  label: string;
  variant?: 'solid' | 'outline' | 'ghost' | 'on-navy' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  /** Fully rounded instead of the default square-ish corner. */
  round?: boolean;
}

/** Square icon-only button — social links, carousel arrows, nav controls. */
export function IconButton(props: IconButtonProps): JSX.Element;
