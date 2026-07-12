"use server";

import { revalidatePath } from "next/cache";
import { requireAthlete } from "@/lib/auth";
import { hasHealthConsent } from "@/lib/consent.server";
import { mealLogSchema, idSchema } from "@/lib/validation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isOwnStorageUrl } from "@/lib/storage";

function revalidate() {
  revalidatePath("/panel/beslenme");
  revalidatePath("/admin/beslenme");
}

/** "YYYY-MM-DD" bugünün yerel tarihi. */
function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "YYYY-MM-DD" değerini gün-hassasiyetli karşılaştırmak için UTC epoch gün sayısına çevirir. */
function dayIndex(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

/** Girilen tarih bugün-14 gün ile bugün+1 gün penceresinde mi? */
function isWithinLogWindow(dateStr: string): boolean {
  const today = dayIndex(todayStr());
  const target = dayIndex(dateStr);
  return target >= today - 14 && target <= today + 1;
}

export async function saveMealLog(input: unknown): Promise<{ error?: string } | void> {
  const s = await requireAthlete();
  const parsed = mealLogSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  // Fotoğraf yalnız kendi depolama alanımızdan olabilir (harici pixel deliği kapalı).
  if (d.photoUrl && !isOwnStorageUrl(d.photoUrl)) return { error: "Geçersiz fotoğraf adresi." };

  const meal = await prisma.nutritionMeal.findUnique({
    where: { id: d.mealId },
    include: { plan: true },
  });
  if (!meal || meal.plan.athleteId !== s.athleteId || !meal.plan.active) {
    return { error: "Bu öğün size ait aktif bir programda değil." };
  }

  if (!(await hasHealthConsent(s.athleteId!))) {
    return { error: "Öğün günlüğü için sağlık verisi onayı gerekli. Onaylar sayfasından izin verebilirsiniz." };
  }

  if (!isWithinLogWindow(d.date)) {
    return { error: "Günlük yalnız son 14 gün için girilebilir." };
  }

  try {
    await prisma.mealLog.upsert({
      where: { mealId_athleteId_date: { mealId: d.mealId, athleteId: s.athleteId!, date: d.date } },
      create: {
        mealId: d.mealId,
        athleteId: s.athleteId!,
        date: d.date,
        photoUrl: d.photoUrl || null,
        note: d.note || "",
        kcal: d.kcal ?? null,
        protein: d.protein ?? null,
        carbs: d.carbs ?? null,
        fat: d.fat ?? null,
      },
      update: {
        photoUrl: d.photoUrl || null,
        note: d.note || "",
        kcal: d.kcal ?? null,
        protein: d.protein ?? null,
        carbs: d.carbs ?? null,
        fat: d.fat ?? null,
      },
    });
  } catch {
    return { error: "Kaydedilemedi." };
  }

  revalidate();
}

const deleteMealLogSchema = z.object({
  mealId: idSchema,
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçersiz tarih."),
});

export async function deleteMealLog(mealId: unknown, date: unknown): Promise<void> {
  const s = await requireAthlete();
  const parsed = deleteMealLogSchema.safeParse({ mealId, date });
  if (!parsed.success) return;
  // Sahiplik: athleteId session'dan — başkasının kaydına dokunulamaz.
  await prisma.mealLog
    .deleteMany({ where: { mealId: parsed.data.mealId, date: parsed.data.date, athleteId: s.athleteId! } })
    .catch(() => {});
  revalidate();
}
