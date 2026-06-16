import React from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: (TabItem | string)[];
  value?: string;
  defaultValue?: string;
  variant?: 'underline' | 'pill';
  onChange?: (id: string) => void;
}

/** Tab bar — gold underline (default) or pill/segmented variant. */
export function Tabs(props: TabsProps): JSX.Element;
