"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { nutritionPlanSchema, nutritionMealSchema } from "@/lib/validation";

function revalidate() {
  revalidatePath("/admin/beslenme");
  revalidatePath("/panel/beslenme");
}

export async function createNutritionPlan(input: unknown): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = nutritionPlanSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  try {
    await prisma.nutritionPlan.create({
      data: {
        athleteId: d.athleteId,
        title: d.title,
        startDate: d.startDate,
        endDate: d.endDate || null,
        notes: d.notes || "",
        meals: {
          create: d.meals.map((m, index) => ({
            name: m.name,
            time: m.time || "",
            content: m.content || "",
            kcal: m.kcal ?? null,
            protein: m.protein ?? null,
            carbs: m.carbs ?? null,
            fat: m.fat ?? null,
            sort: index,
          })),
        },
      },
    });
  } catch {
    return { error: "Kaydedilemedi. Sporcu seçimini kontrol edin." };
  }
  revalidate();
}

const basicsSchema = z.object({
  title: z.string().trim().min(1, "Başlık zorunlu.").max(120),
  startDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
  endDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function updatePlanBasics(id: string, input: unknown): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = basicsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  await prisma.nutritionPlan
    .update({ where: { id }, data: { title: d.title, startDate: d.startDate, endDate: d.endDate || null, notes: d.notes || "" } })
    .catch(() => {});
  revalidate();
}

export async function setPlanActive(id: string, active: boolean): Promise<void> {
  await requireAdmin();
  await prisma.nutritionPlan.update({ where: { id }, data: { active } }).catch(() => {});
  revalidate();
}

export async function deletePlan(id: string): Promise<void> {
  await requireAdmin();
  await prisma.nutritionPlan.delete({ where: { id } }).catch(() => {});
  revalidate();
}

export async function addMeal(planId: string, input: unknown): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = nutritionMealSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  const count = await prisma.nutritionMeal.count({ where: { planId } });
  try {
    await prisma.nutritionMeal.create({
      data: {
        planId,
        name: d.name,
        time: d.time || "",
        content: d.content || "",
        kcal: d.kcal ?? null,
        protein: d.protein ?? null,
        carbs: d.carbs ?? null,
        fat: d.fat ?? null,
        sort: count,
      },
    });
  } catch {
    return { error: "Öğün eklenemedi." };
  }
  revalidate();
}

export async function updateMeal(mealId: string, input: unknown): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = nutritionMealSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  await prisma.nutritionMeal
    .update({
      where: { id: mealId },
      data: {
        name: d.name,
        time: d.time || "",
        content: d.content || "",
        kcal: d.kcal ?? null,
        protein: d.protein ?? null,
        carbs: d.carbs ?? null,
        fat: d.fat ?? null,
      },
    })
    .catch(() => {});
  revalidate();
}

export async function removeMeal(mealId: string): Promise<void> {
  await requireAdmin();
  await prisma.nutritionMeal.delete({ where: { id: mealId } }).catch(() => {});
  revalidate();
}
