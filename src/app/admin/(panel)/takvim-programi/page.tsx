import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { listPitchFacilities } from "@/lib/facilities";
import { ScheduleView } from "@/components/admin/views/ScheduleView";

export const metadata: Metadata = { title: "Takvim Programı" };

export default async function TakvimProgramiPage() {
  const [teams, athletes, trainings, fixtures, pitches] = await Promise.all([
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
    prisma.athlete.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, teamId: true } }),
    prisma.training.findMany({
      orderBy: [{ date: "asc" }, { time: "asc" }],
      include: {
        drills: { orderBy: { sort: "asc" }, select: { id: true, text: true, done: true } },
        attendance: { select: { athlete: { select: { name: true } } } },
      },
    }),
    // Tüm maçlar (geçmiş dahil) — büyük takvimde geçmişe dönük gezinme için.
    prisma.fixture.findMany({
      orderBy: { date: "asc" },
      select: { id: true, competition: true, opponent: true, isHome: true, date: true, time: true, venue: true, teamId: true, status: true, ourScore: true, oppScore: true },
    }),
    listPitchFacilities(),
  ]);

  const now = new Date();
  const todayYmd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <ScheduleView
      teams={teams}
      athletes={athletes}
      pitches={pitches}
      trainings={trainings.map((t) => ({
        id: t.id, teamId: t.teamId, scope: t.scope, status: t.status, date: t.date, time: t.time,
        duration: t.duration, pitch: t.pitch, notes: t.notes,
        drills: t.drills,
        participants: t.attendance.map((a) => a.athlete.name),
      }))}
      fixtures={fixtures}
      todayYmd={todayYmd}
    />
  );
}
