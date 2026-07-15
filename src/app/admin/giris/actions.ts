"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createAdminSession, verifyCredentials } from "@/lib/auth";
import { isAdminRole } from "@/lib/session";
import { clientIp } from "@/lib/net";
import { rateLimit } from "@/lib/rate-limit-db";

const schema = z.object({
  email: z.string().trim().min(1),
  password: z.string().min(1),
  next: z.string().optional(),
});

export type LoginResult = { error: string };

/** Yönetim paneli girişi — YALNIZ yönetici hesapları (paneller tamamen ayrı). */
export async function loginAction(input: unknown): Promise<LoginResult | void> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "E-posta ve şifre giriniz." };

  // Brute-force savunma derinliği: IP başına 10 dakikada en çok 10 deneme.
  const ip = clientIp(await headers()) ?? "unknown";
  const rl = await rateLimit(`login:admin:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.ok) return { error: "Çok fazla giriş denemesi. Lütfen birkaç dakika sonra tekrar deneyin." };

  const session = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!session) return { error: "Giriş bilgileri hatalı. Lütfen kontrol edin." };

  // Rol kapısı: çerez admin/owner hesabı için yazılır (portallar tamamen ayrı)
  if (!isAdminRole(session.role)) {
    return { error: "Bu giriş yöneticiler içindir. Sporcu girişi için panel giriş sayfasını kullanın." };
  }
  await createAdminSession(session);

  const next = parsed.data.next;
  redirect(next && next.startsWith("/admin") ? next : "/admin");
}
