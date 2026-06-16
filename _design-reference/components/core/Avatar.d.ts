import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Gold focus ring. */
  ring?: boolean;
  /** Rounded-square instead of circle. */
  square?: boolean;
}

/** Athlete/user avatar — image or initials monogram on navy gradient. */
export function Avatar(props: AvatarProps): JSX.Element;
