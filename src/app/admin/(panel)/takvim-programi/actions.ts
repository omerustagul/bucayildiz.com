"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { trainingCreateSchema } from "@/lib/validation";

export type TrainingResult = { error: string };

function revalidate() {
  revalidatePath("/admin/takvim-programi");
  revalidatePath("/admin/antrenmanlar");
}

export async function createTraining(input: unknown): Promise<TrainingResult | void> {
  await requireAdmin();
  const parsed = trainingCreateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  try {
    await prisma.training.create({
      data: {
        teamId: d.teamId,
        scope: d.scope,
        date: d.date,
        time: d.time || "",
        duration: d.duration ?? null,
        pitch: d.pitch || "",
        notes: d.notes || "",
        drills: d.drills.length ? { create: d.drills.map((text, i) => ({ text, sort: i })) } : undefined,
        attendance: d.scope === "individual" ? { create: d.athleteIds.map((athleteId) => ({ athleteId })) } : undefined,
      },
    });
  } catch {
    return { error: "Kaydedilemedi. Takım ve sporcu seçimini kontrol edin." };
  }
  revalidate();
}

export async function deleteTraining(id: string): Promise<void> {
  await requireAdmin();
  await prisma.training.delete({ where: { id } }).catch(() => {});
  revalidate();
}
