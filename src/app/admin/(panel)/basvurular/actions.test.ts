// @vitest-environment node
// Başvuru → Sporcu dönüşümü: KVKK rıza taşıma + ATOMİKLİK.
// Kanıtlanan: (1) rıza satırlarına athleteId İŞLENİR ve applicationId KORUNUR
// (soykütük), (2) reddedilen rızalar da taşınır ("reddetti" ≠ "hiç sorulmadı"),
// (3) herhangi bir adım patlarsa sporcu YAZILMAZ (yoksa "sporcu var ama rızası yok"
// hayaleti sessizce oluşur ve foto/sağlık kapıları sebebi görünmeden kapalı kalır),
// (4) mükerrer dönüşüm reddedilir, (5) durum "registered" olur, (6) yetki kapıları.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  app: null as Record<string, unknown> | null,
  athlete: null as Record<string, unknown> | null,
  // committed store — yalnız transaction başarıyla dönerse dolar
  store: {
    athletes: [] as Record<string, unknown>[],
    athleteUpdates: [] as Record<string, unknown>[],
    consentUpdates: [] as Record<string, unknown>[],
    consentDeletes: [] as Record<string, unknown>[],
    statuses: [] as string[],
  },
  failConsentUpdate: false,
  requirePermission: vi.fn(async (key: string) => ({ role: "admin", sub: "u1", name: "Admin", email: "", perm: key })),
  audit: vi.fn(async () => ({})),
  // Atomikliği DOLAYLI değil AÇIK doğrulamak için: üç yazmanın da tek transaction
  // içinde olduğunu assert ederiz (aksi halde mock genişletilirse test sahte geçer).
  txSpy: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requirePermission: H.requirePermission }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ headers: async () => new Map([["x-forwarded-for", "1.2.3.4"]]) }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    application: { findUnique: async () => H.app },
    athlete: { findUnique: async () => H.athlete },
    adminAuditLog: { create: H.audit },
    // Gerçekçi atomiklik: cb stage'e yazar; throw ederse stage ATILIR (rollback).
    $transaction: async (cb: (tx: unknown) => Promise<unknown>) => {
      H.txSpy();
      const stage = {
        athletes: [] as Record<string, unknown>[],
        athleteUpdates: [] as Record<string, unknown>[],
        consentUpdates: [] as Record<string, unknown>[],
        consentDeletes: [] as Record<string, unknown>[],
        statuses: [] as string[],
      };
      const tx = {
        athlete: {
          create: async ({ data }: { data: Record<string, unknown> }) => {
            const row = { id: "ath-new", ...data };
            stage.athletes.push(row);
            return row;
          },
          update: async (args: Record<string, unknown>) => {
            stage.athleteUpdates.push(args);
            return {};
          },
        },
        consentRecord: {
          updateMany: async (args: Record<string, unknown>) => {
            if (H.failConsentUpdate) throw new Error("consent update patladı");
            stage.consentUpdates.push(args);
            return { count: 2 };
          },
          // Rıza satırı SİLİNMEMELİ — çağrılırsa testler yakalasın diye kaydediyoruz.
          deleteMany: async (args: Record<string, unknown>) => {
            stage.consentDeletes.push(args);
            return { count: 0 };
          },
        },
        application: {
          update: async ({ data }: { data: { status: string } }) => {
            stage.statuses.push(data.status);
            return {};
          },
        },
      };
      const r = await cb(tx);
      H.store.athletes.push(...stage.athletes);
      H.store.athleteUpdates.push(...stage.athleteUpdates);
      H.store.consentUpdates.push(...stage.consentUpdates);
      H.store.consentDeletes.push(...stage.consentDeletes);
      H.store.statuses.push(...stage.statuses);
      return r;
    },
  },
}));

import { createAthleteFromApplication, linkAthleteToApplication, unlinkAthleteFromApplication } from "./actions";

const APP = {
  id: "app-1",
  athleteName: "Kerem Yıldız",
  birthDate: "2012-04-08",
  position: "Kanat",
  phone: "0532 111 22 33",
  ageGroup: "U-14",
  athlete: null as null | { id: string; name: string },
};
const INPUT = { teamId: "team-1", number: 7 };

beforeEach(() => {
  H.app = { ...APP };
  H.athlete = null;
  H.store = { athletes: [], athleteUpdates: [], consentUpdates: [], consentDeletes: [], statuses: [] };
  H.failConsentUpdate = false;
  H.requirePermission.mockClear();
  H.audit.mockClear();
  H.txSpy.mockClear();
});

