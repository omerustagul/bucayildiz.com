import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { FixturesView, type FixtureRow } from "@/components/admin/views/FixturesView";

export const metadata: Metadata = { title: "Fikstür" };

export default async function FiksturPage() {
  await requirePermission("fikstur.view");
  const [fixtures, teams] = await Promise.all([
    prisma.fixture.findMany({ orderBy: { date: "desc" } }),
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
  ]);
  return <FixturesView fixtures={fixtures as FixtureRow[]} teams={teams} logoUrl={(await getSettings()).logoUrl} />;
}
