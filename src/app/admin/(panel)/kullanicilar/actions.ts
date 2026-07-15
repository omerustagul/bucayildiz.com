"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireOwner, hashPassword } from "@/lib/auth";
import { isValidPermission } from "@/lib/permissions";
import { clientIp } from "@/lib/net";
import { idSchema } from "@/lib/validation";
import type { SessionPayload } from "@/lib/session";

/** Yönetici (admin/owner) hesap yönetimi — YALNIZ owner (requireOwner). Her mutasyon
 *  denetim izine (AdminAuditLog) yazılır. Güvenlik: son sahip düşürülemez/silinemez,
 *  kendini kilitleyemezsin, "kullanicilar.*" izni devredilemez (owner-exclusive). */

export type UserResult = { ok: true } | { ok: false; error: string };

/** Denetim izi (best-effort — kaydı başarısız olsa da ana işlem geri alınmaz). */
async function writeAudit(actor: SessionPayload, action: string, target: { id: string; name: string } | null, detail: string) {
  const ip = clientIp(await headers());
  await prisma.adminAuditLog
    .create({ data: { actorId: actor.sub, actorName: actor.name, action, targetId: target?.id ?? null, targetName: target?.name ?? null, detail, ipAddress: ip } })
    .catch(() => {});
}

/** İstemci izin listesini kataloğa göre süz + "kullanicilar.*" dışla (owner-exclusive, devredilemez). */
function sanitizePermissions(perms: string[]): string[] {
  return [...new Set(perms.filter((p) => isValidPermission(p) && !p.startsWith("kullanicilar.")))];
}

const nameSchema = z.string().trim().min(1, "Ad zorunlu.").max(120);
const roleSchema = z.enum(["admin", "owner"]);
const passwordSchema = z.string().min(8, "Parola en az 8 karakter olmalı.");

const createSchema = z.object({
  name: nameSchema,
  email: z.string().trim().email("Geçerli e-posta giriniz.").max(160).optional().or(z.literal("")),
  username: z.string().trim().max(60).regex(/^[a-z0-9._-]*$/i, "Kullanıcı adı yalnız harf/rakam/._- içerebilir.").optional().or(z.literal("")),
  password: passwordSchema,
  role: roleSchema,
  permissions: z.array(z.string()).default([]),
});

export async function createAdminUser(input: unknown): Promise<UserResult> {
  const session = await requireOwner();
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  const email = d.email?.trim().toLowerCase() || null;
  const username = d.username?.trim() || null;
  if (!email && !username) return { ok: false, error: "E-posta veya kullanıcı adı gerekli." };
  const permissions = d.role === "owner" ? [] : sanitizePermissions(d.permissions);
  try {
    const passwordHash = await hashPassword(d.password);
    const created = await prisma.user.create({ data: { name: d.name, email, username, passwordHash, role: d.role, permissions } });
    await writeAudit(session, "user.create", { id: created.id, name: created.name }, `Rol: ${d.role === "owner" ? "Sahip" : "Yönetici"} · ${permissions.length} izin`);
  } catch {
    return { ok: false, error: "Bu e-posta veya kullanıcı adı zaten kayıtlı." };
  }
  revalidatePath("/admin/kullanicilar");
  return { ok: true };
}

const updateSchema = z.object({ name: nameSchema, role: roleSchema, permissions: z.array(z.string()).default([]) });

export async function updateAdminUser(id: unknown, input: unknown): Promise<UserResult> {
  const session = await requireOwner();
  const idParsed = idSchema.safeParse(id);
  const parsed = updateSchema.safeParse(input);
  if (!idParsed.success) return { ok: false, error: "Geçersiz kayıt." };
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  const target = await prisma.user.findUnique({ where: { id: idParsed.data }, select: { id: true, name: true, role: true, permissions: true } });
  if (!target || target.role === "athlete") return { ok: false, error: "Yönetici bulunamadı." };

  // GÜVENLİK: son sahip 'Yönetici'ye düşürülemez (kilitlenme) + kendini düşüremezsin.
  if (target.role === "owner" && d.role !== "owner") {
    if (target.id === session.sub) return { ok: false, error: "Kendi sahip yetkinizi kaldıramazsınız." };
    const owners = await prisma.user.count({ where: { role: "owner" } });
    if (owners <= 1) return { ok: false, error: "Son sahibin yetkisi kaldırılamaz." };
  }

  const permissions = d.role === "owner" ? [] : sanitizePermissions(d.permissions);
  // İzin farkı → denetim detayı
  const before = new Set(target.permissions);
  const after = new Set(permissions);
  const added = [...after].filter((p) => !before.has(p));
  const removed = [...before].filter((p) => !after.has(p));
  const parts: string[] = [];
  if (target.role !== d.role) parts.push(`rol: ${target.role}→${d.role}`);
  if (added.length) parts.push(`+[${added.join(", ")}]`);
  if (removed.length) parts.push(`−[${removed.join(", ")}]`);

  await prisma.user.update({ where: { id: target.id }, data: { name: d.name, role: d.role, permissions } });
  await writeAudit(session, "user.update", { id: target.id, name: d.name }, parts.join(" · ") || "değişiklik yok");
  revalidatePath("/admin/kullanicilar");
  return { ok: true };
}

export async function deleteAdminUser(id: unknown): Promise<UserResult> {
  const session = await requireOwner();
  const idParsed = idSchema.safeParse(id);
  if (!idParsed.success) return { ok: false, error: "Geçersiz kayıt." };
  if (idParsed.data === session.sub) return { ok: false, error: "Kendinizi silemezsiniz." };
  const target = await prisma.user.findUnique({ where: { id: idParsed.data }, select: { id: true, name: true, role: true } });
  if (!target || target.role === "athlete") return { ok: false, error: "Yönetici bulunamadı." };
  if (target.role === "owner") {
    const owners = await prisma.user.count({ where: { role: "owner" } });
    if (owners <= 1) return { ok: false, error: "Son sahip silinemez." };
  }
  await prisma.user.delete({ where: { id: target.id } });
  await writeAudit(session, "user.delete", { id: target.id, name: target.name }, `Rol: ${target.role}`);
  revalidatePath("/admin/kullanicilar");
  return { ok: true };
}

export async function resetAdminPassword(id: unknown, newPassword: unknown): Promise<UserResult> {
  const session = await requireOwner();
  const idParsed = idSchema.safeParse(id);
  const pwParsed = passwordSchema.safeParse(newPassword);
  if (!idParsed.success) return { ok: false, error: "Geçersiz kayıt." };
  if (!pwParsed.success) return { ok: false, error: pwParsed.error.issues[0]?.message ?? "Geçersiz parola." };
  const target = await prisma.user.findUnique({ where: { id: idParsed.data }, select: { id: true, name: true, role: true } });
  if (!target || target.role === "athlete") return { ok: false, error: "Yönetici bulunamadı." };
  const passwordHash = await hashPassword(pwParsed.data);
  // tokenVersion++ → hedefin mevcut tüm oturumları geçersizleşir (zorla çıkış).
  await prisma.user.update({ where: { id: target.id }, data: { passwordHash, tokenVersion: { increment: 1 } } });
  await writeAudit(session, "user.password_reset", { id: target.id, name: target.name }, "Parola sıfırlandı (oturumlar sonlandırıldı)");
  revalidatePath("/admin/kullanicilar");
  return { ok: true };
}
