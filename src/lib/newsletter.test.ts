// @vitest-environment node
// Bülten (ticari elektronik ileti) rıza mantığı: rıza ispatı yakalama (sürüm+hash),
// çift/tek opt-in dallanması, confirm/iptal. Prisma+mail+belge mock'lanır; consentTextHash
// gerçek kalır (ispatın gerçekten metnin hash'i olduğunu doğrulamak için).
import { describe, it, expect, vi, beforeEach } from "vitest";

// `server-only` RSC dışında import edilince fırlatır; testte zararsızlaştır (koruma prod'da kalır).
vi.mock("server-only", () => ({}));

const H = vi.hoisted(() => ({
  findUnique: vi.fn(),
  upsert: vi.fn(),
  update: vi.fn(),
  sendMail: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { newsletterSubscriber: { findUnique: H.findUnique, upsert: H.upsert, update: H.update } },
}));
vi.mock("@/lib/mail", () => ({ sendMail: H.sendMail }));
vi.mock("@/lib/consent.server", async (orig) => ({
  ...(await orig<typeof import("@/lib/consent.server")>()),
  getConsentDocumentByKey: H.getDoc,
}));

import { subscribeNewsletter, confirmNewsletter, unsubscribeNewsletter } from "@/lib/newsletter";
import { consentTextHash } from "@/lib/consent.server";

beforeEach(() => {
  H.findUnique.mockReset().mockResolvedValue(null);
  H.upsert.mockReset().mockResolvedValue({});
  H.update.mockReset().mockResolvedValue({});
  H.sendMail.mockReset().mockResolvedValue({ sent: true });
  H.getDoc.mockReset().mockResolvedValue({ version: "2026-06-15", body: "PAZARLAMA METNİ" });
});

describe("subscribeNewsletter (KVKK ticari elektronik ileti)", () => {
  const base = { consent: true, baseUrl: "http://x" };

  it("aktif pazarlama belgesi yoksa abone OLUNAMAZ (ispatsız kayıt yazmaz)", async () => {
    H.getDoc.mockResolvedValue(null);
    const res = await subscribeNewsletter({ email: "c@x.io", ...base });
    expect(res.ok).toBe(false);
    expect(H.upsert).not.toHaveBeenCalled();
  });

  it("SMTP gönderirse ÇİFT opt-in: pending + confirmToken + rıza ispatı (sürüm + metin hash'i)", async () => {
    H.sendMail.mockResolvedValue({ sent: true });
    const res = await subscribeNewsletter({ email: "A@X.io", ...base });
    expect(res.ok).toBe(true);
    const arg = H.upsert.mock.calls[0][0];
    expect(arg.create.email).toBe("a@x.io"); // küçük harfe indirilir
    expect(arg.create.status).toBe("pending");
    expect(arg.create.confirmToken).toBeTruthy();
    expect(arg.create.confirmedAt).toBeNull();
    expect(arg.create.consentVersion).toBe("2026-06-15");
    expect(arg.create.consentHash).toBe(consentTextHash("PAZARLAMA METNİ")); // gerçek belge metninin hash'i
    expect(arg.create.unsubToken).toBeTruthy();
  });

  it("SMTP göndermezse (yapılandırılmamış) TEK opt-in: active + confirmToken null + confirmedAt", async () => {
    H.sendMail.mockResolvedValue({ sent: false });
    await subscribeNewsletter({ email: "b@x.io", ...base });
    const arg = H.upsert.mock.calls[0][0];
    expect(arg.create.status).toBe("active");
    expect(arg.create.confirmToken).toBeNull();
    expect(arg.create.confirmedAt).toBeInstanceOf(Date);
  });

  it("zaten AKTİF e-posta yeniden abone edilmez (upsert çağrılmaz)", async () => {
    H.findUnique.mockResolvedValue({ status: "active" });
    const res = await subscribeNewsletter({ email: "d@x.io", ...base });
    expect(res.ok).toBe(true);
    expect(H.upsert).not.toHaveBeenCalled();
  });
});

describe("confirmNewsletter (çift opt-in onayı)", () => {
  it("geçerli jeton → active + jeton temizlenir + confirmedAt", async () => {
    H.findUnique.mockResolvedValue({ id: "s1" });
    const res = await confirmNewsletter("tok");
    expect(res.ok).toBe(true);
    const arg = H.update.mock.calls[0][0];
    expect(arg.data.status).toBe("active");
    expect(arg.data.confirmToken).toBeNull();
    expect(arg.data.confirmedAt).toBeInstanceOf(Date);
  });

  it("geçersiz jeton → ok:false, güncelleme YOK", async () => {
    H.findUnique.mockResolvedValue(null);
    const res = await confirmNewsletter("yok");
    expect(res.ok).toBe(false);
    expect(H.update).not.toHaveBeenCalled();
  });
});

describe("unsubscribeNewsletter (tek-tık iptal)", () => {
  it("geçerli jeton → unsubscribed + zaman (kayıt SİLİNMEZ, ispat durur)", async () => {
    H.findUnique.mockResolvedValue({ id: "s1", status: "active" });
    const res = await unsubscribeNewsletter("tok");
    expect(res.ok).toBe(true);
    const arg = H.update.mock.calls[0][0];
    expect(arg.data.status).toBe("unsubscribed");
    expect(arg.data.unsubscribedAt).toBeInstanceOf(Date);
  });

  it("boş jeton → ok:false, sorgu YOK (confirm + unsub)", async () => {
    expect((await confirmNewsletter("")).ok).toBe(false);
    expect((await unsubscribeNewsletter("")).ok).toBe(false);
    expect(H.findUnique).not.toHaveBeenCalled();
  });
});
