import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { NutritionAdminView } from "@/components/admin/views/NutritionAdminView";

export const metadata: Metadata = { title: "Beslenme" };

export default async function BeslenmePage() {
  const now = new Date();
  const todayYmd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 30);
  const windowStartYmd = `${windowStart.getFullYear()}-${String(windowStart.getMonth() + 1).padStart(2, "0")}-${String(windowStart.getDate()).padStart(2, "0")}`;

  const [teams, athletes, plans, mealLogs] = await Promise.all([
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
    prisma.athlete.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, teamId: true } }),
    prisma.nutritionPlan.findMany({
      orderBy: { createdAt: "desc" },
      include: { meals: { orderBy: { sort: "asc" } } },
    }),
    prisma.mealLog.findMany({
      where: { date: { gte: windowStartYmd } },
      select: { id: true, mealId: true, athleteId: true, date: true, photoUrl: true, note: true, kcal: true, protein: true, carbs: true, fat: true },
    }),
  ]);

  return (
    <NutritionAdminView
      teams={teams}
      athletes={athletes}
      plans={plans.map((p) => ({
        id: p.id,
        athleteId: p.athleteId,
        title: p.title,
        startDate: p.startDate,
        endDate: p.endDate,
        notes: p.notes,
        active: p.active,
        meals: p.meals.map((m) => ({
          id: m.id,
          name: m.name,
          time: m.time,
          content: m.content,
          kcal: m.kcal,
          protein: m.protein,
          carbs: m.carbs,
          fat: m.fat,
          sort: m.sort,
        })),
      }))}
      mealLogs={mealLogs}
      todayYmd={todayYmd}
    />
  );
}
