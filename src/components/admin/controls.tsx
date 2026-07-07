"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IconButton } from "@/components/ui/IconButton";
import { Icon, type IconName } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";

/** Buca Yıldız Admin — interaktif kontroller. */

export function TextInput({ style, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  const [f, setF] = useState(false);
  return (
    <input
      {...rest}
      onFocus={(e) => {
        setF(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setF(false);
        rest.onBlur?.(e);
      }}
      style={{
        width: "100%",
        fontFamily: "var(--font-body)",
        fontSize: 14.5,
        color: "var(--ink-900)",
        background: "#fff",
        border: `1.5px solid ${f ? "var(--navy-700)" : "var(--ink-200)"}`,
        borderRadius: "var(--radius-sm)",
        padding: "11px 12px",
        outline: "none",
        boxShadow: f ? "var(--ring-focus)" : "none",
        transition: "all var(--dur-fast)",
        ...style,
      }}
    />
  );
}

export function TextArea({ style, rows = 4, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [f, setF] = useState(false);
  return (
    <textarea
      rows={rows}
      {...rest}
      onFocus={(e) => {
        setF(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setF(false);
        rest.onBlur?.(e);
      }}
      style={{
        width: "100%",
        fontFamily: "var(--font-body)",
        fontSize: 14.5,
        lineHeight: 1.6,
        color: "var(--ink-900)",
        background: "#fff",
        border: `1.5px solid ${f ? "var(--navy-700)" : "var(--ink-200)"}`,
        borderRadius: "var(--radius-sm)",
        padding: "11px 12px",
        outline: "none",
        resize: "vertical",
        boxShadow: f ? "var(--ring-focus)" : "none",
        transition: "all var(--dur-fast)",
        ...style,
      }}
    />
  );
}

export function SearchBox({ placeholder = "Ara…", value, onChange, width = 260 }: { placeholder?: string; value?: string; onChange?: (v: string) => void; width?: number | string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "0 12px", height: 40, width }}>
      <span style={{ color: "var(--ink-400)", display: "inline-flex" }}>
        <Icon name="search" size={16} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ink-800)", minWidth: 0 }}
      />
    </div>
  );
}

export function Drawer({ open, onClose, title, subtitle, children, footer, width = 480 }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode; width?: number }) {
  useOverlayDismiss(open, onClose);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <>
      <div className="by-anim-fade" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.45)", zIndex: 200 }} />
      <aside className="by-anim-drawer" role="dialog" aria-modal="true" aria-label={title} style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: `min(${width}px, 94vw)`, background: "var(--surface-page)", boxShadow: "var(--shadow-xl)", zIndex: 201, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, textTransform: "uppercase", color: "var(--text-strong)", margin: 0, lineHeight: 1.05 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "6px 0 0" }}>{subtitle}</p>}
          </div>
          <IconButton label="Kapat" variant="ghost" onClick={onClose}>
            <Icon name="x" size={18} />
          </IconButton>
        </div>
        <div className="by-overlay-scroll" style={{ flex: 1, overflowY: "auto", padding: 24 }}>{children}</div>
        {footer && <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10, justifyContent: "flex-end", background: "var(--surface-subtle)" }}>{footer}</div>}
      </aside>
    </>,
    document.body,
  );
}

export function Modal({ open, onClose, title, children, footer, width = 460 }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; width?: number }) {
  useOverlayDismiss(open, onClose);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="by-anim-fade" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.5)", display: "grid", placeItems: "center", zIndex: 210, padding: 20 }}>
      <div className="by-anim-pop" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title} style={{ width: `min(${width}px, 96vw)`, background: "var(--surface-page)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{title}</h2>
          <IconButton label="Kapat" variant="ghost" onClick={onClose}>
            <Icon name="x" size={18} />
          </IconButton>
        </div>
        <div className="by-overlay-scroll" style={{ padding: 24, maxHeight: "calc(90vh - 132px)", overflowY: "auto" }}>{children}</div>
        {footer && <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10, justifyContent: "flex-end", background: "var(--surface-subtle)" }}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

/** Gerçek yükleyen FileDrop — boşken dashed dropzone, doluyken görsel önizleme. */
export function FileDrop({
  value,
  onChange,
  label = "Görsel yükle",
  hint,
  aspect = "16 / 10",
  compact = false,
  icon = "image",
  style = {},
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  aspect?: string;
  compact?: boolean;
  icon?: IconName;
  style?: React.CSSProperties;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız.");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          position: "relative",
          aspectRatio: aspect,
          borderRadius: "var(--radius-md)",
          border: `1.5px dashed ${over ? "var(--navy-700)" : "var(--ink-300)"}`,
          background: value ? "var(--surface-subtle)" : over ? "var(--navy-50)" : "var(--ink-50)",
          display: "grid",
          placeItems: "center",
          cursor: busy ? "wait" : "pointer",
          overflow: "hidden",
          transition: "all var(--dur-fast)",
          ...style,
        }}
      >
        {value ? (
          <>
            <Image src={value} alt="" fill style={{ objectFit: "contain" }} sizes="480px" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              style={{ position: "absolute", top: 8, right: 8, display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 9px", borderRadius: "var(--radius-sm)", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", zIndex: 2 }}
            >
              <Icon name="trash-2" size={13} /> Kaldır
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: compact ? 4 : 8 }}>
            <span style={{ width: compact ? 34 : 44, height: compact ? 34 : 44, borderRadius: "50%", background: "var(--navy-50)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}>
              <Icon name={icon} size={compact ? 17 : 20} />
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: compact ? 12.5 : 14, color: "var(--ink-700)" }}>{busy ? "Yükleniyor…" : label}</span>
            {hint && !compact && <span style={{ fontSize: 12, color: "var(--ink-400)" }}>{hint}</span>}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
      {error && <span style={{ fontSize: 12.5, color: "var(--red-600)" }}>{error}</span>}
    </div>
  );
}
