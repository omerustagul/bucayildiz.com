"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import { statusMeta } from "@/lib/trainingMeta";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";
import { FullScreenCalendar, type FSEvent } from "@/components/ui/FullScreenCalendar";

export type CalDrill = { id: string; text: string; done: boolean };
export type CalTraining = {
  id: string; date: string; time: string; scope: string; duration: number | null;
  status: string; pitch: string; notes: string; drills: CalDrill[];
};
export type CalFixture = {
  id: string; competition: string; opponent: string; isHome: boolean; date: string; time: string;
  venue: string; status: string; ourScore: number | null; oppScore: number | null;
};

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const SCOPES: Record<string, { label: string; color: string; soft: string }> = {
  team: { label: "Takım Antrenmanı", color: "var(--navy-600)", soft: "var(--navy-50)" },
  individual: { label: "Bireysel Antrenman", color: "var(--gold-600)", soft: "var(--gold-100)" },
};
const scopeMeta = (s: string) => SCOPES[s] ?? SCOPES.team;

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const startOfWeek = (d: Date) => { const x = new Date(d); const wd = (x.getDay() + 6) % 7; x.setDate(x.getDate() - wd); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (d: Date, n: number) => { const x = new Date(d); x.setMonth(x.getMonth() + n, 1); return x; };
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmtDate = (d: string) => { const [y, m, day] = d.split("-"); return day && m && y ? `${day}.${m}.${y}` : d; };

/** Takvim olayı: antrenman veya (fikstürden otomatik) maç. */
type CalEvent = { kind: "training"; t: CalTraining } | { kind: "fixture"; f: CalFixture };
const evTime = (e: CalEvent) => (e.kind === "training" ? e.t.time : e.f.time);
const evKey = (e: CalEvent) => (e.kind === "training" ? `t-${e.t.id}` : `f-${e.f.id}`);

function EventChip({ ev, compact, onActivate, onEnter, onLeave }: {
  ev: CalEvent;
  compact?: boolean;
  onActivate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLeave?: () => void;
}) {
  const meta = ev.kind === "training" ? scopeMeta(ev.t.scope) : { label: "Maç", color: "var(--red-600)", soft: "var(--red-100)" };
  const time = evTime(ev);
  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--ink-700)", overflow: "hidden", whiteSpace: "nowrap" }}>
        <span style={{ width: 6, height: 6, borderRadius: 2, background: meta.color, flex: "none" }} />
        <span className="cal-chip-txt" style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-400)" }}>{time}</span>
        <span className="cal-chip-txt" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{meta.label}</span>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onActivate}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ font: "inherit", width: "100%", textAlign: "left", cursor: "pointer", border: "none", display: "flex", flexDirection: "column", gap: 2, padding: "8px 10px", borderRadius: "var(--radius-sm)", background: meta.soft, borderLeft: `3px solid ${meta.color}` }}
    >
      <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 12.5, color: "var(--ink-700)", fontVariantNumeric: "tabular-nums" }}>{time || "—"}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-800)", lineHeight: 1.15 }}>{meta.label}</span>
    </button>
  );
}

