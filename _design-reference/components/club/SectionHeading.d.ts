import React from 'react';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small gold uppercase label above the title. */
  kicker?: string;
  title: React.ReactNode;
  /** Right-aligned action node, e.g. a "Tümü" Button. */
  action?: React.ReactNode;
  /** Use light text for navy/dark backgrounds. */
  onDark?: boolean;
  align?: 'left' | 'center';
}

/** Standard section header — gold kicker + uppercase condensed title. */
export function SectionHeading(props: SectionHeadingProps): JSX.Element;
