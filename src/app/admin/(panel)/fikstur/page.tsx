import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FixturesView, type FixtureRow } from "@/components/admin/views/FixturesView";

export const metadata: Metadata = { title: "Fikstür" };

export default async function FiksturPage() {
  const fixtures = await prisma.fixture.findMany({ orderBy: { date: "desc" } });
  return <FixturesView fixtures={fixtures as FixtureRow[]} />;
}
