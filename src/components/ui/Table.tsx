"use client";

import { useState } from "react";

/** Buca Yıldız — Table. Lightweight data table. */
export type Column<T> = {
  key: string;
  label: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  render?: (row: T, i: number) => React.ReactNode;
};

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  onRowClick,
  getRowKey,
  empty = "Kayıt bulunamadı.",
  dense = false,
  style = {},
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T, i: number) => void;
  getRowKey?: (row: T, i: number) => string;
  empty?: string;
  dense?: boolean;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(-1);
  const pad = dense ? "10px 14px" : "14px 16px";
  return (
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflowX: "auto", background: "var(--surface-card)", ...style }}>
      <table style={{ width: "100%", minWidth: 540, borderCollapse: "collapse", fontFamily: "var(--font-body)" }}>
        <thead>
          <tr style={{ background: "var(--ink-50)", borderBottom: "1px solid var(--border-subtle)" }}>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || "left",
                  padding: pad,
                  width: c.width,
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: 11.5,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--ink-500)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: "40px 16px", textAlign: "center", color: "var(--ink-400)", fontSize: 14 }}>
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr
              key={getRowKey ? getRowKey(row, i) : i}
              onClick={onRowClick ? () => onRowClick(row, i) : undefined}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              style={{
                borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--ink-100)",
                background: hover === i && onRowClick ? "var(--navy-50)" : "transparent",
                cursor: onRowClick ? "pointer" : "default",
                transition: "background var(--dur-fast)",
              }}
            >
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align || "left", padding: pad, fontSize: 14, color: "var(--ink-700)", verticalAlign: "middle" }}>
                  {c.render ? c.render(row, i) : String(row[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
