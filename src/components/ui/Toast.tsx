"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/lib/icons";

/** Buca Yıldız — hafif Toast bildirimi. framer-motion KULLANMAZ, saf CSS
 *  animasyonludur. Modül seviyesinde `toast.success(msg)` / `toast.error(msg)`
 *  çağrılır; `<Toaster />` uygulama kökünde (AdminShell/PanelShell) BİR KEZ
 *  mount edilir ve modül-içi listener üzerinden mesajları alır. */

type ToastKind = "success" | "error";
type ToastItem = { id: string; kind: ToastKind; text: string; closing?: boolean };
type Listener = (kind: ToastKind, text: string) => void;

let listener: Listener | null = null;

function emit(kind: ToastKind, text: string) {
  listener?.(kind, text);
}

export const toast = {
  success: (text: string) => emit("success", text),
  error: (text: string) => emit("error", text),
};

const AUTO_DISMISS_MS = 3500;
const EXIT_MS = 200;

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = (id: string) => {
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, closing: true } : it)));
    setTimeout(() => setItems((cur) => cur.filter((it) => it.id !== id)), EXIT_MS);
  };

  useEffect(() => {
    listener = (kind, text) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setItems((cur) => [...cur, { id, kind, text }]);
    };
    return () => {
      listener = null;
    };
  }, []);

  // Her yeni toast'a kendi otomatik kapanma zamanlayıcısı — dismiss aynı fonksiyonu
  // hem otomatik hem tıklamayla kapanışta kullanır.
  useEffect(() => {
    const openIds = items.filter((it) => !it.closing).map((it) => it.id);
    const timers = openIds.map((id) => setTimeout(() => dismiss(id), AUTO_DISMISS_MS));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  if (typeof document === "undefined" || items.length === 0) return null;

  return createPortal(
    <div
      aria-live="polite"
      role="status"
      className="by-toast-viewport"
      style={{
        position: "fixed",
        top: "calc(env(safe-area-inset-top) + 16px)",
        right: 16,
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "min(360px, calc(100vw - 32px))",
        pointerEvents: "none",
      }}
    >
      {items.map((it) => (
        <div
          key={it.id}
          onClick={() => dismiss(it.id)}
          className={`by-toast${it.closing ? " is-closing" : ""}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            minWidth: 0,
            padding: "13px 14px",
            borderRadius: "var(--radius-md)",
            background: "var(--navy-800)",
            color: "#fff",
            boxShadow: "var(--shadow-xl)",
            cursor: "pointer",
            pointerEvents: "auto",
          }}
        >
          <span
            style={{
              flex: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: it.kind === "success" ? "var(--gold-400)" : "var(--red-600)",
              color: it.kind === "success" ? "var(--navy-900)" : "#fff",
            }}
          >
            <Icon name={it.kind === "success" ? "check" : "x"} size={13} />
          </span>
          <span style={{ minWidth: 0, flex: 1, fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13.5, lineHeight: 1.4 }}>{it.text}</span>
        </div>
      ))}
    </div>,
    document.body,
  );
}
