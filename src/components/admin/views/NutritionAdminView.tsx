"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Panel, Field, StatTile } from "@/components/admin/kit";
import { TextInput, TextArea, Drawer, Modal } from "@/components/admin/controls";
import { AthletePickerModal } from "@/components/admin/AthletePickerModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import {
  createNutritionPlan,
  updatePlanBasics,
  setPlanActive,
  deletePlan,
  addMeal,
  updateMeal,
  removeMeal,
} from "@/app/admin/(panel)/beslenme/actions";

export type NTeam = { id: string; name: string };
export type NAthlete = { id: string; name: string; teamId: string };
export type NMeal = {
  id: string;
  name: string;
  time: string;
  content: string;
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  sort: number;
};
export type NPlan = {
  id: string;
  athleteId: string;
  title: string;
  startDate: string;
  endDate: string | null;
  notes: string;
  active: boolean;
  meals: NMeal[];
};
export type NMealLog = {
  id: string;
  mealId: string;
  athleteId: string;
  date: string;
  photoUrl: string | null;
  note: string;
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

const fmtDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return day && m && y ? `${day}.${m}.${y}` : d;
};

function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function macroSummary(m: { kcal: number | null; protein: number | null; carbs: number | null; fat: number | null }): string {
  const parts: string[] = [];
  if (m.kcal != null) parts.push(`${m.kcal} kcal`);
  if (m.protein != null) parts.push(`P${m.protein}`);
  if (m.carbs != null) parts.push(`K${m.carbs}`);
  if (m.fat != null) parts.push(`Y${m.fat}`);
  return parts.join(" · ");
}

