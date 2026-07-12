// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const H = vi.hoisted(() => ({
  created: null as Record<string, unknown> | null,
  facility: null as { name: string } | null,
  findFirst: vi.fn(),
  create: vi.fn(),
  requireAdmin: vi.fn(async () => ({ role: "admin", sub: "u1", name: "A", email: "" })),
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: H.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    facility: { findFirst: H.findFirst },
    training: { create: H.create },
  },
}));

import { createTraining } from "./actions";

beforeEach(() => {
  H.created = null;
  H.facility = null;
  H.requireAdmin.mockClear();
  H.findFirst.mockReset().mockImplementation(async () => H.facility);
  H.create.mockReset().mockImplementation(async ({ data }: { data: Record<string, unknown> }) => {
    H.created = data;
    return {};
  });
});

const base = { teamId: "t1", scope: "team", date: "2026-08-01", time: "17:00", duration: 90, notes: "", drills: [], athleteIds: [] };

describe("createTraining — saha yalnız gerçek isPitch=true Facility'den", () => {
  it("geçersiz/silinmiş/isPitch-OLMAYAN id REDDEDİLİR; training.create çağrılmaz; sorgu isPitch:true ile", async () => {
    H.facility = null; // findFirst → null: id yok VEYA isPitch=false (ikisi de where'de elenir)
    const res = await createTraining({ ...base, pitch: "yok-veya-tesis-id" });
    expect(res).toMatchObject({ error: expect.stringContaining("saha") });
    expect(H.create).not.toHaveBeenCalled();
    expect(H.findFirst).toHaveBeenCalledWith({ where: { id: "yok-veya-tesis-id", isPitch: true }, select: { name: true } });
  });

  it("geçerli isPitch saha → Facility ADI kaydedilir (serbest metin değil) + requireAdmin geçer", async () => {
    H.facility = { name: "Ana Saha" };
    const res = await createTraining({ ...base, pitch: "f1" });
    expect(res).toBeUndefined();
    expect(H.created?.pitch).toBe("Ana Saha");
    expect(H.requireAdmin).toHaveBeenCalled();
  });

  it("saha seçilmezse (boş) çökmez; pitch boş kaydedilir; facility sorgusu YAPILMAZ", async () => {
    const res = await createTraining({ ...base, pitch: "" });
    expect(res).toBeUndefined();
    expect(H.created?.pitch).toBe("");
    expect(H.findFirst).not.toHaveBeenCalled();
  });
});
