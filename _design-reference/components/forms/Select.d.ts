import React from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  placeholder?: string;
  options?: (string | SelectOption)[];
  containerStyle?: React.CSSProperties;
}

/** Brand-styled native select with custom chevron — e.g. yaş grubu seçimi. */
export function Select(props: SelectProps): JSX.Element;
