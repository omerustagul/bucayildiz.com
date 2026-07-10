import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  signSession,
  verifyAdminToken,
  verifyPanelToken,
  ADMIN_COOKIE,
  PANEL_COOKIE,
  SESSION_MAX_AGE,
  type SessionPayload,
} from "@/lib/session";

/** Sunucu tarafı auth — şifre hash/doğrulama + oturum cookie yönetimi.
 *
 *  Admin ve sporcu paneli TAMAMEN AYRI portallardır: her biri kendi çerezinde
 *  kendi oturumunu taşır. Girişler rol kapısından geçmeden çerez YAZILMAZ;
 *  bir portala giriş/çıkış diğerinin oturumuna dokunmaz. */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Kullanıcı adı VEYA e-posta + şifre doğrula. Çerez YAZMAZ — hangi portal
 *  oturumu kurulacağına çağıran (giriş action'ı) rol kapısından sonra karar verir. */
export async function verifyCredentials(identifier: string, password: string): Promise<SessionPayload | null> {
  const id = identifier.trim();
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: id.toLowerCase() }, { username: id }] },
  });
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  return {
    sub: user.id,
    email: user.email ?? user.username ?? "",
    role: user.role,
    name: user.name,
    athleteId: user.athleteId ?? undefined,
  };
}

async function setSessionCookie(cookieName: string, payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Admin portal oturumu kurar — yalnız admin rolü. */
export async function createAdminSession(payload: SessionPayload): Promise<void> {
  if (payload.role !== "admin") throw new Error("Admin oturumu yalnız admin rolüyle kurulabilir.");
  await setSessionCookie(ADMIN_COOKIE, payload);
}

/** Sporcu paneli oturumu kurar — athleteId zorunlu. */
export async function createPanelSession(payload: SessionPayload): Promise<void> {
  if (!payload.athleteId) throw new Error("Panel oturumu yalnız sporcu hesabıyla kurulabilir.");
  await setSessionCookie(PANEL_COOKIE, payload);
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}

export async function getPanelSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifyPanelToken(store.get(PANEL_COOKIE)?.value);
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function destroyPanelSession(): Promise<void> {
  const store = await cookies();
  store.delete(PANEL_COOKIE);
}

/**
 * Yönetici yetki kapısı — server action ve sayfalarda kullanılır.
 * Yalnız ADMIN ÇEREZİNE bakar; sporcu oturumu admin'e asla geçmez ve
 * çapraz yönlendirme yapılmaz (portallar ayrı).
 * Server action'lar middleware'i baypas eden POST uçları olduğu için her
 * admin mutasyonu BU kontrolü kendisi yapmalıdır.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const s = await getAdminSession();
  if (!s) redirect("/admin/giris");
  return s;
}

/** Sporcu/veli yetki kapısı — yalnız PANEL ÇEREZİNE bakar (athleteId zorunlu). */
export async function requireAthlete(): Promise<SessionPayload> {
  const s = await getPanelSession();
  if (!s) redirect("/giris");
  return s;
}
