"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminSession, verifyCredentials } from "@/lib/auth";

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

  const session = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!session) return { error: "Giriş bilgileri hatalı. Lütfen kontrol edin." };

  // Rol kapısı: çerez yalnız admin hesabı için yazılır (portallar tamamen ayrı)
  if (session.role !== "admin") {
    return { error: "Bu giriş yöneticiler içindir. Sporcu girişi için panel giriş sayfasını kullanın." };
  }
  await createAdminSession(session);

  const next = parsed.data.next;
  redirect(next && next.startsWith("/admin") ? next : "/admin");
}