describe("createAthleteFromApplication — KVKK rıza taşıma + atomiklik", () => {
  it("rıza satırlarına athleteId İŞLENİR; applicationId ve denetim izi KORUNUR", async () => {
    const res = await createAthleteFromApplication("app-1", INPUT);
    expect(res).toMatchObject({ ok: true });

    expect(H.store.consentUpdates).toHaveLength(1);
    const upd = H.store.consentUpdates[0] as { where: Record<string, unknown>; data: Record<string, unknown> };
    // Yalnız applicationId ile eşleşir — granted filtresi YOK (bkz. sonraki test)
    expect(upd.where).toEqual({ applicationId: "app-1" });
    // YALNIZ athleteId yazılır: audit alanlarına (granted/withdrawnAt/textHash/
    // documentVersion/ipAddress/userAgent/createdAt/granterRelation) DOKUNULMAZ,
    // applicationId de silinmez → soykütük korunur.
    expect(upd.data).toEqual({ athleteId: "ath-new" });
  });

  it("REDDEDİLEN rızalar da taşınır (where'de granted filtresi olmamalı)", async () => {
    await createAthleteFromApplication("app-1", INPUT);
    const upd = H.store.consentUpdates[0] as { where: Record<string, unknown> };
    expect(upd.where).not.toHaveProperty("granted");
    expect(upd.where).not.toHaveProperty("withdrawnAt");
  });

  it("ATOMİK: üç yazma (sporcu + rıza + durum) TEK transaction içinde yapılır", async () => {
    // Açık garanti: sıralı/atomik-olmayan yazmaya kaçılırsa bu test kırılır.
    await createAthleteFromApplication("app-1", INPUT);
    expect(H.txSpy).toHaveBeenCalledTimes(1);
    expect(H.store.athletes).toHaveLength(1);
    expect(H.store.consentUpdates).toHaveLength(1);
    expect(H.store.statuses).toHaveLength(1);
  });

  it("ATOMİK: rıza bağlama patlarsa sporcu YAZILMAZ (rollback)", async () => {
    H.failConsentUpdate = true;
    const res = await createAthleteFromApplication("app-1", INPUT);
    expect(res).toMatchObject({ ok: false });
    expect(H.store.athletes).toHaveLength(0); // hayalet sporcu YOK
    expect(H.store.statuses).toHaveLength(0);
  });

  it("başarıda başvuru durumu 'registered' olur", async () => {
    await createAthleteFromApplication("app-1", INPUT);
    expect(H.store.statuses).toEqual(["registered"]);
  });

  it("alan eşlemesi: athleteName→name, phone→parentPhone, position null → ''", async () => {
    H.app = { ...APP, position: null };
    await createAthleteFromApplication("app-1", INPUT);
    expect(H.store.athletes[0]).toMatchObject({
      name: "Kerem Yıldız",
      birthDate: "2012-04-08",
      parentPhone: "0532 111 22 33",
      position: "",
      teamId: "team-1",
      number: 7,
      applicationId: "app-1",
    });
  });

  it("MÜKERRER: başvuru zaten sporcuya bağlıysa reddedilir, hiçbir yazma olmaz", async () => {
    H.app = { ...APP, athlete: { id: "ath-eski", name: "Kerem Yıldız" } };
    const res = await createAthleteFromApplication("app-1", INPUT);
    expect(res).toMatchObject({ ok: false });
    expect(H.store.athletes).toHaveLength(0);
    expect(H.store.consentUpdates).toHaveLength(0);
  });

  it("başvuru yoksa reddedilir", async () => {
    H.app = null;
    const res = await createAthleteFromApplication("yok", INPUT);
    expect(res).toMatchObject({ ok: false });
    expect(H.store.athletes).toHaveLength(0);
  });

  it("YETKİ: hem basvurular.manage hem sporcular.manage istenir", async () => {
    await createAthleteFromApplication("app-1", INPUT);
    const keys = H.requirePermission.mock.calls.map((c) => c[0]);
    expect(keys).toContain("basvurular.manage");
    expect(keys).toContain("sporcular.manage");
  });

  it("YETKİ reddedilirse hiçbir yazma olmaz", async () => {
    H.requirePermission.mockRejectedValueOnce(new Error("NEXT_REDIRECT"));
    await expect(createAthleteFromApplication("app-1", INPUT)).rejects.toThrow();
    expect(H.store.athletes).toHaveLength(0);
  });

  it("geçersiz takım (boş) reddedilir, yazma olmaz", async () => {
    const res = await createAthleteFromApplication("app-1", { teamId: "", number: 7 });
    expect(res).toMatchObject({ ok: false });
    expect(H.store.athletes).toHaveLength(0);
  });
});

