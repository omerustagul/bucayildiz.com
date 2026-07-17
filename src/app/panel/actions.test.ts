// @vitest-environment node
// Panel ilk-giriş sözleşme kapısı aksiyonu — KVKK Faz 0.1.
// Kanıtlanan: (1) rızalar athleteId + audit meta ile yazılır, (2) SUNUCU zorunluları
// yeniden doğrular (istemci bloğu atlayamaz), (3) minörde granterRelation="veli"
// zorlanır (yetişkinde korunur), (4) Zod girdi doğrulaması.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  missing: [] as string[],
  birthDate: null as string | null,
  // recordConsents imzasıyla tiplenir → mock.calls[0] doğru 3'lü tuple olur.
  record: vi.fn(async (_granted: Record<string, boolean>, _target: { athleteId?: string; applicationId?: string }, _meta: Record<string, unknown>) => 5),
}));

vi.mock("@/lib/auth", () => ({
  requireAthlete: async () => ({ athleteId: "ath-1", sub: "u1", name: "Ali", role: "athlete", email: "" }),
  destroyPanelSession: async () => {},
}));
vi.mock("@/lib/consent.server", () => ({
  missingRequiredConsents: async () => H.missing,
  recordConsents: H.record,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: { athlete: { findUnique: async () => ({ birthDate: H.birthDate }) } },
}));
vi.mock("next/headers", () => ({ headers: async () => new Map([["user-agent", "test-ua"]]) }));
vi.mock("@/lib/net", () => ({ clientIp: () => "1.2.3.4" }));

import { captureInitialConsents } from "./actions";

const REQ = { aydinlatma: true, "acik-riza": true, "saglik-verisi": true };

beforeEach(() => {
  H.missing = ["aydinlatma", "acik-riza", "saglik-verisi"];
  H.birthDate = "2015-01-01"; // minör (bugüne göre ~11)
  H.record.mockClear();
});

describe("captureInitialConsents", () => {
  it("rızaları athleteId + audit meta ile kaydeder (kanal=panel-ilk-giris)", async () => {
    const res = await captureInitialConsents({ consents: { ...REQ, "foto-video": false }, granterName: "Veli Yılmaz", granterRelation: "veli" });
    expect(res).toEqual({ ok: true });
    expect(H.record).toHaveBeenCalledOnce();
    const [granted, target, meta] = H.record.mock.calls[0];
    expect(granted).toMatchObject(REQ);
    expect(target).toEqual({ athleteId: "ath-1" });
    expect(meta).toMatchObject({ granterName: "Veli Yılmaz", channel: "panel-ilk-giris", ipAddress: "1.2.3.4" });
  });

  it("SUNUCU doğrulaması: eksik bir zorunlu bu istekte onaylanmamışsa reddeder, YAZMAZ", async () => {
    // İstemci saglik-verisi'ni false gönderiyor ama sunucu onu EKSİK biliyor → blok atlanamaz.
    const res = await captureInitialConsents({ consents: { aydinlatma: true, "acik-riza": true, "saglik-verisi": false }, granterName: "Veli", granterRelation: "veli" });
    expect(res).toMatchObject({ ok: false });
    expect(H.record).not.toHaveBeenCalled();
  });

  it("MİNÖR: istemci 'kendisi' gönderse de granterRelation='veli' ZORLANIR", async () => {
    H.birthDate = "2015-01-01";
    await captureInitialConsents({ consents: REQ, granterName: "Veli", granterRelation: "kendisi" });
    expect((H.record.mock.calls[0][2] as { granterRelation: string }).granterRelation).toBe("veli");
  });

  it("YETİŞKİN: istemcinin granterRelation'ı korunur (kendisi)", async () => {
    H.birthDate = "1990-01-01";
    await captureInitialConsents({ consents: REQ, granterName: "Ali Veli", granterRelation: "kendisi" });
    expect((H.record.mock.calls[0][2] as { granterRelation: string }).granterRelation).toBe("kendisi");
  });

  it("doğum tarihi boşsa istemci seçimi korunur", async () => {
    H.birthDate = null;
    await captureInitialConsents({ consents: REQ, granterName: "X Veli", granterRelation: "veli" });
    expect((H.record.mock.calls[0][2] as { granterRelation: string }).granterRelation).toBe("veli");
  });

  it("granterName çok kısaysa reddeder, YAZMAZ", async () => {
    const res = await captureInitialConsents({ consents: REQ, granterName: "A", granterRelation: "veli" });
    expect(res).toMatchObject({ ok: false });
    expect(H.record).not.toHaveBeenCalled();
  });

  it("geçersiz relation reddeder", async () => {
    const res = await captureInitialConsents({ consents: REQ, granterName: "Veli Ad", granterRelation: "amca" });
    expect(res).toMatchObject({ ok: false });
    expect(H.record).not.toHaveBeenCalled();
  });
});
