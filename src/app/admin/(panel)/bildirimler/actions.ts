"use server";

import { getSession } from "@/lib/auth";
import { sendPush } from "@/lib/push";

export type SendResult = { ok: true; sent: number; configured: boolean } | { ok: false; error: string };

/**
 * Yönetici → push bildirimi gönderir. Hedef "all" (tüm aboneler) veya bir
 * takım id'si (o takımdaki sporcuların aboneleri).
 * KVKK: gövdeye sağlık/performans verisi yazma — genel tut.
 */
export async function sendNotification(input: { target: string; title: string; body: string; url?: string }): Promise<SendResult> {
  const session = await getSession();
  if (!session || session.role !== "admin") return { ok: false, error: "Yetkisiz." };

  const title = input.title?.trim();
  const body = input.body?.trim();
  if (!title || !body) return { ok: false, error: "Başlık ve mesaj zorunludur." };

  const where = input.target === "all" ? "all" : { athlete: { teamId: input.target } };
  try {
    const res = await sendPush(where, { title, body, url: input.url?.trim() || "/panel" });
    if (!res.configured) return { ok: false, error: "Push yapılandırılmamış (VAPID anahtarları eksik)." };
    return { ok: true, sent: res.sent, configured: true };
  } catch {
    return { ok: false, error: "Bildirim gönderilemedi." };
  }
}
