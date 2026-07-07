"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Panel } from "@/components/admin/kit";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import type { SFixture, STeam, STraining } from "@/components/admin/views/ScheduleView";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export const TRAINING_STATUS_META: Record<string, { label: string; tone: "navy" | "success" | "live" | "gold" }> = {
  planned: { label: "Planlandı", tone: "navy" },
  completed: { label: "Tamamlandı", tone: "success" },
  cancelled: { label: "İptal Edildi", tone: "live" },
  partial: { label: "Yarım Kaldı", tone: "gold" },
};
export const statusMeta = (s: string) => TRAINING_STATUS_META[s] ?? TRAINING_STATUS_META.planned;

const parseYmd = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const startOfWeek = (d: Date) => { const x = new Date(d); const wd = (x.getDay() + 6) % 7; x.setDate(x.getDate() - wd); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmtDate = (d: string) => { const [y, m, day] = d.split("-"); return day && m && y ? `${day}.${m}.${y}` : d; };

type ActiveItem = { kind: "training"; t: STraining } | { kind: "fixture"; f: SFixture };

/** Overlay için Escape ile kapatma + arka plan scroll kilidi.
    src/components/admin/controls.tsx'teki useOverlayDismiss ile birebir aynı kalıp;
    hook orada modül-içi (export edilmemiş) olduğundan burada tekrarlanır. */
function useOverlayDismiss(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}

export function ScheduleCalendar({ teams, trainings, fixtures, todayYmd }: { teams: STeam[]; trainings: STraining[]; fixtures: SFixture[]; todayYmd: string }) {
  const [teamFilter, setTeamFilter] = useState("all");
  const [anchor, setAnchor] = useState<Date>(() => parseYmd(todayYmd));
  const [isMobile, setIsMobile] = useState(false);
  const [tip, setTip] = useState<{ item: ActiveItem; x: number; y: number; up: boolean } | null>(null);
  const [sheet, setSheet] = useState<ActiveItem | null>(null);
  const hideTimer = useRef<number | null>(null);

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

  const closeSheet = useCallback(() => setSheet(null), []);
  useOverlayDismiss(isMobile && sheet != null, closeSheet);

  const today = parseYmd(todayYmd);
  const mon = startOfWeek(anchor);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  const sun = addDays(mon, 6);
  const title = `${mon.getDate()} – ${sun.getDate()} ${MONTHS[sun.getMonth()]} ${sun.getFullYear()}`;

  const trs = trainings.filter((t) => teamFilter === "all" || t.teamId === teamFilter);
  const fxs = fixtures.filter((f) => teamFilter === "all" || f.teamId === teamFilter);
  const trByDate: Record<string, STraining[]> = {};
  for (const t of trs) (trByDate[t.date] ??= []).push(t);
  const fxByDate: Record<string, SFixture[]> = {};
  for (const f of fxs) (fxByDate[f.date] ??= []).push(f);

  const scheduleHide = () => { cancelHide(); hideTimer.current = window.setTimeout(() => setTip(null), 140); };
  const show = (item: ActiveItem, el: HTMLElement) => {
    cancelHide();
    const r = el.getBoundingClientRect();
    const up = window.innerHeight - r.bottom < 340;
    const x = Math.min(Math.max(r.left + r.width / 2, 160), window.innerWidth - 160);
    setTip({ item, x, y: up ? r.top - 8 : r.bottom + 8, up });
  };
  const activate = (item: ActiveItem) => (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) setSheet(item);
    else show(item, e.currentTarget);
  };

  const chipBase: React.CSSProperties = { font: "inherit", width: "100%", textAlign: "left", cursor: "pointer", border: "none", display: "flex", flexDirection: "column", gap: 2, padding: "7px 9px", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-xs)" };

  return (
    <Panel
      title="Haftalık Program"
      action={
        <select value={teamFilter} onChange={(e) => { setTeamFilter(e.target.value); setTip(null); }} style={{ font: "inherit", fontSize: 13, padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--ink-200)", background: "#fff", color: "var(--ink-700)" }}>
          <option value="all">Tüm Takımlar</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      }
    >
      {/* cal-container: container query — dar alanda hafta ızgarası dikey ajandaya döner (globals.css) */}
      <div className="cal-container">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <IconButton label="Önceki hafta" variant="outline" size="sm" onClick={() => { setAnchor((a) => addDays(a, -7)); setTip(null); }}><Icon name="chevron-down" size={16} style={{ transform: "rotate(90deg)" }} /></IconButton>
        <IconButton label="Sonraki hafta" variant="outline" size="sm" onClick={() => { setAnchor((a) => addDays(a, 7)); setTip(null); }}><Icon name="chevron-down" size={16} style={{ transform: "rotate(-90deg)" }} /></IconButton>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{title}</h3>
      </div>

      <div className="cal-week-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
        {weekDays.map((day, i) => {
          const isToday = sameDay(day, today);
          const key = ymd(day);
          const dayTr = trByDate[key] ?? [];
          const dayFx = fxByDate[key] ?? [];
          return (
            <div key={i} className="cal-day" style={{ background: isToday ? "var(--navy-50)" : "var(--surface-card)", border: `1px solid ${isToday ? "var(--navy-300)" : "var(--border-subtle)"}`, borderRadius: "var(--radius-md)", overflow: "hidden", minHeight: 170, display: "flex", flexDirection: "column" }}>
              <div className="cal-day-head" style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", background: isToday ? "var(--navy-700)" : "transparent" }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: isToday ? "#fff" : "var(--ink-400)" }}>{DOW[i]}</span>
                <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 15, color: isToday ? "var(--gold-400)" : "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{day.getDate()}</span>
              </div>
              <div className="cal-day-body" style={{ padding: 7, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                {dayTr.length === 0 && dayFx.length === 0 && <span style={{ margin: "auto", fontSize: 11, color: "var(--ink-300)" }}>—</span>}
                {dayTr.map((t) => {
                  const indiv = t.scope === "individual";
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={activate({ kind: "training", t })}
                      onMouseEnter={isMobile ? undefined : (e) => show({ kind: "training", t }, e.currentTarget)}
                      onMouseLeave={isMobile ? undefined : scheduleHide}
                      style={{ ...chipBase, background: indiv ? "var(--gold-100)" : "var(--navy-50)", borderLeft: `3px solid ${indiv ? "var(--gold-600)" : "var(--navy-600)"}` }}
                    >
                      <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 12, color: "var(--ink-700)", fontVariantNumeric: "tabular-nums" }}>{t.time || "—"}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-800)", lineHeight: 1.2 }}>{indiv ? "Bireysel Antrenman" : "Takım Antrenmanı"}</span>
                      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10.5, color: "var(--ink-400)" }}>
                        {[t.pitch, t.duration ? `${t.duration} dk` : ""].filter(Boolean).join(" · ") || " "}
                      </span>
                    </button>
                  );
                })}
                {dayFx.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={activate({ kind: "fixture", f })}
                    onMouseEnter={isMobile ? undefined : (e) => show({ kind: "fixture", f }, e.currentTarget)}
                    onMouseLeave={isMobile ? undefined : scheduleHide}
                    style={{ ...chipBase, background: "var(--red-100)", borderLeft: "3px solid var(--red-600)" }}
                  >
                    <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 12, color: "var(--ink-700)", fontVariantNumeric: "tabular-nums" }}>{f.time || "—"}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-800)", lineHeight: 1.2 }}>Maç</span>
                    <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10.5, color: "var(--ink-400)" }}>{f.venue || " "}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 14 }}>
        <LegendDot color="var(--navy-600)" label="Takım Antrenmanı" />
        <LegendDot color="var(--gold-600)" label="Bireysel Antrenman" />
        <LegendDot color="var(--red-600)" label="Maç (fikstürden otomatik)" />
      </div>
      </div>

      {/* Portal: PageTransition'ın transform'u position:fixed'ı kendine bağlar (containing
          block); popover/sheet body'ye taşınarak gerçek viewport koordinatları kullanılır. */}
      {tip && !isMobile && createPortal(
        <div
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          style={{ position: "fixed", left: tip.x, top: tip.y, transform: `translate(-50%, ${tip.up ? "-100%" : "0"})`, zIndex: 80, width: 300, maxWidth: "calc(100vw - 24px)" }}
        >
          <ProgramDetailCard item={tip.item} teams={teams} />
        </div>,
        document.body,
      )}

      {sheet && isMobile && createPortal(
        <>
          <div onClick={closeSheet} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.45)", zIndex: 70 }} />
          <div role="dialog" aria-modal="true" aria-label="Program detayı" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 71, maxHeight: "72vh", overflowY: "auto", borderRadius: "16px 16px 0 0", background: "var(--surface-card)", boxShadow: "var(--shadow-lg)", padding: "8px 0 22px" }}>
            <div style={{ width: 44, height: 4, borderRadius: 2, background: "var(--ink-200)", margin: "8px auto 10px" }} />
            <ProgramDetailCard item={sheet} teams={teams} plain />
          </div>
        </>,
        document.body,
      )}
    </Panel>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--ink-600)" }}>
      <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />
      {label}
    </span>
  );
}

