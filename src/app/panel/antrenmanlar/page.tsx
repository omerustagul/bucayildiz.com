import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrainingCalendar, type CalTraining } from "@/components/panel/TrainingCalendar";

export const metadata: Metadata = { title: "Antrenmanlar — Sporcu Paneli" };

export default async function PanelAntrenmanlar() {
  const session = await getSession();
  const athlete = await prisma.athlete.findUnique({
    where: { id: session!.athleteId! },
    include: { team: { include: { trainings: { orderBy: { date: "asc" } } } } },
  });
  if (!athlete) return null;

  const trainings: CalTraining[] = athlete.team.trainings.map((t) => ({ id: t.id, date: t.date, time: t.time, type: t.type, duration: t.duration }));
  const now = new Date();
  const todayYmd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const upcoming = trainings.find((t) => t.date >= todayYmd);
  const initialAnchor = upcoming?.date ?? trainings[0]?.date ?? todayYmd;

  return <TrainingCalendar trainings={trainings} todayYmd={todayYmd} initialAnchor={initialAnchor} />;
}
