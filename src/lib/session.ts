import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/** Edge-safe oturum JWT yardımcıları (jose). next/headers veya bcrypt İÇERMEZ —
 *  middleware (edge runtime) bu modülü güvenle kullanabilir. */

export const SESSION_COOKIE = "by_session";
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
        role: String(payload.role ?? "admin"),
        name: String(payload.name ?? ""),
        athleteId: typeof payload.athleteId === "string" ? payload.athleteId : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
