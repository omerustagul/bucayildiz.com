"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";

/** Tam ekran ay takvimi — geçmişe/geleceğe sınırsız gezinme.
 *  Veriye agnostiktir: olaylar tarih ("YYYY-MM-DD") → FSEvent[] haritası olarak
 *  gelir; olay tıklaması çağırana devredilir (mevcut popover/sheet yeniden kullanılır).
 *  Masaüstü: büyük ızgara + hücre içi çipler. Mobil: kompakt ızgara (noktalar) +
 *  seçili günün ajandası. */
export type FSEvent = {
  key: string;
  time: string;
  label: string;
  sub?: string; // saha / rakip gibi ikincil metin
  color: string; // sol şerit + nokta rengi
  soft: string; // çip zemini
  onClick: (el: HTMLElement) => void;
};

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseYmd = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const startOfWeek = (d: Date) => { const x = new Date(d); const wd = (x.getDay() + 6) % 7; x.setDate(x.getDate() - wd); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmtLong = (s: string) => { const d = parseYmd(s); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${DOW[(d.getDay() + 6) % 7]}`; };

type FSProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  eventsByDate: Record<string, FSEvent[]>;
  todayYmd: string;
  legend?: React.ReactNode;
};

/** Kapalıyken hiç mount edilmez → her açılış bugünkü ayda, taze state ile başlar. */
export function FullScreenCalendar(props: FSProps) {
  if (!props.open || typeof document === "undefined") return null;
  return <FullScreenCalendarBody {...props} />;
}

function FullScreenCalendarBody({ onClose, title, eventsByDate, todayYmd, legend }: FSProps) {
  const today = parseYmd(todayYmd);
  const [month, setMonth] = useState<Date>(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<string>(todayYmd);
  const [isMobile, setIsMobile] = useState(false);

  useOverlayDismiss(true, onClose);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const go = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));
  const goToday = () => { setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(todayYmd); };
  const cells = Array.from({ length: 42 }, (_, i) => addDays(startOfWeek(month), i));
  const evs = (d: Date) => eventsByDate[ymd(d)] ?? [];
  const selEvents = eventsByDate[selected] ?? [];

  return createPortal(
    <div className="by-anim-fade" role="dialog" aria-modal="true" aria-label={title} style={{ position: "fixed", inset: 0, zIndex: 60, background: "var(--surface-subtle)", display: "flex", flexDirection: "column" }}>
      {/* Üst bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px clamp(14px, 3vw, 26px)", borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-card)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ width: 18, height: 2, background: "var(--gold-500)", flex: "none" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--text-strong)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h2>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <IconButton label="Önceki ay" variant="outline" size="sm" onClick={() => go(-1)}><Icon name="chevron-down" size={16} style={{ transform: "rotate(90deg)" }} /></IconButton>
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: 0, minWidth: 150, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {MONTHS[month.getMonth()]} {month.getFullYear()}
          </h3>
          <IconButton label="Sonraki ay" variant="outline" size="sm" onClick={() => go(1)}><Icon name="chevron-down" size={16} style={{ transform: "rotate(-90deg)" }} /></IconButton>
          <Button variant="secondary" size="sm" onClick={goToday}>Bugün</Button>
          <IconButton label="Kapat" variant="outline" size="sm" onClick={onClose}><Icon name="x" size={16} /></IconButton>
        </div>
      </div>

      {/* Gövde */}
      <div style={{ flex: 1, overflowY: "auto", padding: "clamp(10px, 2vw, 22px)", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isMobile ? 4 : 8 }}>
          {DOW.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-400)", padding: "2px 0" }}>{d}</div>
          ))}
        </div>

        {isMobile ? (
          <>
            {/* Mobil: kompakt ızgara (noktalar) + seçili günün ajandası */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {cells.map((day, i) => {
                const inMonth = day.getMonth() === month.getMonth();
                const key = ymd(day);
                const isToday = sameDay(day, today);
                const isSel = key === selected;
                const dayEvs = evs(day);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(key)}
                    style={{ font: "inherit", cursor: "pointer", border: `1.5px solid ${isSel ? "var(--navy-600)" : "var(--border-subtle)"}`, background: isToday ? "var(--navy-50)" : "var(--surface-card)", borderRadius: "var(--radius-sm)", padding: "6px 2px 5px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: inMonth ? 1 : 0.4, minHeight: 46 }}
                  >
                    <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 13, color: isToday ? "var(--navy-700)" : "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{day.getDate()}</span>
                    <span style={{ display: "flex", gap: 3, minHeight: 6 }}>
                      {dayEvs.slice(0, 3).map((e) => <span key={e.key} style={{ width: 6, height: 6, borderRadius: "50%", background: e.color }} />)}
                    </span>
                  </button>
                );
              })}
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-500)", margin: "6px 0 8px" }}>{fmtLong(selected)}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selEvents.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Bu günde kayıt yok.</span>}
                {selEvents.map((e) => (
                  <button
                    key={e.key}
                    type="button"
                    onClick={(ev) => e.onClick(ev.currentTarget)}
                    style={{ font: "inherit", textAlign: "left", cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", borderRadius: "var(--radius-md)", background: e.soft, borderLeft: `3px solid ${e.color}`, boxShadow: "var(--shadow-xs)" }}
                  >
                    <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 13.5, color: "var(--ink-700)", fontVariantNumeric: "tabular-nums", flex: "none" }}>{e.time || "—"}</span>
                    <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-800)" }}>{e.label}</span>
                      {e.sub && <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: "var(--ink-400)" }}>{e.sub}</span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Masaüstü: büyük ızgara, hücre içi çipler */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "minmax(112px, 1fr)", gap: 8, flex: 1 }}>
            {cells.map((day, i) => {
              const inMonth = day.getMonth() === month.getMonth();
              const isToday = sameDay(day, today);
              const dayEvs = evs(day);
              return (
                <div key={i} style={{ background: isToday ? "var(--navy-50)" : "var(--surface-card)", border: `1px solid ${isToday ? "var(--navy-300)" : "var(--border-subtle)"}`, borderRadius: "var(--radius-md)", padding: 7, opacity: inMonth ? 1 : 0.45, display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
                  <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 13.5, color: isToday ? "var(--navy-700)" : "var(--text-strong)", fontVariantNumeric: "tabular-nums", alignSelf: "flex-start", background: isToday ? "var(--gold-300)" : "transparent", borderRadius: 3, padding: isToday ? "0 5px" : 0 }}>{day.getDate()}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, overflow: "hidden" }}>
                    {dayEvs.slice(0, 3).map((e) => (
                      <button
                        key={e.key}
                        type="button"
                        onClick={(ev) => e.onClick(ev.currentTarget)}
                        style={{ font: "inherit", textAlign: "left", cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: 6, padding: "3px 7px", borderRadius: "var(--radius-sm)", background: e.soft, borderLeft: `3px solid ${e.color}`, minWidth: 0 }}
                      >
                        <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 11, color: "var(--ink-600)", fontVariantNumeric: "tabular-nums", flex: "none" }}>{e.time || "—"}</span>
                        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11.5, fontWeight: 600, color: "var(--ink-800)" }}>{e.label}</span>
                      </button>
                    ))}
                    {dayEvs.length > 3 && <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--ink-400)", paddingLeft: 7 }}>+{dayEvs.length - 3} daha</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {legend && <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>{legend}</div>}
      </div>
    </div>,
    document.body,
  );
}
