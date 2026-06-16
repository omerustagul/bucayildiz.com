import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

/** Labeled text input with gold focus ring and error/hint states. */
export function Input(props: InputProps): JSX.Element;
