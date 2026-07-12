// @vitest-environment node
import { describe, it, expect, vi } from "vitest";

const H = vi.hoisted(() => ({ findMany: vi.fn(async () => [{ id: "f1", name: "Ana Saha" }]) }));
vi.mock("@/lib/prisma", () => ({ prisma: { facility: { findMany: H.findMany } } }));

import { listPitchFacilities } from "./facilities";

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
