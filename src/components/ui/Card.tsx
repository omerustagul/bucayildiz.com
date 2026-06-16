"use client";

import { useState } from "react";

/**
 * Buca Yıldız — Card
 * Corporate surface container. Sharp corners, hairline border,
 * navy-tinted shadow. Optional gold top-accent rule.
 */
const VARIANTS: Record<string, React.CSSProperties> = {
  surface: {
    background: "var(--surface-card)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-body)",
  },
  subtle: {
    background: "var(--surface-subtle)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-body)",
  },
  navy: { background: "var(--grad-navy)", border: "1px solid var(--navy-600)", color: "#fff" },
};

const PADS: Record<string, number | string> = {
  none: 0,
  sm: "var(--space-4)",
  md: "var(--space-6)",
  lg: "var(--space-8)",
};

interface CardProps {
  children?: React.ReactNode;
  padding?: keyof typeof PADS;
  interactive?: boolean;
  accent?: boolean;
  variant?: keyof typeof VARIANTS;
  style?: React.CSSProperties;
}

export function Card({
  children,
  padding = "md",
  interactive = false,
  accent = false,
  variant = "surface",
  style = {},
}: CardProps) {
  const [hover, setHover] = useState(false);
  const v = VARIANTS[variant] ?? VARIANTS.surface;
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        padding: PADS[padding] ?? PADS.md,
        boxShadow: hover && interactive ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hover && interactive ? "translateY(-3px)" : "none",
        transition:
          "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        cursor: interactive ? "pointer" : "default",
        ...v,
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {accent && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "var(--grad-gold)",
          }}
        />
      )}
      {children}
    </div>
  );
}
