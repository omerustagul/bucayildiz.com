import type { Metadata } from "next";
import { requireAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PerformanceMatrix } from "@/components/panel/PerformanceMatrix";
import { measurementsToPerf } from "@/lib/perf";

export const metadata: Metadata = { title: "Performans — Sporcu Paneli" };

export default async function PanelPerformans() {
  const session = await requireAthlete();
  const measurements = await prisma.performanceMeasurement.findMany({
    where: { athleteId: session.athleteId! },
    orderBy: { measuredAt: "asc" },
  });
  return <PerformanceMatrix perf={measurementsToPerf(measurements)} />;
}
