"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Drawer, TextInput, SearchBox } from "@/components/admin/controls";
import { Field } from "@/components/admin/kit";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { toast } from "@/components/ui/Toast";
import { createPayment, updatePayment, setPaymentStatus, deletePayment } from "@/app/admin/(panel)/odemeler/actions";

export type PaymentItem = {
  id: string; amount: number; period: string; status: string;
  derived: "paid" | "overdue" | "pending"; dueDate: string | null; paidAt: string | null; note: string | null;
};
export type AthletePayments = {
  athleteId: string; name: string; teamName: string;
  paidTotal: number; pendingCount: number; overdueCount: number; overdueTotal: number;
  nextDue: string | null; status: "clear" | "pending" | "overdue"; payments: PaymentItem[];
};
export type PaymentReport = {
  totalCollected: number; totalPending: number; totalOverdue: number;
  thisMonthExpected: number; thisMonthCollected: number;
  monthly: { month: string; collected: number; expected: number }[];
  byTeam: { team: string; collected: number; pending: number }[];
};

const tl = (n: number) => `${n.toLocaleString("tr-TR")} ₺`;

const DSTATUS: Record<PaymentItem["derived"], { label: string; bg: string; fg: string }> = {
  paid: { label: "Ödendi", bg: "var(--green-100)", fg: "var(--green-600)" },
  pending: { label: "Bekliyor", bg: "var(--gold-100, #f7efd6)", fg: "var(--gold-700)" },
  overdue: { label: "Gecikti", bg: "var(--red-100)", fg: "var(--red-600)" },
};
const ASTATUS: Record<AthletePayments["status"], { label: string; bg: string; fg: string }> = {
  clear: { label: "Güncel", bg: "var(--green-100)", fg: "var(--green-600)" },
  pending: { label: "Bekleyen var", bg: "var(--gold-100, #f7efd6)", fg: "var(--gold-700)" },
  overdue: { label: "Gecikmiş", bg: "var(--red-100)", fg: "var(--red-600)" },
};
const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const monthLabel = (ym: string) => { const [y, m] = ym.split("-"); return `${MONTHS[Number(m) - 1] ?? m} ${y?.slice(2) ?? ""}`; };

function StatCard({ label, value, tone }: { label: string; value: string; tone?: "gold" | "green" | "red" }) {
  const color = tone === "green" ? "var(--green-600)" : tone === "red" ? "var(--red-600)" : tone === "gold" ? "var(--gold-700)" : "var(--text-strong)";
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "16px 18px", minWidth: 0 }}>
      <div style={{ fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, color, marginTop: 5 }}>{value}</div>
    </div>
  );
}

function chip(s: { label: string; bg: string; fg: string }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: "var(--radius-pill)", background: s.bg, color: s.fg, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{s.label}</span>;
}

