import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TakimlarView, type TeamRow, type AthleteLite } from "@/components/admin/views/TakimlarView";

export const metadata: Metadata = { title: "Takımlar" };

export default async function TakimlarPage() {
  const [teams, athletes] = await Promise.all([
    prisma.team.findMany({ orderBy: { sort: "asc" }, include: { _count: { select: { athletes: true } } } }),
    prisma.athlete.findMany({ include: { team: true }, orderBy: { name: "asc" } }),
  ]);

  const teamRows: TeamRow[] = teams.map((t) => ({ id: t.id, name: t.name, short: t.short, coach: t.coach, born: t.born, coverImage: t.coverImage, sort: t.sort, isMain: t.isMain, athleteCount: t._count.athletes }));
  const athleteRows: AthleteLite[] = athletes.map((a) => ({ id: a.id, name: a.name, teamId: a.teamId, teamName: a.team.name, number: a.number, position: a.position }));

  return <TakimlarView teams={teamRows} athletes={athleteRows} />;
}
