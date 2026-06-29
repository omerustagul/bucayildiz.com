import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ViewHeader } from "@/components/admin/ui";
import { MeasurementManager, type MeasurementRow } from "@/components/admin/MeasurementManager";

export const metadata: Metadata = { title: "Performans Ölçümleri" };

export default async function PerformansPage({ searchParams }: { searchParams: Promise<{ athlete?: string }> }) {
  const { athlete: selectedId } = await searchParams;

  const athletes = await prisma.athlete.findMany({
    orderBy: [{ team: { sort: "asc" } }, { name: "asc" }],
    select: { id: true, name: true, team: { select: { name: true } } },
  });

  const measurements = selectedId
    ? await prisma.performanceMeasurement.findMany({ where: { athleteId: selectedId }, orderBy: { measuredAt: "desc" } })
    : [];

  const athleteOpts = athletes.map((a) => ({ id: a.id, name: a.name, teamName: a.team.name }));
  const rows: MeasurementRow[] = measurements.map((m) => ({
    id: m.id, measuredAt: m.measuredAt, vo2: m.vo2, percentile: m.percentile, bodyFat: m.bodyFat, muscle: m.muscle,
    speed: m.speed, endurance: m.endurance, power: m.power, technique: m.technique, tactic: m.tactic, passing: m.passing,
    sprint30: m.sprint30, verticalJump: m.verticalJump, maxHr: m.maxHr, trainingLoad: m.trainingLoad, note: m.note,
  }));

  return (
    <>
      <ViewHeader title="Performans Ölçümleri" subtitle="Sporcuların periyodik ölçümlerini girin; geçmiş kayıtlar raporlama için korunur" />
      <MeasurementManager athletes={athleteOpts} selectedId={selectedId ?? null} measurements={rows} />
    </>
  );
}
