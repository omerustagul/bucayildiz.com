import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/** Edge-safe oturum JWT yardımcıları (jose). next/headers veya bcrypt İÇERMEZ —
 *  middleware (edge runtime) bu modülü güvenle kullanabilir.
 *
 *  Portallar TAMAMEN ayrıdır: admin ve sporcu paneli ayrı çerezlerde ayrı
 *  oturum taşır. Birine giriş yapmak diğerini etkilemez; aynı tarayıcıda
 *  iki portala aynı anda oturum açılabilir. */

export const ADMIN_COOKIE = "by_admin_session";
export const PANEL_COOKIE = "by_panel_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 gün

export type SessionPayload = {
  sub: string;
  email: string;
  role: string;
  name: string;
  athleteId?: string;
  /** Oturum sürümü — DB'deki User.tokenVersion ile eşleşmeli (iptal kontrolü).
   *  Eski token'lar taşımaz → 0 sayılır (mevcut kullanıcılar da 0, zorla çıkış yok). */
  tv?: number;
};

/** HS256 SİMETRİKtir: anahtar zayıfsa çevrimdışı brute-force ile GEÇERLİ admin
 *  token'ı üretilebilir (tam hesap devralma). jose bu konuda korumaz — HS* yolunda
 *  anahtar uzunluğu HİÇ kontrol edilmez (uzunluk kapısı yalnız RSA'da var) → kapı burada.
 *  `openssl rand -hex 32` 64 karakter üretir; 32 güvenli alt sınırdır. */
const MIN_SECRET_LENGTH = 32;

/** Depoda AÇIKÇA duran örnek değerler — sır DEĞİLdirler. Uzunluk kapısını geçebildikleri
 *  için (placeholder 33, dev varsayılanı 48 karakter) ayrıca reddedilirler. Yalnız
 *  ÜRETİMde: yerel geliştirme .env.example varsayılanıyla çalışmaya devam etsin. */
const PUBLIC_EXAMPLE_SECRETS = new Set([
  "dev-secret-change-in-production-0a1b2c3d4e5f6071", // .env.example
  "BURAYA_OPENSSL_RAND_HEX_32_DEGERI", // .env.production.example
]);

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET tanımlı değil.");
  if (secret.length < MIN_SECRET_LENGTH) {
    // Yalnız UZUNLUK yazılır — değerin kendisi asla log'a/hataya girmez.
    throw new Error(`AUTH_SECRET çok kısa (${secret.length} karakter) — en az ${MIN_SECRET_LENGTH} olmalı. Üretin: openssl rand -hex 32`);
  }
  if (process.env.NODE_ENV === "production" && PUBLIC_EXAMPLE_SECRETS.has(secret)) {
    throw new Error("AUTH_SECRET depodaki ÖRNEK değerde — herkese açık olduğu için sır değil. Üretimde kendi değerinizi koyun: openssl rand -hex 32");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Admin portalına erişebilen roller: "admin" ve "owner" (RBAC — owner tüm izinlere
 *  sahip). Panel/sporcu portalı ayrıdır (athlete). Tüm admin-portal kapıları bunu kullanır. */
export function isAdminRole(role: string): boolean {
  return role === "admin" || role === "owner";
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.sub === "string" && typeof payload.email === "string") {
      // Bilinmeyen rolü sessizce "athlete"e DÜŞÜRME — token'ı reddet (fail-closed,
      // açık). Meşru token'lar yalnız "admin"|"owner"|"athlete" taşır; diğerleri bozuktur.
      const role = payload.role;
      if (role !== "admin" && role !== "owner" && role !== "athlete") return null;
      return {
        sub: payload.sub,
        email: payload.email,
        role,
        name: String(payload.name ?? ""),
        athleteId: typeof payload.athleteId === "string" ? payload.athleteId : undefined,
        tv: typeof payload.tv === "number" ? payload.tv : 0,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/** Admin çerezinden YALNIZ admin oturumu döner (rol kapısı çerezde de uygulanır). */
export async function verifyAdminToken(token: string | undefined): Promise<SessionPayload | null> {
  const s = await verifySession(token);
  return s && isAdminRole(s.role) ? s : null;
}

/** Panel çerezinden YALNIZ sporcu oturumu döner (athleteId zorunlu). */
export async function verifyPanelToken(token: string | undefined): Promise<SessionPayload | null> {
  const s = await verifySession(token);
  return s && s.athleteId ? s : null;
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
