import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasHealthConsent } from "@/lib/consent.server";
import { NutritionPanelView, type PanelPlan, type PanelMealLog } from "@/components/panel/NutritionPanelView";

export const metadata: Metadata = { title: "Beslenme — Sporcu Paneli" };

/** "YYYY-MM-DD" bugünün yerel tarihi. */
function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "YYYY-MM-DD" değerini n gün geriye kaydırır. */
function daysAgo(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - n);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

export default async function PanelBeslenme() {
  const session = await getSession();
  const athleteId = session!.athleteId!;

  const todayYmd = todayStr();
  const windowStart = daysAgo(todayYmd, 30);

  const [rawPlans, rawLogs, hasConsent] = await Promise.all([
    prisma.nutritionPlan.findMany({
      where: { athleteId, active: true },
      include: { meals: { orderBy: { sort: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.mealLog.findMany({
      where: { athleteId, date: { gte: windowStart } },
      orderBy: { date: "desc" },
    }),
    hasHealthConsent(athleteId),
  ]);

  const plans: PanelPlan[] = rawPlans.map((p) => ({
    id: p.id,
    title: p.title,
    startDate: p.startDate,
    endDate: p.endDate,
    notes: p.notes,
    meals: p.meals.map((m) => ({
      id: m.id,
      name: m.name,
      time: m.time,
      content: m.content,
      kcal: m.kcal,
      protein: m.protein,
      carbs: m.carbs,
      fat: m.fat,
    })),
  }));

  const logs: PanelMealLog[] = rawLogs.map((l) => ({
    id: l.id,
    mealId: l.mealId,
    date: l.date,
    photoUrl: l.photoUrl,
    note: l.note,
    kcal: l.kcal,
    protein: l.protein,
    carbs: l.carbs,
    fat: l.fat,
  }));

  return <NutritionPanelView plans={plans} logs={logs} hasConsent={hasConsent} todayYmd={todayYmd} />;
}
