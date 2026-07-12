// @vitest-environment node
// #7 oturum yaşam döngüsü: getAdminSession/getPanelSession token'ı doğrularken
// DB'deki tokenVersion + varlık + rol/athleteId'yi de kontrol eder.
// Kilitlenen kritik yollar: iptal (sürüm artışı), silinen kullanıcı, rol düşürme,
// ve tokenVersion'a rağmen KORUNAN portal izolasyonu.
import { describe, it, expect, vi, beforeAll } from "vitest";
vi.mock("server-only", () => ({}));

const H = vi.hoisted(() => ({
  cookieVal: undefined as string | undefined,
  user: null as null | { tokenVersion: number; role: string; athleteId: string | null },
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => (H.cookieVal ? { value: H.cookieVal } : undefined) }),
}));
vi.mock("next/navigation", () => ({ redirect: (u: string) => { throw new Error("REDIRECT:" + u); } }));
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: vi.fn(async () => H.user) } } }));

import { signSession } from "@/lib/session";
import { getAdminSession, getPanelSession } from "@/lib/auth";

beforeAll(() => { process.env.AUTH_SECRET = "test-secret-0123456789abcdef0123456789abcdef"; });

const admin = { sub: "u-admin", email: "a@x", role: "admin", name: "Admin", tv: 3 };
const athlete = { sub: "u-ath", email: "arda", role: "athlete", name: "Arda", athleteId: "ath-1", tv: 2 };

describe("getAdminSession — tokenVersion DB doğrulaması", () => {
  it("tokenVersion eşleşince oturum geçerli", async () => {
    H.cookieVal = await signSession(admin);
    H.user = { tokenVersion: 3, role: "admin", athleteId: null };
    expect((await getAdminSession())?.sub).toBe("u-admin");
  });

  it("DB tokenVersion arttıysa (şifre değişti/her yerden çıkış) eski token REDDEDİLİR", async () => {
    H.cookieVal = await signSession(admin); // tv=3
    H.user = { tokenVersion: 4, role: "admin", athleteId: null };
    expect(await getAdminSession()).toBeNull();
  });

  it("kullanıcı silindiyse REDDEDİLİR (7 gün bayat erişim kapandı)", async () => {
    H.cookieVal = await signSession(admin);
    H.user = null;
    expect(await getAdminSession()).toBeNull();
  });

  it("admin rolü düşürüldüyse REDDEDİLİR", async () => {
    H.cookieVal = await signSession(admin);
    H.user = { tokenVersion: 3, role: "athlete", athleteId: "x" };
    expect(await getAdminSession()).toBeNull();
  });
});

describe("izolasyon tokenVersion sonrası da korunur", () => {
  it("admin token'ı panel oturumu AÇAMAZ (athleteId yok — DB'ye bile gitmeden red)", async () => {
    H.cookieVal = await signSession(admin);
    H.user = { tokenVersion: 3, role: "admin", athleteId: null };
    expect(await getPanelSession()).toBeNull();
  });

  it("geçerli sürümlü athlete oturumu panelde açılır", async () => {
    H.cookieVal = await signSession(athlete);
    H.user = { tokenVersion: 2, role: "athlete", athleteId: "ath-1" };
    expect((await getPanelSession())?.athleteId).toBe("ath-1");
  });
});
