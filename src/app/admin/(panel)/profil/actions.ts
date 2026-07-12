"use server";

import { z } from "zod";
import { requireAdmin, hashPassword, verifyPassword, createAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AdminProfileResult = { ok: true } | { ok: false; error: string };

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifrenizi girin."),
    newPassword: z.string().min(8, "Yeni şifre en az 8 karakter olmalı.").max(100),
    newPassword2: z.string().min(1, "Yeni şifre tekrarını girin."),
  })
  .refine((d) => d.newPassword === d.newPassword2, {
    message: "Yeni şifreler eşleşmiyor.",
    path: ["newPassword2"],
  });

/** Yönetici hesabının şifresini değiştirir (mevcut şifre doğrulanır). */
export async function changeAdminPassword(input: unknown): Promise<AdminProfileResult> {
  const session = await requireAdmin();
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return { ok: false, error: "Kullanıcı bulunamadı." };

  const ok = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!ok) return { ok: false, error: "Mevcut şifre hatalı." };

  try {
    // Şifre değişince tokenVersion'ı artır → başka cihazlardaki eski oturumlar düşer.
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(parsed.data.newPassword), tokenVersion: { increment: 1 } },
      select: { tokenVersion: true },
    });
    // Bu oturum düşmesin: mevcut çerezi yeni sürümle yeniden imzala.
    await createAdminSession({ ...session, tv: updated.tokenVersion });
    return { ok: true };
  } catch {
    return { ok: false, error: "Şifre güncellenemedi." };
  }
}
