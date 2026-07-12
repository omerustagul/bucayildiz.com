"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { sendPush } from "@/lib/push";
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
 * Yönetici → push bildirimi gönderir. Hedef "all" (tüm aboneler) veya bir
 * takım id'si (o takımdaki sporcuların aboneleri).
 * KVKK: gövdeye sağlık/performans verisi yazma — genel tut.
 */
export async function sendNotification(input: unknown): Promise<SendResult> {
  await requireAdmin();

  const parsed = notificationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const { target, title, body, url } = parsed.data;

  const where = target === "all" ? "all" : { athlete: { teamId: target } };
  try {
    const res = await sendPush(where, { title, body, url: url || "/panel" });
    if (!res.configured) return { ok: false, error: "Push yapılandırılmamış (VAPID anahtarları eksik)." };
    return { ok: true, sent: res.sent, configured: true };
  } catch {
    return { ok: false, error: "Bildirim gönderilemedi." };
  }
}
