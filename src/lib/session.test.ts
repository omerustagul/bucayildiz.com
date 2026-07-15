// @vitest-environment node
// (jose, jsdom'un cross-realm Uint8Array'ini reddeder; oturum mantığı zaten
//  sunucu/edge tarafıdır — DOM gerekmez.)
import { beforeAll, describe, expect, it } from "vitest";
import { signSession, verifySession, isAdminRole, type SessionPayload } from "@/lib/session";

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

  it("bilinmeyen rol REDDEDİLİR (sessiz düşürme yok, fail-closed)", async () => {
    const token = await signSession({ ...payload, role: "superadmin" });
    expect(await verifySession(token)).toBeNull();
  });

  it("tokenVersion (tv) taşınır", async () => {
    const token = await signSession({ ...payload, tv: 5 });
    expect((await verifySession(token))?.tv).toBe(5);
  });

  it("token'da tv yoksa 0'a düşer (eski token uyumu — zorla çıkış yok)", async () => {
    const token = await signSession(payload); // tv alanı yok
    expect((await verifySession(token))?.tv).toBe(0);
  });
});

// Regresyon: RBAC'te admin→owner göçünden sonra owner admin portalına GİREBİLMELİ.
// Bu kapı yalnız "admin" kabul edince tüm yöneticiler kilitlenmişti — o hata bir daha olmasın.
describe("isAdminRole (RBAC admin portal kapısı)", () => {
  it("owner ve admin erişir; athlete/bilinmeyen erişemez (fail-closed)", () => {
    expect(isAdminRole("owner")).toBe(true);
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("athlete")).toBe(false);
    expect(isAdminRole("")).toBe(false);
  });

  it("owner token'ı verifySession'da REDDEDİLMEZ (kilitlenme yok)", async () => {
    const token = await signSession({ ...payload, role: "owner", athleteId: undefined });
    expect((await verifySession(token))?.role).toBe("owner");
  });
});
