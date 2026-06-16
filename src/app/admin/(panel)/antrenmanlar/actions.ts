"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TRAINING_TYPES } from "@/lib/enums";

const schema = z.object({
  teamId: z.string().min(1, "Takım seçiniz."),
  type: z.enum(TRAINING_TYPES).default("Saha"),
  date: z.string().trim().min(1, "Tarih zorunlu."),
  time: z.string().trim().max(5).optional().or(z.literal("")),
  duration: z.number().int().min(0).max(300).nullable().optional(),
  pitch: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type TrainingResult = { error: string };

async function requireAuth() {
  const s = await getSession();
  if (!s) redirect("/admin/giris");
}

function toData(d: z.infer<typeof schema>) {
  return {
    teamId: d.teamId,
    type: d.type,
    date: d.date,
    time: d.time || "",
    duration: d.duration ?? null,
    pitch: d.pitch || "",
    notes: d.notes || "",
  };
}

export async function createTraining(input: unknown): Promise<TrainingResult | void> {
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.training.create({ data: toData(parsed.data) });
  } catch {
    return { error: "Kaydedilemedi. Takım seçimini kontrol edin." };
  }
  revalidatePath("/admin/antrenmanlar");
}

export async function updateTraining(id: string, input: unknown): Promise<TrainingResult | void> {
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  await prisma.training.update({ where: { id }, data: toData(parsed.data) });
  revalidatePath("/admin/antrenmanlar");
}

export async function deleteTraining(id: string): Promise<void> {
  await requireAuth();
  await prisma.training.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/antrenmanlar");
}
