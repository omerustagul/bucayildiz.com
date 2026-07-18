"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { resolvePitchName } from "@/lib/facilities";
import { notifyAthletes, notifyTeam } from "@/lib/notify";
import { errLabel } from "@/lib/log";
import { trainingCreateSchema, trainingSeriesSchema } from "@/lib/validation";
import { expandWeekdays, MAX_SERIES_TRAININGS } from "@/lib/schedule";

export type TrainingResult = { error: string };
/** `capped`: aralık üst sınırdan fazla tarih üretiyordu, liste kırpıldı (SESSİZ kırpma
 *  yapmayız — kullanıcıya söylenir ki kalan haftalar için seriyi tekrar kursun). */
export type SeriesResult =
  | { ok: true; created: number; skipped: string[]; capped: boolean }
  | { ok: false; error: string };

function revalidate() {
  revalidatePath("/admin/takvim-programi");
  revalidatePath("/admin/antrenmanlar");
}

export async function createTraining(input: unknown): Promise<TrainingResult | void> {
  await requirePermission("takvim.manage");
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

  // Bildirim (feed + push) — best-effort, olayı bloklamaz. Kullanıcı anahtarı kapattıysa GÖNDERİLMEZ.
  if (!d.notify) return;
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

/**
 * TEKRARLI antrenman serisi (Faz 4.1) — bir tarih aralığında seçilen hafta günlerine
 * antrenman üretir. Tek tek girme zorunluluğunu kaldırır.
 *
 * ÇAKIŞMA: aynı takım + tarih + saat zaten varsa o tarih ATLANIR (silinmez/üzerine
 * yazılmaz) → aynı seriyi iki kez çalıştırmak MÜKERRER üretmez; toplu oluşturmada en
 * olası hata budur. Atlananlar çağırana raporlanır.
 *
 * BİLDİRİM: seri için TEK ÖZET bildirim gönderilir — her antrenman için ayrı bildirim
 * velilere spam olurdu. KVKK: gövdede yalnız tarih/saat, sağlık/performans verisi YOK.
 */
export async function createTrainingSeries(input: unknown): Promise<SeriesResult> {
  await requirePermission("takvim.manage");
  const parsed = trainingSeriesSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;

  const pitchName = await resolvePitchName(d.pitch || "");
  if (pitchName === null) return { ok: false, error: "Geçersiz saha seçimi. Lütfen listeden bir saha seçin." };

  const dates = expandWeekdays(d.startDate, d.endDate, d.weekdays);
  if (dates.length === 0) return { ok: false, error: "Seçilen aralıkta uygun gün bulunamadı." };
  const capped = dates.length >= MAX_SERIES_TRAININGS;

  const time = d.time || "";
  const existing = await prisma.training.findMany({
    where: { teamId: d.teamId, date: { in: dates }, time },
    select: { date: true },
  });
  const taken = new Set(existing.map((e) => e.date));
  const toCreate = dates.filter((x) => !taken.has(x));
  if (toCreate.length === 0) return { ok: true, created: 0, skipped: [...taken], capped };

  try {
    await prisma.$transaction(
      toCreate.map((date) =>
        prisma.training.create({
          data: {
            teamId: d.teamId,
            scope: d.scope,
            date,
            time,
            duration: d.duration ?? null,
            pitch: pitchName,
            notes: d.notes || "",
            drills: d.drills.length ? { create: d.drills.map((text, i) => ({ text, sort: i })) } : undefined,
            attendance: d.scope === "individual" ? { create: d.athleteIds.map((athleteId) => ({ athleteId })) } : undefined,
          },
        }),
      ),
    );
  } catch {
    return { ok: false, error: "Seri kaydedilemedi. Takım ve sporcu seçimini kontrol edin." };
  }
  revalidate();

  if (!d.notify) return { ok: true, created: toCreate.length, skipped: [...taken], capped };
  try {
    const fmt = (s: string) => s.split("-").reverse().join(".");
    const body = `${toCreate.length} antrenman · ${fmt(toCreate[0])} – ${fmt(toCreate[toCreate.length - 1])}${time ? ` · ${time}` : ""}`;
    if (d.scope === "individual") {
      await notifyAthletes(d.athleteIds, { type: "training", title: "Yeni antrenman programı", body, url: "/panel/antrenmanlar" });
    } else {
      await notifyTeam(d.teamId, { type: "training", title: "Yeni antrenman programı", body, url: "/panel/antrenmanlar" });
    }
  } catch (e) {
    console.error("[bildirim] antrenman serisi:", errLabel(e));
  }

  return { ok: true, created: toCreate.length, skipped: [...taken], capped };
}

export async function deleteTraining(id: string): Promise<void> {
  await requirePermission("takvim.manage");
  await prisma.training.delete({ where: { id } }).catch(() => {});
  revalidate();
}
