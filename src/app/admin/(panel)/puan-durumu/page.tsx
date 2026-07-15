import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StandingsView, type StandingRowData } from "@/components/admin/views/StandingsView";

export const metadata: Metadata = { title: "Puan Durumu" };

export default async function PuanDurumuPage() {
  await requirePermission("puan.view");
  const rows = await prisma.standingRow.findMany({ orderBy: { sort: "asc" } });
  return <StandingsView rows={rows as StandingRowData[]} />;
}
