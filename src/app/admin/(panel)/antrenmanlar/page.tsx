import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TrainingView } from "@/components/admin/views/TrainingView";

export const metadata: Metadata = { title: "Antrenmanlar" };

export default async function AntrenmanlarPage() {
  const [teams, trainings] = await Promise.all([
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
    prisma.training.findMany({ orderBy: { date: "asc" }, select: { id: true, teamId: true, type: true, date: true, time: true, duration: true } }),
  ]);
  return <TrainingView teams={teams} trainings={trainings} />;
}
