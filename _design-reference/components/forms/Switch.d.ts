import React from 'react';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  size?: 'sm' | 'md';
  onChange?: (checked: boolean, e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/** On/off toggle — navy when on. Publish state, featured flags, settings. */
export function Switch(props: SwitchProps): JSX.Element;
