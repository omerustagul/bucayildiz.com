import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Primary = navy, accent = gold (use sparingly). */
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'on-navy';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  /** Render as another element/tag, e.g. 'a'. */
  as?: any;
}

/**
 * Primary call-to-action button for Buca Yıldız.
 * @startingPoint section="Core" subtitle="Navy / gold action buttons" viewport="700x200"
 */
export function Button(props: ButtonProps): JSX.Element;
