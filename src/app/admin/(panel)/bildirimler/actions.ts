"use server";

import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { notifyAllAthletes, notifyTeam } from "@/lib/notify";
import { idSchema, internalPath } from "@/lib/validation";

export type SendResult = { ok: true; sent: number; configured: boolean } | { ok: false; error: string };

const notificationSchema = z.object({
  target: idSchema, // "all" veya takım id'si
  title: z.string().trim().min(1, "Başlık zorunludur.").max(120),
  body: z.string().trim().min(1, "Mesaj zorunludur.").max(500),
  // Tıklama hedefi YALNIZ site içi yol olabilir — harici/phishing URL'i engellenir.
  url: internalPath.optional().or(z.literal("")),
});

/**
 * Yönetici → sporcu bildirimi. Hedef "all" (tüm sporcular) veya bir takım id'si.
 * Ortak notifyAthletes akışına bağlanır: feed BİRİNCİL (VAPID olmasa da sporcunun
 * feed'inde görünür), Web Push EK + non-blocking. URL yalnız site-içi (internalPath).
 * KVKK: gövdeye sağlık/performans verisi yazma — genel tut.
 */
export async function sendNotification(input: unknown): Promise<SendResult> {
  await requirePermission("bildirimler.manage");

  const parsed = notificationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const { target, title, body, url } = parsed.data;

  try {
    const payload = { type: "admin" as const, title, body, url: url || "/panel" };
    const res = target === "all" ? await notifyAllAthletes(payload) : await notifyTeam(target, payload);
    // sent = feed'e yazılan (bildirilen) sporcu sayısı; configured = push açık mı.
    return { ok: true, sent: res.feedCount, configured: res.push.configured };
  } catch {
    return { ok: false, error: "Bildirim gönderilemedi." };
  }
}
