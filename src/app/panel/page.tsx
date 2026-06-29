import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AthleteCard } from "@/components/panel/AthleteCard";
import { TrainingCalendar, type CalTraining } from "@/components/panel/TrainingCalendar";
import { PerformanceMatrix } from "@/components/panel/PerformanceMatrix";
import { PushToggle } from "@/components/panel/PushToggle";
import { measurementsToPerf } from "@/lib/perf";

export const metadata: Metadata = { title: "Genel Bakış — Sporcu Paneli" };

export default async function PanelDashboard() {
  const session = await getSession();
  const athlete = await prisma.athlete.findUnique({
    where: { id: session!.athleteId! },
    include: { team: { include: { trainings: { orderBy: { date: "asc" } } } }, measurements: { orderBy: { measuredAt: "asc" } } },
  });
  if (!athlete) return null;

  const trainings: CalTraining[] = athlete.team.trainings.map((t) => ({ id: t.id, date: t.date, time: t.time, type: t.type, duration: t.duration }));

  const now = new Date();
  const todayYmd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const upcoming = trainings.find((t) => t.date >= todayYmd);
  const initialAnchor = upcoming?.date ?? trainings[0]?.date ?? todayYmd;

  return (
    <>
      <AthleteCard
        athlete={{
          name: athlete.name,
          teamName: athlete.team.name,
          position: athlete.position,
          number: athlete.number,
          height: athlete.height,
          weight: athlete.weight,
          foot: athlete.foot,
          licenseNo: athlete.licenseNo,
          birthYear: athlete.birthYear,
          photoUrl: athlete.photoUrl,
        }}
      />
      <PushToggle />
      <TrainingCalendar trainings={trainings} todayYmd={todayYmd} initialAnchor={initialAnchor} />
      <PerformanceMatrix perf={measurementsToPerf(athlete.measurements)} />
    </>
  );
}
