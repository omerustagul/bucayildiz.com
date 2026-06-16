"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, TextInput } from "@/components/admin/controls";
import { Field } from "@/components/admin/kit";
import { Button } from "@/components/ui/Button";
import { savePerformance } from "@/app/admin/(panel)/sporcular/actions";

export type PerfForm = {
  vo2: string;
  vo2History: string;
  percentile: string;
  bodyFat: string;
  muscle: string;
  speed: string;
  endurance: string;
  power: string;
  technique: string;
  tactic: string;
  passing: string;
  sprint30: string;
  verticalJump: string;
  maxHr: string;
  trainingLoad: string;
  measuredAt: string;
};

const EMPTY: PerfForm = {
  vo2: "", vo2History: "", percentile: "", bodyFat: "", muscle: "",
  speed: "", endurance: "", power: "", technique: "", tactic: "", passing: "",
  sprint30: "", verticalJump: "", maxHr: "", trainingLoad: "", measuredAt: "",
};

export function PerformanceModal({ athleteId, athleteName, initial, onClose }: { athleteId: string; athleteName: string; initial: PerfForm | null; onClose: () => void }) {
  const router = useRouter();
  const [v, setV] = useState<PerfForm>(initial ?? EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = (k: keyof PerfForm, val: string) => setV((s) => ({ ...s, [k]: val }));
  const num = (s: string) => (s.trim() === "" ? null : Number(s));

  const save = () => {
    setError(null);
    const hist = v.vo2History.split(",").map((x) => Number(x.trim())).filter((x) => !Number.isNaN(x));
    const payload = {
      vo2: num(v.vo2), vo2History: hist, percentile: num(v.percentile), bodyFat: num(v.bodyFat), muscle: num(v.muscle),
      speed: num(v.speed), endurance: num(v.endurance), power: num(v.power), technique: num(v.technique), tactic: num(v.tactic), passing: num(v.passing),
      sprint30: num(v.sprint30), verticalJump: num(v.verticalJump), maxHr: num(v.maxHr), trainingLoad: num(v.trainingLoad), measuredAt: v.measuredAt,
    };
    startTransition(async () => {
      const res = await savePerformance(athleteId, payload);
      if (res.error) setError(res.error);
      else { onClose(); router.refresh(); }
    });
  };

  const numField = (label: string, key: keyof PerfForm, hint?: string) => (
    <Field label={label} hint={hint}><TextInput type="number" value={v[key]} onChange={(e) => set(key, e.target.value)} /></Field>
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={`Performans — ${athleteName}`}
      width={620}
      footer={<><Button variant="secondary" size="sm" onClick={onClose}>İptal</Button><Button variant="primary" size="sm" onClick={save} disabled={pending}>{pending ? "Kaydediliyor…" : "Kaydet"}</Button></>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold-700)" }}>VO2 & Kompozisyon</div>
        <div className="perf-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {numField("VO2 Max", "vo2", "ml/kg/dk")}
          {numField("Yüzdelik", "percentile", "0-100")}
          <Field label="Ölçüm Tarihi"><TextInput type="date" value={v.measuredAt} onChange={(e) => set("measuredAt", e.target.value)} /></Field>
          {numField("Vücut Yağ", "bodyFat", "%")}
          {numField("Kas Oranı", "muscle", "%")}
          <Field label="VO2 Geçmişi" hint="virgülle: 51,52.8,54"><TextInput value={v.vo2History} onChange={(e) => set("vo2History", e.target.value)} placeholder="51.2, 52.8, 54.1" /></Field>
        </div>

        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold-700)", marginTop: 4 }}>Atletik Profil (0–100)</div>
        <div className="perf-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {numField("Sürat", "speed")}
          {numField("Dayanıklılık", "endurance")}
          {numField("Güç", "power")}
          {numField("Teknik", "technique")}
          {numField("Taktik", "tactic")}
          {numField("Pas", "passing")}
        </div>

        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold-700)", marginTop: 4 }}>KPI</div>
        <div className="perf-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          {numField("Sprint 30m", "sprint30", "sn")}
          {numField("Dikey Sıçrama", "verticalJump", "cm")}
          {numField("Maks. Nabız", "maxHr", "bpm")}
          {numField("Antr. Yükü", "trainingLoad", "AU")}
        </div>

        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Modal>
  );
}
