"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { login } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().min(1),
  password: z.string().min(1),
  next: z.string().optional(),
});

export type LoginResult = { error: string };

export async function loginAction(input: unknown): Promise<LoginResult | void> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "E-posta ve şifre giriniz." };

  const session = await login(parsed.data.email, parsed.data.password);
  if (!session) return { error: "Giriş bilgileri hatalı. Lütfen kontrol edin." };

  const next = parsed.data.next;
  redirect(next && next.startsWith("/admin") ? next : "/admin");
}
