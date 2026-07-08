"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/lib/icons";

/**
 * Buca Yıldız — AgeGroupCard
 * Yaş grubu kartı (A Takım, U-15…U-18). FC Barcelona "Barça Tickets"
 * stili: bordersız görsel kart, alt gradyan scrim, sol altta başlık +
 * sağa çift ok. Hover'da görsel hafif yakınlaşır, oklar sağa kayar.
 */
export function AgeGroupCard({
  label,
  image,
  href = "#",
  style = {},
}: {
  label: string;
  title?: string;
  count?: number;
  image?: string;
  href?: string;
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
        aspectRatio: "3 / 4",
        borderRadius: "var(--radius-lg)",
        textDecoration: "none",
        background: "var(--grad-navy)",
        boxShadow: hover ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transition: "box-shadow var(--dur-base) var(--ease-out)",
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Görsel katmanı — hover'da hafif zoom (background'a transform işlemez, ayrı katman gerekir) */}
      {image ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `center/cover no-repeat url("${image}")`,
            transform: hover ? "scale(1.05)" : "scale(1)",
            transition: "transform .45s var(--ease-out)",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "rgba(255,255,255,0.06)",
            fontSize: 120,
          }}
        >
          ★
        </div>
      )}

      {/* Alt scrim: başlık okunabilirliği */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,12,28,0.05) 45%, rgba(6,12,28,0.88))" }} />

      {/* Sol altta başlık + çift ok */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "var(--space-5)", display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(21px, 1.9vw, 28px)",
            lineHeight: 1,
            letterSpacing: ".01em",
            textTransform: "uppercase",
            color: "#fff",
            minWidth: 0,
          }}
        >
          {label}
        </span>
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            flex: "none",
            color: "#fff",
            transform: hover ? "translateX(5px)" : "none",
            transition: "transform var(--dur-fast) var(--ease-out)",
          }}
        >
          {/* çift ok: iki chevron üst üste bindirilir (») */}
          <Icon name="chevron-right" size={20} />
          <span style={{ marginLeft: -12, display: "inline-flex" }}>
            <Icon name="chevron-right" size={20} />
          </span>
        </span>
      </div>
    </Link>
  );
}
