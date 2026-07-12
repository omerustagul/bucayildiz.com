// @vitest-environment node
// Girdi doğrulama + phishing engeli: bildirim tıklama URL'i yalnız site içi olabilir.
// Ayrıca: admin bildirimi ortak notify akışına (feed + push) bağlanır.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  notifyAll: vi.fn(async (_input: { type: string; title: string; body?: string; url?: string }) => ({ feedCount: 3, push: { sent: 3, configured: true } })),
  notifyTeam: vi.fn(async (_teamId: string, _input: { type: string; title: string; body?: string; url?: string }) => ({ feedCount: 2, push: { sent: 2, configured: false } })),
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: async () => ({ role: "admin", sub: "u1", name: "Admin", email: "" }),
}));
vi.mock("@/lib/notify", () => ({ notifyAllAthletes: H.notifyAll, notifyTeam: H.notifyTeam }));

import { sendNotification } from "./actions";

beforeEach(() => { H.notifyAll.mockClear(); H.notifyTeam.mockClear(); });

describe("sendNotification (URL doğrulama + phishing engeli + feed)", () => {
  it("harici https URL reddedilir → hiçbir bildirim gitmez", async () => {
    const res = await sendNotification({ target: "all", title: "T", body: "B", url: "https://evil.example/phish" });
    expect(res).toMatchObject({ ok: false });
    expect(H.notifyAll).not.toHaveBeenCalled();
  });

  it("protokol-göreli //evil de reddedilir", async () => {
    const res = await sendNotification({ target: "all", title: "T", body: "B", url: "//evil.example" });
    expect(res).toMatchObject({ ok: false });
    expect(H.notifyAll).not.toHaveBeenCalled();
  });

  it("site içi yol kabul edilir + feed'e yazılır (type=admin)", async () => {
    const res = await sendNotification({ target: "all", title: "T", body: "B", url: "/haberler/mac-raporu" });
    expect(res).toMatchObject({ ok: true, sent: 3 });
    expect(H.notifyAll).toHaveBeenCalledOnce();
    expect(H.notifyAll.mock.calls[0][0]).toMatchObject({ type: "admin", url: "/haberler/mac-raporu" });
  });

  it("url verilmezse /panel varsayılanı kullanılır", async () => {
    const res = await sendNotification({ target: "all", title: "T", body: "B" });
    expect(res).toMatchObject({ ok: true });
    expect(H.notifyAll.mock.calls[0][0]).toMatchObject({ url: "/panel" });
  });

  it("başlık boşsa reddedilir", async () => {
    const res = await sendNotification({ target: "all", title: "", body: "B" });
    expect(res).toMatchObject({ ok: false });
    expect(H.notifyAll).not.toHaveBeenCalled();
  });

  it("belirli takım hedefi → notifyTeam(teamId) çağrılır; VAPID kapalıyken bile feed OK", async () => {
    const res = await sendNotification({ target: "team-1", title: "T", body: "B" });
    expect(res).toMatchObject({ ok: true, sent: 2, configured: false }); // push kapalı ama feed yazıldı
    expect(H.notifyTeam).toHaveBeenCalledOnce();
    expect(H.notifyTeam.mock.calls[0][0]).toBe("team-1");
    expect(H.notifyTeam.mock.calls[0][1]).toMatchObject({ type: "admin" });
  });
});
