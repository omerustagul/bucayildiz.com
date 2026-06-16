import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PerformanceMatrix } from "@/components/panel/PerformanceMatrix";
import { toPerf } from "@/lib/perf";

export const metadata: Metadata = { title: "Performans — Sporcu Paneli" };

export default async function PanelPerformans() {
  const session = await getSession();
  const perf = await prisma.performance.findUnique({ where: { athleteId: session!.athleteId! } });
  return <PerformanceMatrix perf={toPerf(perf)} />;
}
