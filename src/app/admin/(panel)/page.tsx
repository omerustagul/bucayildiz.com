import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardView } from "@/components/admin/views/DashboardView";

export const metadata: Metadata = { title: "Genel Bakış" };

export default async function DashboardPage() {
  const [athletes, teamsCount, trainings, injured, teams, upcomingFx, featuredAthletes] = await Promise.all([
    prisma.athlete.count(),
    prisma.team.count(),
    prisma.training.count(),
    prisma.athlete.count({ where: { status: "injured" } }),
    prisma.team.findMany({ orderBy: { sort: "asc" }, include: { _count: { select: { athletes: true } } } }),
    prisma.fixture.findMany({ where: { status: "upcoming" }, orderBy: { date: "asc" }, take: 3 }),
    prisma.athlete.findMany({ include: { team: true }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const maxCount = Math.max(0, ...teams.map((t) => t._count.athletes));
  const bars = teams.map((t) => ({ name: t.name, count: t._count.athletes, highlight: t._count.athletes === maxCount && maxCount > 0 }));

  const upcoming = upcomingFx.map((f) => ({
    id: f.id,
    day: f.date.slice(8),
    competition: f.competition,
    time: f.time,
    home: f.isHome ? "Buca Yıldız" : f.opponent,
    away: f.isHome ? f.opponent : "Buca Yıldız",
  }));

  const featured = featuredAthletes.map((a) => ({
    id: a.id,
    name: a.name,
    number: a.number,
    position: a.position,
    teamName: a.team.name,
    status: a.status,
    photoUrl: a.photoUrl,
  }));

  const today = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <DashboardView
      stats={{ athletes, teams: teamsCount, trainings, injured }}
      bars={bars}
      upcoming={upcoming}
      featured={featured}
      today={today}
    />
  );
}
