import { prisma } from "@/lib/prisma";
import { notifyAthletes, notifyTeam, notifyAllAthletes } from "@/lib/notify";
import { toYmd } from "@/lib/schedule";

/**
 * Antrenman/maç hatırlatmaları (Faz 4.2).
 *
 * ÇİFT GÖNDERİM: PM2 cluster'da 2 instance var ve cron saatlik çalışır → aynı hatırlatma
 * defalarca tetiklenebilir. Çözüm CLAIM-THEN-SEND: gönderimden ÖNCE `ReminderLog`'a kayıt
 * açılır; `@@unique([kind, targetId, daysBefore])` sayesinde ikinci deneme DB seviyesinde
 * düşer ve veliye mükerrer bildirim gitmez. (Uygulama içi kilit yerine DB kısıtı seçildi —
 * instance'lar arası tek güvenilir yol.)
 *
 * KVKK: bildirim gövdesine YALNIZ zaman/yer yazılır. Sağlık, performans, ölçüm veya
 * sakatlık bilgisi ASLA yazılmaz (bkz. lib/push.ts, lib/notify.ts aynı kural).
 */

/** Kaç gün önce hatırlatılacak — TEK YER. Değiştirmek için yalnız burası. */
export const REMINDER_DAYS = [3, 1] as const;

/** Gönderim penceresi (yerel saat): gece yarısı bildirim atılmaz. Cron saatlik
 *  çalışsa da günün ilk uygun saatinde gönderilir, sonrası unique kısıtla atlanır. */
export const SEND_HOUR_FROM = 9;
export const SEND_HOUR_TO = 21;

export type ReminderRun = {
  sent: number;
  /** Başka bir instance/çalıştırma zaten göndermiş (unique ihlali) — mükerrer önlendi. */
  alreadySent: number;
  outOfWindow: boolean;
};

/** `now`'a gün ekleyip "YYYY-MM-DD" döndürür (YEREL — TZ kaymaz). */
export function addDaysYmd(now: Date, days: number): string {
  return toYmd(new Date(now.getFullYear(), now.getMonth(), now.getDate() + days));
}

/** Gönderim hakkını ATOMİK sahiplen. true = bu çalıştırma gönderecek. */
async function claim(kind: string, targetId: string, daysBefore: number, recipients: number): Promise<boolean> {
  try {
    await prisma.reminderLog.create({ data: { kind, targetId, daysBefore, recipients } });
    return true;
  } catch {
    return false; // unique ihlali → zaten gönderilmiş
  }
}

/** "Yarın" / "3 gün sonra" — gövdenin zaman öneki. */
export function whenLabel(days: number): string {
  return days === 1 ? "Yarın" : `${days} gün sonra`;
}

export async function runReminders(now: Date = new Date()): Promise<ReminderRun> {
  const hour = now.getHours();
  if (hour < SEND_HOUR_FROM || hour >= SEND_HOUR_TO) {
    return { sent: 0, alreadySent: 0, outOfWindow: true };
  }

  let sent = 0;
  let alreadySent = 0;

  for (const days of REMINDER_DAYS) {
    const ymd = addDaysYmd(now, days);
    const when = whenLabel(days);

    // ── Antrenmanlar (iptal edilenler hariç)
    const trainings = await prisma.training.findMany({
      where: { date: ymd, status: { not: "cancelled" } },
      select: { id: true, teamId: true, time: true, pitch: true, scope: true, attendance: { select: { athleteId: true } } },
    });
    for (const t of trainings) {
      const athleteIds = t.scope === "individual" ? t.attendance.map((a) => a.athleteId) : null;
      const recipients = athleteIds ? athleteIds.length : await prisma.athlete.count({ where: { teamId: t.teamId } });
      if (recipients === 0) continue; // kimseye gitmeyecekse kilit de açma
      if (!(await claim("training", t.id, days, recipients))) {
        alreadySent++;
        continue;
      }
      // KVKK: yalnız zaman + saha.
      const body = `Antrenman · ${when}${t.time ? ` ${t.time}` : ""}${t.pitch ? ` · ${t.pitch}` : ""}`;
      const payload = { type: "training" as const, title: "Antrenman hatırlatması", body, url: "/panel/antrenmanlar" };
      if (athleteIds) await notifyAthletes(athleteIds, payload);
      else await notifyTeam(t.teamId, payload);
      sent++;
    }

    // ── Maçlar (yalnız oynanmamışlar)
    const fixtures = await prisma.fixture.findMany({
      where: { date: ymd, status: "upcoming" },
      select: { id: true, teamId: true, time: true, venue: true, opponent: true, isHome: true },
    });
    for (const f of fixtures) {
      const recipients = f.teamId
        ? await prisma.athlete.count({ where: { teamId: f.teamId } })
        : await prisma.athlete.count();
      if (recipients === 0) continue;
      if (!(await claim("fixture", f.id, days, recipients))) {
        alreadySent++;
        continue;
      }
      // KVKK: rakip + zaman + yer; performans/sağlık YOK.
      const body = `${f.isHome ? "Ev" : "Deplasman"} · ${f.opponent} · ${when}${f.time ? ` ${f.time}` : ""}${f.venue ? ` · ${f.venue}` : ""}`;
      const payload = { type: "match" as const, title: "Maç hatırlatması", body, url: "/panel/maclar" };
      if (f.teamId) await notifyTeam(f.teamId, payload);
      else await notifyAllAthletes(payload);
      sent++;
    }
  }

  return { sent, alreadySent, outOfWindow: false };
}
