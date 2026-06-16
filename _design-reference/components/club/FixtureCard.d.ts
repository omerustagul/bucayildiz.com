import React from 'react';

export interface FixtureTeam {
  name: string;
  /** Crest image URL; falls back to an initials monogram. */
  crest?: string;
  score?: number;
  /** Kickoff time string for upcoming matches, e.g. "19:00". */
  time?: string;
}

export interface FixtureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  competition?: string;
  date?: string;
  venue?: string;
  status?: 'upcoming' | 'live' | 'finished';
  home?: FixtureTeam;
  away?: FixtureTeam;
}

/**
 * Match fixture card — navy header strip, two crests, score or kickoff time.
 * @startingPoint section="Club" subtitle="Fixture / maç kartı" viewport="420x260"
 */
export function FixtureCard(props: FixtureCardProps): JSX.Element;
