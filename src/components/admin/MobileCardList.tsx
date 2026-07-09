"use client";

import type { ReactNode } from "react";

/**
 * Buca Yıldız Admin — mobil kart listesi yapı taşları.
 *
 * Masaüstünde tablo aynen kalır; ≤760px'te (globals.css'teki `.adm-table-wrap` /
 * `.adm-cards` medya kuralı) tablo gizlenir, bu bileşenlerle kurulan kart listesi
 * gösterilir. İki gösterim de DOM'a birlikte yazılır (JS `matchMedia` YOK) — CSS
 * toggle ile hydration/flash riski olmaz. Alan seçimi (hangi kolon karta gider)
 * her görünümde ayrı kalır; burada yalnız ortak iskelet var.
 */

/** Kart listesi kapsayıcısı — masaüstünde gizli, ≤760px'te görünür. */
export function CardList({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="adm-cards" style={style}>
      {children}
    </div>
  );
}

/** Boş durum mesajı (kart listesi tarafı). */
export function CardEmpty({ children }: { children: ReactNode }) {
  return <div className="adm-card-empty">{children}</div>;
}

/** Tek bir kart — onClick verilirse tıklanabilir buton olur (satır tıklama davranışını korur). */
export function DataCard({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="adm-card adm-card--clickable">
        {children}
      </button>
    );
  }
  return <div className="adm-card">{children}</div>;
}

/** Kart üst satırı: birincil kimlik (avatar/thumbnail + başlık + alt başlık) + sağda rozet. */
export function CardHeader({ avatar, title, subtitle, badge }: { avatar?: ReactNode; title: ReactNode; subtitle?: ReactNode; badge?: ReactNode }) {
  return (
    <div className="adm-card-head">
      {avatar}
      <div className="adm-card-head-text">
        <div className="adm-card-title">{title}</div>
        {subtitle && <div className="adm-card-subtitle">{subtitle}</div>}
      </div>
      {badge && <div className="adm-card-badge">{badge}</div>}
    </div>
  );
}

/** Kart gövdesi: 2 sütunlu kompakt etiket:değer ızgarası. */
export function CardFields({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <div className="adm-card-grid">
      {items.map((it, i) => (
        <div key={i} className="adm-card-field">
          <span className="adm-card-label">{it.label}</span>
          <span className="adm-card-value">{it.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Kart altı aksiyon satırı (görüntüle/düzenle/sil vb.). */
export function CardActions({ children }: { children: ReactNode }) {
  return <div className="adm-card-actions">{children}</div>;
}
