// @vitest-environment node
import { describe, it, expect, vi } from "vitest";

const H = vi.hoisted(() => ({
  findMany: vi.fn(async () => [{ id: "f1", name: "Ana Saha" }]),
  findFirst: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({ prisma: { facility: { findMany: H.findMany, findFirst: H.findFirst } } }));

import { listPitchFacilities, resolvePitchName } from "./facilities";

describe("listPitchFacilities — saha listesi kaynağı", () => {
  it("YALNIZ isPitch=true tesisleri getirir (sort'a göre, id+name seçer)", async () => {
    const rows = await listPitchFacilities();
    expect(H.findMany).toHaveBeenCalledWith({
      where: { isPitch: true },
      orderBy: { sort: "asc" },
      select: { id: true, name: true },
    });
    expect(rows).toEqual([{ id: "f1", name: "Ana Saha" }]);
  });
});

describe("resolvePitchName — oluşturma+düzenleme ORTAK saha doğrulaması", () => {
  it("boş id → '' (saha seçilmedi, geçerli); DB'ye gidilmez", async () => {
    H.findFirst.mockClear();
    expect(await resolvePitchName("")).toBe("");
    expect(H.findFirst).not.toHaveBeenCalled();
  });
  it("gerçek isPitch=true id → Facility adı (sorgu isPitch:true ile)", async () => {
    H.findFirst.mockReset().mockResolvedValueOnce({ name: "Ana Saha" });
    expect(await resolvePitchName("f1")).toBe("Ana Saha");
    expect(H.findFirst).toHaveBeenCalledWith({ where: { id: "f1", isPitch: true }, select: { name: true } });
  });
  it("geçersiz/silinmiş/isPitch-olmayan id → null (çağıran reddeder)", async () => {
    H.findFirst.mockReset().mockResolvedValueOnce(null);
    expect(await resolvePitchName("kotu-id")).toBeNull();
  });
});
