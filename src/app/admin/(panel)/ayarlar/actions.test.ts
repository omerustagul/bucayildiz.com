// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({})); // storage.ts (isOwnStorageUrl) yüklensin
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const H = vi.hoisted(() => ({
  saved: null as Record<string, unknown> | null,
  requireAdmin: vi.fn(async () => ({ role: "admin", sub: "u1", name: "A", email: "" })),
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: H.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSetting: {
      upsert: vi.fn(async ({ update }: { update: Record<string, unknown> }) => {
        H.saved = update;
        return {};
      }),
    },
  },
}));

import { setHomeGalleryFeatured, setHeroMobileImage } from "./actions";

beforeEach(() => {
  H.saved = null;
  H.requireAdmin.mockClear();
});

describe("setHomeGalleryFeatured — yetki + URL allowlist", () => {
  it("kendi /uploads/ görseli kaydedilir + requireAdmin'den geçer", async () => {
    const r = await setHomeGalleryFeatured("/uploads/kare.webp");
    expect(r).toEqual({ ok: true });
    expect(H.saved?.homeGalleryFeaturedUrl).toBe("/uploads/kare.webp");
    expect(H.requireAdmin).toHaveBeenCalled();
  });
  it("keyfi HARİCİ URL REDDEDİLİR, kaydedilmez", async () => {
    const r = await setHomeGalleryFeatured("https://evil.example/pixel.jpg");
    expect(r).toMatchObject({ ok: false });
    expect(H.saved).toBeNull();
  });
  it("null seçimi kaldırır", async () => {
    const r = await setHomeGalleryFeatured(null);
    expect(r).toEqual({ ok: true });
    expect(H.saved?.homeGalleryFeaturedUrl).toBeNull();
  });
});

describe("setHeroMobileImage — yetki + URL allowlist", () => {
  it("kendi /uploads/ görseli kaydedilir + requireAdmin'den geçer", async () => {
    const r = await setHeroMobileImage("/uploads/mobil.webp");
    expect(r).toEqual({ ok: true });
    expect(H.saved?.heroMobileImageUrl).toBe("/uploads/mobil.webp");
    expect(H.requireAdmin).toHaveBeenCalled();
  });
  it("keyfi HARİCİ URL REDDEDİLİR, kaydedilmez", async () => {
    const r = await setHeroMobileImage("https://evil.example/m.jpg");
    expect(r).toMatchObject({ ok: false });
    expect(H.saved).toBeNull();
  });
  it("boş string seçimi kaldırır (mobil hero → null → fallback)", async () => {
    const r = await setHeroMobileImage("");
    expect(r).toEqual({ ok: true });
    expect(H.saved?.heroMobileImageUrl).toBeNull();
  });
});
