import "server-only";
import { prisma } from "@/lib/prisma";
import { sendPush } from "@/lib/push";
import { errLabel } from "@/lib/log";
import { internalPath } from "@/lib/validation";

/**
 * Sporcu bildirimleri — TÜM olay kaynakları (admin gönderimi + sistem olayları:
 * antrenman, maç, ölçüm, mesaj, beslenme) bu ORTAK yardımcıya bağlanır (DRY).
 *
 * Feed BİRİNCİL: her olay ÖNCE Notification kaydı yazar (feed'de kesin görünür).
 * Web Push EK + non-blocking: VAPID varsa dener; push başarısızlığı olayı bloklamaz.
 *
 * KVKK: Notification.body'ye ASLA sağlık/performans DEĞERİ yazma — genel kal
 * ("Yeni ölçüm eklendi", değeri değil). URL yalnız site-içi yol (internalPath).
 * Fan-out: takıma bildirim TEK createMany (N sporcuya N insert değil — N+1 yok).
 */
export type NotifyType = "training" | "match" | "measurement" | "message" | "nutrition" | "admin";
export type NotifyInput = { type: NotifyType; title: string; body?: string; url?: string };
export type NotifyResult = { feedCount: number; push: { sent: number; configured: boolean } };

const EMPTY: NotifyResult = { feedCount: 0, push: { sent: 0, configured: false } };

export async function notifyAthletes(athleteIds: string[], input: NotifyInput): Promise<NotifyResult> {
  const ids = [...new Set(athleteIds.filter(Boolean))];
  if (ids.length === 0) return EMPTY;

  // URL güvenliği: yalnız site-içi yol; harici/phishing (`//`, `https://`, `javascript:`) düşer.
  const url = input.url && internalPath.safeParse(input.url).success ? input.url : null;
  const body = input.body ?? "";

  // Feed birincil — TEK createMany (fan-out; N+1 yok). Feed'de kesin görünür.
  await prisma.notification.createMany({
    data: ids.map((athleteId) => ({ athleteId, type: input.type, title: input.title, body, url })),
  });

  // Web Push ek + non-blocking — başarısızlık olayı/feed'i bloklamaz; PII log'a düşmez (errLabel).
  let push = { sent: 0, configured: false };
  try {
    const r = await sendPush({ athleteId: { in: ids } }, { title: input.title, body, url: url ?? undefined });
    push = { sent: r.sent, configured: r.configured };
  } catch (e) {
    console.error("[bildirim] push başarısız:", errLabel(e));
  }
  return { feedCount: ids.length, push };
}

/** Bir takımın tüm sporcularına — id'ler TEK sorguda çekilir, fan-out tek createMany. */
export async function notifyTeam(teamId: string, input: NotifyInput): Promise<NotifyResult> {
  const athletes = await prisma.athlete.findMany({ where: { teamId }, select: { id: true } });
  return notifyAthletes(athletes.map((a) => a.id), input);
}

/** Tüm sporculara (ör. admin "herkes" hedefi / takımsız kulüp maçı). */
export async function notifyAllAthletes(input: NotifyInput): Promise<NotifyResult> {
  const athletes = await prisma.athlete.findMany({ select: { id: true } });
  return notifyAthletes(athletes.map((a) => a.id), input);
}
