import type { Metadata } from "next";
import { requireAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Ödemeler — Sporcu Paneli" };

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  paid: { label: "Ödendi", bg: "var(--green-100)", fg: "var(--green-600)" },
  pending: { label: "Bekliyor", bg: "var(--gold-100, #f7efd6)", fg: "var(--gold-700)" },
  overdue: { label: "Gecikti", bg: "var(--red-100)", fg: "var(--red-600)" },
};

function Summary({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ flex: 1, minWidth: 140, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "16px 18px" }}>
      <div style={{ fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 24, color: accent ? "var(--gold-700)" : "var(--text-strong)", marginTop: 4 }}>{value}</div>
    </div>
  );
}

export default async function PanelOdemeler() {
  const session = await requireAthlete();
  const payments = await prisma.payment.findMany({
    where: { athleteId: session.athleteId! },
    orderBy: [{ createdAt: "desc" }],
    take: 100,
  });

  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Ödemeler</h1>
        <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: "6px 0 0" }}>Aidat ve ödeme geçmişiniz.</p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Summary label="Ödenen" value={`${paid.toLocaleString("tr-TR")} ₺`} />
        <Summary label="Bekleyen" value={`${pending.toLocaleString("tr-TR")} ₺`} accent />
      </div>

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {payments.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Henüz ödeme kaydınız bulunmuyor.</div>
        ) : (
          payments.map((p, i) => {
            const s = STATUS[p.status] ?? STATUS.pending;
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 18px", borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15.5, color: "var(--text-strong)" }}>{p.period}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                    {p.status === "paid" && p.paidAt ? `Ödendi: ${p.paidAt}` : p.dueDate ? `Son ödeme: ${p.dueDate}` : "—"}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: "none" }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, color: "var(--text-strong)" }}>{p.amount.toLocaleString("tr-TR")} ₺</span>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: "var(--radius-pill)", background: s.bg, color: s.fg }}>{s.label}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
