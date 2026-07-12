// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const H = vi.hoisted(() => ({
  updated: null as Record<string, unknown> | null,
  facility: null as { name: string } | null,
  findFirst: vi.fn(),
  update: vi.fn(),
  requireAdmin: vi.fn(async () => ({ role: "admin", sub: "u1", name: "A", email: "" })),
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: H.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    facility: { findFirst: H.findFirst },
    training: { update: H.update },
  },
}));

import { updateTrainingBasics } from "./actions";

beforeEach(() => {
  H.updated = null;
  H.facility = null;
  H.requireAdmin.mockClear();
  H.findFirst.mockReset().mockImplementation(async () => H.facility);
  H.update.mockReset().mockImplementation(async ({ data }: { data: Record<string, unknown> }) => {
    H.updated = data;
    return {};
  });
});

const base = { date: "2026-08-01", time: "17:00", duration: 90, notes: "" };

describe("updateTrainingBasics — DÜZENLEMEDE de saha yalnız gerçek isPitch=true Facility", () => {
  it("geçersiz/silinmiş/isPitch-OLMAYAN id REDDEDİLİR; training.update çağrılmaz; sorgu isPitch:true ile", async () => {
    H.facility = null; // findFirst → null: id yok VEYA isPitch=false
    const res = await updateTrainingBasics("tr1", { ...base, pitch: "yok-veya-tesis-id" });
    expect(res).toMatchObject({ error: expect.stringContaining("saha") });
    expect(H.update).not.toHaveBeenCalled();
    expect(H.findFirst).toHaveBeenCalledWith({ where: { id: "yok-veya-tesis-id", isPitch: true }, select: { name: true } });
  });

  it("geçerli isPitch id → Facility ADI kaydedilir (serbest metin değil) + requireAdmin geçer", async () => {
    H.facility = { name: "Ana Saha" };
    const res = await updateTrainingBasics("tr1", { ...base, pitch: "f1" });
    expect(res).toBeUndefined();
    expect(H.updated?.pitch).toBe("Ana Saha");
    expect(H.requireAdmin).toHaveBeenCalled();
  });

  it("saha boş (temizlendi) → çökmez; pitch boş kaydedilir; facility sorgusu YAPILMAZ", async () => {
    const res = await updateTrainingBasics("tr1", { ...base, pitch: "" });
    expect(res).toBeUndefined();
    expect(H.updated?.pitch).toBe("");
    expect(H.findFirst).not.toHaveBeenCalled();
  });
});
