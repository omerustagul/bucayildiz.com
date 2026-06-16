import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AthletesView, type AthleteRow } from "@/components/admin/views/AthletesView";

export const metadata: Metadata = { title: "Sporcular" };

type DbPerf = {
  vo2: number | null; vo2History: string; percentile: number | null; bodyFat: number | null; muscle: number | null;
  speed: number | null; endurance: number | null; power: number | null; technique: number | null; tactic: number | null; passing: number | null;
  sprint30: number | null; verticalJump: number | null; maxHr: number | null; trainingLoad: number | null; measuredAt: string | null;
};

function perfToForm(p: DbPerf | null) {
  if (!p) return null;
  const s = (n: number | null) => (n == null ? "" : String(n));
  let hist = "";
  try {
    const arr = JSON.parse(p.vo2History);
    if (Array.isArray(arr)) hist = arr.join(", ");
  } catch {
    hist = "";
  }
  return {
    vo2: s(p.vo2), vo2History: hist, percentile: s(p.percentile), bodyFat: s(p.bodyFat), muscle: s(p.muscle),
    speed: s(p.speed), endurance: s(p.endurance), power: s(p.power), technique: s(p.technique), tactic: s(p.tactic), passing: s(p.passing),
    sprint30: s(p.sprint30), verticalJump: s(p.verticalJump), maxHr: s(p.maxHr), trainingLoad: s(p.trainingLoad), measuredAt: p.measuredAt ?? "",
  };
}

export default async function SporcularPage() {
  const [athletes, teams] = await Promise.all([
    prisma.athlete.findMany({ include: { team: true, user: true, performance: true }, orderBy: [{ team: { sort: "asc" } }, { name: "asc" }] }),
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
    perf: perfToForm(a.performance),
  }));

  return <AthletesView athletes={rows} teams={teams} />;
}
