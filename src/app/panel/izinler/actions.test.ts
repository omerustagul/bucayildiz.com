// @vitest-environment node
// KVKK consent çift-tık idempotanlığı: durum değişmediyse yeni audit satırı
// YAZILMAZ (append-only izi şişirmez); gerçek değişiklikte YAZILIR.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  latest: null as null | { granted: boolean; withdrawnAt: Date | null },
  // İmza AÇIKÇA verilir: argümansız çıkarım `mock.calls[0][0]`'ı `undefined`
  // tipler ve typecheck'te patlar (bu tuzağa daha önce de düşüldü).
  create: vi.fn(async (_args: { data: Record<string, unknown> }) => ({})),
  findFirst: vi.fn(async () => H.latest),
  // foto-video değişiminde public kadroyu tazelemek için sporcunun takımı okunur
  athleteFindUnique: vi.fn(async () => ({ team: { slug: "u-17" } })),
  resolveGranter: vi.fn(async () => ({ name: "Ayşe Yılmaz", relation: "veli" })),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getPanelSession: async () => ({ athleteId: "ath-1", name: "Veli", sub: "u1", role: "athlete", email: "" }),
}));
vi.mock("next/headers", () => ({ headers: async () => new Map() }));
vi.mock("next/cache", () => ({ revalidatePath: H.revalidatePath }));
vi.mock("@/lib/consent.server", () => ({
  getConsentDocumentByKey: async (key: string) => ({ key, version: "v1", title: "Foto/Video", body: "b", required: false }),
  consentTextHash: () => "hash",
  // Onaylayan kişi çözümü ayrı ayrıca test edilir (consent.granter.test.ts);
  // burada YALNIZ sonucunun kayda geçtiği doğrulanır.
  resolveAthleteGranter: H.resolveGranter,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    consentRecord: { findFirst: H.findFirst, create: H.create },
    athlete: { findUnique: H.athleteFindUnique },
  },
}));

import { setAthleteConsent } from "./actions";

beforeEach(() => {
  H.latest = null;
  H.create.mockClear();
  H.findFirst.mockClear();
  H.revalidatePath.mockClear();
  H.athleteFindUnique.mockClear();
  H.resolveGranter.mockClear();
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

  // KVKK: kayıt "kim onayladı"yı DOĞRU yazmalı. Panel hesabının adı ÇOCUĞUN adıdır;
  // eskiden sabit "veli" yazılıyordu → "Veli: <çocuğun adı>" gibi tutarsız iz kalıyordu.
  it("onaylayan kişi ÇÖZÜLEREK yazılır — hesap adı + sabit 'veli' DEĞİL", async () => {
    H.latest = null;
    await setAthleteConsent("foto-video", true);
    expect(H.resolveGranter).toHaveBeenCalledWith("ath-1", "Veli"); // (athleteId, hesap adı)
    const row = H.create.mock.calls[0]![0].data;
    expect(row.granterName).toBe("Ayşe Yılmaz");
    expect(row.granterRelation).toBe("veli");
  });

  it("çözümleyici yakınlık bilmiyorsa kayda 'veli' YAZILMAZ", async () => {
    H.latest = null;
    H.resolveGranter.mockResolvedValueOnce({ name: "Can Demir", relation: "hesap-sahibi" });
    await setAthleteConsent("foto-video", true);
    const row = H.create.mock.calls[0]![0].data;
    expect(row.granterRelation).toBe("hesap-sahibi");
    expect(row.granterRelation).not.toBe("veli");
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

// KVKK md.11: geri alma GECİKMEKSİZİN işlemeli. Public kadro ISR'li (revalidate=60)
// olduğu için foto-video değişiminde takım sayfası AÇIKÇA tazelenmeli — yoksa geri
// alınan fotoğraf 60sn'ye kadar yayında kalır.
describe("foto-video değişimi public kadroyu tazeler", () => {
  it("foto-video GERİ ALINDIĞINDA sporcunun takım sayfası hemen revalidate edilir", async () => {
    H.latest = { granted: true, withdrawnAt: null }; // şu an verili → geri alma gerçek değişiklik
    await setAthleteConsent("foto-video", false);
    expect(H.revalidatePath).toHaveBeenCalledWith("/takimlar/u-17");
  });

  it("foto-video dışındaki belgede takım sayfası tazelenmez (gereksiz invalidasyon yok)", async () => {
    H.latest = { granted: false, withdrawnAt: null };
    await setAthleteConsent("pazarlama", true);
    expect(H.revalidatePath).not.toHaveBeenCalledWith(expect.stringContaining("/takimlar/"));
  });
});