// ---------- Raporlama sekmesi ----------
function ReportTab({ r }: { r: PaymentReport }) {
  const maxMonth = Math.max(1, ...r.monthly.map((m) => Math.max(m.expected, m.collected)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        <StatCard label="Bu ay tahsil" value={tl(r.thisMonthCollected)} tone="green" />
        <StatCard label="Bu ay beklenen" value={tl(r.thisMonthExpected)} tone="gold" />
        <StatCard label="Toplam tahsil" value={tl(r.totalCollected)} tone="green" />
        <StatCard label="Bekleyen" value={tl(r.totalPending)} tone="gold" />
        <StatCard label="Geciken" value={tl(r.totalOverdue)} tone="red" />
      </div>

      {r.monthly.length > 0 && (
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gold-700)", margin: "0 0 16px" }}>Aylık Tahsilat</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(8px, 3vw, 24px)", height: 140 }}>
            {r.monthly.map((m) => (
              <div key={m.month} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: "100%", maxWidth: 46, height: 104, display: "flex", alignItems: "flex-end", gap: 3 }} title={`Beklenen ${tl(m.expected)} · Tahsil ${tl(m.collected)}`}>
                  <div style={{ flex: 1, height: `${(m.expected / maxMonth) * 100}%`, minHeight: 2, background: "var(--ink-200)", borderRadius: "3px 3px 0 0" }} />
                  <div style={{ flex: 1, height: `${(m.collected / maxMonth) * 100}%`, minHeight: 2, background: "var(--grad-gold)", borderRadius: "3px 3px 0 0" }} />
                </div>
                <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{monthLabel(m.month)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--grad-gold)" }} /> Tahsil</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--ink-200)" }} /> Beklenen</span>
          </div>
        </div>
      )}

      {r.byTeam.length > 0 && (
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gold-700)", margin: "0 0 12px" }}>Takım Kırılımı</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {r.byTeam.map((t) => (
              <div key={t.team} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: 14, paddingBottom: 8, borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ fontWeight: 600, color: "var(--text-strong)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.team}</span>
                <span style={{ flex: "none", display: "flex", gap: 14 }}>
                  <span style={{ color: "var(--green-600)", fontWeight: 600 }}>{tl(t.collected)}</span>
                  {t.pending > 0 && <span style={{ color: "var(--gold-700)" }}>+{tl(t.pending)} bek.</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Sporcu detay drawer ----------
type FormState = { id: string | null; period: string; amount: string; dueDate: string; status: string; note: string };
const EMPTY_FORM: FormState = { id: null, period: "", amount: "", dueDate: "", status: "pending", note: "" };

type RowProps = { p: PaymentItem; busyId: string | null; onMarkPaid: (id: string) => void; onEdit: (p: PaymentItem) => void; onRemove: (id: string) => void };

function PaymentRow({ p, busyId, onMarkPaid, onEdit, onRemove }: RowProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>{tl(p.amount)}</span>
          {chip(DSTATUS[p.derived])}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
          {p.period}{p.dueDate ? ` · vade ${p.dueDate}` : ""}{p.paidAt ? ` · ödendi ${p.paidAt}` : ""}
        </div>
      </div>
      <div style={{ flex: "none", display: "flex", gap: 2 }}>
        {p.derived !== "paid" && (
          <button onClick={() => onMarkPaid(p.id)} disabled={busyId === p.id} title="Ödendi işaretle" aria-label="Ödendi işaretle" style={{ border: "none", background: "transparent", color: "var(--green-600)", cursor: "pointer", padding: 6 }}><Icon name="check" size={17} /></button>
        )}
        <button onClick={() => onEdit(p)} disabled={busyId === p.id} title="Düzenle" aria-label="Düzenle" style={{ border: "none", background: "transparent", color: "var(--ink-500)", cursor: "pointer", padding: 6 }}><Icon name="pencil" size={15} /></button>
        <button onClick={() => onRemove(p.id)} disabled={busyId === p.id} title="Sil" aria-label="Sil" style={{ border: "none", background: "transparent", color: "var(--red-600)", cursor: "pointer", padding: 6 }}><Icon name="trash-2" size={15} /></button>
      </div>
    </div>
  );
}

function PaymentSection({ title, items, color, ...rest }: { title: string; items: PaymentItem[]; color: string } & Omit<RowProps, "p">) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 12.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color, margin: "0 0 4px" }}>{title} ({items.length})</h4>
      {items.map((p) => <PaymentRow key={p.id} p={p} {...rest} />)}
    </div>
  );
}

