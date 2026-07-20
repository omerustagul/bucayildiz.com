import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ViewHeader } from "@/components/admin/ui";
import { PaymentsView, type AthletePayments, type PaymentReport, type PaymentItem } from "@/components/admin/PaymentsView";

export const metadata: Metadata = { title: "Ödemeler" };

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Gerçek durum: ödendi ise paid; değilse vadesi geçmişse overdue; yoksa pending.
 *  (Manuel "overdue" statüsü de overdue sayılır.) */
function derive(status: string, dueDate: string | null, today: string): "paid" | "overdue" | "pending" {
  if (status === "paid") return "paid";
  if (status === "overdue") return "overdue";
  if (dueDate && dueDate < today) return "overdue";
  return "pending";
}

export default async function OdemelerPage() {
  await requirePermission("odemeler.view");
  const today = todayYmd();
  const thisMonth = today.slice(0, 7); // "YYYY-MM"

  const [athletes, payments] = await Promise.all([
    // Yalnız ödeme takibi AÇIK sporcular (opt-out bayrağı).
    prisma.athlete.findMany({ where: { paymentsEnabled: true }, orderBy: { name: "asc" }, select: { id: true, name: true, team: { select: { name: true } } } }),
    prisma.payment.findMany({ orderBy: [{ dueDate: "desc" }, { createdAt: "desc" }], include: { athlete: { select: { id: true, name: true, team: { select: { name: true } }, paymentsEnabled: true } } } }),
  ]);

  // ---- Raporlama (TÜM ödemeler üzerinden — silinmiş sporcuların mali kaydı dahil) ----
  let totalCollected = 0, totalPending = 0, totalOverdue = 0, thisMonthExpected = 0, thisMonthCollected = 0;
  const monthMap = new Map<string, { collected: number; expected: number }>();
  const teamMap = new Map<string, { collected: number; pending: number }>();

  for (const p of payments) {
    const st = derive(p.status, p.dueDate, today);
    if (st === "paid") totalCollected += p.amount;
    else if (st === "overdue") totalOverdue += p.amount;
    else totalPending += p.amount;

    // bu ay: vadesi bu ay olan beklenen; bu ay ödenen (paidAt bu ay)
    if (p.dueDate?.slice(0, 7) === thisMonth) thisMonthExpected += p.amount;
    if (st === "paid" && p.paidAt?.slice(0, 7) === thisMonth) thisMonthCollected += p.amount;

    // aylık kırılım (vade ayına göre): son 6 ay
    const mk = p.dueDate?.slice(0, 7) ?? p.paidAt?.slice(0, 7);
    if (mk) {
      const m = monthMap.get(mk) ?? { collected: 0, expected: 0 };
      m.expected += p.amount;
      if (st === "paid") m.collected += p.amount;
      monthMap.set(mk, m);
    }

    // takım kırılımı
    const team = p.athlete?.team.name ?? "—";
    const t = teamMap.get(team) ?? { collected: 0, pending: 0 };
    if (st === "paid") t.collected += p.amount;
    else t.pending += p.amount;
    teamMap.set(team, t);
  }

  const monthly = [...monthMap.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6).reverse()
    .map(([month, v]) => ({ month, ...v }));
  const byTeam = [...teamMap.entries()].map(([team, v]) => ({ team, ...v })).sort((a, b) => b.collected - a.collected);

  const report: PaymentReport = { totalCollected, totalPending, totalOverdue, thisMonthExpected, thisMonthCollected, monthly, byTeam };

  // ---- Per-sporcu (yalnız ödeme-aktif sporcular; drawer için tüm ödemeleri) ----
  const byAthlete = new Map<string, PaymentItem[]>();
  for (const p of payments) {
    if (!p.athlete?.paymentsEnabled) continue; // pasif/silinmiş sporcu listede değil (rapora dahil)
    const arr = byAthlete.get(p.athleteId!) ?? [];
    arr.push({ id: p.id, amount: p.amount, period: p.period, status: p.status, derived: derive(p.status, p.dueDate, today), dueDate: p.dueDate, paidAt: p.paidAt, note: p.note });
    byAthlete.set(p.athleteId!, arr);
  }

  const athleteRows: AthletePayments[] = athletes.map((a) => {
    const list = byAthlete.get(a.id) ?? [];
    const paidTotal = list.filter((x) => x.derived === "paid").reduce((s, x) => s + x.amount, 0);
    const overdue = list.filter((x) => x.derived === "overdue");
    const pending = list.filter((x) => x.derived === "pending");
    const nextDue = pending.map((x) => x.dueDate).filter(Boolean).sort()[0] ?? null;
    const status: AthletePayments["status"] = overdue.length ? "overdue" : pending.length ? "pending" : "clear";
    return {
      athleteId: a.id, name: a.name, teamName: a.team.name,
      paidTotal, pendingCount: pending.length, overdueCount: overdue.length, overdueTotal: overdue.reduce((s, x) => s + x.amount, 0),
      nextDue, status, payments: list,
    };
  });

  return (
    <>
      <ViewHeader
        title="Ödemeler"
        subtitle={`Tahsil ${totalCollected.toLocaleString("tr-TR")} ₺ · bekleyen ${totalPending.toLocaleString("tr-TR")} ₺ · geciken ${totalOverdue.toLocaleString("tr-TR")} ₺`}
      />
      <PaymentsView report={report} athletes={athleteRows} />
    </>
  );
}
