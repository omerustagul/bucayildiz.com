"use client";

import { useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";

export type CalTraining = { id: string; date: string; time: string; scope: string; duration: number | null };

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

function EventChip({ time, scope, compact }: { time: string; scope: string; compact?: boolean }) {
  const t = scopeMeta(scope);
  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--ink-700)", overflow: "hidden", whiteSpace: "nowrap" }}>
        <span style={{ width: 6, height: 6, borderRadius: 2, background: t.color, flex: "none" }} />
        <span className="cal-chip-txt" style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-400)" }}>{time}</span>
        <span className="cal-chip-txt" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</span>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 10px", borderRadius: "var(--radius-sm)", background: t.soft, borderLeft: `3px solid ${t.color}` }}>
      <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 12.5, color: "var(--ink-700)", fontVariantNumeric: "tabular-nums" }}>{time}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-800)", lineHeight: 1.15 }}>{t.label}</span>
    </div>
  );
}

export function TrainingCalendar({ trainings, todayYmd, initialAnchor }: { trainings: CalTraining[]; todayYmd: string; initialAnchor: string }) {
  const [view, setView] = useState<"week" | "month">("week");
  const [anchor, setAnchor] = useState<Date>(parseYmd(initialAnchor));
  const today = parseYmd(todayYmd);

  const byDate: Record<string, CalTraining[]> = {};
  for (const t of trainings) (byDate[t.date] ??= []).push(t);
  Object.values(byDate).forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));
  const eventsFor = (d: Date) => byDate[ymd(d)] ?? [];

  const go = (dir: number) => setAnchor((a) => (view === "week" ? addDays(a, dir * 7) : addMonths(a, dir)));
  const mon = startOfWeek(anchor);
  const title = view === "week" ? `${mon.getDate()} – ${addDays(mon, 6).getDate()} ${MONTHS[addDays(mon, 6).getMonth()]} ${anchor.getFullYear()}` : `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;

  const seg = (id: "week" | "month", label: string) => (
    <button key={id} onClick={() => setView(id)} style={{ font: "inherit", cursor: "pointer", padding: "7px 16px", borderRadius: "var(--radius-sm)", border: "none", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, background: view === id ? "var(--navy-700)" : "transparent", color: view === id ? "#fff" : "var(--ink-500)" }}>{label}</button>
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const monthCells = Array.from({ length: 42 }, (_, i) => addDays(startOfWeek(first), i));

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
                    {evs.map((ev) => <EventChip key={ev.id} time={ev.time} scope={ev.scope} />)}
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
                      {evs.slice(0, 2).map((ev) => <EventChip key={ev.id} time={ev.time} scope={ev.scope} compact />)}
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
        </div>
      </div>
    </section>
  );
}
