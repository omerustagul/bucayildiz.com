import { NextResponse } from "next/server";
import { getAdminSession, getPanelSession } from "@/lib/auth";
import { isAdminRole } from "@/lib/session";
import { saveUpload } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";

/** Görsel yükleme uç noktası — oturumlu yöneticiler veya sporcular (yalnızca görsel). */
export async function POST(req: Request) {
  // İki portal oturumu da geçerli (admin medya yükler, sporcu avatar/push)
  const session = (await getAdminSession()) ?? (await getPanelSession());
  const isAdmin = !!session && isAdminRole(session.role);
  const isAthlete = Boolean(session?.athleteId);
  if (!session || (!isAdmin && !isAthlete)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  // Kötüye kullanım/disk taşması: kullanıcı başına 5 dakikada en çok 40 yükleme.
  const rl = rateLimit(`upload:${session.sub}`, 40, 5 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Çok fazla yükleme isteği. Lütfen biraz bekleyin." }, { status: 429 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  const kind = form.get("kind") === "video" ? "video" : "image";
  // Video yükleme yalnız admin (30MB, kapak videosu); sporcu yalnız görsel yükler.
  if (kind === "video" && !isAdmin) {
    return NextResponse.json({ error: "Video yükleme yetkiniz yok." }, { status: 403 });
  }

  try {
    const { url } = await saveUpload(file, { kind });
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Yükleme başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
