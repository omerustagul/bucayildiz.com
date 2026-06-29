"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/admin/controls";
import { Field } from "@/components/admin/kit";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { addMeasurement, deleteMeasurement } from "@/app/admin/(panel)/performans/actions";

type AthleteOpt = { id: string; name: string; teamName: string };
export type MeasurementRow = {
  id: string; measuredAt: string; vo2: number | null; percentile: number | null;
  bodyFat: number | null; muscle: number | null; speed: number | null; endurance: number | null;
  power: number | null; technique: number | null; tactic: number | null; passing: number | null;
  sprint30: number | null; verticalJump: number | null; maxHr: number | null; trainingLoad: number | null;
  note: string | null;
};

const FIELDS: { key: keyof MeasurementRow; label: string; hint?: string }[] = [
  { key: "vo2", label: "VO2 Max", hint: "ml/kg/dk" },
  { key: "percentile", label: "Yüzdelik", hint: "0-100" },
  { key: "bodyFat", label: "Vücut Yağ", hint: "%" },
  { key: "muscle", label: "Kas Oranı", hint: "%" },
  { key: "speed", label: "Sürat", hint: "0-100" },
  { key: "endurance", label: "Dayanıklılık", hint: "0-100" },
  { key: "power", label: "Güç", hint: "0-100" },
  { key: "technique", label: "Teknik", hint: "0-100" },
  { key: "tactic", label: "Taktik", hint: "0-100" },
  { key: "passing", label: "Pas", hint: "0-100" },
  { key: "sprint30", label: "Sprint 30m", hint: "sn" },
  { key: "verticalJump", label: "Dikey Sıçrama", hint: "cm" },
  { key: "maxHr", label: "Maks. Nabız", hint: "bpm" },
  { key: "trainingLoad", label: "Antr. Yükü", hint: "AU" },
];

const selStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: 14, padding: "10px 12px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--text-body)", minWidth: 240,
};
const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13.5, color: "var(--text-body)", borderTop: "1px solid var(--border-subtle)", whiteSpace: "nowrap" };

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const EMPTY = (): Record<string, string> => ({ measuredAt: todayYmd(), note: "" });

export function MeasurementManager({ athletes, selectedId, measurements }: { athletes: AthleteOpt[]; selectedId: string | null; measurements: MeasurementRow[] }) {
  const router = useRouter();
  const [v, setV] = useState<Record<string, string>>(EMPTY());
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const set = (k: string, val: string) => { setV((s) => ({ ...s, [k]: val })); setOk(false); setErr(null); };
  const numOrNull = (s: string | undefined) => (s == null || s.trim() === "" ? null : Number(s));

  const save = () => {
    if (pending || !selectedId) return;
    setErr(null);
    const payload: Record<string, unknown> = { athleteId: selectedId, measuredAt: v.measuredAt, note: v.note || "" };
    for (const f of FIELDS) payload[f.key] = numOrNull(v[f.key]);
    start(async () => {
      const res = await addMeasurement(payload);
      if (res.ok) { setV(EMPTY()); setOk(true); router.refresh(); }
      else setErr(res.error);
    });
  };

  const remove = (id: string) => {
    if (!confirm("Bu ölçüm kaydı silinsin mi?")) return;
    setBusyId(id);
    start(async () => { await deleteMeasurement(id); setBusyId(null); router.refresh(); });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>Sporcu:</label>
        <select style={selStyle} value={selectedId ?? ""} onChange={(e) => router.push(`/admin/performans${e.target.value ? `?athlete=${e.target.value}` : ""}`)}>
          <option value="">Seçiniz…</option>
          {athletes.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.teamName})</option>)}
        </select>
      </div>

      {!selectedId ? (
        <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-muted)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
          Ölçümlerini görüntülemek/girmek için bir sporcu seçin.
        </div>
      ) : (
        <>
          {/* Yeni ölçüm */}
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Yeni Ölçüm Gir</h3>
              <div style={{ width: 200 }}><Field label="Ölçüm Tarihi"><TextInput type="date" value={v.measuredAt} onChange={(e) => set("measuredAt", e.target.value)} /></Field></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }} className="perf-fields">
              {FIELDS.map((f) => (
                <Field key={f.key} label={f.label} hint={f.hint}>
                  <TextInput type="number" value={v[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
                </Field>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <Field label="Not" hint="opsiyonel"><TextInput value={v.note ?? ""} onChange={(e) => set("note", e.target.value)} placeholder="örn. sezon başı testi" /></Field>
            </div>
            {err && <div style={{ marginTop: 12, padding: "9px 12px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{err}</div>}
            {ok && <div style={{ marginTop: 12, padding: "9px 12px", background: "var(--green-100)", border: "1px solid var(--green-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--green-600)" }}>Ölçüm eklendi.</div>}
            <div style={{ marginTop: 14 }}><Button variant="primary" onClick={save} disabled={pending}>{pending ? "Kaydediliyor…" : "Ölçümü Kaydet"}</Button></div>
          </div>

          {/* Geçmiş */}
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-strong)" }}>
              Geçmiş Ölçümler ({measurements.length})
            </div>
            {measurements.length === 0 ? (
              <div style={{ padding: "36px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Bu sporcu için henüz ölçüm yok.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
                  <thead><tr style={{ background: "var(--surface-subtle)" }}>
                    <th style={th}>Tarih</th><th style={th}>VO2</th><th style={th}>Yüzdelik</th><th style={th}>Yağ%</th><th style={th}>Kas%</th>
                    <th style={th}>Sprint30</th><th style={th}>Dikey</th><th style={th}>Maks.Nabız</th><th style={th}>Antr.Yük</th><th style={th}></th>
                  </tr></thead>
                  <tbody>
                    {measurements.map((m) => (
                      <tr key={m.id}>
                        <td style={{ ...td, fontWeight: 600, color: "var(--text-strong)" }}>{m.measuredAt}</td>
                        <td style={td}>{m.vo2 ?? "—"}</td>
                        <td style={td}>{m.percentile ?? "—"}</td>
                        <td style={td}>{m.bodyFat ?? "—"}</td>
                        <td style={td}>{m.muscle ?? "—"}</td>
                        <td style={td}>{m.sprint30 ?? "—"}</td>
                        <td style={td}>{m.verticalJump ?? "—"}</td>
                        <td style={td}>{m.maxHr ?? "—"}</td>
                        <td style={td}>{m.trainingLoad ?? "—"}</td>
                        <td style={{ ...td, textAlign: "right" }}>
                          <button onClick={() => remove(m.id)} disabled={busyId === m.id} aria-label="Sil" title="Sil" style={{ border: "none", background: "transparent", color: "var(--red-600)", cursor: "pointer", padding: 6 }}>
                            <Icon name="trash-2" size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
