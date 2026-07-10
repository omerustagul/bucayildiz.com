"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/lib/icons";

type Option = string | { value: string; label: string };

/** Buca Yıldız — Select. Native açılır liste yerine marka dilinde ÖZEL popup:
 *  beyaz panel, seçili satırda altın onay işareti, klavye gezinmesi (ok/Enter/
 *  Escape), dışarı tıklayınca kapanma. API eski native sürümle birebir uyumlu —
 *  onChange yine `e.target.value` okunacak şekilde çağrılır. */
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
  disabled = false,
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
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}) {
  const reactId = useId();
  const selId = id || (label ? `sel-${label.replace(/\s+/g, "-").toLowerCase()}` : `sel-${reactId}`);
  const listId = `${selId}-list`;

  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? value : internal;
  const currentLabel = opts.find((o) => o.value === current)?.label ?? "";

  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Placeholder da seçilebilir bir satırdır (boş değere dönüş)
  const rows = placeholder ? [{ value: "", label: placeholder }, ...opts] : opts;

  const commit = (v: string) => {
    if (!isControlled) setInternal(v);
    // Eski native API ile uyum: tüketiciler e.target.value okur
    onChange?.({ target: { value: v, name: name ?? "" } } as unknown as React.ChangeEvent<HTMLSelectElement>);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const openPopup = () => {
    if (disabled) return;
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const estimated = Math.min(rows.length * 42 + 12, 300);
    const below = window.innerHeight - r.bottom;
    const openUp = below < estimated + 12 && r.top > below;
    setPos(
      openUp
        ? { bottom: window.innerHeight - r.top + 6, left: r.left, width: r.width }
        : { top: r.bottom + 6, left: r.left, width: r.width },
    );
    const idx = rows.findIndex((o) => o.value === current);
    setHighlight(idx >= 0 ? idx : 0);
    setOpen(true);
  };

  // Dışarı tıklama + Escape + klavye gezinme + dışarıda scroll'da kapanma
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popupRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Tab") setOpen(false);
      else if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(h + 1, rows.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
      else if (e.key === "Home") { e.preventDefault(); setHighlight(0); }
      else if (e.key === "End") { e.preventDefault(); setHighlight(rows.length - 1); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const r = rows[highlight]; if (r) commit(r.value); }
    };
    const onScroll = (e: Event) => {
      if (popupRef.current?.contains(e.target as Node)) return; // liste içi kaydırma serbest
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, highlight, rows.length]);

  // Vurgulanan satır görünür kalsın
  useEffect(() => {
    if (!open) return;
    popupRef.current?.querySelector(`[data-idx="${highlight}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, highlight]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={selId} style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-600)" }}>
          {label}
          {required && <span style={{ color: "var(--gold-600)" }}> *</span>}
        </label>
      )}
      {/* Form gönderimi için gizli alan (native select yok artık) */}
      {name && <input type="hidden" name={name} value={current ?? ""} />}
      <button
        ref={triggerRef}
        id={selId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPopup())}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); openPopup(); }
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          textAlign: "left",
          fontFamily: "var(--font-body)",
          fontSize: 15,
          color: disabled ? "var(--ink-500)" : current ? "var(--ink-900)" : "var(--ink-400)",
          background: disabled ? "var(--ink-50)" : "#fff",
          border: `1.5px solid ${focus || open ? "var(--navy-700)" : "var(--ink-200)"}`,
          borderRadius: "var(--radius-sm)",
          padding: "12px 12px",
          boxShadow: focus || open ? "var(--ring-focus)" : "none",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all var(--dur-fast) var(--ease-out)",
          ...style,
        }}
      >
        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {currentLabel || placeholder || "Seçiniz"}
        </span>
        <span aria-hidden="true" style={{ flex: "none", color: "var(--navy-600)", display: "inline-flex", transition: "transform var(--dur-fast) var(--ease-out)", transform: open ? "rotate(180deg)" : "none" }}>
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {hint && <span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{hint}</span>}

      {open && pos && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popupRef}
            id={listId}
            role="listbox"
            aria-label={label || placeholder || "Seçenekler"}
            className="by-anim-pop by-overlay-scroll"
            style={{
              position: "fixed",
              top: pos.top,
              bottom: pos.bottom,
              left: pos.left,
              width: pos.width,
              zIndex: 260,
              maxHeight: 300,
              overflowY: "auto",
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-xl)",
              padding: 6,
            }}
          >
            {rows.map((o, i) => {
              const selected = o.value === current;
              const hl = i === highlight;
              return (
                <div
                  key={o.value || "__empty"}
                  data-idx={i}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(o.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    minHeight: 40,
                    padding: "8px 11px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontSize: 14.5,
                    fontWeight: selected ? 650 : 450,
                    color: o.value === "" ? "var(--ink-400)" : "var(--ink-900)",
                    background: hl ? "var(--navy-50)" : "transparent",
                    transition: "background var(--dur-fast) var(--ease-out)",
                  }}
                >
                  <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.label}</span>
                  {selected && (
                    <span style={{ flex: "none", color: "var(--gold-600)", display: "inline-flex" }}>
                      <Icon name="check" size={16} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
