import type { Metadata } from "next";
import { requireAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrainingCalendar, type CalFixture, type CalTraining } from "@/components/panel/TrainingCalendar";

export const metadata: Metadata = { title: "Antrenmanlar — Sporcu Paneli" };

export default async function PanelAntrenmanlar() {
  // requireAthlete: oturum bayatsa (şifre değişimi vb.) 500 yerine /giris'e yönlendirir.
  const session = await requireAthlete();
  const athlete = await prisma.athlete.findUnique({ where: { id: session.athleteId! }, select: { id: true, teamId: true } });
  if (!athlete) return null;

  // Takım antrenmanları + yalnız bu sporcunun katılımcı olduğu bireysel antrenmanlar.
  const [rawTrainings, rawFixtures] = await Promise.all([
    prisma.training.findMany({
      where: { teamId: athlete.teamId, OR: [{ scope: "team" }, { attendance: { some: { athleteId: athlete.id } } }] },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      include: { drills: { orderBy: { sort: "asc" }, select: { id: true, text: true, done: true } } },
    }),
    // Tüm maçlar (geçmiş dahil) — büyük takvimde geçmişe dönük gezinme için.
    prisma.fixture.findMany({
      orderBy: { date: "asc" },
      select: { id: true, competition: true, opponent: true, isHome: true, date: true, time: true, venue: true, status: true, ourScore: true, oppScore: true },
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

  return <TrainingCalendar trainings={trainings} fixtures={fixtures} todayYmd={todayYmd} initialAnchor={initialAnchor} />;
}
