"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/lib/icons";
import { MediaViewer } from "@/components/content/MediaViewer";

/** Buca Yıldız — galeri ızgarası. Foto/video karışık listelenir; tıklanınca
 *  tam ekran görüntüleyici açılır. Kartlarda dosya adı GÖSTERİLMEZ — yalnız
 *  kategori rozeti ve yüklenme tarihi (temiz, modern kart). */

export type GalleryAsset = {
  id: string;
  url: string;
  /** yalnız alt metni için (dosya adı ekranda gösterilmez) */
  title: string;
  kind: string;
  category: string | null;
  /** sunucuda biçimlenmiş "10 Tem 2026" */
  date: string;
};

export function MediaGallery({ items }: { items: GalleryAsset[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Görüntüleyicide de dosya adı yerine kategori · tarih gösterilir
  const viewerItems = items.map((a) => ({ id: a.id, url: a.url, kind: a.kind, title: [a.category, a.date].filter(Boolean).join(" · ") }));
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
        {items.map((a, i) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="link-card by-gallery-card"
            aria-label={`${a.kind === "video" ? "Videoyu oynat" : "Fotoğrafı büyüt"}${a.category ? ` — ${a.category}` : ""}`}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 0,
              textAlign: "left",
              cursor: "pointer",
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span style={{ position: "relative", display: "block", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--navy-50)" }}>
              {a.kind === "video" ? (
                <>
                  <video src={a.url} preload="metadata" muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(8, 15, 33, 0.25)" }}>
                    <span style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255, 255, 255, 0.92)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-md)" }}>
                      <Icon name="play" size={20} style={{ color: "var(--navy-800)", fill: "var(--navy-800)", marginLeft: 2 }} />
                    </span>
                  </span>
                </>
              ) : (
                <Image src={a.url} alt={a.title || "Medya"} fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 50vw, 280px" />
              )}
            </span>
            {/* Alt bilgi: kategori rozeti + tarih (dosya adı yok) */}
            <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 13px", minWidth: 0 }}>
              {a.category ? (
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11, fontWeight: 700, color: "var(--gold-700)", background: "rgba(201, 162, 39, 0.12)", border: "1px solid rgba(201, 162, 39, 0.3)", borderRadius: "var(--radius-sm)", padding: "4px 10px" }}>
                  {a.category}
                </span>
              ) : (
                <span />
              )}
              <span style={{ flex: "none", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{a.date}</span>
            </span>
          </button>
        ))}
      </div>
      {activeIndex != null && <MediaViewer items={viewerItems} index={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />}
    </>
  );
}
