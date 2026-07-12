// @vitest-environment node
// Public iş başvurusu: /basvuru korumaları (honeypot + rate-limit + Zod) +
// kayıt-İÇİNDE consent audit (hash/version/consentedAt/ip/ua) + cvUrl allowlist.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { __resetRateLimit } from "@/lib/rate-limit";

vi.mock("server-only", () => ({})); // storage.ts (isOwnStorageUrl) yüklensin

const H = vi.hoisted(() => ({
  created: null as Record<string, unknown> | null,
  posting: null as { id: string } | null,
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

beforeEach(() => { H.created = null; H.posting = null; __resetRateLimit(); });

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

  it("aynı IP'den 5 başvurudan sonrası rate-limit'e takılır", async () => {
    for (let i = 0; i < 5; i++) expect((await submitJobApplication(valid)).ok).toBe(true);
    expect((await submitJobApplication(valid)).ok).toBe(false);
  });
});
