"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Panel, Field } from "@/components/admin/kit";
import { TextInput, TextArea } from "@/components/admin/controls";
import { AthletePickerModal } from "@/components/admin/AthletePickerModal";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import { createTraining, createTrainingSeries } from "@/app/admin/(panel)/takvim-programi/actions";
import { expandWeekdays, WEEKDAYS, MAX_SERIES_TRAININGS } from "@/lib/schedule";
import type { SAthlete, SFixture, SPitch, STeam } from "@/components/admin/views/ScheduleView";

type ProgramKind = "team" | "individual" | "mac";

const KINDS: { id: ProgramKind; label: string; color: string }[] = [
  { id: "team", label: "Takım Antrenmanı", color: "var(--navy-600)" },
  { id: "individual", label: "Bireysel Antrenman", color: "var(--gold-600)" },
  { id: "mac", label: "Maç", color: "var(--red-600)" },
];

export function ScheduleAssignCard({ teams, athletes, pitches, fixtures }: { teams: STeam[]; athletes: SAthlete[]; pitches: SPitch[]; fixtures: SFixture[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<ProgramKind>("team");
  const [team, setTeam] = useState(teams[0]?.id ?? "");
  const [selAthletes, setSelAthletes] = useState<Set<string>>(new Set());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState("90");
  // Saha değeri artık Facility id'sidir (serbest metin değil). Hiç saha yoksa boş.
  const [pitch, setPitch] = useState(pitches[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [drills, setDrills] = useState<string[]>([""]);
  const [notify, setNotify] = useState(true);
  const [selFx, setSelFx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  // Tekrarlı seri (Faz 4.1): tek tarih yerine aralık + hafta günleri.
  const [repeat, setRepeat] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [weekdays, setWeekdays] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<string | null>(null);

  /** Canlı önizleme — kullanıcı kaç antrenman üreteceğini GÖRMEDEN oluşturmasın. */
  const seriesDates = useMemo(
    () => (repeat ? expandWeekdays(date, endDate, [...weekdays]) : []),
    [repeat, date, endDate, weekdays],
  );
  const toggleWeekday = (n: number) =>
    setWeekdays((s) => {
      const next = new Set(s);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const teamAthletes = useMemo(() => athletes.filter((a) => a.teamId === team), [athletes, team]);
  const currentTeam = useMemo(() => teams.filter((t) => t.id === team), [teams, team]);
  const fx = fixtures.find((f) => f.id === selFx) ?? null;

  const selectedAthletes = useMemo(
    () => teamAthletes.filter((a) => selAthletes.has(a.id)),
    [teamAthletes, selAthletes],
  );

  const removeAthlete = (id: string) =>
    setSelAthletes((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  const setDrill = (i: number, v: string) => setDrills((ds) => ds.map((d, j) => (j === i ? v : d)));
  const removeDrill = (i: number) => setDrills((ds) => ds.filter((_, j) => j !== i));

  const assign = () => {
    setError(null);
    setResult(null);
    if (!date) {
      setError(repeat ? "Başlangıç tarihi seçiniz." : "Tarih seçiniz.");
      return;
    }
    const common = {
      teamId: team,
      scope: kind === "individual" ? ("individual" as const) : ("team" as const),
      time,
      duration: duration ? Number(duration) : null,
      pitch,
      notes,
      drills: drills.map((d) => d.trim()).filter(Boolean),
      athleteIds: kind === "individual" ? [...selAthletes] : [],
      notify,
    };
    const reset = () => {
      setNotes("");
      setDate("");
      setDrills([""]);
      setSelAthletes(new Set());
    };

    if (repeat) {
      if (!endDate) return setError("Bitiş tarihi seçiniz.");
      if (weekdays.size === 0) return setError("En az bir gün seçiniz.");
      startTransition(async () => {
        const res = await createTrainingSeries({ ...common, startDate: date, endDate, weekdays: [...weekdays] });
        if (!res.ok) return setError(res.error);
        // Sonucu AÇIKÇA raporla: kaç oluştu, kaç atlandı, sınıra takıldı mı.
        const parts = [`${res.created} antrenman oluşturuldu`];
        if (res.skipped.length) parts.push(`${res.skipped.length} tarih atlandı (o saatte zaten antrenman var)`);
        if (res.capped) parts.push(`en fazla ${MAX_SERIES_TRAININGS} tarih — kalan haftalar için seriyi tekrar kurun`);
        setResult(parts.join(" · "));
        reset();
        setEndDate("");
        setWeekdays(new Set());
        router.refresh();
      });
      return;
    }

    startTransition(async () => {
      const res = await createTraining({ ...common, date });
      if (res?.error) setError(res.error);
      else {
        reset();
        router.refresh();
      }
    });
  };

  return (
    <Panel title="Program Ata">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Program Türü" required>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => { setKind(k.id); setError(null); }}
                style={{ font: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${kind === k.id ? k.color : "var(--ink-200)"}`, background: kind === k.id ? "var(--navy-50)" : "#fff", fontWeight: 600, fontSize: 13, color: "var(--ink-700)" }}
              >
                <span style={{ width: 9, height: 9, borderRadius: 3, background: k.color }} />
                {k.label}
              </button>
            ))}
          </div>
        </Field>

        {kind === "mac" ? (
          <MacPanel fixtures={fixtures} selFx={selFx} onSelect={setSelFx} fx={fx} />
        ) : (
          <>
            <Select label="Takım" required options={teams.map((t) => ({ value: t.id, label: t.name }))} value={team} onChange={(e) => { setTeam(e.target.value); setSelAthletes(new Set()); }} />
            {kind === "individual" && (
              <Field label="Sporcular" required>
                <Button variant="secondary" fullWidth leftIcon={<Icon name="users" size={16} />} onClick={() => setPickerOpen(true)}>
                  Sporcu Seç
                </Button>
                <span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{selAthletes.size} sporcu seçili</span>
                {selAthletes.size > 0 && selAthletes.size <= 6 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedAthletes.map((a) => (
                      <span
                        key={a.id}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, maxWidth: 200, padding: "5px 6px 5px 10px", borderRadius: "var(--radius-pill)", background: "var(--navy-50)", color: "var(--navy-800)", fontSize: 12.5, fontWeight: 600 }}
                      >
                        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAthlete(a.id)}
                          aria-label={`${a.name} seçimini kaldır`}
                          style={{ font: "inherit", cursor: "pointer", border: "none", background: "none", padding: 0, display: "inline-flex", color: "var(--navy-500)" }}
                        >
                          <Icon name="x" size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>
            )}
            {/* Tekrarlı program (Faz 4.1): tek tarih yerine aralık + hafta günleri */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 12px", borderRadius: "var(--radius-md)", background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-strong)" }}>Tekrarlı program</div>
                <div style={{ fontSize: 12, color: "var(--ink-400)", lineHeight: 1.4 }}>Bir tarih aralığında seçtiğiniz günlere otomatik antrenman oluşturur</div>
              </div>
              <Switch ariaLabel="Tekrarlı program" checked={repeat} onChange={(val) => { setRepeat(val); setError(null); setResult(null); }} />
            </div>

            {repeat ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <Field label="Başlangıç" required><TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
                  <Field label="Bitiş" required><TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Field>
                  <Field label="Saat"><TextInput type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
                </div>
                <Field label="Günler" required hint="Haftanın hangi günlerinde tekrarlansın">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {WEEKDAYS.map((w) => {
                      const on = weekdays.has(w.value);
                      return (
                        <button
                          key={w.value}
                          type="button"
                          onClick={() => toggleWeekday(w.value)}
                          aria-pressed={on}
                          aria-label={w.label}
                          style={{ font: "inherit", cursor: "pointer", minWidth: 48, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${on ? "var(--navy-600)" : "var(--ink-200)"}`, background: on ? "var(--navy-600)" : "#fff", color: on ? "#fff" : "var(--ink-700)", fontWeight: 600, fontSize: 13 }}
                        >
                          {w.short}
                        </button>
                      );
                    })}
                  </div>
                  {/* Önizleme — körlemesine toplu oluşturma yapılmasın */}
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: seriesDates.length ? "var(--navy-700)" : "var(--ink-400)" }}>
                    {seriesDates.length > 0
                      ? `${seriesDates.length} antrenman oluşturulacak · ${seriesDates[0].split("-").reverse().join(".")} – ${seriesDates[seriesDates.length - 1].split("-").reverse().join(".")}`
                      : "Tarih aralığı ve en az bir gün seçin"}
                  </span>
                </Field>
              </>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Tarih" required><TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
                <Field label="Saat"><TextInput type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Süre" hint="dakika"><TextInput type="number" value={duration} onChange={(e) => setDuration(e.target.value)} /></Field>
              {pitches.length > 0 ? (
                <Select label="Saha" options={pitches.map((p) => ({ value: p.id, label: p.name }))} value={pitch} onChange={(e) => setPitch(e.target.value)} />
              ) : (
                <Field label="Saha" hint="Tesisler'de en az bir tesisi saha olarak işaretleyin">
                  <Link href="/admin/tesisler" style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, padding: "9px 11px", borderRadius: "var(--radius-sm)", border: "1.5px dashed var(--ink-200)", fontSize: 12.5, fontWeight: 600, color: "var(--navy-700)", textDecoration: "none" }}>
                    <Icon name="plus" size={13} /> Tesisler&apos;e git
                  </Link>
                </Field>
              )}
            </div>
            <Field label="Antrenman İçeriği" hint="Çalışmaları madde madde ekleyin">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {drills.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <TextInput value={d} onChange={(e) => setDrill(i, e.target.value)} placeholder={`Madde ${i + 1} — örn. Pas kalıpları`} />
                    </div>
                    {drills.length > 1 && (
                      <IconButton label="Maddeyi sil" variant="outline" size="sm" onClick={() => removeDrill(i)}>
                        <Icon name="trash-2" size={14} />
                      </IconButton>
                    )}
                  </div>
                ))}
                <Button variant="secondary" size="sm" leftIcon={<Icon name="plus" size={14} />} onClick={() => setDrills((ds) => [...ds, ""])}>
                  Madde Ekle
                </Button>
              </div>
            </Field>
            <Field label="Genel Not"><TextArea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="örn. Krampon ve yağmurluk getirilecek" /></Field>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--ink-600)" }}>Sporculara bildirim gönder</span>
              <Switch ariaLabel="Sporculara bildirim gönder" checked={notify} onChange={setNotify} />
            </div>
            {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
            {/* Seri sonucu: kaç oluştu / kaç atlandı / sınıra takıldı mı */}
            {result && <div style={{ padding: "10px 13px", background: "var(--green-100, #dcfce7)", border: "1px solid var(--green-600, #16a34a)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--green-700, #15803d)", lineHeight: 1.5 }}>{result}</div>}
            <Button variant="accent" fullWidth leftIcon={<Icon name="calendar-check" size={16} />} onClick={assign} disabled={pending}>
              {pending ? "Ekleniyor…" : "Programa Ekle"}
            </Button>
          </>
        )}
      </div>

      <AthletePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        teams={currentTeam}
        athletes={teamAthletes}
        mode="multi"
        selectedIds={[...selAthletes]}
        onApply={(ids) => setSelAthletes(new Set(ids))}
      />
    </Panel>
  );
}

