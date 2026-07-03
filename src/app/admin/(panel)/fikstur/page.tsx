import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FixturesView, type FixtureRow } from "@/components/admin/views/FixturesView";

export const metadata: Metadata = { title: "Fikstür" };

export default async function FiksturPage() {
  const [fixtures, teams] = await Promise.all([
    prisma.fixture.findMany({ orderBy: { date: "desc" } }),
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
  ]);
  return <FixturesView fixtures={fixtures as FixtureRow[]} teams={teams} />;
}