/** Popover (masaüstü hover) ve bottom-sheet (mobil) ortak detay içeriği. */
function ProgramDetailCard({ item, teams, plain }: { item: ActiveItem; teams: STeam[]; plain?: boolean }) {
  const teamName = (id: string | null) => teams.find((t) => t.id === id)?.name ?? "";
  const box: React.CSSProperties = plain
    ? { padding: "4px 20px 0" }
    : { background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: 16 };
  const metaRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12.5, color: "var(--ink-500)", marginBottom: 10 };

  if (item.kind === "fixture") {
    const f = item.f;
    return (
      <div style={box}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: "var(--red-600)" }} />
          <strong style={{ fontSize: 14, color: "var(--text-strong)" }}>Maç</strong>
          <span style={{ marginLeft: "auto" }}><Badge tone="gold">{f.isHome ? "Ev Sahibi" : "Deplasman"}</Badge></span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-800)", marginBottom: 6 }}>
          {f.isHome ? `Buca Yıldız – ${f.opponent}` : `${f.opponent} – Buca Yıldız`}
        </div>
        <div style={metaRow}>
          <span>{f.competition}</span>
          <span>{fmtDate(f.date)}{f.time ? ` · ${f.time}` : ""}</span>
          {f.venue && <span>{f.venue}</span>}
          {f.teamId && <span>{teamName(f.teamId)}</span>}
        </div>
        <Link href="/admin/fikstur" style={{ fontSize: 13, fontWeight: 600, color: "var(--navy-700)", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
          Fikstür&apos;de Yönet <Icon name="external-link" size={13} />
        </Link>
      </div>
    );
  }

  const t = item.t;
  const st = statusMeta(t.status);
  const indiv = t.scope === "individual";
  return (
    <div style={box}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: 3, background: indiv ? "var(--gold-600)" : "var(--navy-600)" }} />
        <strong style={{ fontSize: 14, color: "var(--text-strong)" }}>{indiv ? "Bireysel Antrenman" : "Takım Antrenmanı"}</strong>
        <span style={{ marginLeft: "auto" }}><Badge tone={st.tone}>{st.label}</Badge></span>
      </div>
      <div style={metaRow}>
        <span>{teamName(t.teamId)}</span>
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
      {t.participants.length > 0 && (
        <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginBottom: 6 }}>
          <strong style={{ color: "var(--ink-600)" }}>Katılımcılar:</strong> {t.participants.join(", ")}
        </div>
      )}
      {t.notes && <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}><strong style={{ color: "var(--ink-600)" }}>Not:</strong> {t.notes}</div>}
    </div>
  );
}
