import { NextResponse } from "next/server";
import { getAdminSession, getPanelSession } from "@/lib/auth";
import { isSameOrigin } from "@/lib/net";
import { prisma } from "@/lib/prisma";

/** Web Push aboneliğini sil — tek tıkla çıkış (KVKK). */
export async function POST(req: Request) {
  // CSRF savunma derinliği — bkz. lib/net.ts isSameOrigin (route handler'lar Next'in
  // Server Action origin kontrolünden geçmez).
  if (!isSameOrigin(req.headers)) return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });

  // İki portal oturumu da geçerli (admin medya yükler, sporcu avatar/push)
  const session = (await getAdminSession()) ?? (await getPanelSession());
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  let body: { endpoint?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  if (!body.endpoint) return NextResponse.json({ error: "Endpoint gerekli." }, { status: 400 });

  await prisma.pushSubscription.deleteMany({ where: { endpoint: body.endpoint, userId: session.sub } });
  return NextResponse.json({ ok: true });
}
