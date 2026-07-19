"use client";

import { useState } from "react";
import { Modal } from "@/components/admin/controls";
import { Icon } from "@/lib/icons";

export type ConsentRow = {
  documentKey: string;
  documentTitle: string;
  documentVersion: string;
  granted: boolean;
  granterName: string;
  granterRelation: string | null;
  channel: string;
  textHash: string;
  ipAddress: string | null;
  otpVerified: boolean;
  createdAt: string; // önceden formatlanmış
  withdrawnAt: string | null;
};

/**
 * KVKK onaylarının özeti (satırda "X/Y onay" rozeti) + denetim detayı (modal).
 * Her belge ayrı: verilen/verilmeyen, sürüm, hash, IP, tarih. Başvuru VE sporcu
 * satırlarında kullanılır (aynı ConsentRecord şekli). `exportHref` verilirse
 * modalda "CSV indir" gösterilir (D7 — yalnız KVKK yetkisi olan sayfalar geçer).
 */
export function ConsentAuditCell({ consents, exportHref }: { consents: ConsentRow[]; exportHref?: string }) {
  const [open, setOpen] = useState(false);
  if (consents.length === 0) return <span style={{ color: "var(--ink-400)", fontSize: 13 }}>—</span>;

  const granted = consents.filter((c) => c.granted && !c.withdrawnAt).length;
  const total = consents.length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 10px",
          borderRadius: "var(--radius-pill)",
          border: "1px solid var(--border-subtle)",
          background: "var(--surface-card)",
          color: "var(--text-body)",
          fontSize: 12.5,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <Icon name="shield-check" size={14} />
        {granted}/{total} onay
      </button>

      {open && (
        <Modal open onClose={() => setOpen(false)} title="KVKK Onay Kayıtları" width={640}>
          {exportHref && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              {/* download route → Content-Disposition attachment. <a download> yeter;
                  route zaten kvkk.view kapısıyla korunur (istemci gizlemez, sunucu reddeder). */}
              <a
                href={exportHref}
                download
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 12px", borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--border-subtle)", background: "var(--surface-card)",
                  color: "var(--text-body)", fontSize: 12.5, fontWeight: 600, textDecoration: "none",
                }}
              >
                <Icon name="download" size={14} /> CSV indir
              </a>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {consents.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  background: c.granted && !c.withdrawnAt ? "var(--surface-subtle)" : "var(--surface-card)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-strong)" }}>{c.documentTitle}</span>
                  {c.withdrawnAt ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--ink-500)", fontSize: 12.5, fontWeight: 600 }}>
                      <Icon name="x" size={14} /> Geri alındı
                    </span>
                  ) : c.granted ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--green-600)", fontSize: 12.5, fontWeight: 600 }}>
                      <Icon name="check" size={14} /> Verildi
                    </span>
                  ) : (
                    <span style={{ color: "var(--red-600)", fontSize: 12.5, fontWeight: 600 }}>Verilmedi</span>
                  )}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12, color: "var(--text-muted)" }}>
                  <span>Sürüm: <strong style={{ color: "var(--text-body)" }}>{c.documentVersion}</strong></span>
                  <span>Onaylayan: <strong style={{ color: "var(--text-body)" }}>{c.granterName}</strong>{c.granterRelation ? ` (${c.granterRelation})` : ""}</span>
                  <span>Kanal: {c.channel}</span>
                  <span>Tarih: {c.createdAt}</span>
                  {c.ipAddress && <span>IP: {c.ipAddress}</span>}
                  <span>OTP: {c.otpVerified ? "✓" : "—"}</span>
                  <span title={c.textHash} style={{ fontFamily: "var(--font-stat, monospace)" }}>Hash: {c.textHash.slice(0, 16)}…</span>
                </div>
              </div>
            ))}
            <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Bu kayıtlar KVKK ispat yükümlülüğü içindir: hangi metnin (hash) hangi sürümüne, kim tarafından,
              hangi kanaldan ve ne zaman onay verildiğini gösterir.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
