import type { Perf } from "@/components/panel/PerformanceMatrix";

type DbPerf = {
  vo2: number | null;
  vo2History: string;
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
  measuredAt: string | null;
};

/** Performance DB kaydını panel matrisi prop'una çevirir (vo2History JSON parse). */
export function toPerf(p: DbPerf | null): Perf | null {
  if (!p) return null;
  let history: number[] = [];
  try {
    const arr = JSON.parse(p.vo2History);
    if (Array.isArray(arr)) history = arr.filter((n): n is number => typeof n === "number");
  } catch {
    history = [];
  }
  return {
    vo2: p.vo2,
    vo2History: history,
    percentile: p.percentile,
    bodyFat: p.bodyFat,
    muscle: p.muscle,
    speed: p.speed,
    endurance: p.endurance,
    power: p.power,
    technique: p.technique,
    tactic: p.tactic,
    passing: p.passing,
    sprint30: p.sprint30,
    verticalJump: p.verticalJump,
    maxHr: p.maxHr,
    trainingLoad: p.trainingLoad,
    measuredAt: p.measuredAt,
  };
}
