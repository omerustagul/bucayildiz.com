// @vitest-environment node
// (jose, jsdom'un cross-realm Uint8Array'ini reddeder; oturum mantığı zaten
//  sunucu/edge tarafıdır — DOM gerekmez.)
import { afterEach, beforeAll, describe, expect, it } from "vitest";
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

// AUTH_SECRET kapısı — HS256 SİMETRİK olduğu için zayıf anahtar = token forge =
// tam hesap devralma. jose HS* yolunda uzunluk KONTROL ETMEZ, kapı bizde.
describe("AUTH_SECRET kapısı", () => {
  const GOOD = "test-secret-0123456789abcdef0123456789abcdef";
  afterEach(() => {
    process.env.AUTH_SECRET = GOOD; // diğer testler bozulmasın
  });

  it("32 karakterden KISA secret reddedilir (brute-force'a açık)", async () => {
    process.env.AUTH_SECRET = "kisa-secret";
    await expect(signSession(payload)).rejects.toThrow(/en az 32/i);
  });

  it("tam 32 karakter kabul edilir (sınır)", async () => {
    process.env.AUTH_SECRET = "a".repeat(32);
    await expect(signSession(payload)).resolves.toBeTypeOf("string");
  });

  it("AUTH_SECRET yoksa reddedilir", async () => {
    delete (process.env as Record<string, string | undefined>).AUTH_SECRET;
    await expect(signSession(payload)).rejects.toThrow(/tanımlı değil/i);
  });

  it("hata mesajı secret DEĞERİNİ sızdırmaz (yalnız uzunluk)", async () => {
    const gizli = "cok-gizli-kisa";
    process.env.AUTH_SECRET = gizli;
    await expect(signSession(payload)).rejects.toThrow(
      expect.objectContaining({ message: expect.not.stringContaining(gizli) }),
    );
  });
});

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
