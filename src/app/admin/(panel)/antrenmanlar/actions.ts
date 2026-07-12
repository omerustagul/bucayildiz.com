"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { resolvePitchName } from "@/lib/facilities";
import { attendanceSaveSchema, TRAINING_STATUSES } from "@/lib/validation";

function revalidate() {
  revalidatePath("/admin/antrenmanlar");
  revalidatePath("/admin/takvim-programi");
}

export async function setTrainingStatus(id: string, status: string): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = z.enum(TRAINING_STATUSES).safeParse(status);
  if (!parsed.success) return { error: "Geçersiz durum." };
  await prisma.training.update({ where: { id }, data: { status: parsed.data } }).catch(() => {});
  revalidate();
}

const basicsSchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
  time: z.string().trim().max(5).optional().or(z.literal("")),
  duration: z.number().int().min(0).max(300).nullable().optional(),
  pitch: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function updateTrainingBasics(id: string, input: unknown): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = basicsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;

  // Saha: oluşturma ile AYNI doğrulama (ortak helper) — serbest metin deliği kapalı.
  // Geçersiz/silinmiş/isPitch-olmayan id reddedilir; doğrulanan Facility'nin adı kaydedilir.
  const pitchName = await resolvePitchName(d.pitch || "");
  if (pitchName === null) return { error: "Geçersiz saha seçimi. Lütfen listeden bir saha seçin." };

  await prisma.training
    .update({ where: { id }, data: { date: d.date, time: d.time || "", duration: d.duration ?? null, pitch: pitchName, notes: d.notes || "" } })
    .catch(() => {});
  revalidate();
}

export async function toggleDrill(drillId: string, done: boolean): Promise<void> {
  await requireAdmin();
  await prisma.trainingDrill.update({ where: { id: drillId }, data: { done } }).catch(() => {});
  revalidate();
}

export async function addDrill(trainingId: string, text: string): Promise<{ error?: string } | void> {
  await requireAdmin();
  const t = text.trim();
  if (!t || t.length > 200) return { error: "Geçerli bir madde giriniz (en fazla 200 karakter)." };
  const count = await prisma.trainingDrill.count({ where: { trainingId } });
  try {
    await prisma.trainingDrill.create({ data: { trainingId, text: t, sort: count } });
  } catch {
    return { error: "Madde eklenemedi." };
  }
  revalidate();
}

export async function removeDrill(drillId: string): Promise<void> {
  await requireAdmin();
  await prisma.trainingDrill.delete({ where: { id: drillId } }).catch(() => {});
  revalidate();
}

export async function saveAttendance(input: unknown): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = attendanceSaveSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const { trainingId, rows } = parsed.data;
  try {
    await prisma.$transaction(
      rows.map((r) =>
        prisma.trainingAttendance.upsert({
          where: { trainingId_athleteId: { trainingId, athleteId: r.athleteId } },
          create: { trainingId, athleteId: r.athleteId, status: r.status, note: r.note || "" },
          update: { status: r.status, note: r.note || "" },
        }),
      ),
    );
  } catch {
    return { error: "Yoklama kaydedilemedi." };
  }
  revalidate();
}
