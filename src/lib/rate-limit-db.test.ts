// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  queryRaw: vi.fn(),
  executeRaw: vi.fn(async () => 0),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: H.queryRaw,
    $executeRaw: H.executeRaw,
  },
}));

import { rateLimit } from "./rate-limit-db";

beforeEach(() => {
  H.queryRaw.mockReset();
  H.executeRaw.mockReset();
  H.executeRaw.mockResolvedValue(0);
});

describe("rateLimit (Postgres-backed)", () => {
  it("limit aşılmadıysa ok:true döner", async () => {
    H.queryRaw.mockResolvedValue([{ count: 3, resetAt: new Date(Date.now() + 60_000) }]);
    const res = await rateLimit("k", 3, 1000);
    expect(res).toEqual({ ok: true, retryAfter: 0 });
  });

  it("limit aşıldıysa ok:false + retryAfter > 0 döner", async () => {
    H.queryRaw.mockResolvedValue([{ count: 4, resetAt: new Date(Date.now() + 60_000) }]);
    const res = await rateLimit("k", 3, 1000);
    expect(res.ok).toBe(false);
    expect(res.retryAfter).toBeGreaterThan(0);
  });

  it("DB erişilemezse fail-open: ok:true döner (meşru kullanıcı kilitlenmez)", async () => {
    H.queryRaw.mockRejectedValue(new Error("DB erişilemedi"));
    const res = await rateLimit("k", 3, 1000);
    expect(res).toEqual({ ok: true, retryAfter: 0 });
  });
});
