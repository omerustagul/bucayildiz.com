"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Icon } from "@/lib/icons";
import { setAthleteConsent } from "@/app/panel/izinler/actions";

export type ConsentItem = {
  key: string;
  title: string;
  summary: string;
  required: boolean;
  isConsent: boolean;
  version: string;
  granted: boolean; // güncel durum
  updatedAt: string | null;
};

export function ConsentManager({ items }: { items: ConsentItem[] }) {
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const toggle = (key: string, next: boolean) => {
    setErr(null);
    setPendingKey(key);
    startTransition(async () => {
      const res = await setAthleteConsent(key, next);
      if (!res.ok) setErr(res.error);
      setPendingKey(null);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {err && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{err}</div>}
      {items.map((c) => {
        const busy = pendingKey === c.key;
        return (
          <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14.5, color: "var(--text-strong)" }}>{c.title}</span>
                {c.required && <span style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--navy-600)", border: "1px solid var(--border-subtle)", borderRadius: 4, padding: "1px 6px" }}>Zorunlu</span>}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>{c.summary}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 5 }}>
                Sürüm {c.version}
                {c.updatedAt ? ` · son güncelleme ${c.updatedAt}` : ""} ·{" "}
                <Link href={`/sozlesmeler/${c.key}`} target="_blank" style={{ color: "var(--text-link)", textDecoration: "underline" }}>metni oku</Link>
              </div>
            </div>
            <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 10 }}>
              {c.granted ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--green-600)", fontSize: 12.5, fontWeight: 600 }}>
                  <Icon name="check" size={14} /> {c.isConsent ? "Verildi" : "Okundu"}
                </span>
              ) : (
                <span style={{ color: "var(--ink-400)", fontSize: 12.5, fontWeight: 600 }}>Kapalı</span>
              )}
              {!c.required && (
                <button
                  onClick={() => toggle(c.key, !c.granted)}
                  disabled={busy}
                  style={{
                    padding: "7px 14px", borderRadius: "var(--radius-pill)",
                    border: c.granted ? "1px solid var(--border-subtle)" : "none",
                    background: c.granted ? "var(--surface-card)" : "var(--grad-gold)",
                    color: c.granted ? "var(--text-muted)" : "var(--navy-900)",
                    fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, cursor: busy ? "wait" : "pointer", whiteSpace: "nowrap",
                  }}
                >
                  {busy ? "…" : c.granted ? "Geri Al" : "İzin Ver"}
                </button>
              )}
            </div>
          </div>
        );
      })}
      <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
        Zorunlu onayları geri almak için kulüple iletişime geçin. Opsiyonel izinleri (fotoğraf/video, pazarlama)
        dilediğiniz zaman buradan açıp kapatabilirsiniz; her değişiklik KVKK kaydına işlenir.
      </p>
    </div>
  );
}
