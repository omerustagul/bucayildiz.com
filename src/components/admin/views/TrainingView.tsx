"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Panel, Field } from "@/components/admin/kit";
import { TextInput, TextArea } from "@/components/admin/controls";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { createTraining } from "@/app/admin/(panel)/antrenmanlar/actions";

export type TeamLite = { id: string; name: string };
export type TrainingLite = { id: string; teamId: string; type: string; date: string; time: string; duration: number | null };

const TYPE_META: { id: string; color: string }[] = [
  { id: "Saha", color: "var(--navy-600)" },
  { id: "Kondisyon", color: "var(--gold-600)" },
  { id: "Taktik", color: "var(--green-600)" },
  { id: "Bireysel", color: "var(--navy-400)" },
  { id: "Maç", color: "var(--red-600)" },
];
const typeColor = (t: string) => TYPE_META.find((x) => x.id === t)?.color ?? "var(--navy-600)";
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const PITCHES = ["Saha 1", "Saha 2", "Kapalı Salon", "Kondisyon Salonu"];

function dowIndex(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return -1;
  return (d.getDay() + 6) % 7; // Pazartesi = 0
}

export function TrainingView({ teams, trainings }: { teams: TeamLite[]; trainings: TrainingLite[] }) {
  const router = useRouter();
  const [team, setTeam] = useState(teams[0]?.id ?? "");
  const [type, setType] = useState("Saha");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState("90");
  const [pitch, setPitch] = useState("Saha 1");
  const [notes, setNotes] = useState("");
  const [notify, setNotify] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const teamName = teams.find((t) => t.id === team)?.name ?? "";
  const weekly: Record<number, TrainingLite[]> = {};
  for (const tr of trainings.filter((t) => t.teamId === team)) {
    const i = dowIndex(tr.date);
    if (i >= 0) (weekly[i] ??= []).push(tr);
  }
  Object.values(weekly).forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));

  const assign = () => {
    setError(null);
    if (!date) {
      setError("Tarih seçiniz.");
      return;
    }
    startTransition(async () => {
      const res = await createTraining({ teamId: team, type, date, time, duration: duration ? Number(duration) : null, pitch, notes });
      if (res?.error) setError(res.error);
      else {
        setNotes("");
        setDate("");
        router.refresh();
      }
    });
  };

  return (
    <>
      <ViewHeader title="Antrenmanlar" subtitle="Takım ve sporculara antrenman planı ata" />
      <div className="hp-grid-2" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 18, alignItems: "start" }}>
        {/* Assign form */}
        <Panel title="Antrenman Ata">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Select label="Takım" required options={teams.map((t) => ({ value: t.id, label: t.name }))} value={team} onChange={(e) => setTeam(e.target.value)} />
            <Field label="Antrenman Türü" required>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TYPE_META.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    style={{ font: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${type === t.id ? t.color : "var(--ink-200)"}`, background: type === t.id ? "var(--navy-50)" : "#fff", fontWeight: 600, fontSize: 13, color: "var(--ink-700)" }}
                  >
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: t.color }} />
                    {t.id}
                  </button>
                ))}
              </div>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Tarih"><TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
              <Field label="Saat"><TextInput type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Süre" hint="dakika"><TextInput type="number" value={duration} onChange={(e) => setDuration(e.target.value)} /></Field>
              <Select label="Saha" options={PITCHES} value={pitch} onChange={(e) => setPitch(e.target.value)} />
            </div>
            <Field label="Not / İçerik"><TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="örn. Pas kalıpları + duran top çalışması" /></Field>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--ink-600)" }}>Sporculara bildirim gönder</span>
              <Switch checked={notify} onChange={setNotify} />
            </div>
            {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
            <Button variant="accent" fullWidth leftIcon={<Icon name="calendar-check" size={16} />} onClick={assign} disabled={pending}>
              {pending ? "Atanıyor…" : "Antrenmanı Ata"}
            </Button>
          </div>
        </Panel>

        {/* Weekly plan */}
        <Panel title={`Haftalık Plan — ${teamName}`} action={<Badge tone="gold">Bu takım</Badge>}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
            {DOW.map((d, i) => (
              <div key={d} style={{ border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden", minHeight: 150, display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "8px 10px", background: "var(--ink-50)", borderBottom: "1px solid var(--border-subtle)", fontSize: 11.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-500)", textAlign: "center" }}>{d}</div>
                <div style={{ padding: 7, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  {!weekly[i]?.length && <div style={{ margin: "auto", fontSize: 11, color: "var(--ink-300)" }}>—</div>}
                  {weekly[i]?.map((s) => (
                    <div key={s.id} style={{ padding: "7px 8px", borderRadius: "var(--radius-sm)", background: "var(--surface-card)", borderLeft: `3px solid ${typeColor(s.type)}`, boxShadow: "var(--shadow-xs)" }}>
                      <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 12, color: "var(--ink-700)" }}>{s.time}</div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-800)", lineHeight: 1.15 }}>{s.type}</div>
                      {s.duration && <div style={{ fontSize: 10.5, color: "var(--ink-400)" }}>{s.duration} dk</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 14 }}>
            {TYPE_META.map((t) => (
              <span key={t.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--ink-700)" }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: t.color }} />
                {t.id}
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
