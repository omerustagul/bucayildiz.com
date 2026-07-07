"use client";

import { useRef, useState } from "react";

export type TabItem = { id: string; label: string; icon?: React.ReactNode; count?: number };

/** Buca Yıldız — Tabs. Underline tab bar with gold active indicator. */
export function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  variant = "underline",
  style = {},
}: {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: "underline" | "pill";
  style?: React.CSSProperties;
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.id);
  const active = isControlled ? value : internal;
  const pick = (id: string) => {
    if (!isControlled) setInternal(id);
    onChange?.(id);
  };

  const pill = variant === "pill";

  // Fare ile sürükleyerek kaydırma (dokunmatikte native scroll zaten çalışır)
  // + dikey tekerleği yatay kaydırmaya çevirme. Küçük eşik, tab tıklamasını bozmaz.
  const listRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startLeft: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // dokunmatik: native scroll
    const el = listRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    drag.current = { startX: e.clientX, startLeft: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = listRef.current;
    if (!d || !el) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    el.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => { drag.current = null; };
  const onClickCapture = (e: React.MouseEvent) => {
    // Sürükleme yapıldıysa bırakınca tab seçilmesin
    if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); }
  };
  const onWheel = (e: React.WheelEvent) => {
    const el = listRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) el.scrollLeft += e.deltaY;
  };

  return (
    <div
      role="tablist"
      className="by-tabs"
      ref={listRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
      onWheel={onWheel}
      style={{
        display: "flex",
        gap: pill ? 4 : 2,
        borderBottom: pill ? "none" : "1px solid var(--border-subtle)",
        background: pill ? "var(--ink-100)" : "transparent",
        padding: pill ? 3 : 0,
        borderRadius: pill ? "var(--radius-md)" : 0,
        flexWrap: "nowrap", // dar ekranda sarmak yerine .by-tabs ile yatay kaydırılır
        ...style,
      }}
    >
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => pick(t.id)}
            style={{
              font: "inherit",
              cursor: "pointer",
              border: "none",
              background: pill && on ? "var(--surface-card)" : "transparent",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: ".01em",
              color: on ? (pill ? "var(--navy-800)" : "var(--navy-700)") : "var(--ink-500)",
              padding: pill ? "8px 16px" : "11px 16px",
              borderRadius: pill ? "var(--radius-sm)" : 0,
              boxShadow: pill && on ? "var(--shadow-xs)" : "none",
              borderBottom: pill ? "none" : `2px solid ${on ? "var(--gold-500)" : "transparent"}`,
              marginBottom: pill ? 0 : -1,
              transition: "color var(--dur-fast), border-color var(--dur-fast)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            {t.icon}
            {t.label}
            {t.count != null && (
              <span style={{ fontFamily: "var(--font-stat)", fontSize: 11.5, fontWeight: 700, color: on ? "var(--navy-700)" : "var(--ink-400)", background: on ? "var(--navy-50)" : "var(--ink-100)", borderRadius: "var(--radius-pill)", padding: "1px 7px" }}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
