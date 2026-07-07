import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ViewHeader } from "@/components/admin/ui";
import { Toolbar } from "@/components/admin/kit";
import { PerformanceMatrix } from "@/components/panel/PerformanceMatrix";
import { measurementsToPerf } from "@/lib/perf";
import { AthletePickerTrigger, NewMeasurementButton, MeasurementHistory, type MeasurementRow } from "@/components/admin/MeasurementManager";
import { PerformanceOverview } from "@/components/admin/PerformanceOverview";

export const metadata: Metadata = { title: "Performans Ölçümleri" };

export default async function PerformansPage({ searchParams }: { searchParams: Promise<{ athlete?: string }> }) {
  const { athlete: selectedId } = await searchParams;

  const [teams, athletes] = await Promise.all([
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
    prisma.athlete.findMany({
      orderBy: [{ team: { sort: "asc" } }, { name: "asc" }],
      select: { id: true, name: true, teamId: true, team: { select: { name: true } } },
    }),
  ]);
  const athleteOpts = athletes.map((a) => ({ id: a.id, name: a.name, teamId: a.teamId, teamName: a.team.name }));

  // ---- Sporcu seçili: matris + "Yeni Ölçüm Gir" + geçmiş ----
  if (selectedId) {
    const [athlete, measurements] = await Promise.all([
      prisma.athlete.findUnique({ where: { id: selectedId }, select: { name: true, team: { select: { name: true } } } }),
      prisma.performanceMeasurement.findMany({ where: { athleteId: selectedId }, orderBy: { measuredAt: "desc" } }),
    ]);
    const rows: MeasurementRow[] = measurements.map((m) => ({
      id: m.id, measuredAt: m.measuredAt,
      yoyoLevel: m.yoyoLevel, yoyoDistance: m.yoyoDistance, repeatedSprint: m.repeatedSprint,
      bodyFat: m.bodyFat, muscle: m.muscle,
      sprint10: m.sprint10, sprint20: m.sprint20, sprint30: m.sprint30,
      verticalJump: m.verticalJump, standingLongJump: m.standingLongJump,
      tTest: m.tTest, agility505: m.agility505, note: m.note,
    }));
    const perf = measurementsToPerf(measurements);

    return (
      <>
        <ViewHeader
          title="Performans Ölçümleri"
          subtitle={athlete ? `${athlete.name} · ${athlete.team.name}` : "Sporcu performans matrisi"}
          action={<NewMeasurementButton athleteId={selectedId} />}
        />
        <Toolbar><AthletePickerTrigger teams={teams} athletes={athleteOpts} selectedId={selectedId} /></Toolbar>
        <PerformanceMatrix perf={perf} />
        <MeasurementHistory measurements={rows} />
      </>
    );
  }

  // ---- Sporcu seçilmedi: takım geneli rapor ----
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [grouped, totalRecords, thisMonthCount, recent] = await Promise.all([
    prisma.performanceMeasurement.groupBy({ by: ["athleteId"], _max: { measuredAt: true } }),
    prisma.performanceMeasurement.count(),
    prisma.performanceMeasurement.count({ where: { measuredAt: { startsWith: ym } } }),
    prisma.performanceMeasurement.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, athleteId: true, measuredAt: true, note: true, athlete: { select: { name: true, team: { select: { name: true } } } } },
    }),
  ]);

  const lastBy = new Map(grouped.map((g) => [g.athleteId, g._max.measuredAt]));
  const pending = athleteOpts
    .map((a) => ({ id: a.id, name: a.name, teamName: a.teamName, lastDate: lastBy.get(a.id) ?? null }))
    .sort((a, b) => {
      if (a.lastDate === b.lastDate) return a.name.localeCompare(b.name);
      if (a.lastDate === null) return -1;
      if (b.lastDate === null) return 1;
      return a.lastDate.localeCompare(b.lastDate);
    })
    .slice(0, 8);
  const recentMapped = recent.map((r) => ({
    id: r.id, athleteId: r.athleteId, athleteName: r.athlete.name, teamName: r.athlete.team.name, measuredAt: r.measuredAt, note: r.note,
  }));

  return (
    <>
      <ViewHeader title="Performans Ölçümleri" subtitle="Takım geneli ölçüm durumu — detay için bir sporcu seçin" />
      <Toolbar><AthletePickerTrigger teams={teams} athletes={athleteOpts} selectedId={null} /></Toolbar>
      <PerformanceOverview
        athletesTotal={athleteOpts.length}
        measuredCount={grouped.length}
        thisMonthCount={thisMonthCount}
        totalRecords={totalRecords}
        pending={pending}
        recent={recentMapped}
      />
    </>
  );
}
