"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";
import { saveMealLog, deleteMealLog } from "@/app/panel/beslenme/actions";

export type PanelMeal = {
  id: string;
  name: string;
  time: string;
  content: string;
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

export type PanelPlan = {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  notes: string;
  meals: PanelMeal[];
};

export type PanelMealLog = {
  id: string;
  mealId: string;
  date: string;
  photoUrl: string | null;
  note: string;
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

const fmtDate = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const DOW = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  return `${d} ${MONTHS[m - 1]} ${y}, ${DOW[dt.getDay()]}`;
};

const fmtDateShort = (ymd: string | null) => {
  if (!ymd) return null;
  const [y, m, d] = ymd.split("-");
  return `${d}.${m}.${y}`;
};

/** "YYYY-MM-DD" değerini gün-hassasiyetli karşılaştırmak için UTC epoch gün sayısına çevirir. */
function dayIndex(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}
function addDaysYmd(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

const card: React.CSSProperties = {
  background: "var(--surface-card)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  padding: 20,
};

const macroBadges = (kcal: number | null, protein: number | null, carbs: number | null, fat: number | null) => {
  const chips: { label: string }[] = [];
  if (kcal != null) chips.push({ label: `${kcal} kcal` });
  if (protein != null) chips.push({ label: `P${protein}` });
  if (carbs != null) chips.push({ label: `K${carbs}` });
  if (fat != null) chips.push({ label: `Y${fat}` });
  return chips;
};

/** Minimal portal lightbox — fotoğrafı büyütür. */
function PhotoLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useOverlayDismiss(true, onClose);
  return createPortal(
    <div
      className="by-anim-fade"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.72)", zIndex: 210, display: "grid", placeItems: "center", padding: 20 }}
    >
      <div className="by-anim-pop" onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: "min(720px, 92vw)", maxHeight: "88vh" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Öğün fotoğrafı" style={{ display: "block", maxWidth: "100%", maxHeight: "88vh", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xl)" }} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          style={{ position: "absolute", top: -14, right: -14, width: 32, height: 32, borderRadius: "50%", border: "none", background: "#fff", color: "var(--navy-900)", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "var(--shadow-md)" }}
        >
          <Icon name="x" size={16} />
        </button>
      </div>
    </div>,
    document.body,
  );
}