// --- EK: mevcut sporcuyu geçmiş başvuruya bağlama + geri alma ---
// Risk: yanlış bağlama = sporcu BAŞKA çocuğun velisinin rızasını devralır ve fotoğrafı
// ona dayanarak yayımlanır → geri alma (unlink) simetrik ve kayıpsız olmalı.
describe("linkAthleteToApplication / unlinkAthleteFromApplication", () => {
  it("bağlama: rızalar sporcuya bağlanır, sporcu başvuruya işaretlenir, durum 'registered'", async () => {
    H.athlete = { id: "ath-1", name: "Kerem Yıldız", applicationId: null };
    const res = await linkAthleteToApplication("app-1", "ath-1");
    expect(res).toMatchObject({ ok: true });
    expect(H.store.consentUpdates[0]).toEqual({ where: { applicationId: "app-1" }, data: { athleteId: "ath-1" } });
    expect(H.store.athleteUpdates[0]).toEqual({ where: { id: "ath-1" }, data: { applicationId: "app-1" } });
    expect(H.store.statuses).toEqual(["registered"]);
  });

  it("bağlama ATOMİK: rıza bağlama patlarsa sporcu işaretlenmez", async () => {
    H.athlete = { id: "ath-1", name: "Kerem", applicationId: null };
    H.failConsentUpdate = true;
    const res = await linkAthleteToApplication("app-1", "ath-1");
    expect(res).toMatchObject({ ok: false });
    expect(H.store.athleteUpdates).toHaveLength(0);
    expect(H.store.statuses).toHaveLength(0);
  });

  it("bağlama: sporcu ZATEN başka başvuruya bağlıysa reddedilir (rıza karışmasın)", async () => {
    H.athlete = { id: "ath-1", name: "Kerem", applicationId: "baska-app" };
    const res = await linkAthleteToApplication("app-1", "ath-1");
    expect(res).toMatchObject({ ok: false });
    expect(H.store.consentUpdates).toHaveLength(0);
  });

  it("bağlama: başvuru ZATEN bir sporcuya bağlıysa reddedilir", async () => {
    H.app = { ...APP, athlete: { id: "ath-eski", name: "Eski" } };
    H.athlete = { id: "ath-1", name: "Kerem", applicationId: null };
    const res = await linkAthleteToApplication("app-1", "ath-1");
    expect(res).toMatchObject({ ok: false });
    expect(H.store.consentUpdates).toHaveLength(0);
  });

  it("GERİ ALMA: rıza satırları SİLİNMEZ, yalnız athleteId boşalır (denetim izi durur)", async () => {
    H.app = { ...APP, athlete: { id: "ath-1", name: "Kerem Yıldız" } };
    const res = await unlinkAthleteFromApplication("app-1");
    expect(res).toMatchObject({ ok: true });
    // deleteMany DEĞİL updateMany: satırlar korunur
    expect(H.store.consentDeletes).toHaveLength(0);
    expect(H.store.consentUpdates[0]).toEqual({ where: { applicationId: "app-1" }, data: { athleteId: null } });
    expect(H.store.athleteUpdates[0]).toEqual({ where: { id: "ath-1" }, data: { applicationId: null } });
  });

  it("GERİ ALMA: durum 'registered' kalmaz (sporcu yokken yalan söylerdi)", async () => {
    H.app = { ...APP, athlete: { id: "ath-1", name: "Kerem" } };
    await unlinkAthleteFromApplication("app-1");
    expect(H.store.statuses).toEqual(["contacted"]);
  });

  it("GERİ ALMA: başvuru bağlı değilse reddedilir, yazma olmaz", async () => {
    H.app = { ...APP, athlete: null };
    const res = await unlinkAthleteFromApplication("app-1");
    expect(res).toMatchObject({ ok: false });
    expect(H.store.consentUpdates).toHaveLength(0);
  });

  it("YETKİ: bağlama da iki anahtar ister", async () => {
    H.athlete = { id: "ath-1", name: "Kerem", applicationId: null };
    await linkAthleteToApplication("app-1", "ath-1");
    const keys = H.requirePermission.mock.calls.map((c) => c[0]);
    expect(keys).toContain("basvurular.manage");
    expect(keys).toContain("sporcular.manage");
  });
});
