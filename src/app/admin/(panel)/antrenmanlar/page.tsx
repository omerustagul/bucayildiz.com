import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { listPitchFacilities } from "@/lib/facilities";
import { TrainingManageView } from "@/components/admin/views/TrainingManageView";

export const metadata: Metadata = { title: "Antrenmanlar" };

export default async function AntrenmanlarPage() {
  const [teams, athletes, trainings, pitches] = await Promise.all([
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
    prisma.athlete.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, teamId: true } }),
    prisma.training.findMany({
      orderBy: [{ date: "desc" }, { time: "desc" }],
      include: {
        drills: { orderBy: { sort: "asc" }, select: { id: true, text: true, done: true } },
        attendance: { select: { athleteId: true, status: true, note: true } },
      },
    }),
    listPitchFacilities(),
  ]);

  return (
    <TrainingManageView
      teams={teams}
      athletes={athletes}
      pitches={pitches}
      trainings={trainings.map((t) => ({
        id: t.id, teamId: t.teamId, scope: t.scope, status: t.status, date: t.date, time: t.time,
        duration: t.duration, pitch: t.pitch, notes: t.notes, drills: t.drills, attendance: t.attendance,
      }))}
    />
  );
}
