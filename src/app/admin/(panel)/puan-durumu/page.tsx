import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { StandingsView, type StandingRowData } from "@/components/admin/views/StandingsView";

export const metadata: Metadata = { title: "Puan Durumu" };

export default async function PuanDurumuPage() {
  const rows = await prisma.standingRow.findMany({ orderBy: { sort: "asc" } });
  return <StandingsView rows={rows as StandingRowData[]} />;
}
