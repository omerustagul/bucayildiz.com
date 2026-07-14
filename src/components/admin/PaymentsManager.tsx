"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/admin/controls";
import { Field } from "@/components/admin/kit";
import { CardList, DataCard, CardHeader, CardFields, CardActions } from "@/components/admin/MobileCardList";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Icon } from "@/lib/icons";
import { createPayment, setPaymentStatus, deletePayment } from "@/app/admin/(panel)/odemeler/actions";

type AthleteOpt = { id: string; name: string; teamName: string };
export type PaymentRow = {
  id: string; athleteName: string; teamName: string; amount: number;
  period: string; status: string; dueDate: string | null; paidAt: string | null;
};

const STATUS_LABEL: Record<string, { label: string; bg: string; fg: string }> = {
  paid: { label: "Ödendi", bg: "var(--green-100)", fg: "var(--green-600)" },
  pending: { label: "Bekliyor", bg: "var(--gold-100, #f7efd6)", fg: "var(--gold-700)" },
  overdue: { label: "Gecikti", bg: "var(--red-100)", fg: "var(--red-600)" },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Bekliyor" },
  { value: "paid", label: "Ödendi" },
  { value: "overdue", label: "Gecikti" },
];

const selStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: 14, padding: "10px 12px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--text-body)", width: "100%",
};
const th: React.CSSProperties = { textAlign: "left", padding: "10px 14px", fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 14px", fontSize: 14, color: "var(--text-body)", borderTop: "1px solid var(--border-subtle)", whiteSpace: "nowrap" };

export function PaymentsManager({ athletes, payments }: { athletes: AthleteOpt[]; payments: PaymentRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [athleteId, setAthleteId] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");

  const add = () => {
    if (pending) return;
    setErr(null);
    start(async () => {
      const res = await createPayment({ athleteId, amount: Number(amount), period, dueDate, status });
      if (res.ok) { setAthleteId(""); setAmount(""); setPeriod(""); setDueDate(""); setStatus("pending"); router.refresh(); }
      else setErr(res.error);
    });
  };

  const changeStatus = (id: string, s: string) => {
    setBusyId(id);
    start(async () => {
      try {
        await setPaymentStatus(id, s);
        router.refresh();
      } finally {
        setBusyId(null);
      }
    });
  };

  const remove = (id: string) => {
    if (!confirm("Bu ödeme kaydı silinsin mi?")) return;
    setBusyId(id);
    start(async () => {
      try {
        await deletePayment(id);
        router.refresh();
      } finally {
        setBusyId(null);
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Yeni ödeme */}
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 14px" }}>Yeni Ödeme Kaydı</h3>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1.2fr 1fr", gap: 12 }} className="pay-form">
          <Field label="Sporcu">
            <Select
              style={selStyle}
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
              placeholder="Seçiniz"
              options={athletes.map((a) => ({ value: a.id, label: `${a.name} (${a.teamName})` }))}
            />
          </Field>
          <Field label="Tutar (₺)"><TextInput type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1500" /></Field>
          <Field label="Dönem"><TextInput value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="Haziran 2026" /></Field>
          <Field label="Son Ödeme"><TextInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></Field>
          <Field label="Durum">
            <Select
              style={selStyle}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "pending", label: "Bekliyor" },
                { value: "paid", label: "Ödendi" },
                { value: "overdue", label: "Gecikti" },
              ]}
            />
          </Field>
        </div>
        {err && <div style={{ marginTop: 10, padding: "9px 12px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{err}</div>}
        <div style={{ marginTop: 14 }}><Button variant="primary" onClick={add} disabled={pending}>{pending ? "Ekleniyor…" : "Ödeme Ekle"}</Button></div>
      </div>

      {/* Liste */}
      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {payments.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Henüz ödeme kaydı yok.</div>
        ) : (
          <>
          <div className="adm-table-wrap" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead><tr style={{ background: "var(--surface-subtle)" }}>
                <th style={th}>Sporcu</th><th style={th}>Dönem</th><th style={th}>Tutar</th><th style={th}>Son Ödeme</th><th style={th}>Durum</th><th style={th}></th>
              </tr></thead>
              <tbody>
                {payments.map((p) => {
                  const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.pending;
                  return (
                    <tr key={p.id}>
                      <td style={{ ...td, fontWeight: 600, color: "var(--text-strong)" }}>{p.athleteName}<span style={{ color: "var(--text-muted)", fontWeight: 400 }}> · {p.teamName}</span></td>
                      <td style={td}>{p.period}</td>
                      <td style={{ ...td, fontFamily: "var(--font-stat, inherit)", fontWeight: 700 }}>{p.amount.toLocaleString("tr-TR")} ₺</td>
                      <td style={{ ...td, color: "var(--text-muted)" }}>{p.dueDate || "—"}</td>
                      <td style={td}>
                        <Select
                          value={p.status}
                          disabled={busyId === p.id}
                          onChange={(e) => changeStatus(p.id, e.target.value)}
                          options={STATUS_OPTIONS}
                          containerStyle={{ display: "inline-flex" }}
                          style={{ ...selStyle, minWidth: 108, padding: "6px 10px", background: s.bg, color: s.fg, fontWeight: 600, border: "none" }}
                        />
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <button onClick={() => remove(p.id)} disabled={busyId === p.id} aria-label="Sil" title="Sil" style={{ border: "none", background: "transparent", color: "var(--red-600)", cursor: "pointer", padding: 6 }}>
                          <Icon name="trash-2" size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <CardList style={{ padding: 14 }}>
            {payments.map((p) => {
              const s = STATUS_LABEL[p.status] ?? STATUS_LABEL.pending;
              return (
                <DataCard key={p.id}>
                  <CardHeader
                    title={p.athleteName}
                    subtitle={p.teamName}
                    badge={
                      <Select
                        value={p.status}
                        disabled={busyId === p.id}
                        onChange={(e) => changeStatus(p.id, e.target.value)}
                        options={STATUS_OPTIONS}
                        containerStyle={{ display: "inline-flex" }}
                        style={{ ...selStyle, minWidth: 108, padding: "6px 10px", background: s.bg, color: s.fg, fontWeight: 600, border: "none" }}
                      />
                    }
                  />
                  <CardFields
                    items={[
                      { label: "Dönem", value: p.period },
                      { label: "Tutar", value: `${p.amount.toLocaleString("tr-TR")} ₺` },
                      { label: "Son Ödeme", value: p.dueDate || "—" },
                    ]}
                  />
                  <CardActions>
                    <Button variant="ghost" size="sm" style={{ color: "var(--red-600)" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={() => remove(p.id)} disabled={busyId === p.id}>
                      Sil
                    </Button>
                  </CardActions>
                </DataCard>
              );
            })}
          </CardList>
          </>
        )}
      </div>
    </div>
  );
}
