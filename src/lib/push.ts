import "server-only";
import webpush from "web-push";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Web Push gönderimi (VAPID). VAPID_* env yoksa sessizce devre dışı.
 *
 * KVKK: Bildirim gövdesine sağlık/performans (özel nitelikli) verisi YAZILMAZ.
 * Genel kalır ("Yeni performans ölçümün eklendi"); detay uygulama içinde.
 * Abonelik = opt-in; ölü/iptal abonelikler otomatik silinir.
 */

let configured = false;
function ensureConfigured(): boolean {
  if (configured) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:bilgi@bucayildiz.com", pub, priv);
  configured = true;
  return true;
}

export type PushPayload = { title: string; body: string; url?: string };

/** Verilen hedefe (tüm aboneler / Prisma where) bildirim gönderir. */
export async function sendPush(where: Prisma.PushSubscriptionWhereInput | "all", payload: PushPayload): Promise<{ sent: number; removed: number; configured: boolean }> {
  if (!ensureConfigured()) return { sent: 0, removed: 0, configured: false };

  const subs = await prisma.pushSubscription.findMany({
    where: where === "all" ? {} : where,
  });

  const data = JSON.stringify(payload);
  let sent = 0;
  const stale: string[] = [];

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, data);
        sent++;
      } catch (e: unknown) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) stale.push(s.id); // abonelik iptal/geçersiz
      }
    }),
  );

  if (stale.length) await prisma.pushSubscription.deleteMany({ where: { id: { in: stale } } });
  return { sent, removed: stale.length, configured: true };
}
