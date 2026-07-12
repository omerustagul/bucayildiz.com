// @vitest-environment node
// Girdi doğrulama + phishing engeli: bildirim tıklama URL'i yalnız site içi olabilir.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  sendPush: vi.fn(async (_where: unknown, _payload: { title: string; body: string; url: string }) => ({
    configured: true,
    sent: 3,
  })),
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: async () => ({ role: "admin", sub: "u1", name: "Admin", email: "" }),
}));
vi.mock("@/lib/push", () => ({ sendPush: H.sendPush }));

import { sendNotification } from "./actions";

beforeEach(() => H.sendPush.mockClear());

describe("sendNotification (girdi doğrulama + phishing engeli)", () => {
  it("harici https URL reddedilir → push GÖNDERİLMEZ", async () => {
    const res = await sendNotification({ target: "all", title: "T", body: "B", url: "https://evil.example/phish" });
    expect(res).toMatchObject({ ok: false });
    expect(H.sendPush).not.toHaveBeenCalled();
  });

  it("protokol-göreli //evil de reddedilir", async () => {
    const res = await sendNotification({ target: "all", title: "T", body: "B", url: "//evil.example" });
    expect(res).toMatchObject({ ok: false });
    expect(H.sendPush).not.toHaveBeenCalled();
  });

  it("site içi yol kabul edilir ve push'a geçer", async () => {
    const res = await sendNotification({ target: "all", title: "T", body: "B", url: "/haberler/mac-raporu" });
    expect(res).toMatchObject({ ok: true, sent: 3 });
    expect(H.sendPush).toHaveBeenCalledOnce();
    expect(H.sendPush.mock.calls[0][1]).toMatchObject({ url: "/haberler/mac-raporu" });
  });

  it("url verilmezse /panel varsayılanı kullanılır", async () => {
    const res = await sendNotification({ target: "all", title: "T", body: "B" });
    expect(res).toMatchObject({ ok: true });
    expect(H.sendPush.mock.calls[0][1]).toMatchObject({ url: "/panel" });
  });

  it("başlık boşsa reddedilir", async () => {
    const res = await sendNotification({ target: "all", title: "", body: "B" });
    expect(res).toMatchObject({ ok: false });
    expect(H.sendPush).not.toHaveBeenCalled();
  });
});
