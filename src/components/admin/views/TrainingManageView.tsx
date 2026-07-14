"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ViewHeader, Toolbar, Field } from "@/components/admin/kit";
import { TextInput, TextArea, Drawer } from "@/components/admin/controls";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Tabs } from "@/components/ui/Tabs";
import { Icon } from "@/lib/icons";
import { toast } from "@/components/ui/Toast";
import { TRAINING_STATUS_META, statusMeta } from "@/lib/trainingMeta";
import {
  setTrainingStatus, setTrainingPitch, updateTrainingBasics, toggleDrill, addDrill, removeDrill, saveAttendance,
} from "@/app/admin/(panel)/antrenmanlar/actions";
import { deleteTraining } from "@/app/admin/(panel)/takvim-programi/actions";

export type MTeam = { id: string; name: string };
export type MPitch = { id: string; name: string };
export type MAthlete = { id: string; name: string; teamId: string };
export type MDrill = { id: string; text: string; done: boolean };
export type MAttendance = { athleteId: string; status: string; note: string };
export type MTraining = {
  id: string; teamId: string; scope: string; status: string; date: string; time: string;
  duration: number | null; pitch: string; notes: string; drills: MDrill[]; attendance: MAttendance[];
};

const ATT_OPTIONS = [
  { id: "present", label: "Katıldı", color: "var(--green-600)" },
  { id: "absent", label: "Katılmadı", color: "var(--red-600)" },
  { id: "excused", label: "İzinli", color: "var(--gold-600)" },
] as const;

const fmtDate = (d: string) => { const [y, m, day] = d.split("-"); return day && m && y ? `${day}.${m}.${y}` : d; };

