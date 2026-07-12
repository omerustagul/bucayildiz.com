// @vitest-environment node
// KVKK denetim izi bütünlüğü — recordConsents guard'ı + satır üretimi.
import { describe, it, expect, vi } from "vitest";
import { recordConsents } from "@/lib/consent.server";

function fakeDb(docs: unknown[]) {
  const createMany = vi.fn(async (args: { data: unknown[] }) => ({ count: args.data.length }));
  const db = {
    consentDocument: { findMany: vi.fn(async () => docs) },
    consentRecord: { createMany },
    // recordConsents yalnız yukarıdaki ikisini kullanır; DbClient tipini karşılamak için cast.
  } as unknown as Parameters<typeof recordConsents>[3];
  return { db, createMany };
}

const meta = { granterName: "Veli", channel: "basvuru" };

describe("recordConsents (KVKK audit bütünlüğü)", () => {
  it("aktif belge yoksa HATA fırlatır (sessiz 0-satır yazmaz)", async () => {
    const { db, createMany } = fakeDb([]);
    await expect(
      recordConsents({ "acik-riza": true }, { applicationId: "a1" }, meta, db),
    ).rejects.toThrow(/onay belgesi bulunamadı/i);
    expect(createMany).not.toHaveBeenCalled();
  });

  it("her aktif belge için bir denetim satırı yazar (granted haritası + metin hash'i)", async () => {
    const docs = [
      { key: "aydinlatma", version: "v1", title: "Aydınlatma", body: "metin-1", ordering: 1 },
      { key: "acik-riza", version: "v1", title: "Açık Rıza", body: "metin-2", ordering: 2 },
      { key: "pazarlama", version: "v1", title: "Pazarlama", body: "metin-3", ordering: 3 },
    ];
    const { db, createMany } = fakeDb(docs);
    const n = await recordConsents(
      { aydinlatma: true, "acik-riza": true, pazarlama: false },
      { applicationId: "a1" },
      meta,
      db,
    );
    expect(n).toBe(3);
    expect(createMany).toHaveBeenCalledOnce();
    const rows = createMany.mock.calls[0][0].data as Array<Record<string, unknown>>;
    expect(rows).toHaveLength(3);
    expect(rows.find((r) => r.documentKey === "acik-riza")?.granted).toBe(true);
    expect(rows.find((r) => r.documentKey === "pazarlama")?.granted).toBe(false);
    // istemciye güvenilmez: metnin SHA-256'sı (64 hex) her satırda var
    expect(rows.every((r) => typeof r.textHash === "string" && (r.textHash as string).length === 64)).toBe(true);
    expect(rows.every((r) => r.applicationId === "a1")).toBe(true);
  });
});
