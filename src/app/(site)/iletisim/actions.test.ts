// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({ notify: vi.fn(async () => ({ sent: true })) }));
vi.mock("next/headers", () => ({ headers: async () => new Map([["x-forwarded-for", "1.2.3.4"]]) }));
vi.mock("@/lib/mail", () => ({ notifyContactMessage: H.notify }));
vi.mock("@/lib/rate-limit-db", () => ({ rateLimit: async () => ({ ok: true, retryAfter: 0 }) }));

import { submitContactMessage } from "./actions";

const valid = { name: "Ali Veli", email: "ali@example.com", phone: "", message: "Merhaba, bilgi almak istiyorum." };

beforeEach(() => {
  H.notify.mockClear();
  H.notify.mockResolvedValue({ sent: true });
});

describe("submitContactMessage", () => {
  it("honeypot doluysa sessizce ok, mail GÖNDERİLMEZ", async () => {
    const res = await submitContactMessage({ ...valid, website: "bot" });
    expect(res).toEqual({ ok: true });
    expect(H.notify).not.toHaveBeenCalled();
  });

  it("geçerli mesaj gönderilir", async () => {
    const res = await submitContactMessage(valid);
    expect(res).toEqual({ ok: true });
    expect(H.notify).toHaveBeenCalledOnce();
  });

  it("SMTP yoksa (sent:false) SAHTE BAŞARI vermez — dürüst hata", async () => {
    H.notify.mockResolvedValue({ sent: false });
    const res = await submitContactMessage(valid);
    expect(res).toMatchObject({ ok: false });
  });

  it("geçersiz (kısa mesaj) reddedilir", async () => {
    const res = await submitContactMessage({ ...valid, message: "x" });
    expect(res).toMatchObject({ ok: false });
    expect(H.notify).not.toHaveBeenCalled();
  });
});
