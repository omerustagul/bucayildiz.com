"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { resolvePitchName } from "@/lib/facilities";
import { attendanceSaveSchema, TRAINING_STATUSES } from "@/lib/validation";

function revalidate() {
  revalidatePath("/admin/antrenmanlar");
  revalidatePath("/admin/takvim-programi");
}

export async function setTrainingStatus(id: string, status: string): Promise<{ error?: string } | void> {
  await requirePermission("antrenmanlar.manage");
  const parsed = z.enum(TRAINING_STATUSES).safeParse(status);
  if (!parsed.success) return { error: "Geçersiz durum." };
  await prisma.training.update({ where: { id }, data: { status: parsed.data } }).catch(() => {});
  revalidate();
}

// Saha ARTIK burada değil — kendi anında-kaydet action'ında (setTrainingPitch).
// Böylece bu buton sahayı yanlışlıkla silmez/değiştirmez.
const basicsSchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
  time: z.string().trim().max(5).optional().or(z.literal("")),
  duration: z.number().int().min(0).max(300).nullable().optional(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function updateTrainingBasics(id: string, input: unknown): Promise<{ error?: string } | void> {
  await requirePermission("antrenmanlar.manage");
  const parsed = basicsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  await prisma.training
    .update({ where: { id }, data: { date: d.date, time: d.time || "", duration: d.duration ?? null, notes: d.notes || "" } })
    .catch(() => {});
  revalidate();
}

/** Sahayı tek adımda güncelle (dropdown seçilince anında — durum butonları gibi).
 *  Oluşturma/düzenleme ile AYNI doğrulama: geçersiz/silinmiş/isPitch-olmayan id reddedilir. */
export async function setTrainingPitch(id: string, pitchId: string): Promise<{ error?: string } | void> {
  await requirePermission("antrenmanlar.manage");
  const pitchName = await resolvePitchName(pitchId || "");
  if (pitchName === null) return { error: "Geçersiz saha seçimi." };
  await prisma.training.update({ where: { id }, data: { pitch: pitchName } }).catch(() => {});
  revalidate();
}

export async function toggleDrill(drillId: string, done: boolean): Promise<void> {
  await requirePermission("antrenmanlar.manage");
  await prisma.trainingDrill.update({ where: { id: drillId }, data: { done } }).catch(() => {});
  revalidate();
}

export async function addDrill(trainingId: string, text: string): Promise<{ error?: string } | void> {
  await requirePermission("antrenmanlar.manage");
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
  await requirePermission("antrenmanlar.manage");
  await prisma.trainingDrill.delete({ where: { id: drillId } }).catch(() => {});
  revalidate();
}

export async function saveAttendance(input: unknown): Promise<{ error?: string } | void> {
  await requirePermission("antrenmanlar.manage");
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
