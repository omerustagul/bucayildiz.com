"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Panel, Field } from "@/components/admin/kit";
import { TextInput, TextArea } from "@/components/admin/controls";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import { createTraining } from "@/app/admin/(panel)/takvim-programi/actions";
import type { SAthlete, SFixture, STeam } from "@/components/admin/views/ScheduleView";

const PITCHES = ["Saha 1", "Saha 2", "Kapalı Salon", "Kondisyon Salonu"];

type ProgramKind = "team" | "individual" | "mac";

const KINDS: { id: ProgramKind; label: string; color: string }[] = [
  { id: "team", label: "Takım Antrenmanı", color: "var(--navy-600)" },
  { id: "individual", label: "Bireysel Antrenman", color: "var(--gold-600)" },
  { id: "mac", label: "Maç", color: "var(--red-600)" },
];

export function ScheduleAssignCard({ teams, athletes, fixtures }: { teams: STeam[]; athletes: SAthlete[]; fixtures: SFixture[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<ProgramKind>("team");
  const [team, setTeam] = useState(teams[0]?.id ?? "");
  const [selAthletes, setSelAthletes] = useState<Set<string>>(new Set());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState("90");
  const [pitch, setPitch] = useState("Saha 1");
  const [notes, setNotes] = useState("");
  const [drills, setDrills] = useState<string[]>([""]);
  const [notify, setNotify] = useState(true);
  const [selFx, setSelFx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const teamAthletes = useMemo(() => athletes.filter((a) => a.teamId === team), [athletes, team]);
  const fx = fixtures.find((f) => f.id === selFx) ?? null;

  const toggleAthlete = (id: string) =>
    setSelAthletes((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const setDrill = (i: number, v: string) => setDrills((ds) => ds.map((d, j) => (j === i ? v : d)));
  const removeDrill = (i: number) => setDrills((ds) => ds.filter((_, j) => j !== i));

  const assign = () => {
    setError(null);
    if (!date) {
      setError("Tarih seçiniz.");
      return;
    }
    startTransition(async () => {
      const res = await createTraining({
        teamId: team,
        scope: kind === "individual" ? "individual" : "team",
        date,
        time,
        duration: duration ? Number(duration) : null,
        pitch,
        notes,
        drills: drills.map((d) => d.trim()).filter(Boolean),
        athleteIds: kind === "individual" ? [...selAthletes] : [],
      });
      if (res?.error) setError(res.error);
      else {
        setNotes("");
        setDate("");
        setDrills([""]);
        setSelAthletes(new Set());
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
              <Field label="Sporcular" required hint={`${selAthletes.size} sporcu seçili`}>
                {teamAthletes.length > 0 && (
                  <div style={{ display: "flex", gap: 14, marginBottom: 2 }}>
                    <button
                      type="button"
                      onClick={() => setSelAthletes(new Set(teamAthletes.map((a) => a.id)))}
                      style={{ font: "inherit", cursor: "pointer", border: "none", background: "none", padding: 0, fontSize: 12.5, fontWeight: 600, color: "var(--navy-700)" }}
                    >
                      Tümünü Seç
                    </button>
                    <button
                      type="button"
                      disabled={selAthletes.size === 0}
                      onClick={() => setSelAthletes(new Set())}
                      style={{ font: "inherit", cursor: selAthletes.size ? "pointer" : "default", border: "none", background: "none", padding: 0, fontSize: 12.5, fontWeight: 600, color: selAthletes.size ? "var(--ink-500)" : "var(--ink-300)" }}
                    >
                      Seçimi Temizle
                    </button>
                  </div>
                )}
                <div style={{ maxHeight: 190, overflowY: "auto", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                  {teamAthletes.length === 0 && <span style={{ padding: 8, fontSize: 13, color: "var(--ink-400)" }}>Bu takımda sporcu bulunmuyor.</span>}
                  {teamAthletes.map((a) => (
                    <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, padding: "7px 9px", borderRadius: "var(--radius-sm)", cursor: "pointer", background: selAthletes.has(a.id) ? "var(--navy-50)" : "transparent", color: "var(--ink-700)" }}>
                      <input type="checkbox" checked={selAthletes.has(a.id)} onChange={() => toggleAthlete(a.id)} />
                      {a.name}
                    </label>
                  ))}
                </div>
              </Field>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Tarih" required><TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
              <Field label="Saat"><TextInput type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Süre" hint="dakika"><TextInput type="number" value={duration} onChange={(e) => setDuration(e.target.value)} /></Field>
              <Select label="Saha" options={PITCHES} value={pitch} onChange={(e) => setPitch(e.target.value)} />
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
              <Switch checked={notify} onChange={setNotify} />
            </div>
            {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
            <Button variant="accent" fullWidth leftIcon={<Icon name="calendar-check" size={16} />} onClick={assign} disabled={pending}>
              {pending ? "Ekleniyor…" : "Programa Ekle"}
            </Button>
          </>
        )}
      </div>
    </Panel>
  );
}

function MacPanel({ fixtures, selFx, onSelect, fx }: { fixtures: SFixture[]; selFx: string | null; onSelect: (id: string) => void; fx: SFixture | null }) {
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
