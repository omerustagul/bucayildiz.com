"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";

/** Buca Yıldız — tam ekran medya görüntüleyici. Site genelinde tek kaynak:
 *  fotoğraf contain-fit büyür, video kontrollerle oynar (tarayıcı tam ekranı
 *  dahil). Ok tuşları/butonlarıyla gezinme, sayaç ve başlık şeridi vardır. */

export type ViewerAsset = { id: string; url: string; title: string; kind: string };

export function MediaViewer({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: ViewerAsset[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const asset = items[index];
  const many = items.length > 1;
  useOverlayDismiss(true, onClose);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!many) return;
      onNavigate((index + dir + items.length) % items.length);
    },
    [many, index, items.length, onNavigate],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go]);

  if (!asset || typeof document === "undefined") return null;

  const navBtn: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 46,
    height: 46,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,.22)",
    background: "rgba(8,15,33,.55)",
    color: "#fff",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    backdropFilter: "blur(6px)",
    zIndex: 2,
  };

  return createPortal(
    <div
      className="by-anim-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={asset.title || "Medya görüntüleyici"}
      style={{ position: "fixed", inset: 0, background: "rgba(4, 8, 18, 0.94)", zIndex: 210, display: "flex", flexDirection: "column" }}
    >
      {/* Üst şerit: sayaç + kapat */}
      <div onClick={(e) => e.stopPropagation()} style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px clamp(14px, 3vw, 26px)" }}>
        <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 14, letterSpacing: ".08em", color: "rgba(255,255,255,.65)", fontVariantNumeric: "tabular-nums" }}>
          {many ? `${index + 1} / ${items.length}` : ""}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(255,255,255,.22)", background: "rgba(8,15,33,.55)", color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}
        >
          <Icon name="x" size={19} />
        </button>
      </div>

      {/* Medya alanı */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", display: "grid", placeItems: "center", padding: "0 clamp(10px, 6vw, 80px)" }}>
        {many && (
          <>
            <button type="button" aria-label="Önceki" onClick={(e) => { e.stopPropagation(); go(-1); }} style={{ ...navBtn, left: "clamp(8px, 2vw, 22px)" }}>
              <Icon name="chevron-down" size={20} style={{ transform: "rotate(90deg)" }} />
            </button>
            <button type="button" aria-label="Sonraki" onClick={(e) => { e.stopPropagation(); go(1); }} style={{ ...navBtn, right: "clamp(8px, 2vw, 22px)" }}>
              <Icon name="chevron-down" size={20} style={{ transform: "rotate(-90deg)" }} />
            </button>
          </>
        )}
        <div className="by-anim-pop" key={asset.id} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "100%", maxHeight: "100%", display: "grid", placeItems: "center" }}>
          {asset.kind === "video" ? (
            <video
              src={asset.url}
              controls
              autoPlay
              playsInline
              style={{ display: "block", maxWidth: "100%", maxHeight: "calc(100vh - 150px)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xl)", background: "#000" }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.url}
              alt={asset.title || "Medya"}
              style={{ display: "block", maxWidth: "100%", maxHeight: "calc(100vh - 150px)", objectFit: "contain", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xl)" }}
            />
          )}
        </div>
      </div>

      {/* Alt şerit: başlık */}
      <div onClick={(e) => e.stopPropagation()} style={{ flex: "none", padding: "12px clamp(14px, 3vw, 26px) calc(14px + env(safe-area-inset-bottom))", textAlign: "center" }}>
        {asset.title && (
          <span style={{ display: "inline-block", maxWidth: "min(720px, 90vw)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.85)" }}>
            {asset.title}
          </span>
        )}
      </div>
    </div>,
    document.body,
  );
}
