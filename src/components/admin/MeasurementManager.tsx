"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TextInput, Modal } from "@/components/admin/controls";
import { Field } from "@/components/admin/kit";
import { AthletePickerModal } from "@/components/admin/AthletePickerModal";
import { CardList, DataCard, CardHeader, CardFields, CardActions } from "@/components/admin/MobileCardList";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Icon, type IconName } from "@/lib/icons";
import { computeVo2, YOYO_LEVELS, TESTS, TEST_BY_KEY, type TestKey } from "@/lib/perf";
import { addMeasurement, deleteMeasurement } from "@/app/admin/(panel)/performans/actions";

type TeamOpt = { id: string; name: string };
type AthleteOpt = { id: string; name: string; teamId: string; teamName: string };
export type MeasurementRow = {
  id: string; measuredAt: string;
  yoyoLevel: string | null; yoyoDistance: number | null; repeatedSprint: number | null;
  bodyFat: number | null; muscle: number | null;
  sprint10: number | null; sprint20: number | null; sprint30: number | null;
  verticalJump: number | null; standingLongJump: number | null;
  tTest: number | null; agility505: number | null;
  note: string | null;
};

// Form bölümleri (kategori başlıkları); alan etiketleri/birimleri lib/perf'ten gelir.
const FORM_GROUPS: { title: string; icon: IconName; keys: TestKey[] }[] = [
  { title: "Dayanıklılık", icon: "heart-pulse", keys: ["yoyoDistance", "repeatedSprint"] },
  { title: "Vücut Kompozisyonu", icon: "heart-pulse", keys: ["bodyFat", "muscle"] },
  { title: "Sürat", icon: "gauge", keys: ["sprint10", "sprint20", "sprint30"] },
  { title: "Kuvvet", icon: "dumbbell", keys: ["verticalJump", "standingLongJump"] },
  { title: "Çeviklik", icon: "traffic-cone", keys: ["tTest", "agility505"] },
];
// Geçmiş tablosu değer sütunları (VO2 ayrı, başta).
const HISTORY_KEYS: TestKey[] = TESTS.map((t) => t.key);

const ORANGE = "#E08A2E";
const selStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: 14, padding: "10px 12px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--text-body)", minWidth: 240,
};
const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13.5, color: "var(--text-body)", borderTop: "1px solid var(--border-subtle)", whiteSpace: "nowrap" };
const pgBtn = (disabled: boolean): React.CSSProperties => ({
  display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)", background: "var(--surface-card)",
  color: disabled ? "var(--ink-300)" : "var(--navy-700)", cursor: disabled ? "not-allowed" : "pointer",
});

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const numOrNull = (s: string | undefined) => (s == null || s.trim() === "" ? null : Number(s));

/* ---------------------------------------------------------------- Sporcu seçici */

