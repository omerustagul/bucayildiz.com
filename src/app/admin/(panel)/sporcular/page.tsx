import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AthletesView, type AthleteRow } from "@/components/admin/views/AthletesView";

export const metadata: Metadata = { title: "Sporcular" };

export default async function SporcularPage() {
  const [athletes, teams] = await Promise.all([
    prisma.athlete.findMany({ include: { team: true, user: true }, orderBy: [{ team: { sort: "asc" } }, { name: "asc" }] }),
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
  ]);

  const rows: AthleteRow[] = athletes.map((a) => ({
    id: a.id,
    name: a.name,
    teamId: a.teamId,
    teamName: a.team.name,
    position: a.position,
    number: a.number,
    height: a.height,
    weight: a.weight,
    birthYear: a.birthYear,
    foot: a.foot,
    status: a.status,
    licenseNo: a.licenseNo,
    photoUrl: a.photoUrl,
    parentPhone: a.parentPhone,
    hasLogin: !!a.user,
    username: a.user?.username ?? null,
  }));

  return <AthletesView athletes={rows} teams={teams} />;
}
