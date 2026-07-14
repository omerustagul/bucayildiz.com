"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAthlete } from "@/lib/auth";
import { idSchema } from "@/lib/validation";

export type FeedItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  url: string | null;
  read: boolean;
  createdAt: string; // ISO
};

/** Oturumdaki sporcunun bildirimleri — IDOR: YALNIZ session.athleteId kapsamlı.
 *  Başka sporcunun bildirimi asla dönmez. */
export async function getMyNotifications(): Promise<FeedItem[]> {
  const s = await requireAthlete();
  const athleteId = s.athleteId;
  if (!athleteId) return []; // tip güvenliği + undefined → "hepsini getir" footgun'unu kapat
  const rows = await prisma.notification.findMany({
    where: { athleteId },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  return rows.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    url: n.url,
    read: n.readAt != null,
    createdAt: n.createdAt.toISOString(),
  }));
}

/** Tek bildirimi okundu işaretle — SAHİPLİK filtresi: where'de id + athleteId birlikte,
 *  böylece client'tan gelen yabancı bir id 0 satır eşler (no-op, sızıntı yok). updateMany
 *  kullanılır ki bulunmayan/başkasına ait id hata değil sessiz no-op olsun. */
export async function markNotificationRead(id: unknown): Promise<{ ok: boolean }> {
  const s = await requireAthlete();
  const athleteId = s.athleteId;
  if (!athleteId) return { ok: false };
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return { ok: false };
  try {
    await prisma.notification.updateMany({
      where: { id: parsed.data, athleteId, readAt: null },
      data: { readAt: new Date() },
    });
  } catch {
    return { ok: false };
  }
  revalidatePath("/panel", "layout"); // header rozeti tazelensin
  return { ok: true };
}

/** Tümünü okundu işaretle — yalnız kendi bildirimleri (athleteId kapsamlı). */
export async function markAllNotificationsRead(): Promise<{ ok: boolean }> {
  const s = await requireAthlete();
  const athleteId = s.athleteId;
  if (!athleteId) return { ok: false };
  try {
    await prisma.notification.updateMany({
      where: { athleteId, readAt: null },
      data: { readAt: new Date() },
    });
  } catch {
    return { ok: false };
  }
  revalidatePath("/panel", "layout");
  return { ok: true };
}