function MacPanel({ fixtures: allFixtures, selFx, onSelect, fx }: { fixtures: SFixture[]; selFx: string | null; onSelect: (id: string) => void; fx: SFixture | null }) {
  const fixtures = allFixtures.filter((f) => f.status === "upcoming"); // bilgi panelinde yalnız yaklaşanlar
  const fmt = (d: string) => {
    const [y, m, day] = d.split("-");
    return day && m && y ? `${day}.${m}.${y}` : d;
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-500)", lineHeight: 1.5 }}>
        Maçlar fikstürden takvime <strong>otomatik</strong> yansır; ayrıca eklemeniz gerekmez. Aşağıdan yaklaşan maçların detayına bakabilirsiniz.
      </p>
      <div style={{ maxHeight: 250, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
        {fixtures.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Yaklaşan maç bulunmuyor.</span>}
        {fixtures.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f.id)}
            style={{ font: "inherit", textAlign: "left", cursor: "pointer", padding: "9px 11px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${selFx === f.id ? "var(--red-600)" : "var(--ink-200)"}`, background: selFx === f.id ? "var(--red-100)" : "#fff", display: "flex", flexDirection: "column", gap: 3 }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gold-700)" }}>{f.competition}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-800)" }}>
              {f.isHome ? `Buca Yıldız – ${f.opponent}` : `${f.opponent} – Buca Yıldız`}
            </span>
            <span style={{ fontSize: 12, color: "var(--ink-400)" }}>{fmt(f.date)}{f.time ? ` · ${f.time}` : ""}</span>
          </button>
        ))}
      </div>
      {fx && (
        <div style={{ padding: "12px 14px", borderRadius: "var(--radius-md)", background: "var(--navy-50)", border: "1px solid var(--navy-300)", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge tone="gold">{fx.isHome ? "Ev Sahibi" : "Deplasman"}</Badge>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--navy-800)" }}>{fx.competition}</span>
          </div>
          {fx.venue && <span style={{ fontSize: 12.5, color: "var(--ink-500)" }}>Saha: {fx.venue}</span>}
          <Link href="/admin/fikstur" style={{ fontSize: 13, fontWeight: 600, color: "var(--navy-700)", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            Fikstür&apos;de Yönet <Icon name="external-link" size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}
