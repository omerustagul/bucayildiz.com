// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({})); // storage.ts (isOwnStorageUrl) yüklensin
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const H = vi.hoisted(() => ({
  saved: "__unset__" as unknown,
  requireAdmin: vi.fn(async () => ({ role: "admin", sub: "u1", name: "A", email: "" })),
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: H.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSetting: {
      upsert: vi.fn(async ({ update }: { update: { homeGalleryFeaturedUrl: unknown } }) => {
        H.saved = update.homeGalleryFeaturedUrl;
        return {};
      }),
    },
  },
}));

import { setHomeGalleryFeatured } from "./actions";

beforeEach(() => {
  H.saved = "__unset__";
  H.requireAdmin.mockClear();
});

describe("setHomeGalleryFeatured — yetki + URL allowlist", () => {
  it("kendi depolamamızdan (/uploads/) görsel kaydedilir + requireAdmin'den geçer", async () => {
    const r = await setHomeGalleryFeatured("/uploads/kare.webp");
    expect(r).toEqual({ ok: true });
    expect(H.saved).toBe("/uploads/kare.webp");
    expect(H.requireAdmin).toHaveBeenCalled();
  });

  it("keyfi HARİCİ URL REDDEDİLİR (allowlist), kaydedilmez", async () => {
    const r = await setHomeGalleryFeatured("https://evil.example/pixel.jpg");
    expect(r).toMatchObject({ ok: false });
    expect(H.saved).toBe("__unset__");
  });

  it("null seçimi kaldırır (homeGalleryFeaturedUrl = null)", async () => {
    const r = await setHomeGalleryFeatured(null);
    expect(r).toEqual({ ok: true });
    expect(H.saved).toBeNull();
  });

  it("boş string de kaldırır", async () => {
    const r = await setHomeGalleryFeatured("");
    expect(r).toEqual({ ok: true });
    expect(H.saved).toBeNull();
  });
});
