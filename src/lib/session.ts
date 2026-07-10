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
};

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET tanımlı değil.");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.sub === "string" && typeof payload.email === "string") {
      return {
        sub: payload.sub,
        email: payload.email,
        role: payload.role === "admin" ? "admin" : "athlete",
        name: String(payload.name ?? ""),
        athleteId: typeof payload.athleteId === "string" ? payload.athleteId : undefined,
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
  return s && s.role === "admin" ? s : null;
}

/** Panel çerezinden YALNIZ sporcu oturumu döner (athleteId zorunlu). */
export async function verifyPanelToken(token: string | undefined): Promise<SessionPayload | null> {
  const s = await verifySession(token);
  return s && s.athleteId ? s : null;
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
