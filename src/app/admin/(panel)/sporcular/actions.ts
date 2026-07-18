"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission, hashPassword } from "@/lib/auth";
import { clientIp } from "@/lib/net";
import { deleteUpload } from "@/lib/storage";

const schema = z.object({
  name: z.string().trim().min(1, "İsim zorunlu.").max(120),
  teamId: z.string().min(1, "Takım seçiniz."),
  position: z.string().trim().max(40).optional().or(z.literal("")),
  number: z.number().int().min(0).max(99).nullable().optional(),
  height: z.number().int().min(100).max(230).nullable().optional(),
  weight: z.number().int().min(20).max(150).nullable().optional(),
  birthDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir doğum tarihi giriniz.").optional().or(z.literal("")).nullable(),
  foot: z.enum(["Sağ", "Sol", "Çift"]).nullable().optional(),
  status: z.enum(["active", "injured", "rest"]).default("active"),
  licenseNo: z.string().trim().max(40).optional().or(z.literal("")),
  // Sorumlu kişi adı — KVKK rıza kayıtlarında "onaylayan" olarak kullanılır
  // (bkz. lib/consent.server.ts resolveAthleteGranter). Boşsa yakınlık iddia edilmez.
  parentName: z.string().trim().max(120).optional().or(z.literal("")),
  parentPhone: z.string().trim().max(20).optional().or(z.literal("")),
  photoUrl: z.string().trim().nullable().optional(),
});

export type AthleteResult = { error: string };


function toData(d: z.infer<typeof schema>) {
  return {
    name: d.name,
    teamId: d.teamId,
    position: d.position || "",
    number: d.number ?? null,
    height: d.height ?? null,
    weight: d.weight ?? null,
    birthDate: d.birthDate && d.birthDate.trim() ? d.birthDate : null,
    foot: d.foot ?? null,
    status: d.status,
    licenseNo: d.licenseNo || null,
    parentName: d.parentName || null,
    parentPhone: d.parentPhone || null,
    photoUrl: d.photoUrl && d.photoUrl.trim() ? d.photoUrl : null,
  };
}

export async function createAthlete(input: unknown): Promise<AthleteResult | void> {
  await requirePermission("sporcular.manage");
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.athlete.create({ data: toData(parsed.data) });
  } catch {
    return { error: "Sporcu kaydedilemedi. Takım seçimini kontrol edin." };
  }
  revalidatePath("/admin/sporcular");
}

export async function updateAthlete(id: string, input: unknown): Promise<AthleteResult | void> {
  await requirePermission("sporcular.manage");
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.athlete.update({ where: { id }, data: toData(parsed.data) });
  } catch {
    return { error: "Güncellenemedi." };
  }
  revalidatePath("/admin/sporcular");
}

/** Sporcuya panel giriş bilgisi oluşturur/günceller. */
export async function provisionAthleteLogin(athleteId: string, username: string, password: string): Promise<{ ok?: boolean; error?: string }> {
  await requirePermission("sporcular.manage");
  const u = username.trim().toLowerCase();
  if (!u || !/^[a-z0-9._-]{3,40}$/.test(u)) return { error: "Geçerli bir kullanıcı adı girin (a-z, 0-9, . _ -)." };
  if (password && password.length < 8) return { error: "Şifre en az 8 karakter olmalı." };

  const athlete = await prisma.athlete.findUnique({ where: { id: athleteId }, include: { user: true } });
  if (!athlete) return { error: "Sporcu bulunamadı." };

  try {
    if (athlete.user) {
      const data: { username: string; passwordHash?: string } = { username: u };
      if (password) data.passwordHash = await hashPassword(password);
      await prisma.user.update({ where: { id: athlete.user.id }, data });
    } else {
      if (!password) return { error: "Yeni hesap için şifre gerekli." };
      await prisma.user.create({ data: { username: u, passwordHash: await hashPassword(password), name: athlete.name, role: "athlete", athleteId } });
    }
  } catch {
    return { error: "Bu kullanıcı adı zaten kullanımda." };
  }
  revalidatePath("/admin/sporcular");
  return { ok: true };
}

/**
 * Sporcuyu ve kişisel verilerini imha eder (KVKK md.7 unutulma hakkı). Karar-bağımsız
 * imha mekaniği (Faz 2.4): ölçüm/antrenman/beslenme/bildirim CASCADE ile gider; ancak
 * — ÖDEME kayıtları SİLİNMEZ (VUK/TTK saklama): silmeden önce sporcu adı `payerName`'e
 *   snapshot alınır, sonra SetNull ile atıflı-ama-bağsız kalır;
 * — giriş `User` hesabı (yetim kalmasın diye) SİLİNİR;
 * — yüklenen foto DİSKTEN/S3'ten silinir (best-effort, DB'yi bloklamaz);
 * — `adminAuditLog`'a silme denetim izi yazılır (kim/ne zaman/ne).
 * Rıza kayıtları şimdilik SetNull ile korunur (PII imha kararı avukatta — Faz 2.4/B).
 * Eski sürüm tek satır `athlete.delete().catch(()=>{})` idi — sessiz hata + ödeme kaybı +
 * yetim User/dosya bırakıyordu.
 */
export async function deleteAthlete(id: string): Promise<void> {
  const actor = await requirePermission("sporcular.manage");
  const athlete = await prisma.athlete.findUnique({
    where: { id },
    select: { id: true, name: true, photoUrl: true, user: { select: { id: true } } },
  });
  if (!athlete) return; // zaten yok

  await prisma.$transaction(async (tx) => {
    // Mali kayıt saklanır: silmeden önce atıf için ad snapshot'ı (sonra SetNull ile bağ kopar).
    await tx.payment.updateMany({ where: { athleteId: id }, data: { payerName: athlete.name } });
    // Yetim kalmasın: giriş hesabını sil (varsa). Sporcu silinince aksi halde SetNull ile orphan kalırdı.
    if (athlete.user) await tx.user.delete({ where: { id: athlete.user.id } });
    // Sporcu + cascade (ölçüm/antrenman/beslenme/bildirim). Ödeme+rıza SetNull ile korunur.
    await tx.athlete.delete({ where: { id } });
  });

  // Foto dosyasını depodan sil (best-effort — DB kaydı gitti, dosya temizliği bloklamaz).
  await deleteUpload(athlete.photoUrl);

  // KVKK imha denetim izi.
  await prisma.adminAuditLog.create({
    data: {
      actorId: actor.sub,
      actorName: actor.name,
      action: "athlete.delete",
      targetId: id,
      targetName: athlete.name,
      detail: "Sporcu imha edildi; ödemeler saklandı (ad snapshot + SetNull), giriş hesabı ve foto silindi, rıza kayıtları korundu.",
      ipAddress: clientIp(await headers()),
    },
  });

  revalidatePath("/admin/sporcular");
}
