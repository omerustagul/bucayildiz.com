import type { Perf } from "@/components/panel/PerformanceMatrix";

type DbMeasurement = {
  measuredAt: string;
  vo2: number | null;
  percentile: number | null;
  bodyFat: number | null;
  muscle: number | null;
  speed: number | null;
  endurance: number | null;
  power: number | null;
  technique: number | null;
  tactic: number | null;
  passing: number | null;
  sprint30: number | null;
  verticalJump: number | null;
  maxHr: number | null;
  trainingLoad: number | null;
};

/**
 * Periyodik ölçüm dizisinden panel matrisi prop'u üretir.
 * - Mevcut durum = en GÜNCEL tarihli ölçüm.
 * - vo2History = tüm ölçümlerin (tarihe göre artan) VO2 serisi → trend grafiği.
 */
export function measurementsToPerf(measurements: DbMeasurement[]): Perf | null {
  if (!measurements.length) return null;
  const sorted = [...measurements].sort((a, b) => a.measuredAt.localeCompare(b.measuredAt));
  const latest = sorted[sorted.length - 1];
  const vo2History = sorted.map((m) => m.vo2).filter((n): n is number => typeof n === "number");
  return {
    vo2: latest.vo2,
    vo2History,
    percentile: latest.percentile,
    bodyFat: latest.bodyFat,
    muscle: latest.muscle,
    speed: latest.speed,
    endurance: latest.endurance,
    power: latest.power,
    technique: latest.technique,
    tactic: latest.tactic,
    passing: latest.passing,
    sprint30: latest.sprint30,
    verticalJump: latest.verticalJump,
    maxHr: latest.maxHr,
    trainingLoad: latest.trainingLoad,
    measuredAt: latest.measuredAt,
  };
}