/** Popover (masaüstü hover) ve bottom-sheet (mobil) ortak detay içeriği. */
function EventDetailCard({ ev, plain }: { ev: CalEvent; plain?: boolean }) {
  const box: React.CSSProperties = plain
    ? { padding: "4px 20px 0" }
    : { background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: 16 };
  const metaRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12.5, color: "var(--ink-500)", marginBottom: 10 };

  if (ev.kind === "fixture") {
    const f = ev.f;
    return (
      <div style={box}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: "var(--red-600)" }} />
          <strong style={{ fontSize: 14, color: "var(--text-strong)" }}>Maç</strong>
          <span style={{ marginLeft: "auto" }}><Badge tone="gold">{f.isHome ? "Ev Sahibi" : "Deplasman"}</Badge></span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-800)", marginBottom: 6 }}>
          {f.status === "finished"
            ? (f.isHome
                ? `Buca Yıldız ${f.ourScore ?? "-"}–${f.oppScore ?? "-"} ${f.opponent}`
                : `${f.opponent} ${f.oppScore ?? "-"}–${f.ourScore ?? "-"} Buca Yıldız`)
            : (f.isHome ? `Buca Yıldız – ${f.opponent}` : `${f.opponent} – Buca Yıldız`)}
        </div>
        <div style={metaRow}>
          <span>{f.competition}</span>
          <span>{fmtDate(f.date)}{f.time ? ` · ${f.time}` : ""}</span>
          {f.venue && <span>{f.venue}</span>}
          {f.status === "finished" && <span>Tamamlandı</span>}
        </div>
      </div>
    );
  }

  const t = ev.t;
  const st = statusMeta(t.status);
  const sc = scopeMeta(t.scope);
  return (
    <div style={box}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: 3, background: sc.color }} />
        <strong style={{ fontSize: 14, color: "var(--text-strong)" }}>{sc.label}</strong>
        <span style={{ marginLeft: "auto" }}><Badge tone={st.tone}>{st.label}</Badge></span>
      </div>
      <div style={metaRow}>
        <span>{fmtDate(t.date)}{t.time ? ` · ${t.time}` : ""}</span>
        {t.duration != null && <span>{t.duration} dk</span>}
        {t.pitch && <span>{t.pitch}</span>}
      </div>
      {t.drills.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-500)", marginBottom: 6 }}>Antrenman İçeriği</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
            {t.drills.map((d) => (
              <li key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 13, color: d.done ? "var(--ink-400)" : "var(--ink-700)" }}>
                <Icon name={d.done ? "calendar-check" : "chevron-right"} size={13} style={{ marginTop: 2, flex: "none", color: d.done ? "var(--green-600)" : "var(--ink-300)" }} />
                <span style={{ textDecoration: d.done ? "line-through" : "none" }}>{d.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {t.notes && <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}><strong style={{ color: "var(--ink-600)" }}>Not:</strong> {t.notes}</div>}
    </div>
  );
}

