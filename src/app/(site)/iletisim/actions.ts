"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/validation";
import { clientIp } from "@/lib/net";
import { rateLimit } from "@/lib/rate-limit";
import { notifyContactMessage } from "@/lib/mail";
import { errLabel } from "@/lib/log";

export type ContactResult = { ok: true } | { ok: false; error: string };

/** İletişim mesajı — yöneticiye e-posta. Honeypot + rate-limit; SMTP yoksa
 *  KULLANICIYA dürüst döner ("iletilemedi") — sahte başarı/sessiz kayıp yok. */
export async function submitContactMessage(input: unknown): Promise<ContactResult> {
  const honeypot = (input as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { ok: true };

  const ip = clientIp(await headers()) ?? "unknown";
  const rl = rateLimit(`iletisim:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) return { ok: false, error: "Çok fazla mesaj denemesi. Lütfen biraz sonra tekrar deneyin." };

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Lütfen formu kontrol edin." };

  try {
    const { sent } = await notifyContactMessage(parsed.data);
    if (!sent) return { ok: false, error: "Mesaj şu an iletilemiyor. Lütfen telefon veya e-posta ile ulaşın." };
    return { ok: true };
  } catch (e) {
    console.error("[iletisim] mesaj gönderilemedi:", errLabel(e));
    return { ok: false, error: "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin." };
  }
}
