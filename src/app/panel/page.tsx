import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AthleteCard } from "@/components/panel/AthleteCard";
import { TrainingCalendar, type CalFixture, type CalTraining } from "@/components/panel/TrainingCalendar";
import { PerformanceMatrix } from "@/components/panel/PerformanceMatrix";
import { PushToggle } from "@/components/panel/PushToggle";
import { measurementsToPerf } from "@/lib/perf";

export const metadata: Metadata = { title: "Genel Bakış — Sporcu Paneli" };

export default async function PanelDashboard() {
  const session = await getSession();
  const athlete = await prisma.athlete.findUnique({
    where: { id: session!.athleteId! },
    include: { team: true, measurements: { orderBy: { measuredAt: "asc" } } },
  });
  if (!athlete) return null;

  // Takım antrenmanları + yalnız bu sporcunun katılımcı olduğu bireysel antrenmanlar.
  const [rawTrainings, rawFixtures] = await Promise.all([
    prisma.training.findMany({
      where: { teamId: athlete.teamId, OR: [{ scope: "team" }, { attendance: { some: { athleteId: athlete.id } } }] },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      include: { drills: { orderBy: { sort: "asc" }, select: { id: true, text: true, done: true } } },
    }),
    prisma.fixture.findMany({
      where: { status: "upcoming" },
      orderBy: { date: "asc" },
      select: { id: true, competition: true, opponent: true, isHome: true, date: true, time: true, venue: true },
    }),
  ]);
  const trainings: CalTraining[] = rawTrainings.map((t) => ({
    id: t.id, date: t.date, time: t.time, scope: t.scope, duration: t.duration,
    status: t.status, pitch: t.pitch, notes: t.notes, drills: t.drills,
  }));
  const fixtures: CalFixture[] = rawFixtures;

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
      <TrainingCalendar trainings={trainings} fixtures={fixtures} todayYmd={todayYmd} initialAnchor={initialAnchor} />
      <PerformanceMatrix perf={measurementsToPerf(athlete.measurements)} />
    </>
  );
}
