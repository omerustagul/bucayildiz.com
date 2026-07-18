// @vitest-environment node
// Silme HATASI yutulmamalı: eskiden delete().catch(() => {}) + return { ok: true }
// vardı — arayüz "silindi" diyor, takım duruyordu (yalancı başarı).
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({ count: vi.fn(), del: vi.fn(), revalidate: vi.fn() }));

vi.mock("next/cache", () => ({ revalidatePath: H.revalidate }));
vi.mock("@/lib/auth", () => ({ requirePermission: async () => ({ sub: "u1", name: "Admin" }) }));
vi.mock("@/lib/prisma", () => ({
  prisma: { athlete: { count: H.count }, team: { delete: H.del } },
}));

import { deleteTeam } from "./actions";

beforeEach(() => {
  H.count.mockReset().mockResolvedValue(0);
  H.del.mockReset().mockResolvedValue({});
  H.revalidate.mockReset();
});

describe("deleteTeam", () => {
  it("başarılı silmede ok:true döner", async () => {
    expect(await deleteTeam("t1")).toEqual({ ok: true });
    expect(H.revalidate).toHaveBeenCalled();
  });

  it("silme BAŞARISIZ olursa ok:false döner — 'silindi' YALANI atılmaz", async () => {
    H.del.mockRejectedValue(Object.assign(new Error("FK"), { code: "P2003" }));
    const res = await deleteTeam("t1");
    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    // Silinmediyse listeyi tazelemenin de anlamı yok
    expect(H.revalidate).not.toHaveBeenCalled();
  });

  it("takımda sporcu varsa silmeye HİÇ kalkışmaz", async () => {
    H.count.mockResolvedValue(3);
    const res = await deleteTeam("t1");
    expect(res.ok).toBe(false);
    expect(res.error).toContain("3");
    expect(H.del).not.toHaveBeenCalled();
  });
});
