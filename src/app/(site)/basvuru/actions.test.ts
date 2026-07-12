// @vitest-environment node
// KVKK atomiklik regresyonu: Application + consent audit TEK transaction'da.
// Kanıtlanan: (1) consent yazımı başarısızsa YETİM Application kalmaz (rollback),
// (2) başarılıysa audit satırları HER ZAMAN yazılır, (3) geçersiz girdi DB'ye gitmez.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { __resetRateLimit } from "@/lib/rate-limit";

const H = vi.hoisted(() => ({
  activeDocs: [] as Array<Record<string, unknown>>,
  store: { apps: [] as unknown[], consents: [] as unknown[] },
  notify: vi.fn(async () => {}),
}));

vi.mock("next/headers", () => ({
  headers: async () => new Map([["user-agent", "test-ua"], ["x-forwarded-for", "1.2.3.4"]]),
}));
vi.mock("@/lib/mail", () => ({ notifyNewApplication: H.notify }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    // Gerçekçi atomiklik modeli: callback stage'e yazar; throw ederse stage
    // ATILIR (rollback) — yalnız cb başarıyla dönerse committed store'a işlenir.
    $transaction: async (cb: (tx: unknown) => Promise<unknown>) => {
      const stage = { apps: [] as unknown[], consents: [] as unknown[] };
      const tx = {
        application: {
          create: async ({ data }: { data: Record<string, unknown> }) => {
            const row = { id: `app-${stage.apps.length + 1}`, ...data };
            stage.apps.push(row);
            return row;
          },
        },
        consentDocument: { findMany: async () => H.activeDocs },
        consentRecord: {
          createMany: async ({ data }: { data: unknown[] }) => {
            stage.consents.push(...data);
            return { count: data.length };
          },
        },
      };
      const r = await cb(tx);
      H.store.apps.push(...stage.apps);
      H.store.consents.push(...stage.consents);
      return r;
    },
  },
}));

import { submitApplication } from "./actions";

const validInput = {
  athleteName: "Arda Yılmaz",
  birthDate: "2012-05-10",
  ageGroup: "U-15",
  parentName: "Mehmet Yılmaz",
  phone: "0532 000 00 00",
  email: "",
  consents: { aydinlatma: true, "acik-riza": true, "saglik-verisi": true },
};

beforeEach(() => {
  H.store.apps = [];
  H.store.consents = [];
  H.activeDocs = [];
  H.notify.mockClear();
  __resetRateLimit();
});

describe("submitApplication (KVKK atomiklik)", () => {
  it("aktif belge yoksa: transaction geri alınır, YETİM Application kalmaz", async () => {
    H.activeDocs = [];
    const res = await submitApplication(validInput);
    expect(res).toEqual({ ok: false, error: expect.any(String) });
    expect(H.store.apps).toHaveLength(0); // rollback → audit izsiz kayıt yok
    expect(H.store.consents).toHaveLength(0);
  });

  it("başarılı: Application + her belge için audit satırı yazılır", async () => {
    H.activeDocs = [
      { key: "aydinlatma", version: "v1", title: "A", body: "b1", ordering: 1 },
      { key: "acik-riza", version: "v1", title: "B", body: "b2", ordering: 2 },
      { key: "saglik-verisi", version: "v1", title: "C", body: "b3", ordering: 3 },
    ];
    const res = await submitApplication(validInput);
    expect(res).toEqual({ ok: true });
    expect(H.store.apps).toHaveLength(1);
    expect(H.store.consents).toHaveLength(3); // audit her zaman yazıldı
  });

  it("geçersiz doğum tarihi (2012-13-40) reddedilir, DB'ye hiç yazılmaz", async () => {
    H.activeDocs = [{ key: "acik-riza", version: "v1", title: "B", body: "b", ordering: 1 }];
    const res = await submitApplication({ ...validInput, birthDate: "2012-13-40" });
    expect(res).toMatchObject({ ok: false });
    expect(H.store.apps).toHaveLength(0);
  });

  it("honeypot doluysa: sessizce ok döner ama DB'ye HİÇBİR ŞEY yazmaz (bot)", async () => {
    H.activeDocs = [{ key: "acik-riza", version: "v1", title: "B", body: "b", ordering: 1 }];
    const res = await submitApplication({ ...validInput, website: "http://spam.example" });
    expect(res).toEqual({ ok: true });
    expect(H.store.apps).toHaveLength(0);
    expect(H.store.consents).toHaveLength(0);
  });

  it("aynı IP'den 5 başvurudan sonrası rate-limit'e takılır", async () => {
    H.activeDocs = [{ key: "acik-riza", version: "v1", title: "B", body: "b", ordering: 1 }];
    for (let i = 0; i < 5; i++) expect((await submitApplication(validInput)).ok).toBe(true);
    const sixth = await submitApplication(validInput);
    expect(sixth).toMatchObject({ ok: false });
    expect(H.store.apps).toHaveLength(5); // 6.'sı yazılmadı
  });
});
