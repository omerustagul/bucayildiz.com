import React from 'react';

export interface NewsCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /** Image URL. Omit for a branded navy placeholder. */
  image?: string;
  category?: string;
  date?: string;
  title: React.ReactNode;
  excerpt?: string;
  href?: string;
}

/**
 * Haber (news) card — image, gold category tag, date, title, excerpt.
 * @startingPoint section="Club" subtitle="News / haber card" viewport="380x420"
 */
export function NewsCard(props: NewsCardProps): JSX.Element;
