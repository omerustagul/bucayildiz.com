"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";

export type ProfileResult = { ok: true } | { ok: false; error: string };

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Geçerli bir telefon giriniz.")
  .max(20)
  .regex(/^[0-9+\s()-]+$/, "Telefon yalnızca rakam ve +()- içerebilir.");

/** Veli iletişim bilgisini günceller (sporcunun düzenleyebildiği tek alan). */
export async function updateContact(parentPhone: string): Promise<ProfileResult> {
  const session = await requireAthlete();
  const parsed = phoneSchema.safeParse(parentPhone);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz telefon." };

  try {
    await prisma.athlete.update({ where: { id: session.athleteId! }, data: { parentPhone: parsed.data } });
    revalidatePath("/panel/profil");
    return { ok: true };
  } catch {
    return { ok: false, error: "Güncellenemedi. Lütfen tekrar deneyin." };
  }
}

const photoUrlSchema = z
  .string()
  .trim()
  .min(1, "Geçersiz fotoğraf.")
  .max(500)
  .refine((v) => v.startsWith("/uploads/") || /^https?:\/\//.test(v), "Geçersiz fotoğraf adresi.");

/**
 * Profil fotoğrafını günceller. Dosyanın kendisi `/api/upload` üzerinden
 * (src/lib/storage.ts, magic-byte doğrulamalı) yüklenip URL alınır; bu action
 * yalnızca o URL'yi oturumdaki sporcunun KENDİ kaydına yazar — session dışı
 * bir athleteId asla kabul edilmez.
 */
export async function updatePhoto(url: string): Promise<ProfileResult> {
  const session = await requireAthlete();
  const parsed = photoUrlSchema.safeParse(url);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz fotoğraf." };

  try {
    await prisma.athlete.update({ where: { id: session.athleteId! }, data: { photoUrl: parsed.data } });
    revalidatePath("/panel/profil");
    revalidatePath("/panel", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Fotoğraf güncellenemedi. Lütfen tekrar deneyin." };
  }
}

const passwordSchema = z.object({
  current: z.string().min(1, "Mevcut şifrenizi girin."),
  next: z.string().min(8, "Yeni şifre en az 8 karakter olmalı.").max(100),
});

/** Hesap şifresini değiştirir (mevcut şifre doğrulanır). */
export async function changePassword(current: string, next: string): Promise<ProfileResult> {
  const session = await requireAthlete();
  const parsed = passwordSchema.safeParse({ current, next });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return { ok: false, error: "Kullanıcı bulunamadı." };

  const ok = await verifyPassword(parsed.data.current, user.passwordHash);
  if (!ok) return { ok: false, error: "Mevcut şifre yanlış." };

  try {
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(parsed.data.next) } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Şifre güncellenemedi." };
  }
}
