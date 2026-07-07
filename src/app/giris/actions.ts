"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { destroySession, login } from "@/lib/auth";

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

  const session = await login(parsed.data.identifier, parsed.data.password);
  if (!session) return { error: "Giriş bilgileri hatalı. Lütfen kontrol edin." };

  if (session.role === "admin" || !session.athleteId) {
    await destroySession(); // yanlış kapıdan oturum bırakma
    return { error: "Bu giriş sporcular içindir. Yönetici girişi için yönetim paneli giriş sayfasını kullanın." };
  }

  const next = parsed.data.next;
  if (next && next.startsWith("/panel")) redirect(next);
  redirect("/panel");
}
