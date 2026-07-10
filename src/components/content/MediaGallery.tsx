"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/lib/icons";
import { MediaViewer } from "@/components/content/MediaViewer";

/** Buca Yıldız — kategori sayfası medya ızgarası. Foto/video karışık listelenir;
 *  tıklanınca portal lightbox ile büyütülür (fotoğraf) veya oynatılır (video). */

export type GalleryAsset = { id: string; url: string; title: string; kind: string };

export function MediaGallery({ items }: { items: GalleryAsset[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
        {items.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActiveIndex(items.indexOf(a))}
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
      {activeIndex != null && <MediaViewer items={items} index={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />}
    </>
  );
}
