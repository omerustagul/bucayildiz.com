import React from 'react';

export interface TrialBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  href?: string;
  onCta?: (e: React.MouseEvent) => void;
}

/**
 * "Ücretsiz denemelere katıl" hero CTA card — navy gradient, gold edge,
 * star watermark, accent button. Sits at the top of the homepage.
 * @startingPoint section="Club" subtitle="Free-trial CTA banner" viewport="900x240"
 */
export function TrialBanner(props: TrialBannerProps): JSX.Element;
