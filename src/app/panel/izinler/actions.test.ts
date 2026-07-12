// @vitest-environment node
// KVKK consent çift-tık idempotanlığı: durum değişmediyse yeni audit satırı
// YAZILMAZ (append-only izi şişirmez); gerçek değişiklikte YAZILIR.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  latest: null as null | { granted: boolean; withdrawnAt: Date | null },
  create: vi.fn(async () => ({})),
  findFirst: vi.fn(async () => H.latest),
}));

vi.mock("@/lib/auth", () => ({
  getPanelSession: async () => ({ athleteId: "ath-1", name: "Veli", sub: "u1", role: "athlete", email: "" }),
}));
vi.mock("next/headers", () => ({ headers: async () => new Map() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/consent.server", () => ({
  getConsentDocumentByKey: async (key: string) => ({ key, version: "v1", title: "Foto/Video", body: "b", required: false }),
  consentTextHash: () => "hash",
}));
vi.mock("@/lib/prisma", () => ({
  prisma: { consentRecord: { findFirst: H.findFirst, create: H.create } },
}));

import { setAthleteConsent } from "./actions";

beforeEach(() => {
  H.latest = null;
  H.create.mockClear();
  H.findFirst.mockClear();
});

describe("setAthleteConsent (çift-tık idempotanlık)", () => {
  it("durum zaten aynıysa (verili → yine ver) yeni satır YAZMAZ", async () => {
    H.latest = { granted: true, withdrawnAt: null }; // şu an verili
    const res = await setAthleteConsent("foto-video", true);
    expect(res).toEqual({ ok: true });
    expect(H.create).not.toHaveBeenCalled();
  });

  it("gerçek durum değişikliğinde (verili → geri al) yeni audit satırı YAZAR", async () => {
    H.latest = { granted: true, withdrawnAt: null };
    const res = await setAthleteConsent("foto-video", false);
    expect(res).toEqual({ ok: true });
    expect(H.create).toHaveBeenCalledOnce();
  });

  it("ilk kez (kayıt yok) verildiğinde YAZAR", async () => {
    H.latest = null;
    await setAthleteConsent("foto-video", true);
    expect(H.create).toHaveBeenCalledOnce();
  });

  it("geçersiz girdi (granted boolean değil) reddedilir, yazmaz", async () => {
    H.latest = null;
    const res = await setAthleteConsent("foto-video", "evet" as unknown);
    expect(res).toMatchObject({ ok: false });
    expect(H.create).not.toHaveBeenCalled();
  });

  it("boş documentKey reddedilir, yazmaz", async () => {
    H.latest = null;
    const res = await setAthleteConsent("", true);
    expect(res).toMatchObject({ ok: false });
    expect(H.create).not.toHaveBeenCalled();
  });
});
