// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const H = vi.hoisted(() => ({
  createMany: vi.fn(async (_args: { data: Array<Record<string, unknown>> }) => ({ count: 0 })),
  athleteFindMany: vi.fn(async () => [] as { id: string }[]),
  sendPush: vi.fn(async () => ({ sent: 0, removed: 0, configured: false })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    notification: { createMany: H.createMany },
    athlete: { findMany: H.athleteFindMany },
  },
}));
vi.mock("@/lib/push", () => ({ sendPush: H.sendPush }));

import { notifyAthletes, notifyTeam } from "@/lib/notify";

beforeEach(() => {
  H.createMany.mockReset().mockResolvedValue({ count: 0 });
  H.athleteFindMany.mockReset().mockResolvedValue([]);
  H.sendPush.mockReset().mockResolvedValue({ sent: 0, removed: 0, configured: false });
});

describe("notifyAthletes — fan-out + güvenlik", () => {
  it("çok sporcuya TEK createMany (N+1 yok), N satır", async () => {
    await notifyAthletes(["a1", "a2", "a3"], { type: "training", title: "T", body: "B", url: "/panel/antrenmanlar" });
    expect(H.createMany).toHaveBeenCalledOnce();
    expect(H.createMany.mock.calls[0][0].data).toHaveLength(3);
  });

  it("harici/phishing URL feed'e YAZILMAZ (null'a düşer) — internalPath", async () => {
    await notifyAthletes(["a1"], { type: "admin", title: "T", url: "https://evil.example/x" });
    expect(H.createMany.mock.calls[0][0].data[0]).toMatchObject({ url: null });
  });

  it("site içi URL korunur", async () => {
    await notifyAthletes(["a1"], { type: "admin", title: "T", url: "/panel/maclar" });
    expect(H.createMany.mock.calls[0][0].data[0]).toMatchObject({ url: "/panel/maclar" });
  });

  it("boş id listesi → hiçbir şey yazılmaz/gönderilmez", async () => {
    const r = await notifyAthletes([], { type: "admin", title: "T" });
    expect(H.createMany).not.toHaveBeenCalled();
    expect(H.sendPush).not.toHaveBeenCalled();
    expect(r.feedCount).toBe(0);
  });

  it("push başarısız olsa da feed yazılır (non-blocking; olay bloklanmaz)", async () => {
    H.sendPush.mockRejectedValueOnce(new Error("push down"));
    const r = await notifyAthletes(["a1"], { type: "admin", title: "T" });
    expect(H.createMany).toHaveBeenCalledOnce();
    expect(r.feedCount).toBe(1);
  });

  it("tekrarlı id'ler tekilleştirilir", async () => {
    await notifyAthletes(["a1", "a1", "a2"], { type: "admin", title: "T" });
    expect(H.createMany.mock.calls[0][0].data).toHaveLength(2);
  });
});

describe("notifyTeam — takım id'lerini tek sorguda çekip fan-out", () => {
  it("takım sporcularını TEK sorguda çeker → TEK createMany", async () => {
    H.athleteFindMany.mockResolvedValueOnce([{ id: "a1" }, { id: "a2" }]);
    await notifyTeam("team-1", { type: "training", title: "T" });
    expect(H.athleteFindMany).toHaveBeenCalledWith({ where: { teamId: "team-1" }, select: { id: true } });
    expect(H.createMany).toHaveBeenCalledOnce();
    expect(H.createMany.mock.calls[0][0].data).toHaveLength(2);
  });
});