export function TrainingManageView({ teams, athletes, pitches, trainings }: { teams: MTeam[]; athletes: MAthlete[]; pitches: MPitch[]; trainings: MTraining[] }) {
  const [teamTab, setTeamTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () => trainings.filter((t) => (teamTab === "all" || t.teamId === teamTab) && (statusFilter === "all" || t.status === statusFilter)),
    [trainings, teamTab, statusFilter],
  );
  const open = trainings.find((t) => t.id === openId) ?? null;
  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? "";

  const tabs = [
    { id: "all", label: "Tümü", count: trainings.length },
    ...teams.map((t) => ({ id: t.id, label: t.name, count: trainings.filter((x) => x.teamId === t.id).length })),
  ];

  return (
    <>
      <ViewHeader
        title="Antrenmanlar"
        subtitle="Takvim programındaki antrenmanları yönet: durum, içerik ve yoklama"
        tabs={<Tabs tabs={tabs} value={teamTab} onChange={setTeamTab} />}
      />
      <Toolbar>
        <span style={{ fontSize: 13, color: "var(--ink-400)" }}>{rows.length} antrenman</span>
        <div style={{ marginLeft: "auto" }}>
          <Select
            options={[{ value: "all", label: "Tüm Durumlar" }, ...Object.entries(TRAINING_STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            containerStyle={{ minWidth: 160 }}
            style={{ padding: "8px 34px 8px 12px", fontSize: 13.5 }}
          />
        </div>
      </Toolbar>

      {rows.length === 0 ? (
        <div style={{ padding: "44px 16px", textAlign: "center", color: "var(--ink-400)", fontSize: 14, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
          Antrenman bulunamadı. Takvim Programı sayfasından antrenman atayabilirsiniz.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((t) => {
            const st = statusMeta(t.status);
            const doneCount = t.drills.filter((d) => d.done).length;
            const presentCount = t.attendance.filter((a) => a.status === "present").length;
            const indiv = t.scope === "individual";
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setOpenId(t.id)}
                style={{ font: "inherit", textAlign: "left", cursor: "pointer", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderLeft: `3px solid ${indiv ? "var(--gold-600)" : "var(--navy-600)"}`, borderRadius: "var(--radius-md)", padding: "13px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 16px", boxShadow: "var(--shadow-xs)" }}
              >
                <div style={{ minWidth: 90 }}>
                  <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 14, color: "var(--text-strong)" }}>{fmtDate(t.date)}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{t.time || "—"}</div>
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink-800)" }}>{indiv ? "Bireysel Antrenman" : "Takım Antrenmanı"}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}>
                    {[teamName(t.teamId), t.pitch, t.duration ? `${t.duration} dk` : ""].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {t.drills.length > 0 && <span style={{ fontSize: 12, color: "var(--ink-500)" }}><Icon name="calendar-check" size={12} style={{ marginRight: 4, verticalAlign: -1 }} />{doneCount}/{t.drills.length} madde</span>}
                  {t.attendance.length > 0 && <span style={{ fontSize: 12, color: "var(--ink-500)" }}>{presentCount}/{t.attendance.length} katılım</span>}
                  <Badge tone={st.tone}>{st.label}</Badge>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {open && <TrainingDrawer key={open.id} training={open} teams={teams} athletes={athletes} pitches={pitches} onClose={() => setOpenId(null)} />}
    </>
  );
}

function TrainingDrawer({ training: t, teams, athletes, pitches, onClose }: { training: MTraining; teams: MTeam[]; athletes: MAthlete[]; pitches: MPitch[]; onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [newDrill, setNewDrill] = useState("");
  // Depolanan pitch bir AD'dır; dropdown id ile çalışır → adı id'ye eşle. Eşleşmezse
  // (eski serbest metin / silinmiş / yeniden adlandırılmış tesis) boş bırakılır + uyarılır.
  const initialPitchId = pitches.find((p) => p.name === t.pitch)?.id ?? "";
  const pitchUnmatched = !!t.pitch && !initialPitchId;
  const [basics, setBasics] = useState({ date: t.date, time: t.time, duration: t.duration?.toString() ?? "", pitch: initialPitchId, notes: t.notes });

  // Yoklama satırları: bireyselde attendance kayıtları (katılımcılar); takımda
  // takım kadrosu + mevcut kayıtlarla birleşim.
  const roster: { athleteId: string; name: string }[] =
    t.scope === "individual"
      ? t.attendance.map((a) => ({ athleteId: a.athleteId, name: athletes.find((x) => x.id === a.athleteId)?.name ?? "—" }))
      : athletes.filter((a) => a.teamId === t.teamId).map((a) => ({ athleteId: a.id, name: a.name }));

  const [att, setAtt] = useState<Record<string, { status: string; note: string }>>(() => {
    const m: Record<string, { status: string; note: string }> = {};
    for (const r of roster) {
      const ex = t.attendance.find((a) => a.athleteId === r.athleteId);
      m[r.athleteId] = { status: ex?.status ?? "unknown", note: ex?.note ?? "" };
    }
    return m;
  });

  const run = (fn: () => Promise<{ error?: string } | void>) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fn();
        if (res?.error) setError(res.error);
        router.refresh();
      } catch {
        toast.error("İşlem başarısız. Lütfen tekrar deneyin.");
      }
    });
  };

  // Saha seçilince ANINDA kaydet (durum butonları gibi) — ayrı "Bilgileri Güncelle"
  // butonunu aramaya gerek kalmaz. Seçim state'i hemen güncellenir, sonra persist edilir.
  const savePitch = (pitchId: string) => {
    setBasics((b) => ({ ...b, pitch: pitchId }));
    setError(null);
    startTransition(async () => {
      const res = await setTrainingPitch(t.id, pitchId);
      if (res?.error) { setError(res.error); return; }
      toast.success("Saha güncellendi.");
      router.refresh();
    });
  };

  const saveAll = () => {
    const rows = roster
      .map((r) => ({ athleteId: r.athleteId, status: att[r.athleteId]?.status ?? "unknown", note: att[r.athleteId]?.note ?? "" }))
      .filter((r) => r.status !== "unknown" || r.note.trim() !== "");
    if (rows.length === 0) { setError("Kaydedilecek yoklama satırı yok."); return; }
    run(() => saveAttendance({ trainingId: t.id, rows }));
  };

  const remove = () => {
    if (!window.confirm("Bu antrenmanı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteTraining(t.id);
      onClose();
      router.refresh();
    });
  };

  const indiv = t.scope === "individual";

  return (
    <Drawer
      open
      onClose={onClose}
      title={indiv ? "Bireysel Antrenman" : "Takım Antrenmanı"}
      subtitle={`${teams.find((x) => x.id === t.teamId)?.name ?? ""} · ${fmtDate(t.date)}${t.time ? ` · ${t.time}` : ""}`}
      width={620}
      footer={
        <>
          <Button variant="ghost" size="sm" style={{ color: "var(--red-600)", marginRight: "auto" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>
            Sil
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>Kapat</Button>
          <Button variant="primary" size="sm" onClick={saveAll} disabled={pending}>
            {pending ? "Kaydediliyor…" : "Yoklamayı Kaydet"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Durum */}
        <Field label="Antrenman Durumu">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(TRAINING_STATUS_META).map(([value, meta]) => (
              <button
                key={value}
                type="button"
                disabled={pending}
                onClick={() => run(() => setTrainingStatus(t.id, value))}
                style={{ font: "inherit", cursor: "pointer", padding: "8px 13px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${t.status === value ? "var(--navy-600)" : "var(--ink-200)"}`, background: t.status === value ? "var(--navy-50)" : "#fff", fontWeight: 600, fontSize: 13, color: "var(--ink-700)" }}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Temel bilgiler */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", marginBottom: 10 }}>Program Bilgileri</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Tarih"><TextInput type="date" value={basics.date} onChange={(e) => setBasics((b) => ({ ...b, date: e.target.value }))} /></Field>
            <Field label="Saat"><TextInput type="time" value={basics.time} onChange={(e) => setBasics((b) => ({ ...b, time: e.target.value }))} /></Field>
            <Field label="Süre" hint="dakika"><TextInput type="number" value={basics.duration} onChange={(e) => setBasics((b) => ({ ...b, duration: e.target.value }))} /></Field>
            {pitches.length > 0 ? (
              <Select
                label="Saha"
                placeholder="Saha seçin"
                hint={pitchUnmatched ? `Kayıtlı "${t.pitch}" listede yok — yeni saha seçince güncellenir` : "Seçince otomatik kaydedilir"}
                options={pitches.map((p) => ({ value: p.id, label: p.name }))}
                value={basics.pitch}
                onChange={(e) => savePitch(e.target.value)}
                disabled={pending}
              />
            ) : (
              <Field label="Saha" hint="Tesisler'de en az bir tesisi saha olarak işaretleyin">
                <Link href="/admin/tesisler" style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, padding: "12px 12px", borderRadius: "var(--radius-sm)", border: "1.5px dashed var(--ink-200)", fontSize: 13, fontWeight: 600, color: "var(--navy-700)", textDecoration: "none" }}>
                  <Icon name="plus" size={13} /> Tesisler&apos;e git
                </Link>
              </Field>
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            <Field label="Genel Not"><TextArea rows={2} value={basics.notes} onChange={(e) => setBasics((b) => ({ ...b, notes: e.target.value }))} /></Field>
          </div>
          <div style={{ marginTop: 10 }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={pending}
              onClick={() => run(() => updateTrainingBasics(t.id, { date: basics.date, time: basics.time, duration: basics.duration ? Number(basics.duration) : null, notes: basics.notes }))}
            >
              Bilgileri Güncelle
            </Button>
          </div>
        </div>

        {/* Maddeler */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", marginBottom: 10 }}>
            Antrenman İçeriği {t.drills.length > 0 && <span style={{ color: "var(--ink-400)" }}>({t.drills.filter((d) => d.done).length}/{t.drills.length})</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {t.drills.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Henüz madde eklenmemiş.</span>}
            {t.drills.map((d) => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: d.done ? "var(--green-100)" : "var(--surface-card)" }}>
                <input type="checkbox" checked={d.done} disabled={pending} onChange={(e) => run(async () => { await toggleDrill(d.id, e.target.checked); })} />
                <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: d.done ? "var(--ink-400)" : "var(--ink-700)", textDecoration: d.done ? "line-through" : "none" }}>{d.text}</span>
                <IconButton label="Maddeyi sil" variant="outline" size="sm" disabled={pending} onClick={() => run(async () => { await removeDrill(d.id); })}><Icon name="trash-2" size={13} /></IconButton>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <TextInput value={newDrill} onChange={(e) => setNewDrill(e.target.value)} placeholder="Yeni madde — örn. Şut çalışması" />
              </div>
              <Button variant="secondary" size="sm" disabled={pending || !newDrill.trim()} onClick={() => run(async () => { const r = await addDrill(t.id, newDrill); if (!r?.error) setNewDrill(""); return r; })}>
                Ekle
              </Button>
            </div>
          </div>
        </div>

        {/* Yoklama */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", marginBottom: 10 }}>
            Yoklama & Sporcu Notları {indiv && <Badge tone="gold" style={{ marginLeft: 6 }}>Katılımcılar</Badge>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {roster.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Sporcu bulunamadı.</span>}
            {roster.map((r) => {
              const row = att[r.athleteId] ?? { status: "unknown", note: "" };
              return (
                <div key={r.athleteId} style={{ display: "flex", flexDirection: "column", gap: 7, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-800)", flex: 1, minWidth: 120 }}>{r.name}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {ATT_OPTIONS.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setAtt((m) => ({ ...m, [r.athleteId]: { ...row, status: row.status === o.id ? "unknown" : o.id } }))}
                          style={{ font: "inherit", cursor: "pointer", padding: "5px 10px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${row.status === o.id ? o.color : "var(--ink-200)"}`, background: row.status === o.id ? "var(--ink-50)" : "#fff", fontWeight: 600, fontSize: 12, color: row.status === o.id ? o.color : "var(--ink-500)" }}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <TextInput value={row.note} onChange={(e) => setAtt((m) => ({ ...m, [r.athleteId]: { ...row, note: e.target.value } }))} placeholder="Sporcuya özel not / direktif (opsiyonel)" />
                </div>
              );
            })}
          </div>
        </div>

        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Drawer>
  );
}
