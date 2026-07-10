"use client";

import { useState } from "react";

/** Buca Yıldız — Switch. On/off toggle, navy when on. */
export function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  size = "md",
  style = {},
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  size?: "sm" | "md";
  style?: React.CSSProperties;
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const W = size === "sm" ? 36 : 44;
  const H = size === "sm" ? 20 : 24;
  const K = H - 6;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange?.(!on);
  };
  const control = (
    <span
      className="by-switch"
      onClick={toggle}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
      role="switch"
      aria-checked={on}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      style={{
        width: W,
        height: H,
        flex: "none",
        borderRadius: "var(--radius-pill)",
        background: on ? "var(--navy-700)" : "var(--ink-300)",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background var(--dur-fast) var(--ease-out)",
        opacity: disabled ? 0.5 : 1,
        display: "inline-block",
      }}
    >
      <span
        className="by-switch-knob"
        style={{
          position: "absolute",
          top: 3,
          left: on ? W - K - 3 : 3,
          width: K,
          height: K,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "var(--shadow-sm)",
        }}
      />
    </span>
  );
  if (!label) return control;
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-700)", ...style }}>
      {control}
      {label}
    </label>
  );
}
