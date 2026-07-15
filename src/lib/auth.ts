import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import {
  signSession,
  verifyAdminToken,
  verifyPanelToken,
  isAdminRole,
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
    tv: user.tokenVersion,
  };
}

/**
 * Token geçerli imzalı olsa da hâlâ GÜNCEL mi? DB'deki kullanıcıyı okur:
 * - kullanıcı silinmişse geçersiz (erişim anında biter),
 * - tokenVersion uyuşmuyorsa geçersiz (şifre değişimi / her yerden çıkış),
 * - admin portalı için rol hâlâ admin, panel için athleteId hâlâ dolu olmalı.
 * Bu, JWT'nin 7 gün "bayat" kalmasını (silinen/rol-düşürülen kullanıcı) kapatır.
 */
async function isSessionCurrent(s: SessionPayload, portal: "admin" | "panel"): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: s.sub },
    select: { tokenVersion: true, role: true, athleteId: true },
  });
  if (!user) return false;
  if ((s.tv ?? 0) !== user.tokenVersion) return false;
  if (portal === "admin" && !isAdminRole(user.role)) return false;
  if (portal === "panel" && !user.athleteId) return false;
  return true;
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
  if (!isAdminRole(payload.role)) throw new Error("Admin oturumu yalnız admin/owner rolüyle kurulabilir.");
  await setSessionCookie(ADMIN_COOKIE, payload);
}

/** Sporcu paneli oturumu kurar — athleteId zorunlu. */
export async function createPanelSession(payload: SessionPayload): Promise<void> {
  if (!payload.athleteId) throw new Error("Panel oturumu yalnız sporcu hesabıyla kurulabilir.");
  await setSessionCookie(PANEL_COOKIE, payload);
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const s = await verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
  if (!s) return null;
  return (await isSessionCurrent(s, "admin")) ? s : null;
}

export async function getPanelSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const s = await verifyPanelToken(store.get(PANEL_COOKIE)?.value);
  if (!s) return null;
  return (await isSessionCurrent(s, "panel")) ? s : null;
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

/**
 * Granular yetki kapısı. Önce requireAdmin (oturum + tazelik), sonra DB'den GÜNCEL
 * rol+izinleri okuyup `key`'i kontrol eder — izinler JWT'ye YAZILMADIĞINDAN (bkz.
 * SessionPayload) değişiklik anında geçerli olur. `owner` tümüne erişir. Yetki yoksa
 * /admin'e yönlendirir (kullanıcı bağlamda kalır; nav zaten yetkisiz sayfayı gizler,
 * bu server tarafı savunma derinliğidir). Her admin sayfası/action'ı ilgili anahtarla
 * çağırır: sayfa `alan.view`, mutasyon `alan.manage`.
 */
export async function requirePermission(key: string): Promise<SessionPayload> {
  const s = await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: s.sub }, select: { role: true, permissions: true } });
  if (!user || !hasPermission(user.role, user.permissions, key)) redirect("/admin");
  return s;
}

/** Bir admin'in GÜNCEL rol+izinlerini DB'den getirir (nav filtreleme, UI). null = admin değil. */
export async function getAdminPermissions(): Promise<{ role: string; permissions: string[] } | null> {
  const s = await getAdminSession();
  if (!s) return null;
  const user = await prisma.user.findUnique({ where: { id: s.sub }, select: { role: true, permissions: true } });
  return user ? { role: user.role, permissions: user.permissions } : null;
}

/**
 * Yalnız SAHİP (owner) kapısı. Kullanıcı/yetki yönetimi gibi YETKİ-YÜKSELTMEYE açık
 * işlemler bununla korunur — bir admin'e "kullanicilar" izni verilse bile owner
 * değilse geçemez (privilege escalation kapalı). Owner değilse /admin'e yönlendirir.
 */
export async function requireOwner(): Promise<SessionPayload> {
  const s = await requireAdmin();
  const user = await prisma.user.findUnique({ where: { id: s.sub }, select: { role: true } });
  if (user?.role !== "owner") redirect("/admin");
  return s;
}

/** Sporcu/veli yetki kapısı — yalnız PANEL ÇEREZİNE bakar (athleteId zorunlu). */
export async function requireAthlete(): Promise<SessionPayload> {
  const s = await getPanelSession();
  if (!s) redirect("/giris");
  return s;
}
