// @vitest-environment node
// KVKK denetim izi bütünlüğü — recordConsents guard'ı + satır üretimi
// + foto-video rıza kapısı (photoConsentedAthleteIds).
import { describe, it, expect, vi } from "vitest";

// photoConsentedAthleteIds modül-seviyesi prisma kullanır (recordConsents'in aksine
// db enjekte edilemez) → mock'lanır. recordConsents testleri kendi fake db'lerini
// geçtiği için bu mock onları ETKİLEMEZ.
const H = vi.hoisted(() => ({
  rows: [] as Array<Record<string, unknown>>,
  requiredDocs: [] as Array<{ key: string; version: string }>,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    consentRecord: { findMany: vi.fn(async () => H.rows) },
    consentDocument: { findMany: vi.fn(async () => H.requiredDocs) },
  },
}));

import { recordConsents, photoConsentedAthleteIds, missingRequiredConsents } from "@/lib/consent.server";

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

// Foto-video rıza kapısı: public kadroda çocuğun fotoğrafının gösterilip
// gösterilmeyeceğini belirler → yanlışı KVKK ihlali demek. Sorgu createdAt DESC
// döndüğü için her sporcunun İLK satırı en yenisidir; mock'lar bu sırayı taklit eder.
describe("photoConsentedAthleteIds (foto-video kapısı)", () => {
  it("kayıt YOKSA rıza sayılmaz (fail-closed — 'hiç sorulmamış' da yayımlanmaz)", async () => {
    H.rows = [];
    expect([...(await photoConsentedAthleteIds(["a1"]))]).toEqual([]);
  });

  it("granted + geri alınmamış → rıza VAR", async () => {
    H.rows = [{ athleteId: "a1", granted: true, withdrawnAt: null }];
    expect([...(await photoConsentedAthleteIds(["a1"]))]).toEqual(["a1"]);
  });

  it("EN YENİ kayıt geri alınmışsa, ESKİ granted kaydı rızayı geri getirmez", async () => {
    // DESC: önce en yeni (geri alma), sonra eski (verilmiş)
    H.rows = [
      { athleteId: "a1", granted: false, withdrawnAt: new Date() },
      { athleteId: "a1", granted: true, withdrawnAt: null },
    ];
    expect([...(await photoConsentedAthleteIds(["a1"]))]).toEqual([]);
  });

  it("withdrawnAt doluysa granted:true olsa bile rıza YOK", async () => {
    H.rows = [{ athleteId: "a1", granted: true, withdrawnAt: new Date() }];
    expect([...(await photoConsentedAthleteIds(["a1"]))]).toEqual([]);
  });

  it("çok sporcu: yalnız rızalı olanlar döner", async () => {
    H.rows = [
      { athleteId: "a1", granted: true, withdrawnAt: null },
      { athleteId: "a2", granted: false, withdrawnAt: null },
      { athleteId: "a3", granted: true, withdrawnAt: null },
    ];
    const set = await photoConsentedAthleteIds(["a1", "a2", "a3"]);
    expect([...set].sort()).toEqual(["a1", "a3"]);
  });

  it("boş liste → sorgu atılmaz, boş küme", async () => {
    H.rows = [{ athleteId: "a1", granted: true, withdrawnAt: null }]; // yine de boş dönmeli
    expect([...(await photoConsentedAthleteIds([]))]).toEqual([]);
  });
});

// Panel ilk-giriş kapısının tetikleyicisi: hangi zorunlu rızalar EKSİK.
// Yanlışı = ya sıfır-rızalı sporcu paneli açar (fail-open, KVKK ihlali) ya da
// rızalı sporcu kilitlenir. DB-güdümlü (aktif+required belgeler).
describe("missingRequiredConsents (panel ilk-giriş kapısı)", () => {
  const V = "2026-06-15";
  const REQ = [
    { key: "aydinlatma", version: V },
    { key: "acik-riza", version: V },
    { key: "saglik-verisi", version: V },
  ];
  // Yardımcı: güncel sürüme rıza kaydı (sürüm kayması testleri hariç hep eşleşir).
  const grantedNow = (key: string) => ({ documentKey: key, documentVersion: V, granted: true, withdrawnAt: null });

  it("hiç kayıt yoksa TÜM zorunlular eksik (sıfır-rızalı admin sporcusu)", async () => {
    H.requiredDocs = REQ; H.rows = [];
    expect((await missingRequiredConsents("a1")).sort()).toEqual(["acik-riza", "aydinlatma", "saglik-verisi"]);
  });

  it("hepsi aktif onaylıysa eksik YOK (kapı tetiklenmez)", async () => {
    H.requiredDocs = REQ;
    H.rows = REQ.map((d) => grantedNow(d.key));
    expect(await missingRequiredConsents("a1")).toEqual([]);
  });

  it("bir zorunlu geri alınmışsa yalnız o eksik sayılır", async () => {
    H.requiredDocs = REQ;
    H.rows = [
      grantedNow("aydinlatma"),
      grantedNow("acik-riza"),
      { documentKey: "saglik-verisi", documentVersion: V, granted: false, withdrawnAt: new Date() },
    ];
    expect(await missingRequiredConsents("a1")).toEqual(["saglik-verisi"]);
  });

  it("EN YENİ kayıt esas: eski granted, yeni geri-alma varsa EKSİK", async () => {
    H.requiredDocs = [{ key: "saglik-verisi", version: V }];
    // DESC: önce yeni (geri alma), sonra eski (verilmiş)
    H.rows = [
      { documentKey: "saglik-verisi", documentVersion: V, granted: false, withdrawnAt: new Date() },
      { documentKey: "saglik-verisi", documentVersion: V, granted: true, withdrawnAt: null },
    ];
    expect(await missingRequiredConsents("a1")).toEqual(["saglik-verisi"]);
  });

  it("SÜRÜM KAYMASI: eski sürüme rıza verilmişse EKSİK (belge güncellendi → yeniden onay)", async () => {
    H.requiredDocs = [{ key: "acik-riza", version: "2026-07-01" }]; // güncel sürüm
    H.rows = [{ documentKey: "acik-riza", documentVersion: "2026-06-01", granted: true, withdrawnAt: null }]; // eski sürüme rıza
    expect(await missingRequiredConsents("a1")).toEqual(["acik-riza"]);
  });

  it("GÜNCEL sürüme rıza varsa eksik YOK (sürüm eşleşiyor)", async () => {
    H.requiredDocs = [{ key: "acik-riza", version: "2026-07-01" }];
    H.rows = [{ documentKey: "acik-riza", documentVersion: "2026-07-01", granted: true, withdrawnAt: null }];
    expect(await missingRequiredConsents("a1")).toEqual([]);
  });

  it("OPSİYONEL belgeler (required:false) tetikleyiciye GİRMEZ", async () => {
    // requiredDocs yalnız required:true döndürür (query where'i) → foto-video/pazarlama yok
    H.requiredDocs = REQ; // opsiyoneller listeye hiç gelmez
    H.rows = REQ.map((d) => grantedNow(d.key));
    expect(await missingRequiredConsents("a1")).toEqual([]);
  });

  it("aktif zorunlu belge yoksa eksik YOK (kapı kurulmadan panel açılır)", async () => {
    H.requiredDocs = []; H.rows = [];
    expect(await missingRequiredConsents("a1")).toEqual([]);
  });
});
