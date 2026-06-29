"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type MeasurementResult = { ok: true } | { ok: false; error: string };

const num = z.number().finite().nullable().optional();
const measurementSchema = z.object({
  athleteId: z.string().min(1, "Sporcu seçiniz."),
  measuredAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir ölçüm tarihi giriniz."),
  vo2: num,
  percentile: num,
  bodyFat: num,
  muscle: num,
  speed: num,
  endurance: num,
  power: num,
  technique: num,
  tactic: num,
  passing: num,
  sprint30: num,
  verticalJump: num,
  maxHr: num,
  trainingLoad: num,
  note: z.string().trim().max(300).optional().or(z.literal("")),
});

const int = (v: number | null | undefined) => (v == null ? null : Math.round(v));

/** Yeni periyodik performans ölçümü ekler (geçmişi korur — upsert DEĞİL). */
export async function addMeasurement(input: unknown): Promise<MeasurementResult> {
  await requireAdmin();
  const parsed = measurementSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;

  try {
    await prisma.performanceMeasurement.create({
      data: {
        athleteId: d.athleteId,
        measuredAt: d.measuredAt,
        vo2: d.vo2 ?? null,
        percentile: int(d.percentile),
        bodyFat: d.bodyFat ?? null,
        muscle: d.muscle ?? null,
        speed: int(d.speed),
        endurance: int(d.endurance),
        power: int(d.power),
        technique: int(d.technique),
        tactic: int(d.tactic),
        passing: int(d.passing),
        sprint30: d.sprint30 ?? null,
        verticalJump: int(d.verticalJump),
        maxHr: int(d.maxHr),
        trainingLoad: int(d.trainingLoad),
        note: d.note || null,
      },
    });
    revalidatePath("/admin/performans");
    revalidatePath("/panel/performans");
    revalidatePath("/panel");
    return { ok: true };
  } catch {
    return { ok: false, error: "Ölçüm kaydedilemedi." };
  }
}

/** Bir ölçüm kaydını siler (yanlış girilen kayıtlar için). */
export async function deleteMeasurement(id: string): Promise<MeasurementResult> {
  await requireAdmin();
  try {
    await prisma.performanceMeasurement.delete({ where: { id } });
    revalidatePath("/admin/performans");
    revalidatePath("/panel/performans");
    revalidatePath("/panel");
    return { ok: true };
  } catch {
    return { ok: false, error: "Silinemedi." };
  }
}
