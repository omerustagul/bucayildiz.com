import { NextResponse } from "next/server";
import { getAdminSession, getPanelSession } from "@/lib/auth";
import { isSameOrigin } from "@/lib/net";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit-db";

/** Web Push aboneliği kaydı — oturumlu kullanıcı (sporcu/veli veya admin). */
export async function POST(req: Request) {
  // CSRF savunma derinliği — bkz. lib/net.ts isSameOrigin (route handler'lar Next'in
  // Server Action origin kontrolünden geçmez).
  if (!isSameOrigin(req.headers)) return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });

  // İki portal oturumu da geçerli (admin medya yükler, sporcu avatar/push)
  const session = (await getAdminSession()) ?? (await getPanelSession());
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const rl = await rateLimit(`push-sub:${session.sub}`, 20, 5 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });

  let body: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const { endpoint, keys } = body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Eksik abonelik verisi." }, { status: 400 });
  }

  const data = {
    p256dh: keys.p256dh,
    auth: keys.auth,
    userId: session.sub,
    athleteId: session.athleteId ?? null,
    userAgent: req.headers.get("user-agent") || null,
  };

  try {
    // Aynı endpoint başka kullanıcıya bağlıysa devralmayı engelle.
    const existing = await prisma.pushSubscription.findUnique({ where: { endpoint }, select: { userId: true } });
    if (existing && existing.userId && existing.userId !== session.sub) {
      return NextResponse.json({ error: "Bu cihaz başka bir hesaba bağlı." }, { status: 409 });
    }
    await prisma.pushSubscription.upsert({ where: { endpoint }, update: data, create: { endpoint, ...data } });
  } catch {
    return NextResponse.json({ error: "Abonelik kaydedilemedi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
