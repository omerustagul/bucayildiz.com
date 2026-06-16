import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Web Push aboneliği kaydı — oturumlu kullanıcı (sporcu/veli veya admin). */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

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

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: data,
    create: { endpoint, ...data },
  });

  return NextResponse.json({ ok: true });
}
