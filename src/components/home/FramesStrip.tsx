"use client";

import { useState } from "react";
import { MediaViewer, type ViewerAsset } from "@/components/content/MediaViewer";

/** Akademiden Kareler şeridi (istemci) — karta tıklanınca sayfadan ayrılmadan
 *  tam ekran görüntüleyici açılır. */
export function FramesStrip({ photos }: { photos: ViewerAsset[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <>
      <div className="by-frames-strip" style={{ marginTop: 26 }}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="by-frame-card"
            aria-label={p.title || "Akademi fotoğrafını büyüt"}
            style={{
              position: "relative",
              display: "block",
              aspectRatio: "1 / 1",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--border-subtle)",
              background: "var(--navy-50)",
              boxShadow: "var(--shadow-sm)",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.url}
              alt={p.title || "Akademi fotoğrafı"}
              loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          </button>
        ))}
      </div>
      {activeIndex != null && <MediaViewer items={photos} index={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />}
    </>
  );
}