export function TrainingCalendar({ trainings, fixtures = [], todayYmd, initialAnchor }: {
  trainings: CalTraining[];
  fixtures?: CalFixture[];
  todayYmd: string;
  initialAnchor: string;
}) {
  const [view, setView] = useState<"week" | "month">("week");
  const [anchor, setAnchor] = useState<Date>(parseYmd(initialAnchor));
  const [isMobile, setIsMobile] = useState(false);
  const [tip, setTip] = useState<{ ev: CalEvent; x: number; y: number; up: boolean } | null>(null);
  const [sheet, setSheet] = useState<CalEvent | null>(null);
  const [fullOpen, setFullOpen] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const today = parseYmd(todayYmd);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => { setIsMobile(mq.matches); if (mq.matches) setTip(null); };
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) { window.clearTimeout(hideTimer.current); hideTimer.current = null; }
  }, []);
  useEffect(() => () => cancelHide(), [cancelHide]);
  const scheduleHide = () => { cancelHide(); hideTimer.current = window.setTimeout(() => setTip(null), 140); };
  const show = (ev: CalEvent, el: HTMLElement) => {
    cancelHide();
    const r = el.getBoundingClientRect();
    const up = window.innerHeight - r.bottom < 340;
    const x = Math.min(Math.max(r.left + r.width / 2, 160), window.innerWidth - 160);
    setTip({ ev, x, y: up ? r.top - 8 : r.bottom + 8, up });
  };
  const closeSheet = useCallback(() => setSheet(null), []);
  useOverlayDismiss(isMobile && sheet != null, closeSheet);

  const byDate: Record<string, CalEvent[]> = {};
  for (const t of trainings) (byDate[t.date] ??= []).push({ kind: "training", t });
  for (const f of fixtures) (byDate[f.date] ??= []).push({ kind: "fixture", f });
  Object.values(byDate).forEach((list) => list.sort((a, b) => evTime(a).localeCompare(evTime(b))));
  const eventsFor = (d: Date) => byDate[ymd(d)] ?? [];

  const go = (dir: number) => { setTip(null); setAnchor((a) => (view === "week" ? addDays(a, dir * 7) : addMonths(a, dir))); };
  const mon = startOfWeek(anchor);
  const title = view === "week" ? `${mon.getDate()} – ${addDays(mon, 6).getDate()} ${MONTHS[addDays(mon, 6).getMonth()]} ${anchor.getFullYear()}` : `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;

  const seg = (id: "week" | "month", label: string) => (
    <button key={id} onClick={() => { setView(id); setTip(null); }} style={{ font: "inherit", cursor: "pointer", padding: "7px 16px", borderRadius: "var(--radius-sm)", border: "none", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, background: view === id ? "var(--navy-700)" : "transparent", color: view === id ? "#fff" : "var(--ink-500)" }}>{label}</button>
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const monthCells = Array.from({ length: 42 }, (_, i) => addDays(startOfWeek(first), i));

  const activate = (ev: CalEvent) => (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) setSheet(ev);
    else show(ev, e.currentTarget);
  };

  // Büyük takvim için tarih → olay haritası.
  const fsEvents: Record<string, FSEvent[]> = {};
  for (const [date, list] of Object.entries(byDate)) {
    fsEvents[date] = list.map((ev) => {
      if (ev.kind === "training") {
        const sc = scopeMeta(ev.t.scope);
        return {
          key: evKey(ev),
          time: ev.t.time,
          label: sc.label,
          sub: [ev.t.pitch, ev.t.duration ? `${ev.t.duration} dk` : ""].filter(Boolean).join(" · ") || undefined,
          color: sc.color,
          soft: sc.soft,
          onClick: (el: HTMLElement) => { if (isMobile) setSheet(ev); else show(ev, el); },
        };
      }
      return {
        key: evKey(ev),
        time: ev.f.time,
        label: "Maç",
        sub: ev.f.isHome ? `Buca Yıldız – ${ev.f.opponent}` : `${ev.f.opponent} – Buca Yıldız`,
        color: "var(--red-600)",
        soft: "var(--red-100)",
        onClick: (el: HTMLElement) => { if (isMobile) setSheet(ev); else show(ev, el); },
      };
    });
  }

  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ width: 18, height: 2, background: "var(--gold-500)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", margin: 0 }}>Program Takvimi</h2>
      </div>
      <div className="cal-container" style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconButton label="Önceki" variant="outline" size="sm" onClick={() => go(-1)}><Icon name="chevron-down" size={16} style={{ transform: "rotate(90deg)" }} /></IconButton>
            <IconButton label="Sonraki" variant="outline" size="sm" onClick={() => go(1)}><Icon name="chevron-down" size={16} style={{ transform: "rotate(-90deg)" }} /></IconButton>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 21, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{title}</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 2, padding: 3, background: "var(--ink-100)", borderRadius: "var(--radius-md)" }}>
              {seg("week", "Hafta")}
              {seg("month", "Ay")}
            </div>
            <IconButton label="Büyük takvim" variant="outline" size="sm" onClick={() => { setTip(null); setFullOpen(true); }}>
              <Icon name="calendar-days" size={16} />
            </IconButton>
          </div>
        </div>

        {view === "week" ? (
          <div className="cal-week-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
            {weekDays.map((day, i) => {
              const isToday = sameDay(day, today);
              const evs = eventsFor(day);
              return (
                <div key={i} className="cal-day" style={{ background: isToday ? "var(--navy-50)" : "var(--surface-card)", border: `1px solid ${isToday ? "var(--navy-300)" : "var(--border-subtle)"}`, borderRadius: "var(--radius-md)", overflow: "hidden", minHeight: 188, display: "flex", flexDirection: "column" }}>
                  <div className="cal-day-head" style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", background: isToday ? "var(--navy-700)" : "transparent" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: isToday ? "#fff" : "var(--ink-400)" }}>{DOW[i]}</span>
                    <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 16, color: isToday ? "var(--gold-400)" : "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{day.getDate()}</span>
                  </div>
                  <div className="cal-day-body" style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                    {evs.length === 0 && <span style={{ margin: "auto", fontSize: 11, color: "var(--ink-300)" }}>—</span>}
                    {evs.map((ev) => (
                      <EventChip
                        key={evKey(ev)}
                        ev={ev}
                        onActivate={activate(ev)}
                        onEnter={isMobile ? undefined : (e) => show(ev, e.currentTarget)}
                        onLeave={isMobile ? undefined : scheduleHide}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
              {DOW.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-400)", padding: "2px 0" }}>{d}</div>)}
            </div>
            <div className="cal-month-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", gap: 6 }}>
              {monthCells.map((day, i) => {
                const inMonth = day.getMonth() === anchor.getMonth();
                const isToday = sameDay(day, today);
                const evs = eventsFor(day);
                return (
                  <button key={i} className="cal-month-cell" onClick={() => { setAnchor(day); setView("week"); }} style={{ textAlign: "left", cursor: "pointer", font: "inherit", background: isToday ? "var(--navy-50)" : "var(--surface-card)", border: `1px solid ${isToday ? "var(--navy-300)" : "var(--border-subtle)"}`, borderRadius: "var(--radius-sm)", padding: "7px 8px", minHeight: 92, opacity: inMonth ? 1 : 0.42, display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 14, color: isToday ? "var(--navy-700)" : "var(--text-strong)", fontVariantNumeric: "tabular-nums", alignSelf: "flex-start", background: isToday ? "var(--gold-300)" : "transparent", borderRadius: 3, padding: isToday ? "0 5px" : 0 }}>{day.getDate()}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, overflow: "hidden" }}>
                      {evs.slice(0, 2).map((ev) => <EventChip key={evKey(ev)} ev={ev} compact onActivate={() => {}} />)}
                      {evs.length > 2 && <span style={{ fontSize: 10.5, color: "var(--ink-400)", fontWeight: 600 }}>+{evs.length - 2} daha</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 14 }}>
          {Object.entries(SCOPES).map(([k, t]) => (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-500)" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: t.color }} />{t.label}
            </span>
          ))}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-500)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--red-600)" }} />Maç
          </span>
        </div>
      </div>

      <FullScreenCalendar
        open={fullOpen}
        onClose={() => setFullOpen(false)}
        title="Program Takvimi"
        eventsByDate={fsEvents}
        todayYmd={todayYmd}
        legend={
          <>
            {Object.entries(SCOPES).map(([k, t]) => (
              <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-500)" }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: t.color }} />{t.label}
              </span>
            ))}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-500)" }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--red-600)" }} />Maç
            </span>
          </>
        }
      />

      {/* Portal: transform'lu üst öğeler position:fixed'ı bozmasın diye body'ye taşınır. */}
      {tip && !isMobile && createPortal(
        <div
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          style={{ position: "fixed", left: tip.x, top: tip.y, transform: `translate(-50%, ${tip.up ? "-100%" : "0"})`, zIndex: 80, width: 300, maxWidth: "calc(100vw - 24px)" }}
        >
          <div className="by-anim-pop">
            <EventDetailCard ev={tip.ev} />
          </div>
        </div>,
        document.body,
      )}

      {sheet && isMobile && createPortal(
        <>
          <div className="by-anim-fade" onClick={closeSheet} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.45)", zIndex: 70 }} />
          <div className="by-anim-sheet" role="dialog" aria-modal="true" aria-label="Program detayı" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 71, maxHeight: "72vh", overflowY: "auto", borderRadius: "16px 16px 0 0", background: "var(--surface-card)", boxShadow: "var(--shadow-lg)", padding: "8px 0 22px" }}>
            <div style={{ width: 44, height: 4, borderRadius: 2, background: "var(--ink-200)", margin: "8px auto 10px" }} />
            <EventDetailCard ev={sheet} plain />
          </div>
        </>,
        document.body,
      )}
    </section>
  );
}
