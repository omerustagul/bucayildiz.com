"use client";

import { useState } from "react";

/**
 * Buca Yıldız — IconButton
 * Square icon-only button. Used for social links, nav controls, carousels.
 */
const SIZES = { sm: 32, md: 40, lg: 48 } as const;

const VARIANTS: Record<string, React.CSSProperties & { hover: React.CSSProperties }> = {
  solid: {
    background: "var(--navy-700)",
    color: "#fff",
    border: "1px solid var(--navy-700)",
    hover: { background: "var(--navy-800)" },
  },
  outline: {
    background: "transparent",
    color: "var(--navy-700)",
    border: "1.5px solid var(--ink-200)",
    hover: { border: "1.5px solid var(--navy-700)", background: "var(--navy-50)" },
  },
  ghost: {
    background: "transparent",
    color: "var(--navy-600)",
    border: "1px solid transparent",
    hover: { background: "var(--ink-100)" },
  },
  "on-navy": {
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.18)",
    hover: { background: "rgba(255,255,255,0.16)", border: "1px solid var(--gold-400)" },
  },
  gold: {
    background: "var(--grad-gold)",
    color: "var(--navy-900)",
    border: "1px solid var(--gold-600)",
    hover: { filter: "brightness(1.05)" },
  },
};

interface IconButtonOwnProps {
  children?: React.ReactNode;
  label: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  round?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

type IconButtonProps = IconButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof IconButtonOwnProps>;

export function IconButton({
  children,
  label,
  variant = "outline",
  size = "md",
  round = false,
  disabled = false,
  style = {},
  ...rest
}: IconButtonProps) {
  const [hover, setHover] = useState(false);
  const dim = SIZES[size] ?? SIZES.md;
  const v = VARIANTS[variant] ?? VARIANTS.outline;
  const { hover: hoverStyle, ...vBase } = v;
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: dim,
    height: dim,
    borderRadius: round ? "var(--radius-pill)" : "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all var(--dur-fast) var(--ease-out)",
    ...vBase,
    ...(hover && !disabled ? hoverStyle : null),
    ...style,
  };
  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      style={base}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {children}
    </button>
  );
}
