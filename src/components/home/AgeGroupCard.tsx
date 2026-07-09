"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Buca Yıldız — AgeGroupCard
 * Yaş grubu kartı (A Takım, U-15…U-18). FC Barcelona "Barça Tickets"
 * stili: bordersız 2:3 poster kart, alt gradyan scrim, sol altta başlık +
 * yazı yüksekliğinde kalın çift ok. Hover'da kartın TAMAMI büyür (1.07)
 * ve komşuların üzerine çıkar. `wide` (Ana Takım) kart 2 sütun kaplar;
 * yüksekliği satırdaki 2:3 kartlardan alır, oranları bozmaz.
 */

/** Yazı yüksekliğine ölçeklenen kalın çift ok (em tabanlı — font boyutunu izler). */
function DoubleChevron({ shifted }: { shifted: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        flex: "none",
        marginLeft: 12,
        transform: shifted ? "translateX(6px)" : "none",
        transition: "transform var(--dur-fast) var(--ease-out)",
      }}
    >
      <svg viewBox="0 0 26 24" style={{ width: "0.86em", height: "0.86em", display: "block" }}>
        <path d="M4 3 L13 12 L4 21" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 3 L23 12 L14 21" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function AgeGroupCard({
  label,
  image,
  href = "#",
  wide = false,
  style = {},
}: {
  label: string;
  title?: string;
  count?: number;
  image?: string;
  href?: string;
  /** Ana Takım: kart 2 sütun kaplar, yanal geniş durur. */
  wide?: boolean;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      style={{
        position: "relative",
        display: "block",
        overflow: "hidden",
        textDecoration: "none",
        borderRadius: 10,
        background: "var(--grad-navy)",
        boxShadow: hover ? "0 18px 44px rgba(0,0,0,.35)" : "var(--shadow-sm)",
        // Barça etkileşimi: kartın tamamı büyür, komşuların üzerine çıkar
        transform: hover ? "scale(1.07)" : "scale(1)",
        transition: "transform .5s var(--ease-out), box-shadow .5s var(--ease-out)",
        willChange: "transform",
        zIndex: hover ? 5 : 0,
        ...(wide
          ? { gridColumn: "span 2", height: "100%", minHeight: 300 }
          : { aspectRatio: "2 / 3" }),
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {image ? (
        <div style={{ position: "absolute", inset: 0, background: `center/cover no-repeat url("${image}")` }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "rgba(255,255,255,0.06)", fontSize: 120 }}>★</div>
      )}

      {/* Alt scrim: başlık okunabilirliği (görsellerimiz FCB gibi alttan karartılmış çekilmiyor) */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,12,28,0.05) 45%, rgba(6,12,28,0.88))" }} />

      {/* Sol altta başlık + çift ok — ok son satırın sonunda akar, tek başına alta düşmez */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 16 }}>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: wide ? "clamp(26px, 2.4vw, 34px)" : "clamp(21px, 1.9vw, 28px)",
            lineHeight: 1,
            letterSpacing: ".01em",
            textTransform: "uppercase",
            color: "#fff",
            maxHeight: "3em",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ minWidth: 0 }}>{label}</span>
          <DoubleChevron shifted={hover} />
        </div>
      </div>
    </Link>
  );
}
