"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyAthletes } from "@/lib/notify";
import { errLabel } from "@/lib/log";

export type MeasurementResult = { ok: true } | { ok: false; error: string };

const num = z.number().finite().nullable().optional();
const measurementSchema = z.object({
  athleteId: z.string().min(1, "Sporcu seçiniz."),
  measuredAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir ölçüm tarihi giriniz."),
  yoyoLevel: z.enum(["IR1", "IR2"]).nullable().optional(),
  yoyoDistance: num,
  repeatedSprint: num,
  bodyFat: num,
  muscle: num,
  sprint10: num,
  sprint20: num,
  sprint30: num,
  verticalJump: num,
  standingLongJump: num,
  tTest: num,
  agility505: num,
  note: z.string().trim().max(300).optional().or(z.literal("")),
});

/** Yeni periyodik performans ölçümü ekler (geçmişi korur — upsert DEĞİL). */
export async function addMeasurement(input: unknown): Promise<MeasurementResult> {
  await requirePermission("performans.manage");
  const parsed = measurementSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;

  // Yo-Yo mesafesi girildiyse seviye zorunlu (VO2max hesabı için).
  if (d.yoyoDistance != null && !d.yoyoLevel) {
    return { ok: false, error: "Yo-Yo mesafesi için test seviyesi (IR1/IR2) seçiniz." };
  }

  try {
    await prisma.performanceMeasurement.create({
      data: {
        athleteId: d.athleteId,
        measuredAt: d.measuredAt,
        yoyoLevel: d.yoyoDistance != null ? (d.yoyoLevel ?? null) : null,
        yoyoDistance: d.yoyoDistance ?? null,
        repeatedSprint: d.repeatedSprint ?? null,
        bodyFat: d.bodyFat ?? null,
        muscle: d.muscle ?? null,
        sprint10: d.sprint10 ?? null,
        sprint20: d.sprint20 ?? null,
        sprint30: d.sprint30 ?? null,
        verticalJump: d.verticalJump ?? null,
        standingLongJump: d.standingLongJump ?? null,
        tTest: d.tTest ?? null,
        agility505: d.agility505 ?? null,
        note: d.note || null,
      },
    });
    revalidatePath("/admin/performans");
    revalidatePath("/panel/performans");
    revalidatePath("/panel");
    // Bildirim — KVKK: gövdeye ölçüm DEĞERİ yazma; yalnız "eklendi" bilgisi.
    try {
      await notifyAthletes([d.athleteId], { type: "measurement", title: "Yeni performans ölçümü", body: "Antrenörün yeni bir ölçüm ekledi.", url: "/panel/performans" });
    } catch (e) {
      console.error("[bildirim] ölçüm:", errLabel(e));
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Ölçüm kaydedilemedi." };
  }
}

/** Bir ölçüm kaydını siler (yanlış girilen kayıtlar için). */
export async function deleteMeasurement(id: string): Promise<MeasurementResult> {
  await requirePermission("performans.manage");
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
