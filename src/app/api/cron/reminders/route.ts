import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { runReminders } from "@/lib/reminders";
import { errLabel } from "@/lib/log";

/**
 * Zamanlanmış hatırlatma tetikleyicisi (Faz 4.2). Sunucudaki cron SAATLİK çağırır;
 * `runReminders` yalnız gönderim penceresinde ve daha önce gönderilmemiş olanlar için
 * bildirim üretir (çift gönderim DB unique kısıtıyla engellenir).
 *
 * GÜVENLİK:
 * - Yalnız POST — tarayıcı/crawler/prefetch ile kazara tetiklenmesin.
 * - `x-cron-key` başlığı `CRON_SECRET` ile ZAMANLAMA-GÜVENLİ karşılaştırılır.
 * - `CRON_SECRET` tanımlı DEĞİLSE uç kapalıdır (503) — korumasız çalıştırılamaz.
 */
export const dynamic = "force-dynamic";

function validKey(provided: string | null): boolean {
  const expected = process.env.CRON_SECRET || "";
  if (!expected || !provided) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false; // timingSafeEqual eşit uzunluk ister
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Zamanlanmış görev anahtarı tanımlı değil." }, { status: 503 });
  }
  if (!validKey(req.headers.get("x-cron-key"))) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  try {
    const result = await runReminders(new Date());
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("[cron] hatırlatma çalıştırılamadı:", errLabel(e));
    return NextResponse.json({ error: "Hatırlatma çalıştırılamadı." }, { status: 500 });
  }
}
