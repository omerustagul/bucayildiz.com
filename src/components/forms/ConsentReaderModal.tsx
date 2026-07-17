"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/lib/icons";

/**
 * Aşağı-kaydır-oku sözleşme okuyucusu — onay butonu metin SONUNA kadar
 * kaydırılmadan aktifleşmez (kısa metin hemen aktif). Başvuru formu (`ApplicationForm`)
 * ve panel ilk-giriş kapısı (`ConsentGate`) bunu PAYLAŞIR (kopya-yapıştır değil).
 * `title`+`body` ile ayrık: her iki çağıran kendi belge tipini geçirebilir.
 */
export function ConsentReaderModal({ title, body, onApprove, onClose }: { title: string; body: string; onApprove: () => void; onClose: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Metin zaten kaydırma gerektirmiyorsa (kısa) butonu hemen aktif et.
    const el = bodyRef.current;
    if (el && el.scrollHeight - el.clientHeight <= 8) setReachedEnd(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleScroll = () => {
    const el = bodyRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setReachedEnd(true);
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        background: "rgba(8,18,38,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom))",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width: "min(640px, 100%)", maxHeight: "min(86dvh, 760px)", background: "#fff", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: 0, lineHeight: 1.15 }}>{title}</h3>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "5px 0 0" }}>Onaylamak için metni sonuna kadar okuyun.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" style={{ flex: "none", border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-500)", padding: 4, display: "inline-flex" }}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div
          ref={bodyRef}
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: "auto", padding: "20px 22px", fontSize: 13.8, lineHeight: 1.7, color: "var(--text-body)", whiteSpace: "pre-wrap", background: "var(--surface-subtle)" }}
        >
          {body}
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 10, background: "#fff" }}>
          {!reachedEnd && (
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 12.5, color: "var(--text-muted)" }}>
              <Icon name="arrow-down" size={14} /> Onaylamak için sözleşmeyi sonuna kadar kaydırın
            </div>
          )}
          <button
            type="button"
            disabled={!reachedEnd}
            onClick={() => {
              onApprove();
              onClose();
            }}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "var(--radius-sm)",
              border: reachedEnd ? "1px solid var(--gold-600)" : "1px solid var(--border-subtle)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: ".03em",
              textTransform: "uppercase",
              cursor: reachedEnd ? "pointer" : "not-allowed",
              background: reachedEnd ? "var(--grad-gold)" : "var(--ink-100)",
              color: reachedEnd ? "var(--navy-900)" : "var(--ink-400)",
              transition: "all var(--dur-base) var(--ease-out)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {reachedEnd && <Icon name="check" size={17} />}
            Sözleşmeyi Onayla
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
