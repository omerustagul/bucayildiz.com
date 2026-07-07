// @vitest-environment node
// (jose, jsdom'un cross-realm Uint8Array'ini reddeder; oturum mantığı zaten
//  sunucu/edge tarafıdır — DOM gerekmez.)
import { beforeAll, describe, expect, it } from "vitest";
import { signSession, verifySession, type SessionPayload } from "@/lib/session";

// Oturum JWT'sinin imzalama/doğrulama turu — güvenliğin kalbi.
// AUTH_SECRET testte set edilir (session.ts her çağrıda process.env'den okur).

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-0123456789abcdef0123456789abcdef";
});

const payload: SessionPayload = {
  sub: "athlete-1",
  email: "arda.yilmaz",
  role: "athlete",
  name: "Arda Yılmaz",
  athleteId: "ath-1",
};

describe("session", () => {
  it("imzalanan token aynı payload'a çözülür", async () => {
    const token = await signSession(payload);
    const decoded = await verifySession(token);
    expect(decoded).toMatchObject(payload);
  });

  it("geçersiz/kurcalanmış token null döner (fail-closed)", async () => {
    const token = await signSession(payload);
    const tampered = token.slice(0, -3) + "aaa";
    expect(await verifySession(tampered)).toBeNull();
    expect(await verifySession(undefined)).toBeNull();
    expect(await verifySession("çöp")).toBeNull();
  });

  it("bilinmeyen rol 'athlete'e düşürülür (yetki yükseltmesini önler)", async () => {
    const token = await signSession({ ...payload, role: "superadmin" });
    const decoded = await verifySession(token);
    expect(decoded?.role).toBe("athlete");
  });
});
