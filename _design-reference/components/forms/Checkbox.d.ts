import React from 'react';

export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/** Square navy checkbox with label — controlled or uncontrolled. */
export function Checkbox(props: CheckboxProps): JSX.Element;
