"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Icon } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";

/** Buca Yıldız — kategori sayfası medya ızgarası. Foto/video karışık listelenir;
 *  tıklanınca portal lightbox ile büyütülür (fotoğraf) veya oynatılır (video). */

export type GalleryAsset = { id: string; url: string; title: string; kind: string };

function AssetLightbox({ asset, onClose }: { asset: GalleryAsset; onClose: () => void }) {
  useOverlayDismiss(true, onClose);
  return createPortal(
    <div
      className="by-anim-fade"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.82)", zIndex: 210, display: "grid", placeItems: "center", padding: 20 }}
    >
      <div className="by-anim-pop" onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: "min(960px, 94vw)", maxHeight: "90vh" }}>
        {asset.kind === "video" ? (
          <video src={asset.url} controls autoPlay style={{ display: "block", maxWidth: "100%", maxHeight: "90vh", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xl)" }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.url} alt={asset.title || "Medya"} style={{ display: "block", maxWidth: "100%", maxHeight: "90vh", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xl)" }} />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          style={{ position: "absolute", top: -14, right: -14, width: 34, height: 34, borderRadius: "50%", border: "none", background: "#fff", color: "var(--navy-900)", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "var(--shadow-md)" }}
        >
          <Icon name="x" size={17} />
        </button>
      </div>
    </div>,
    document.body,
  );
}

export function MediaGallery({ items }: { items: GalleryAsset[] }) {
  const [active, setActive] = useState<GalleryAsset | null>(null);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
        {items.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActive(a)}
            className="link-card"
            style={{ position: "relative", display: "block", aspectRatio: "4 / 3", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--grad-navy)", border: "1px solid var(--navy-700)", padding: 0, cursor: "pointer", textAlign: "left" }}
          >
            {a.kind === "video" ? (
              <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <span style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--grad-gold)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-lg)" }}>
                  <Icon name="play" size={22} style={{ color: "var(--navy-900)", fill: "var(--navy-900)" }} />
                </span>
              </span>
            ) : (
              <Image src={a.url} alt={a.title || "Medya"} fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 50vw, 280px" />
            )}
            <span style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />
            {a.title && (
              <span style={{ position: "absolute", left: 14, bottom: 12, right: 14, fontSize: 12.5, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
            )}
          </button>
        ))}
      </div>
      {active && <AssetLightbox asset={active} onClose={() => setActive(null)} />}
    </>
  );
}