export function NutritionAdminView({
  teams,
  athletes,
  plans,
  mealLogs,
  todayYmd,
}: {
  teams: NTeam[];
  athletes: NAthlete[];
  plans: NPlan[];
  mealLogs: NMealLog[];
  todayYmd: string;
}) {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const athletesWithActivePlan = useMemo(() => {
    const s = new Set<string>();
    for (const p of plans) if (p.active) s.add(p.athleteId);
    return s;
  }, [plans]);

  const athletesWithoutPlan = useMemo(
    () => athletes.filter((a) => !athletesWithActivePlan.has(a.id)),
    [athletes, athletesWithActivePlan],
  );

  const teamNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of teams) m.set(t.id, t.name);
    return m;
  }, [teams]);

  const athleteNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of athletes) m.set(a.id, a.name);
    return m;
  }, [athletes]);

  const todayLoggedAthleteCount = useMemo(() => {
    const s = new Set<string>();
    for (const l of mealLogs) if (l.date === todayYmd) s.add(l.athleteId);
    return s.size;
  }, [mealLogs, todayYmd]);

  const recentLogs = useMemo(
    () =>
      [...mealLogs]
        .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1))
        .slice(0, 10),
    [mealLogs],
  );

  const selectedAthlete = athletes.find((a) => a.id === selectedAthleteId) ?? null;
  const athletePlans = useMemo(
    () => (selectedAthleteId ? plans.filter((p) => p.athleteId === selectedAthleteId) : []),
    [plans, selectedAthleteId],
  );

  return (
    <>
      <ViewHeader
        title="Beslenme"
        subtitle="Sporcu beslenme programları ve öğün günlüğü takibi"
        actions={
          <Button
            variant="accent"
            leftIcon={<Icon name="plus" size={16} />}
            disabled={!selectedAthleteId}
            onClick={() => setDrawerOpen(true)}
          >
            Program Oluştur
          </Button>
        }
      />

      {!selectedAthlete ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
          {/* Hızlı sporcu seçimi — programı olan sporcuya da rapordan tek adımda gidilir */}
          <div>
            <Button
              variant="secondary"
              leftIcon={<Icon name="users" size={16} />}
              onClick={() => setPickerOpen(true)}
            >
              Sporcu Seç
            </Button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <StatTile label="Toplam Sporcu" value={athletes.length} icon="users" accent />
            <StatTile label="Aktif Program" value={plans.filter((p) => p.active).length} icon="clipboard-list" />
            <StatTile label="Programsız Sporcu" value={athletesWithoutPlan.length} icon="heart-pulse" deltaTone={athletesWithoutPlan.length > 0 ? "down" : "neutral"} />
            <StatTile label="Bugün Günlük Giren" value={todayLoggedAthleteCount} icon="calendar-days" deltaTone="neutral" />
          </div>

          <Panel title="Programsız Sporcular">
            {athletesWithoutPlan.length === 0 ? (
              <div style={{ padding: "8px 4px", fontSize: 13.5, color: "var(--ink-400)" }}>
                Tüm sporcuların aktif programı var.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {athletesWithoutPlan.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedAthleteId(a.id)}
                    style={{
                      font: "inherit",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 11px",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      background: "transparent",
                      color: "var(--ink-700)",
                      fontWeight: 500,
                      fontSize: 13.5,
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                    <span style={{ flex: "none", fontSize: 12, color: "var(--ink-400)" }}>{teamNameById.get(a.teamId) ?? ""}</span>
                    <Icon name="chevron-right" size={14} />
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Son Günlük Kayıtları">
            {recentLogs.length === 0 ? (
              <div style={{ padding: "8px 4px", fontSize: 13.5, color: "var(--ink-400)" }}>Henüz günlük kaydı yok.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recentLogs.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setSelectedAthleteId(l.athleteId)}
                    style={{ font: "inherit", textAlign: "left", cursor: "pointer", background: "transparent", display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}
                  >
                    <div style={{ flex: "none", width: 84, fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 13, color: "var(--navy-700)" }}>
                      {fmtDate(l.date)}
                    </div>
                    <div style={{ flex: "none", fontWeight: 600, fontSize: 13.5, color: "var(--ink-800)", maxWidth: 180, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {athleteNameById.get(l.athleteId) ?? "—"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, color: "var(--ink-500)" }}>
                      {l.note || "—"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Panel>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Icon name="arrow-left" size={14} />}
              onClick={() => setSelectedAthleteId(null)}
            >
              Rapora Dön
            </Button>
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>
              {selectedAthlete.name} <span style={{ fontWeight: 500, color: "var(--ink-400)" }}>— {teamNameById.get(selectedAthlete.teamId) ?? ""}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={() => setPickerOpen(true)}>
              Değiştir
            </Button>
          </div>
          {athletePlans.length === 0 ? (
            <div style={{ padding: "44px 16px", textAlign: "center", color: "var(--ink-400)", fontSize: 14, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
              Bu sporcuya ait program yok.
            </div>
          ) : (
            athletePlans.map((p) => (
              <PlanCard key={p.id} plan={p} mealLogs={mealLogs.filter((l) => l.athleteId === p.athleteId)} todayYmd={todayYmd} />
            ))
          )}
        </div>
      )}

      {drawerOpen && selectedAthleteId && (
        <PlanDrawer mode="create" athleteId={selectedAthleteId} onClose={() => setDrawerOpen(false)} />
      )}

      <AthletePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        teams={teams}
        athletes={athletes}
        mode="single"
        onSelect={(id) => setSelectedAthleteId(id)}
      />
    </>
  );
}

function PlanCard({ plan: p, mealLogs, todayYmd }: { plan: NPlan; mealLogs: NMealLog[]; todayYmd: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [day, setDay] = useState(todayYmd);
  const [photoModal, setPhotoModal] = useState<string | null>(null);

  const run = (fn: () => Promise<{ error?: string } | void>) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res?.error) setError(res.error);
      router.refresh();
    });
  };

  const remove = () => {
    if (!window.confirm("Bu programı silmek istediğinize emin misiniz?")) return;
    run(async () => {
      await deletePlan(p.id);
    });
  };

  const minDay = addDaysYmd(todayYmd, -30);
  const canPrev = day > minDay;
  const canNext = day < todayYmd;

  const logsForDay = mealLogs.filter((l) => l.date === day);

  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 17, color: "var(--text-strong)", margin: 0 }}>{p.title}</h3>
            <Badge tone={p.active ? "success" : "neutral"}>{p.active ? "Aktif" : "Pasif"}</Badge>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-400)", marginTop: 4 }}>
            {fmtDate(p.startDate)}{p.endDate ? ` – ${fmtDate(p.endDate)}` : " – açık uçlu"}
          </div>
          {p.notes && <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--ink-600)", lineHeight: 1.5 }}>{p.notes}</p>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="secondary" size="sm" disabled={pending} onClick={() => setEditOpen(true)}>Düzenle</Button>
          <Button variant="secondary" size="sm" disabled={pending} onClick={() => run(async () => { await setPlanActive(p.id, !p.active); })}>
            {p.active ? "Pasife Al" : "Aktif Yap"}
          </Button>
          <IconButton label="Programı sil" variant="outline" size="sm" disabled={pending} onClick={remove}>
            <Icon name="trash-2" size={14} />
          </IconButton>
        </div>
      </div>

      {error && (
        <div style={{ margin: "12px 20px 0", padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>
          {error}
        </div>
      )}

      <div style={{ padding: "16px 20px" }}>
        <MealsTable planId={p.id} meals={p.meals} pending={pending} onRun={run} />
      </div>

      {p.active && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--surface-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)" }}>
              Günlük Takip
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconButton label="Önceki gün" variant="outline" size="sm" disabled={!canPrev} onClick={() => setDay((d) => addDaysYmd(d, -1))}>
                <Icon name="chevron-left" size={14} />
              </IconButton>
              <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 13.5, color: "var(--text-strong)", minWidth: 84, textAlign: "center" }}>
                {fmtDate(day)}
              </span>
              <IconButton label="Sonraki gün" variant="outline" size="sm" disabled={!canNext} onClick={() => setDay((d) => addDaysYmd(d, 1))}>
                <Icon name="chevron-right" size={14} />
              </IconButton>
              {day !== todayYmd && (
                <Button variant="ghost" size="sm" onClick={() => setDay(todayYmd)}>Bugün</Button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {p.meals.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Öğün tanımlanmamış.</span>}
            {p.meals.map((m) => {
              const log = logsForDay.find((l) => l.mealId === m.id);
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)" }}>
                  {log?.photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoModal(log.photoUrl)}
                      style={{ font: "inherit", cursor: "pointer", padding: 0, border: "none", background: "none", flex: "none" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={log.photoUrl} alt={`${m.name} fotoğrafı`} width={56} height={56} style={{ objectFit: "cover", borderRadius: "var(--radius-sm)", display: "block" }} />
                    </button>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-800)" }}>{m.name}</span>
                      {m.time && <span style={{ fontSize: 12, color: "var(--ink-400)" }}>{m.time}</span>}
                    </div>
                    {log ? (
                      <>
                        {log.note && <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-600)", lineHeight: 1.5 }}>{log.note}</p>}
                        <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--ink-500)" }}>
                          Gerçekleşen: {macroSummary(log) || "—"} — Hedef: {macroSummary(m) || "—"}
                        </div>
                      </>
                    ) : (
                      <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--ink-400)" }}>Kayıt yok</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {editOpen && <PlanDrawer mode="edit" plan={p} onClose={() => setEditOpen(false)} />}

      {photoModal && (
        <Modal open onClose={() => setPhotoModal(null)} title="Öğün Fotoğrafı" width={560}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoModal} alt="Öğün fotoğrafı" style={{ width: "100%", height: "auto", borderRadius: "var(--radius-sm)", display: "block" }} />
        </Modal>
      )}
    </div>
  );
}

function MealsTable({
  planId,
  meals,
  pending,
  onRun,
}: {
  planId: string;
  meals: NMeal[];
  pending: boolean;
  onRun: (fn: () => Promise<{ error?: string } | void>) => void;
}) {
  const [addingRow, setAddingRow] = useState<null | { name: string; time: string; content: string; kcal: string; protein: string; carbs: string; fat: string }>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const startAdd = () => setAddingRow({ name: "", time: "", content: "", kcal: "", protein: "", carbs: "", fat: "" });

  const saveAdd = () => {
    if (!addingRow) return;
    const name = addingRow.name.trim();
    if (!name) return;
    onRun(async () =>
      addMeal(planId, {
        name,
        time: addingRow.time,
        content: addingRow.content,
        kcal: addingRow.kcal ? Number(addingRow.kcal) : null,
        protein: addingRow.protein ? Number(addingRow.protein) : null,
        carbs: addingRow.carbs ? Number(addingRow.carbs) : null,
        fat: addingRow.fat ? Number(addingRow.fat) : null,
      }),
    );
    setAddingRow(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)" }}>Öğünler</div>
      {meals.length === 0 && !addingRow && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Öğün tanımlanmamış.</span>}
      {meals.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {meals.map((m) =>
            editingId === m.id ? (
              <MealEditRow key={m.id} meal={m} pending={pending} onCancel={() => setEditingId(null)} onSaved={() => setEditingId(null)} onRun={onRun} />
            ) : (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ minWidth: 90, flex: "none" }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-800)" }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{m.time || "—"}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, color: "var(--ink-600)" }}>
                  {m.content || "—"}
                </div>
                <div style={{ flex: "none", fontSize: 12.5, color: "var(--ink-500)", whiteSpace: "nowrap" }}>{macroSummary(m) || "—"}</div>
                <div style={{ display: "flex", gap: 6, flex: "none" }}>
                  <IconButton label="Öğünü düzenle" variant="ghost" size="sm" disabled={pending} onClick={() => setEditingId(m.id)}>
                    <Icon name="pencil" size={13} />
                  </IconButton>
                  <IconButton
                    label="Öğünü sil"
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() => {
                      if (!window.confirm("Bu öğünü silmek istediğinize emin misiniz?")) return;
                      onRun(async () => {
                        await removeMeal(m.id);
                      });
                    }}
                  >
                    <Icon name="trash-2" size={13} />
                  </IconButton>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {addingRow ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--surface-subtle)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 96px", gap: 8 }}>
            <TextInput placeholder="Öğün adı" value={addingRow.name} onChange={(e) => setAddingRow((r) => (r ? { ...r, name: e.target.value } : r))} />
            <TextInput type="time" value={addingRow.time} onChange={(e) => setAddingRow((r) => (r ? { ...r, time: e.target.value } : r))} />
          </div>
          <TextInput placeholder="İçerik (ne yenecek)" value={addingRow.content} onChange={(e) => setAddingRow((r) => (r ? { ...r, content: e.target.value } : r))} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
            <TextInput type="number" min={0} placeholder="Kcal" value={addingRow.kcal} onChange={(e) => setAddingRow((r) => (r ? { ...r, kcal: e.target.value } : r))} />
            <TextInput type="number" min={0} placeholder="Protein" value={addingRow.protein} onChange={(e) => setAddingRow((r) => (r ? { ...r, protein: e.target.value } : r))} />
            <TextInput type="number" min={0} placeholder="Karbonhidrat" value={addingRow.carbs} onChange={(e) => setAddingRow((r) => (r ? { ...r, carbs: e.target.value } : r))} />
            <TextInput type="number" min={0} placeholder="Yağ" value={addingRow.fat} onChange={(e) => setAddingRow((r) => (r ? { ...r, fat: e.target.value } : r))} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button variant="ghost" size="sm" onClick={() => setAddingRow(null)}>Vazgeç</Button>
            <Button variant="secondary" size="sm" disabled={pending || !addingRow.name.trim()} onClick={saveAdd}>Kaydet</Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" size="sm" leftIcon={<Icon name="plus" size={14} />} disabled={pending} onClick={startAdd}>
          Öğün Ekle
        </Button>
      )}
    </div>
  );
}

function MealEditRow({
  meal: m,
  pending,
  onCancel,
  onSaved,
  onRun,
}: {
  meal: NMeal;
  pending: boolean;
  onCancel: () => void;
  onSaved: () => void;
  onRun: (fn: () => Promise<{ error?: string } | void>) => void;
}) {
  const [row, setRow] = useState({
    name: m.name,
    time: m.time,
    content: m.content,
    kcal: m.kcal != null ? String(m.kcal) : "",
    protein: m.protein != null ? String(m.protein) : "",
    carbs: m.carbs != null ? String(m.carbs) : "",
    fat: m.fat != null ? String(m.fat) : "",
  });

  const save = () => {
    const name = row.name.trim();
    if (!name) return;
    const num = (v: string) => (v ? Number(v) : null);
    onRun(async () =>
      updateMeal(m.id, {
        name,
        time: row.time,
        content: row.content,
        kcal: Number.isFinite(num(row.kcal)) ? num(row.kcal) : null,
        protein: Number.isFinite(num(row.protein)) ? num(row.protein) : null,
        carbs: Number.isFinite(num(row.carbs)) ? num(row.carbs) : null,
        fat: Number.isFinite(num(row.fat)) ? num(row.fat) : null,
      }),
    );
    onSaved();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--navy-700)", background: "var(--navy-50)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 96px", gap: 8 }}>
        <TextInput placeholder="Öğün adı" value={row.name} onChange={(e) => setRow((r) => ({ ...r, name: e.target.value }))} />
        <TextInput type="time" value={row.time} onChange={(e) => setRow((r) => ({ ...r, time: e.target.value }))} />
      </div>
      <TextInput placeholder="İçerik (ne yenecek)" value={row.content} onChange={(e) => setRow((r) => ({ ...r, content: e.target.value }))} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
        <TextInput type="number" min={0} placeholder="Kcal" value={row.kcal} onChange={(e) => setRow((r) => ({ ...r, kcal: e.target.value }))} />
        <TextInput type="number" min={0} placeholder="Protein" value={row.protein} onChange={(e) => setRow((r) => ({ ...r, protein: e.target.value }))} />
        <TextInput type="number" min={0} placeholder="Karbonhidrat" value={row.carbs} onChange={(e) => setRow((r) => ({ ...r, carbs: e.target.value }))} />
        <TextInput type="number" min={0} placeholder="Yağ" value={row.fat} onChange={(e) => setRow((r) => ({ ...r, fat: e.target.value }))} />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="ghost" size="sm" disabled={pending} onClick={onCancel}>Vazgeç</Button>
        <Button variant="secondary" size="sm" disabled={pending || !row.name.trim()} onClick={save}>Kaydet</Button>
      </div>
    </div>
  );
}

type DrawerProps =
  | { mode: "create"; athleteId: string; onClose: () => void }
  | { mode: "edit"; plan: NPlan; onClose: () => void };

function PlanDrawer(props: DrawerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isEdit = props.mode === "edit";
  const initial = isEdit
    ? { title: props.plan.title, startDate: props.plan.startDate, endDate: props.plan.endDate ?? "", notes: props.plan.notes }
    : { title: "", startDate: "", endDate: "", notes: "" };

  const [basics, setBasics] = useState(initial);
  type MealRow = { name: string; time: string; content: string; kcal: string; protein: string; carbs: string; fat: string };
  const emptyMealRow = (): MealRow => ({ name: "", time: "", content: "", kcal: "", protein: "", carbs: "", fat: "" });
  const [mealRows, setMealRows] = useState<MealRow[]>([emptyMealRow()]);

  const run = (fn: () => Promise<{ error?: string } | void>, onSuccess?: () => void) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.refresh();
      onSuccess?.();
    });
  };

  const setMealField = (i: number, field: keyof MealRow, value: string) =>
    setMealRows((rows) => rows.map((r, j) => (j === i ? { ...r, [field]: value } : r)));
  const removeMealRow = (i: number) => setMealRows((rows) => rows.filter((_, j) => j !== i));

  const saveCreate = () => {
    if (props.mode !== "create") return;
    if (!basics.title.trim()) { setError("Başlık zorunlu."); return; }
    if (!basics.startDate) { setError("Geçerli bir tarih seçiniz."); return; }
    const meals = mealRows
      .map((r) => ({
        name: r.name.trim(),
        time: r.time,
        content: r.content,
        kcal: r.kcal ? Number(r.kcal) : null,
        protein: r.protein ? Number(r.protein) : null,
        carbs: r.carbs ? Number(r.carbs) : null,
        fat: r.fat ? Number(r.fat) : null,
      }))
      .filter((m) => m.name.length > 0);
    if (meals.length === 0) { setError("En az bir öğün ekleyin."); return; }
    run(
      () =>
        createNutritionPlan({
          athleteId: props.athleteId,
          title: basics.title,
          startDate: basics.startDate,
          endDate: basics.endDate,
          notes: basics.notes,
          meals,
        }),
      props.onClose,
    );
  };

  const saveEditBasics = () => {
    if (props.mode !== "edit") return;
    if (!basics.title.trim()) { setError("Başlık zorunlu."); return; }
    if (!basics.startDate) { setError("Geçerli bir tarih seçiniz."); return; }
    run(() => updatePlanBasics(props.plan.id, { title: basics.title, startDate: basics.startDate, endDate: basics.endDate, notes: basics.notes }));
  };

  return (
    <Drawer
      open
      onClose={props.onClose}
      title={isEdit ? "Programı Düzenle" : "Program Oluştur"}
      subtitle={isEdit ? props.plan.title : undefined}
      width={620}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={props.onClose}>Kapat</Button>
          <Button variant="primary" size="sm" disabled={pending} onClick={isEdit ? saveEditBasics : saveCreate}>
            {pending ? "Kaydediliyor…" : isEdit ? "Bilgileri Güncelle" : "Programı Oluştur"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", marginBottom: 10 }}>Program Bilgileri</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Başlık" required>
              <TextInput value={basics.title} onChange={(e) => setBasics((b) => ({ ...b, title: e.target.value }))} placeholder="örn. Sezon Öncesi Beslenme Programı" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Başlangıç Tarihi" required>
                <TextInput type="date" value={basics.startDate} onChange={(e) => setBasics((b) => ({ ...b, startDate: e.target.value }))} />
              </Field>
              <Field label="Bitiş Tarihi" hint="Boş = açık uçlu">
                <TextInput type="date" value={basics.endDate} onChange={(e) => setBasics((b) => ({ ...b, endDate: e.target.value }))} />
              </Field>
            </div>
            <Field label="Notlar">
              <TextArea rows={3} value={basics.notes} onChange={(e) => setBasics((b) => ({ ...b, notes: e.target.value }))} />
            </Field>
          </div>
        </div>

        {props.mode === "create" && (
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", marginBottom: 10 }}>Öğünler</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mealRows.map((r, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TextInput placeholder={`Öğün ${i + 1} adı — örn. Kahvaltı`} value={r.name} onChange={(e) => setMealField(i, "name", e.target.value)} />
                    </div>
                    <div style={{ width: 96, flex: "none" }}>
                      <TextInput type="time" value={r.time} onChange={(e) => setMealField(i, "time", e.target.value)} />
                    </div>
                    {mealRows.length > 1 && (
                      <IconButton label="Öğünü sil" variant="outline" size="sm" onClick={() => removeMealRow(i)}>
                        <Icon name="trash-2" size={14} />
                      </IconButton>
                    )}
                  </div>
                  <TextInput placeholder="İçerik (ne yenecek)" value={r.content} onChange={(e) => setMealField(i, "content", e.target.value)} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
                    <TextInput type="number" min={0} placeholder="Kcal" value={r.kcal} onChange={(e) => setMealField(i, "kcal", e.target.value)} />
                    <TextInput type="number" min={0} placeholder="Protein" value={r.protein} onChange={(e) => setMealField(i, "protein", e.target.value)} />
                    <TextInput type="number" min={0} placeholder="Karbonhidrat" value={r.carbs} onChange={(e) => setMealField(i, "carbs", e.target.value)} />
                    <TextInput type="number" min={0} placeholder="Yağ" value={r.fat} onChange={(e) => setMealField(i, "fat", e.target.value)} />
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" leftIcon={<Icon name="plus" size={14} />} onClick={() => setMealRows((rows) => [...rows, emptyMealRow()])}>
                Öğün Ekle
              </Button>
            </div>
          </div>
        )}

        {props.mode === "edit" && (
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-400)", lineHeight: 1.5 }}>
            Öğünler plan kartındaki tablodan düzenlenir/eklenir.
          </p>
        )}

        {error && (
          <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>
            {error}
          </div>
        )}
      </div>
    </Drawer>
  );
}
