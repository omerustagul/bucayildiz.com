"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { notifyAthletes } from "@/lib/notify";
import { errLabel } from "@/lib/log";
import { nutritionPlanSchema, nutritionMealSchema } from "@/lib/validation";

function revalidate() {
  revalidatePath("/admin/beslenme");
  revalidatePath("/panel/beslenme");
}

export async function createNutritionPlan(input: unknown): Promise<{ error?: string } | void> {
  await requirePermission("beslenme.manage");
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

  // Bildirim — plan BAŞLIĞI (admin etiketi, PII değil); makro/içerik ASLA yazılmaz.
  try {
    await notifyAthletes([d.athleteId], { type: "nutrition", title: "Yeni beslenme programı", body: d.title, url: "/panel/beslenme" });
  } catch (e) {
    console.error("[bildirim] beslenme:", errLabel(e));
  }
}

const basicsSchema = z.object({
  title: z.string().trim().min(1, "Başlık zorunlu.").max(120, "Başlık en fazla 120 karakter olabilir."),
  startDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
  endDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir bitiş tarihi giriniz.").optional().or(z.literal("")),
  notes: z.string().trim().max(500, "Not en fazla 500 karakter olabilir.").optional().or(z.literal("")),
});

export async function updatePlanBasics(id: string, input: unknown): Promise<{ error?: string } | void> {
  await requirePermission("beslenme.manage");
  const parsed = basicsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  await prisma.nutritionPlan
    .update({ where: { id }, data: { title: d.title, startDate: d.startDate, endDate: d.endDate || null, notes: d.notes || "" } })
    .catch(() => {});
  revalidate();
}

export async function setPlanActive(id: string, active: boolean): Promise<void> {
  await requirePermission("beslenme.manage");
  await prisma.nutritionPlan.update({ where: { id }, data: { active } }).catch(() => {});
  revalidate();
}

export async function deletePlan(id: string): Promise<void> {
  await requirePermission("beslenme.manage");
  await prisma.nutritionPlan.delete({ where: { id } }).catch(() => {});
  revalidate();
}

export async function addMeal(planId: string, input: unknown): Promise<{ error?: string } | void> {
  await requirePermission("beslenme.manage");
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
  await requirePermission("beslenme.manage");
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
  await requirePermission("beslenme.manage");
  await prisma.nutritionMeal.delete({ where: { id: mealId } }).catch(() => {});
  revalidate();
}
