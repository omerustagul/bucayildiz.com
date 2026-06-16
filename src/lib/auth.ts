import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, verifySession, SESSION_COOKIE, SESSION_MAX_AGE, type SessionPayload } from "@/lib/session";

/** Sunucu tarafı auth — şifre hash/doğrulama + oturum cookie yönetimi. */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Kullanıcı adı VEYA e-posta + şifre doğrula; başarılıysa oturumu kur. */
export async function login(identifier: string, password: string): Promise<SessionPayload | null> {
  const id = identifier.trim();
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: id.toLowerCase() }, { username: id }] },
  });
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  const payload: SessionPayload = {
    sub: user.id,
    email: user.email ?? user.username ?? "",
    role: user.role,
    name: user.name,
    athleteId: user.athleteId ?? undefined,
  };
  await createSession(payload);
  return payload;
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
