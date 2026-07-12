// @vitest-environment node
// IDOR: sporcu YALNIZ kendi bildirimlerini görür/okur; mark-read sahiplik filtresi.
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const H = vi.hoisted(() => ({
  athleteId: "me-1" as string | undefined,
  findMany: vi.fn(async (_args: { where: Record<string, unknown> }) => [] as unknown[]),
  updateMany: vi.fn(async (_args: { where: Record<string, unknown> }) => ({ count: 1 })),
}));

vi.mock("@/lib/auth", () => ({
  requireAthlete: async () => ({ role: "athlete", sub: "u1", name: "S", email: "", athleteId: H.athleteId }),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: { notification: { findMany: H.findMany, updateMany: H.updateMany } },
}));

import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from "./actions";

beforeEach(() => {
  H.athleteId = "me-1";
  H.findMany.mockReset().mockResolvedValue([]);
  H.updateMany.mockReset().mockResolvedValue({ count: 1 });
});

describe("panel feed — IDOR (yalnız kendi bildirimleri)", () => {
  it("getMyNotifications sorgusu YALNIZ session.athleteId kapsamlı", async () => {
    await getMyNotifications();
    expect(H.findMany).toHaveBeenCalledOnce();
    expect(H.findMany.mock.calls[0][0].where).toMatchObject({ athleteId: "me-1" });
  });

  it("markNotificationRead SAHİPLİK filtresi: where'de id + athleteId birlikte", async () => {
    await markNotificationRead("notif-123");
    expect(H.updateMany).toHaveBeenCalledOnce();
    expect(H.updateMany.mock.calls[0][0].where).toMatchObject({ id: "notif-123", athleteId: "me-1" });
  });

  it("başkasının id'si körü körüne güncellenmez — sahiplik where'i hep athleteId taşır", async () => {
    H.updateMany.mockResolvedValueOnce({ count: 0 }); // yabancı id 0 satır eşler
    const r = await markNotificationRead("someone-elses-id");
    expect(r).toEqual({ ok: true }); // no-op, hata değil, sızıntı yok
    expect(H.updateMany.mock.calls[0][0].where).toMatchObject({ athleteId: "me-1" });
  });

  it("geçersiz id (boş) reddedilir, DB'ye gidilmez", async () => {
    const r = await markNotificationRead("");
    expect(r).toEqual({ ok: false });
    expect(H.updateMany).not.toHaveBeenCalled();
  });

  it("markAll yalnız kendi okunmamışlarını işaretler (athleteId + readAt:null)", async () => {
    await markAllNotificationsRead();
    expect(H.updateMany.mock.calls[0][0].where).toMatchObject({ athleteId: "me-1", readAt: null });
  });
});