function PhotoPicker({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız.");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
      {value ? (
        <div style={{ position: "relative", maxWidth: 200, width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Öğün fotoğrafı" style={{ display: "block", width: "100%", maxWidth: 200, height: "auto", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", objectFit: "cover" }} />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Fotoğrafı kaldır"
            style={{ position: "absolute", top: 6, right: 6, display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
          >
            <Icon name="x" size={12} /> Kaldır
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: "var(--radius-sm)", border: "1.5px dashed var(--ink-300)", background: busy ? "var(--ink-50)" : "var(--surface-page)", color: "var(--ink-700)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, cursor: busy ? "wait" : "pointer" }}
        >
          <Icon name="image" size={16} /> {busy ? "Yükleniyor…" : "Fotoğraf Yükle/Çek"}
        </button>
      )}
      {error && <span style={{ fontSize: 12, color: "var(--red-600)" }}>{error}</span>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: 13.5, padding: "9px 11px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)", background: "var(--surface-page)", color: "var(--text-body)", width: "100%", minWidth: 0,
};
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 5, display: "block" };

function MealLogForm({
  mealId,
  date,
  initial,
  onDone,
  onCancel,
}: {
  mealId: string;
  date: string;
  initial: PanelMealLog | null;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string | null>(initial?.photoUrl ?? null);
  const [note, setNote] = useState(initial?.note ?? "");
  const [kcal, setKcal] = useState(initial?.kcal != null ? String(initial.kcal) : "");
  const [protein, setProtein] = useState(initial?.protein != null ? String(initial.protein) : "");
  const [carbs, setCarbs] = useState(initial?.carbs != null ? String(initial.carbs) : "");
  const [fat, setFat] = useState(initial?.fat != null ? String(initial.fat) : "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toNum = (v: string): number | null => {
    if (!v.trim()) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await saveMealLog({
        mealId,
        date,
        photoUrl: photoUrl || null,
        note,
        kcal: toNum(kcal),
        protein: toNum(protein),
        carbs: toNum(carbs),
        fat: toNum(fat),
      });
      if (res && "error" in res && res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
      onDone();
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 14, borderRadius: "var(--radius-md)", background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
      <PhotoPicker value={photoUrl} onChange={setPhotoUrl} />
      <div>
        <label style={labelStyle}>Not</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={400}
          placeholder="Öğünle ilgili not ekleyin (opsiyonel)"
          style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font-body)" }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <label style={labelStyle}>Kcal</label>
          <input style={inputStyle} inputMode="numeric" value={kcal} onChange={(e) => setKcal(e.target.value)} />
        </div>
        <div style={{ minWidth: 0 }}>
          <label style={labelStyle}>Protein (g)</label>
          <input style={inputStyle} inputMode="numeric" value={protein} onChange={(e) => setProtein(e.target.value)} />
        </div>
        <div style={{ minWidth: 0 }}>
          <label style={labelStyle}>Karb (g)</label>
          <input style={inputStyle} inputMode="numeric" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
        </div>
        <div style={{ minWidth: 0 }}>
          <label style={labelStyle}>Yağ (g)</label>
          <input style={inputStyle} inputMode="numeric" value={fat} onChange={(e) => setFat(e.target.value)} />
        </div>
      </div>
      {error && <div style={{ padding: "8px 11px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 12.5, color: "var(--red-600)" }}>{error}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          style={{ padding: "9px 16px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--grad-gold)", color: "var(--navy-900)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, cursor: pending ? "wait" : "pointer" }}
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            style={{ padding: "9px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, cursor: pending ? "wait" : "pointer" }}
          >
            Vazgeç
          </button>
        )}
      </div>
    </div>
  );
}

function MealCard({
  meal,
  date,
  log,
  canLog,
  onLightbox,
}: {
  meal: PanelMeal;
  date: string;
  log: PanelMealLog | null;
  canLog: boolean;
  onLightbox: (src: string) => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, startDelete] = useTransition();
  const chips = macroBadges(meal.kcal, meal.protein, meal.carbs, meal.fat);
  const doneChips = log ? macroBadges(log.kcal, log.protein, log.carbs, log.fat) : [];

  const confirmDelete = () => {
    if (!window.confirm("Bu öğün günlüğünü silmek istediğinize emin misiniz?")) return;
    startDelete(async () => {
      await deleteMealLog(meal.id, date);
      router.refresh();
    });
  };

  return (
    <div style={{ ...card, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14.5, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{meal.name}</span>
            {meal.time && <span style={{ fontSize: 12.5, color: "var(--ink-400)", fontVariantNumeric: "tabular-nums", flex: "none" }}>{meal.time}</span>}
          </div>
        </div>
        {chips.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {chips.map((c) => (
              <Badge key={c.label} tone="neutral">{c.label}</Badge>
            ))}
          </div>
        )}
      </div>
      {meal.content && <p style={{ margin: 0, fontSize: 13, color: "var(--ink-600)", lineHeight: 1.5 }}>{meal.content}</p>}

      {canLog && (editing || !log) ? (
        <MealLogForm
          mealId={meal.id}
          date={date}
          initial={log}
          onDone={() => setEditing(false)}
          onCancel={log ? () => setEditing(false) : undefined}
        />
      ) : canLog && log ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8, borderTop: "1px dashed var(--border-subtle)" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
            {log.photoUrl && (
              <button
                type="button"
                onClick={() => onLightbox(log.photoUrl!)}
                style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", flex: "none" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={log.photoUrl} alt="Öğün fotoğrafı" style={{ maxWidth: 200, width: "100%", height: "auto", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", objectFit: "cover", display: "block" }} />
              </button>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: 1 }}>
              {doneChips.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {doneChips.map((c) => (
                    <Badge key={c.label} tone="success">{c.label}</Badge>
                  ))}
                </div>
              )}
              {log.note && <p style={{ margin: 0, fontSize: 13, color: "var(--ink-600)", lineHeight: 1.5 }}>{log.note}</p>}
              {!log.note && doneChips.length === 0 && !log.photoUrl && (
                <span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>Kayıt yapıldı, ek bilgi girilmedi.</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => setEditing(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--ink-700)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}
            >
              <Icon name="pencil" size={13} /> Düzenle
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--red-600)", background: "transparent", color: "var(--red-600)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, cursor: deleting ? "wait" : "pointer" }}
            >
              <Icon name="trash-2" size={13} /> {deleting ? "Siliniyor…" : "Sil"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function NutritionPanelView({ plans, logs, hasConsent, todayYmd }: {
  plans: PanelPlan[];
  logs: PanelMealLog[];
  hasConsent: boolean;
  todayYmd: string;
}) {
  const [selectedDate, setSelectedDate] = useState(todayYmd);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const minDate = addDaysYmd(todayYmd, -14);
  const maxDate = addDaysYmd(todayYmd, 1);
  const todayIdx = dayIndex(todayYmd);
  const selIdx = dayIndex(selectedDate);

  const canPrev = selIdx > dayIndex(minDate);
  const canNext = selIdx < dayIndex(maxDate);

  const go = (dir: number) => {
    const next = addDaysYmd(selectedDate, dir);
    if (dayIndex(next) < dayIndex(minDate) || dayIndex(next) > dayIndex(maxDate)) return;
    setSelectedDate(next);
  };

  const logsByMealAndDate = useMemo(() => {
    const map = new Map<string, PanelMealLog>();
    for (const l of logs) map.set(`${l.mealId}__${l.date}`, l);
    return map;
  }, [logs]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 18, height: 2, background: "var(--gold-500)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", margin: 0 }}>Beslenme Programı</h2>
      </div>

      {!hasConsent && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: "var(--radius-md)", background: "var(--navy-50)", border: "1px solid var(--navy-300)" }}>
          <Icon name="shield-check" size={18} style={{ color: "var(--navy-600)", flex: "none", marginTop: 1 }} />
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-700)", lineHeight: 1.5 }}>
              Öğün günlüğü tutabilmek için sağlık verisi onayı gereklidir.
            </p>
            <Link href="/panel/izinler" style={{ alignSelf: "flex-start", fontSize: 13, fontWeight: 600, color: "var(--text-link)", textDecoration: "underline" }}>
              Onaylar sayfasına git
            </Link>
          </div>
        </div>
      )}

      {plans.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: "40px 24px", color: "var(--ink-500)" }}>
          <Icon name="apple" size={30} style={{ color: "var(--ink-300)", marginBottom: 10 }} />
          <p style={{ margin: 0, fontSize: 14 }}>Henüz beslenme programınız yok. Antrenörünüz atadığında burada görünecek.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <IconButton label="Önceki gün" variant="outline" size="sm" onClick={() => go(-1)} disabled={!canPrev}>
              <Icon name="chevron-left" size={16} />
            </IconButton>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)", minWidth: 0 }}>{fmtDate(selectedDate)}</span>
            <IconButton label="Sonraki gün" variant="outline" size="sm" onClick={() => go(1)} disabled={!canNext}>
              <Icon name="chevron-right" size={16} />
            </IconButton>
            {selIdx !== todayIdx && (
              <button
                type="button"
                onClick={() => setSelectedDate(todayYmd)}
                style={{ padding: "7px 14px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--ink-700)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}
              >
                Bugün
              </button>
            )}
          </div>

          {plans.map((plan) => {
            const doneCount = plan.meals.filter((m) => logsByMealAndDate.has(`${m.id}__${selectedDate}`)).length;
            return (
              <div key={plan.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ ...card, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "var(--text-strong)", margin: 0, minWidth: 0 }}>{plan.title}</h3>
                    <span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>
                      {fmtDateShort(plan.startDate)}{plan.endDate ? ` – ${fmtDateShort(plan.endDate)}` : " – devam ediyor"}
                    </span>
                  </div>
                  {plan.notes && <p style={{ margin: 0, fontSize: 13, color: "var(--ink-600)", lineHeight: 1.5 }}>{plan.notes}</p>}
                  {hasConsent && plan.meals.length > 0 && (
                    <span style={{ fontSize: 12.5, color: "var(--ink-500)", fontWeight: 600 }}>{doneCount}/{plan.meals.length} öğün kaydedildi</span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.meals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      date={selectedDate}
                      log={logsByMealAndDate.get(`${meal.id}__${selectedDate}`) ?? null}
                      canLog={hasConsent}
                      onLightbox={setLightbox}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {lightbox && <PhotoLightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
}
