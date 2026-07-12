"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { resolvePitchName } from "@/lib/facilities";
import { notifyAthletes, notifyTeam } from "@/lib/notify";
import { errLabel } from "@/lib/log";
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

  // Saha: seçildiyse gerçek + isPitch=true Facility olmalı (düzenleme ile ORTAK helper).
  // Serbest metin değil — geçersiz/silinmiş/isPitch-olmayan id reddedilir; adı kaydedilir.
  const pitchName = await resolvePitchName(d.pitch || "");
  if (pitchName === null) return { error: "Geçersiz saha seçimi. Lütfen listeden bir saha seçin." };

  try {
    await prisma.training.create({
      data: {
        teamId: d.teamId,
        scope: d.scope,
        date: d.date,
        time: d.time || "",
        duration: d.duration ?? null,
        pitch: pitchName,
        notes: d.notes || "",
        drills: d.drills.length ? { create: d.drills.map((text, i) => ({ text, sort: i })) } : undefined,
        attendance: d.scope === "individual" ? { create: d.athleteIds.map((athleteId) => ({ athleteId })) } : undefined,
      },
    });
  } catch {
    return { error: "Kaydedilemedi. Takım ve sporcu seçimini kontrol edin." };
  }
  revalidate();

  // Bildirim (feed + push) — best-effort, olayı bloklamaz.
  try {
    const when = `${d.date}${d.time ? ` · ${d.time}` : ""}`;
    if (d.scope === "individual") {
      await notifyAthletes(d.athleteIds, { type: "training", title: "Yeni bireysel antrenman", body: when, url: "/panel/antrenmanlar" });
    } else {
      await notifyTeam(d.teamId, { type: "training", title: "Yeni takım antrenmanı", body: when, url: "/panel/antrenmanlar" });
    }
  } catch (e) {
    console.error("[bildirim] antrenman:", errLabel(e));
  }
}

export async function deleteTraining(id: string): Promise<void> {
  await requireAdmin();
  await prisma.training.delete({ where: { id } }).catch(() => {});
  revalidate();
}
