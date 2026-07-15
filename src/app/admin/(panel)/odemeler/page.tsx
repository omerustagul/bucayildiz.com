import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ViewHeader } from "@/components/admin/ui";
import { PaymentsManager, type PaymentRow } from "@/components/admin/PaymentsManager";

export const metadata: Metadata = { title: "Ödemeler" };

export default async function OdemelerPage() {
  await requirePermission("odemeler.view");
  const [athletes, payments] = await Promise.all([
    prisma.athlete.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, team: { select: { name: true } } } }),
    prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 300, include: { athlete: { select: { name: true, team: { select: { name: true } } } } } }),
  ]);

  const athleteOpts = athletes.map((a) => ({ id: a.id, name: a.name, teamName: a.team.name }));
  const rows: PaymentRow[] = payments.map((p) => ({
    id: p.id,
    athleteName: p.athlete.name,
    teamName: p.athlete.team.name,
    amount: p.amount,
    period: p.period,
    status: p.status,
    dueDate: p.dueDate,
    paidAt: p.paidAt,
  }));

  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <ViewHeader title="Ödemeler" subtitle={`Tahsil edilen ${totalPaid.toLocaleString("tr-TR")} ₺ · bekleyen ${totalPending.toLocaleString("tr-TR")} ₺`} />
      <PaymentsManager athletes={athleteOpts} payments={rows} />
    </>
  );
}
