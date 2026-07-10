import { NextResponse } from "next/server";
import { getAdminSession, getPanelSession } from "@/lib/auth";
import { saveUpload } from "@/lib/storage";

/** Görsel yükleme uç noktası — oturumlu yöneticiler veya sporcular (yalnızca görsel). */
export async function POST(req: Request) {
  // İki portal oturumu da geçerli (admin medya yükler, sporcu avatar/push)
  const session = (await getAdminSession()) ?? (await getPanelSession());
  const isAdmin = session?.role === "admin";
  const isAthlete = Boolean(session?.athleteId);
  if (!session || (!isAdmin && !isAthlete)) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  try {
    const { url } = await saveUpload(file);
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Yükleme başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
