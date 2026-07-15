// @vitest-environment node
// Public iş başvurusu: /basvuru korumaları (honeypot + rate-limit + Zod) +
// kayıt-İÇİNDE consent audit (hash/version/consentedAt/ip/ua) + cvUrl allowlist.
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({})); // storage.ts (isOwnStorageUrl) yüklensin
// Kontrol edilebilir mock: varsayılan ok:true; rate-limit testinde ok:false zorlanır.
vi.mock("@/lib/rate-limit-db", () => ({ rateLimit: H.rl }));

const H = vi.hoisted(() => ({
  created: null as Record<string, unknown> | null,
  posting: null as { id: string } | null,
  rl: vi.fn(async () => ({ ok: true, retryAfter: 0 })),
}));

vi.mock("next/headers", () => ({
  headers: async () => new Map([["user-agent", "test-ua"], ["x-forwarded-for", "9.9.9.9"]]),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    jobApplication: { create: async ({ data }: { data: Record<string, unknown> }) => { H.created = data; return { id: "app1" }; } },
    jobPosting: { findUnique: async () => H.posting },
  },
}));

import { submitJobApplication } from "./actions";

const valid = { name: "Ali Veli", email: "ali@example.com", phone: "0532 000 00 00", message: "Merhaba", cvUrl: "", consent: true };

beforeEach(() => { H.created = null; H.posting = null; H.rl.mockClear(); });

describe("submitJobApplication — public form korumaları + kayıt-içi consent", () => {
  it("honeypot doluysa: sessizce ok, DB'ye HİÇBİR ŞEY yazılmaz (bot)", async () => {
    const res = await submitJobApplication({ ...valid, website: "http://spam.example" });
    expect(res).toEqual({ ok: true });
    expect(H.created).toBeNull();
  });

  it("geçersiz girdi (e-posta yok) reddedilir, DB'ye yazılmaz", async () => {
    const res = await submitJobApplication({ name: "X", email: "", consent: true });
    expect(res).toMatchObject({ ok: false });
    expect(H.created).toBeNull();
  });

  it("consent işaretlenmemişse reddedilir (gerçek onay kutusu zorunlu)", async () => {
    const res = await submitJobApplication({ ...valid, consent: false });
    expect(res).toMatchObject({ ok: false });
    expect(H.created).toBeNull();
  });

  it("başarılı: JobApplication yazılır + consent AUDIT alanları gerçekten dolu", async () => {
    const res = await submitJobApplication(valid);
    expect(res).toEqual({ ok: true });
    expect(H.created).toMatchObject({
      name: "Ali Veli", email: "ali@example.com",
      consentVersion: expect.any(String), ipAddress: "9.9.9.9", userAgent: "test-ua",
    });
    expect(typeof H.created?.consentTextHash).toBe("string");
    expect((H.created?.consentTextHash as string)).toHaveLength(64); // SHA-256 hex
    expect(H.created?.consentedAt).toBeInstanceOf(Date);
  });

  it("harici CV URL REDDEDİLİR (isOwnStorageUrl allowlist)", async () => {
    const res = await submitJobApplication({ ...valid, cvUrl: "https://evil.example/cv.pdf" });
    expect(res).toMatchObject({ ok: false, fieldErrors: { cvUrl: expect.any(String) } });
    expect(H.created).toBeNull();
  });

  it("kendi /uploads/ CV URL kabul edilir + kaydedilir", async () => {
    const res = await submitJobApplication({ ...valid, cvUrl: "/uploads/1783-cv.pdf" });
    expect(res).toEqual({ ok: true });
    expect(H.created?.cvUrl).toBe("/uploads/1783-cv.pdf");
  });

  it("rate-limit bloklarsa (ok:false) başvuru REDDEDİLİR", async () => {
    // Sayım/eşik src/lib/rate-limit-db.test.ts'te; burada aksiyonun bloğa saygısı.
    H.rl.mockResolvedValueOnce({ ok: false, retryAfter: 60 });
    expect((await submitJobApplication(valid)).ok).toBe(false);
    expect(H.created).toBeNull(); // DB'ye yazılmadı
  });
});