export function AthletePickerTrigger({ teams, athletes, selectedId }: { teams: TeamOpt[]; athletes: AthleteOpt[]; selectedId: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const selected = athletes.find((a) => a.id === selectedId) ?? null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>Sporcu:</label>
      <Button variant="secondary" size="sm" leftIcon={<Icon name="users" size={15} />} onClick={() => setOpen(true)}>
        {selected ? `${selected.name} (${selected.teamName})` : "Sporcu Seç"}
      </Button>
      {open && (
        <AthletePickerModal
          open={open}
          onClose={() => setOpen(false)}
          teams={teams}
          athletes={athletes}
          mode="single"
          selectedIds={selectedId ? [selectedId] : []}
          onSelect={(id) => router.push(`/admin/performans?athlete=${id}`)}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------- "Yeni Ölçüm Gir" butonu + popup */

export function NewMeasurementButton({ athleteId }: { athleteId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>
        Yeni Ölçüm Gir
      </Button>
      {open && <NewMeasurementModal athleteId={athleteId} onClose={() => setOpen(false)} />}
    </>
  );
}

function GroupHead({ icon, title }: { icon: IconName; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
      <span style={{ width: 24, height: 24, borderRadius: "var(--radius-sm)", background: "var(--navy-50)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}><Icon name={icon} size={14} /></span>
      <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12.5, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--gold-700)" }}>{title}</span>
    </div>
  );
}

function NewMeasurementModal({ athleteId, onClose }: { athleteId: string; onClose: () => void }) {
  const router = useRouter();
  const [v, setV] = useState<Record<string, string>>({ measuredAt: todayYmd(), yoyoLevel: "IR1", note: "" });
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const set = (k: string, val: string) => { setV((s) => ({ ...s, [k]: val })); setErr(null); };

  const vo2Preview = computeVo2(v.yoyoLevel, numOrNull(v.yoyoDistance));

  const save = () => {
    if (pending) return;
    setErr(null);
    const payload: Record<string, unknown> = {
      athleteId, measuredAt: v.measuredAt, note: v.note || "",
      yoyoLevel: v.yoyoLevel || null,
    };
    for (const t of TESTS) payload[t.key] = numOrNull(v[t.key]);
    start(async () => {
      const res = await addMeasurement(payload);
      if (res.ok) { onClose(); router.refresh(); }
      else setErr(res.error);
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Yeni Ölçüm Gir"
      width={720}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>İptal</Button>
          <Button variant="accent" size="sm" onClick={save} disabled={pending}>{pending ? "Kaydediliyor…" : "Ölçümü Kaydet"}</Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ maxWidth: 220 }}>
          <Field label="Ölçüm Tarihi" required><TextInput type="date" value={v.measuredAt} onChange={(e) => set("measuredAt", e.target.value)} /></Field>
        </div>

        {FORM_GROUPS.map((g) => (
          <div key={g.title} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <GroupHead icon={g.icon} title={g.title} />

            {g.title === "Dayanıklılık" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, alignItems: "end" }}>
                <Field label="Yo-Yo Seviyesi" hint="VO2max bundan hesaplanır">
                  <Select
                    value={v.yoyoLevel}
                    onChange={(e) => set("yoyoLevel", e.target.value)}
                    options={YOYO_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
                    style={{ ...selStyle, minWidth: 0, width: "100%" }}
                  />
                </Field>
                <Field label={TEST_BY_KEY.yoyoDistance.label} hint={TEST_BY_KEY.yoyoDistance.unit}>
                  <TextInput type="number" inputMode="decimal" value={v.yoyoDistance ?? ""} onChange={(e) => set("yoyoDistance", e.target.value)} />
                </Field>
                <Field label={TEST_BY_KEY.repeatedSprint.label} hint={TEST_BY_KEY.repeatedSprint.unit}>
                  <TextInput type="number" inputMode="decimal" value={v.repeatedSprint ?? ""} onChange={(e) => set("repeatedSprint", e.target.value)} />
                </Field>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "flex-end", padding: "6px 12px", borderRadius: "var(--radius-sm)", background: "var(--surface-subtle)", border: "1px dashed var(--border-subtle)" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--ink-500)" }}>Hesaplanan VO2max</span>
                  <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 20, color: vo2Preview != null ? "var(--navy-700)" : "var(--ink-300)" }}>{vo2Preview != null ? `${vo2Preview.toFixed(1)}` : "—"} <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-400)" }}>ml/kg/dk</span></span>
                </div>
              </div>
            )}

            {g.title !== "Dayanıklılık" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                {g.keys.map((k) => {
                  const meta = TEST_BY_KEY[k];
                  return (
                    <Field key={k} label={meta.label} hint={meta.unit}>
                      <TextInput type="number" inputMode="decimal" value={v[k] ?? ""} onChange={(e) => set(k, e.target.value)} />
                    </Field>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        <Field label="Amaç / Not" hint="opsiyonel — ölçümün ne amaçla yapıldığı">
          <TextInput value={v.note ?? ""} onChange={(e) => set("note", e.target.value)} placeholder="örn. sezon başı testi, ara dönem kontrolü…" />
        </Field>
        {err && <div style={{ padding: "9px 12px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{err}</div>}
      </div>
    </Modal>
  );
}

/* ------------------------------------------- Geçmiş tablosu: trend + sayfalama */

/**
 * Bir önceki (kronolojik) ölçüme göre trend sembolü.
 * Renk: yeşil = iyileşme, kırmızı = geriye gidiş, turuncu = değişim yok.
 * Ok yönü: değerin sayısal hareketi (▲ yükseldi / ▼ düştü).
 */
function TrendMark({ value, older, better }: { value: number | null; older: number | null | undefined; better: "up" | "down" }) {
  if (value == null || older == null) return null;
  const delta = value - older;
  if (delta === 0) return <span title="Değişim yok" style={{ fontSize: 11, fontWeight: 800, color: ORANGE, lineHeight: 1 }}>=</span>;
  const wentUp = delta > 0;
  const improved = better === "up" ? wentUp : !wentUp;
  const color = improved ? "var(--green-600)" : "var(--red-600)";
  return <span title={improved ? "İyileşme" : "Geriye gidiş"} style={{ fontSize: 10, fontWeight: 800, color, lineHeight: 1 }}>{wentUp ? "▲" : "▼"}</span>;
}

function MetricCell({ value, older, better }: { value: number | null; older: number | null | undefined; better: "up" | "down" }) {
  return (
    <td style={td}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        {value ?? "—"}
        <TrendMark value={value} older={older} better={better} />
      </span>
    </td>
  );
}

/** Kart görünümü için MetricCell'in `<td>` sarmalayıcısız hâli. */
function MetricValue({ value, older, better }: { value: number | null; older: number | null | undefined; better: "up" | "down" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      {value ?? "—"}
      <TrendMark value={value} older={older} better={better} />
    </span>
  );
}

export function MeasurementHistory({ measurements }: { measurements: MeasurementRow[] }) {
  const router = useRouter();
  const [perPage, setPerPage] = useState<number | "all">(10);
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, start] = useTransition();

  const sortedDesc = useMemo(
    () => [...measurements].sort((a, b) => b.measuredAt.localeCompare(a.measuredAt)),
    [measurements],
  );
  const total = sortedDesc.length;
  const size = perPage === "all" ? Math.max(total, 1) : perPage;
  const pageCount = Math.max(1, Math.ceil(total / size));
  const curPage = Math.min(page, pageCount);
  const startIdx = (curPage - 1) * size;
  const pageRows = perPage === "all" ? sortedDesc : sortedDesc.slice(startIdx, startIdx + size);
  const rangeFrom = total === 0 ? 0 : startIdx + 1;
  const rangeTo = perPage === "all" ? total : Math.min(startIdx + size, total);

  const remove = (id: string) => {
    if (!confirm("Bu ölçüm kaydı silinsin mi?")) return;
    setBusyId(id);
    start(async () => {
      try {
        await deleteMeasurement(id);
        router.refresh();
      } finally {
        setBusyId(null);
      }
    });
  };
  const changePer = (val: string) => { setPerPage(val === "all" ? "all" : Number(val)); setPage(1); };

  const vo2Of = (m?: MeasurementRow | null) => (m ? computeVo2(m.yoyoLevel, m.yoyoDistance) : null);

  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-strong)" }}>Geçmiş Ölçümler ({total})</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          <span style={{ color: "var(--green-600)", fontWeight: 800 }}>▲▼</span> iyileşme · <span style={{ color: "var(--red-600)", fontWeight: 800 }}>▲▼</span> geriye gidiş · <span style={{ color: ORANGE, fontWeight: 800 }}>=</span> değişim yok <span style={{ opacity: 0.7 }}>(önceki ölçüme göre)</span>
        </span>
      </div>
      {total === 0 ? (
        <div style={{ padding: "36px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Bu sporcu için henüz ölçüm yok. Sağ üstteki “Yeni Ölçüm Gir” ile ekleyebilirsiniz.</div>
      ) : (
        <>
          <div className="adm-table-wrap" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1180 }}>
              <thead><tr style={{ background: "var(--surface-subtle)" }}>
                <th style={th}>Tarih</th>
                <th style={th}>VO2</th>
                {HISTORY_KEYS.map((k) => <th key={k} style={th}>{TEST_BY_KEY[k].short}</th>)}
                <th style={th}></th>
              </tr></thead>
              <tbody>
                {pageRows.map((m, i) => {
                  const older = sortedDesc[startIdx + i + 1] ?? null;
                  const vo2 = vo2Of(m);
                  return (
                    <tr key={m.id}>
                      <td style={{ ...td, fontWeight: 600, color: "var(--text-strong)" }}>{m.measuredAt}</td>
                      <td style={td}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          {vo2 != null ? vo2.toFixed(1) : "—"}
                          <TrendMark value={vo2} older={vo2Of(older)} better="up" />
                        </span>
                      </td>
                      {HISTORY_KEYS.map((k) => (
                        <MetricCell key={k} value={m[k]} older={older?.[k]} better={TEST_BY_KEY[k].better} />
                      ))}
                      <td style={{ ...td, textAlign: "right" }}>
                        <button onClick={() => remove(m.id)} disabled={busyId === m.id} aria-label="Sil" title="Sil" style={{ border: "none", background: "transparent", color: "var(--red-600)", cursor: "pointer", padding: 6 }}>
                          <Icon name="trash-2" size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <CardList style={{ padding: 14 }}>
            {pageRows.map((m, i) => {
              const older = sortedDesc[startIdx + i + 1] ?? null;
              const vo2 = vo2Of(m);
              return (
                <DataCard key={m.id}>
                  <CardHeader
                    title={m.measuredAt}
                    subtitle={m.note || undefined}
                    badge={
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "var(--navy-700)" }}>
                        VO2 {vo2 != null ? vo2.toFixed(1) : "—"}
                        <TrendMark value={vo2} older={vo2Of(older)} better="up" />
                      </span>
                    }
                  />
                  <CardFields
                    items={HISTORY_KEYS.map((k) => ({
                      label: `${TEST_BY_KEY[k].label} (${TEST_BY_KEY[k].unit})`,
                      value: <MetricValue value={m[k]} older={older?.[k]} better={TEST_BY_KEY[k].better} />,
                    }))}
                  />
                  <CardActions>
                    <Button variant="ghost" size="sm" style={{ color: "var(--red-600)" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={() => remove(m.id)} disabled={busyId === m.id}>
                      Sil
                    </Button>
                  </CardActions>
                </DataCard>
              );
            })}
          </CardList>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 18px", borderTop: "1px solid var(--border-subtle)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Sayfa başına</span>
              <Select
                value={String(perPage)}
                onChange={(e) => changePer(e.target.value)}
                options={[
                  { value: "10", label: "10" },
                  { value: "25", label: "25" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                  { value: "all", label: "Tümü" },
                ]}
                style={{ fontFamily: "var(--font-body)", fontSize: 13, padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--text-body)", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{rangeFrom}–{rangeTo} / {total}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button onClick={() => setPage(Math.max(1, curPage - 1))} disabled={curPage <= 1} aria-label="Önceki sayfa" style={pgBtn(curPage <= 1)}><Icon name="chevron-left" size={16} /></button>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)", minWidth: 70, textAlign: "center" }}>Sayfa {curPage}/{pageCount}</span>
                <button onClick={() => setPage(Math.min(pageCount, curPage + 1))} disabled={curPage >= pageCount} aria-label="Sonraki sayfa" style={pgBtn(curPage >= pageCount)}><Icon name="chevron-right" size={16} /></button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
