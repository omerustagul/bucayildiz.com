"use server";

import { headers } from "next/headers";
import { newsletterSchema } from "@/lib/validation";
import { clientIp } from "@/lib/net";
import { rateLimit } from "@/lib/rate-limit-db";
import { subscribeNewsletter, type NewsletterResult } from "@/lib/newsletter";
import { errLabel } from "@/lib/log";

/**
 * Bülten aboneliği (public). Next Server Action → yerleşik Origin/CSRF koruması.
 * Honeypot + IP rate-limit; açık rıza zorunlu (işaretsiz gelemez). Rıza ispatı ve
 * çift/tek opt-in kararı `subscribeNewsletter`'da. Doğrulama linki için baseUrl
 * istekten türetilir (dev→localhost, prod→bucayildiz.com).
 */
export async function subscribeToNewsletter(input: unknown): Promise<NewsletterResult> {
  // Bot tuzağı: gizli "website" alanı doluysa sessiz başarı (kayıt yazmadan).
  const honeypot = (input as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { ok: true, message: "Aboneliğiniz alındı. Teşekkürler!" };

  const h = await headers();
  const ip = clientIp(h) ?? "unknown";
  const rl = await rateLimit(`bulten:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) return { ok: false, error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." };

  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Lütfen e-postanızı kontrol edin." };
  if (!parsed.data.consent) return { ok: false, error: "Devam etmek için ticari elektronik ileti onayını işaretleyin." };

  const host = h.get("host") ?? "bucayildiz.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");

  try {
    return await subscribeNewsletter({
      email: parsed.data.email,
      consent: parsed.data.consent,
      ip: ip === "unknown" ? null : ip,
      ua: h.get("user-agent"),
      baseUrl: `${proto}://${host}`,
    });
  } catch (e) {
    console.error("[bulten] abone olunamadı:", errLabel(e));
    return { ok: false, error: "Abonelik şu an tamamlanamadı. Lütfen daha sonra tekrar deneyin." };
  }
}
