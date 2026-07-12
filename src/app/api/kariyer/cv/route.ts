import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/net";

/**
 * PUBLIC CV yükleme — iş başvurusu için (oturum YOK). Ana /api/upload'ın oturum
 * kapısı DEĞİŞMEZ; bu ayrı, DAR yüzey yalnız PDF (belge modu) kabul eder:
 * saveUpload document → %PDF magic-byte + application/pdf + 10 MB.
 * DoS/abuse savunması: IP başına 10 dakikada en çok 5 yükleme.
 */
export async function POST(req: Request) {
  const ip = clientIp(req.headers) ?? "unknown";
  const rl = rateLimit(`cv-upload:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Çok fazla yükleme isteği. Lütfen biraz bekleyin." }, { status: 429 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  try {
    const { url } = await saveUpload(file, { kind: "document" });
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Yükleme başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
