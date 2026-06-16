"use client";

import { useState } from "react";

type Option = string | { value: string; label: string };

/** Buca Yıldız — Select. Native select with brand styling + custom chevron. */
export function Select({
  label,
  hint,
  options = [],
  placeholder,
  id,
  required = false,
  value,
  defaultValue,
  onChange,
  name,
  containerStyle = {},
  style = {},
}: {
  label?: string;
  hint?: string;
  options?: Option[];
  placeholder?: string;
  id?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}) {
  const [focus, setFocus] = useState(false);
  const selId = id || (label ? `sel-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={selId} style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-600)" }}>
          {label}
          {required && <span style={{ color: "var(--gold-600)" }}> *</span>}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <select
          id={selId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: "100%",
            appearance: "none",
            WebkitAppearance: "none",
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: "var(--ink-900)",
            background: "#fff",
            border: `1.5px solid ${focus ? "var(--navy-700)" : "var(--ink-200)"}`,
            borderRadius: "var(--radius-sm)",
            padding: "12px 38px 12px 12px",
            boxShadow: focus ? "var(--ring-focus)" : "none",
            cursor: "pointer",
            transition: "all var(--dur-fast) var(--ease-out)",
            ...style,
          }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => {
            const val = typeof o === "string" ? o : o.value;
            const lbl = typeof o === "string" ? o : o.label;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--navy-600)", fontSize: 12 }}>▾</span>
      </div>
      {hint && <span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{hint}</span>}
    </div>
  );
}
