"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createPanelSession, verifyCredentials } from "@/lib/auth";
import { clientIp } from "@/lib/net";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1),
  next: z.string().optional(),
});

export type PanelLoginResult = { error: string };

/** Sporcu paneli girişi — YALNIZ sporcu hesapları. Yönetici hesabı burada
 *  oturum AÇAMAZ (paneller tamamen ayrı; yönetici girişi: /admin/giris). */
export async function panelLoginAction(input: unknown): Promise<PanelLoginResult | void> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "Kullanıcı adı/e-posta ve şifre giriniz." };

  // Brute-force savunma derinliği: IP başına 10 dakikada en çok 10 deneme.
  const ip = clientIp(await headers()) ?? "unknown";
  const rl = rateLimit(`login:panel:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.ok) return { error: "Çok fazla giriş denemesi. Lütfen birkaç dakika sonra tekrar deneyin." };

  const session = await verifyCredentials(parsed.data.identifier, parsed.data.password);
  if (!session) return { error: "Giriş bilgileri hatalı. Lütfen kontrol edin." };

  // Rol kapısı: çerez yalnız sporcu hesabı için yazılır (portallar tamamen ayrı)
  if (session.role === "admin" || !session.athleteId) {
    return { error: "Bu giriş sporcular içindir. Yönetici girişi için yönetim paneli giriş sayfasını kullanın." };
  }
  await createPanelSession(session);

  const next = parsed.data.next;
  if (next && next.startsWith("/panel")) redirect(next);
  redirect("/panel");
}