function AthleteDrawer({ athlete, onClose }: { athlete: AthletePayments; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const setF = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((s) => ({ ...s, [k]: v }));

  const groups = useMemo(() => ({
    overdue: athlete.payments.filter((p) => p.derived === "overdue"),
    pending: athlete.payments.filter((p) => p.derived === "pending"),
    paid: athlete.payments.filter((p) => p.derived === "paid"),
  }), [athlete.payments]);

  const openEdit = (p: PaymentItem) => {
    setForm({ id: p.id, period: p.period, amount: String(p.amount), dueDate: p.dueDate ?? "", status: p.status === "overdue" ? "pending" : p.status, note: p.note ?? "" });
    setShowForm(true);
    setErr(null);
  };
  const openNew = () => { setForm(EMPTY_FORM); setShowForm(true); setErr(null); };

  const submit = () => {
    setErr(null);
    const payload = { amount: Number(form.amount), period: form.period, dueDate: form.dueDate, status: form.status, note: form.note };
    start(async () => {
      const res = form.id
        ? await updatePayment({ id: form.id, ...payload })
        : await createPayment({ athleteId: athlete.athleteId, ...payload });
      if (res.ok) { toast.success(form.id ? "Ödeme güncellendi." : "Ödeme eklendi."); setShowForm(false); setForm(EMPTY_FORM); router.refresh(); }
      else setErr(res.error);
    });
  };

  const markPaid = (id: string) => { setBusyId(id); start(async () => { try { await setPaymentStatus(id, "paid"); router.refresh(); } finally { setBusyId(null); } }); };
  const remove = (id: string) => {
    if (!confirm("Bu ödeme kaydı silinsin mi?")) return;
    setBusyId(id);
    start(async () => { try { await deletePayment(id); router.refresh(); } finally { setBusyId(null); } });
  };


  return (
    <Drawer open onClose={onClose} title={athlete.name} subtitle={`${athlete.teamName} · ödeme geçmişi`} width={520}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <StatCard label="Ödenen" value={tl(athlete.paidTotal)} tone="green" />
          <StatCard label="Bekleyen" value={String(athlete.pendingCount)} tone="gold" />
          <StatCard label="Geciken" value={tl(athlete.overdueTotal)} tone="red" />
        </div>

        {!showForm ? (
          <Button variant="primary" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={openNew}>Ödeme Ekle</Button>
        ) : (
          <div style={{ background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "var(--text-strong)" }}>{form.id ? "Ödemeyi Düzenle" : "Yeni Ödeme"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Dönem"><TextInput value={form.period} onChange={(e) => setF("period", e.target.value)} placeholder="Haziran 2026" /></Field>
              <Field label="Tutar (₺)"><TextInput type="number" value={form.amount} onChange={(e) => setF("amount", e.target.value)} placeholder="1500" /></Field>
              <Field label="Son Ödeme"><TextInput type="date" value={form.dueDate} onChange={(e) => setF("dueDate", e.target.value)} /></Field>
              <Field label="Durum">
                <Select value={form.status} onChange={(e) => setF("status", e.target.value)} options={[{ value: "pending", label: "Bekliyor" }, { value: "paid", label: "Ödendi" }]} />
              </Field>
            </div>
            {err && <div style={{ padding: "8px 11px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{err}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Button variant="secondary" size="sm" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>İptal</Button>
              <Button variant="primary" size="sm" onClick={submit} disabled={pending}>{pending ? "Kaydediliyor…" : form.id ? "Güncelle" : "Ekle"}</Button>
            </div>
          </div>
        )}

        {athlete.payments.length === 0 ? (
          <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Bu sporcu için henüz ödeme kaydı yok.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <PaymentSection title="Geciken" items={groups.overdue} color="var(--red-600)" busyId={busyId} onMarkPaid={markPaid} onEdit={openEdit} onRemove={remove} />
            <PaymentSection title="Bekleyen / Yaklaşan" items={groups.pending} color="var(--gold-700)" busyId={busyId} onMarkPaid={markPaid} onEdit={openEdit} onRemove={remove} />
            <PaymentSection title="Ödenmiş geçmiş" items={groups.paid} color="var(--green-600)" busyId={busyId} onMarkPaid={markPaid} onEdit={openEdit} onRemove={remove} />
          </div>
        )}
      </div>
    </Drawer>
  );
}

// ---------- Ana görünüm ----------
export function PaymentsView({ report, athletes }: { report: PaymentReport; athletes: AthletePayments[] }) {
  const [tab, setTab] = useState("rapor");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLocaleLowerCase("tr");
    if (!s) return athletes;
    return athletes.filter((a) => a.name.toLocaleLowerCase("tr").includes(s) || a.teamName.toLocaleLowerCase("tr").includes(s));
  }, [athletes, q]);

  const open = athletes.find((a) => a.athleteId === openId) ?? null;

  return (
    <div style={{ marginTop: 8 }}>
      <Tabs
        tabs={[{ id: "rapor", label: "Raporlama" }, { id: "sporcular", label: `Sporcular (${athletes.length})` }]}
        value={tab}
        onChange={setTab}
      />

      <div style={{ marginTop: 18 }}>
        {tab === "rapor" ? (
          <ReportTab r={report} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SearchBox value={q} onChange={setQ} placeholder="Sporcu veya takım ara…" />
            {filtered.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                {athletes.length === 0 ? "Ödeme takibi açık sporcu yok. (Sporcu düzenlerken “Ödeme takibi” açın.)" : "Eşleşen sporcu yok."}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {filtered.map((a) => (
                  <button
                    key={a.athleteId}
                    onClick={() => setOpenId(a.athleteId)}
                    style={{ textAlign: "left", cursor: "pointer", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                        {chip(ASTATUS[a.status])}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 3 }}>
                        {a.teamName} · ödenen {tl(a.paidTotal)}
                        {a.overdueCount > 0 ? ` · ${a.overdueCount} geciken` : a.pendingCount > 0 ? ` · ${a.pendingCount} bekleyen` : ""}
                        {a.nextDue ? ` · sonraki vade ${a.nextDue}` : ""}
                      </div>
                    </div>
                    <span style={{ flex: "none", color: "var(--ink-400)", display: "inline-flex" }}><Icon name="chevron-right" size={18} /></span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {open && <AthleteDrawer athlete={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
