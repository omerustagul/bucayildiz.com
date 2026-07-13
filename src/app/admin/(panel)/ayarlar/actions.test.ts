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

import { setHomeGalleryFeatured, setHeroMobileImage, saveSettings } from "./actions";

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

describe("saveSettings — kulüp konumu (latitude/longitude)", () => {
  const base = { clubName: "Buca Yıldız Futbol Akademisi", clubShortName: "Buca Yıldız" };

  it("geçerli koordinatlar kaydedilir + requireAdmin'den geçer", async () => {
    const r = await saveSettings({ ...base, latitude: 38.3894, longitude: 27.1786 });
    expect(r).toEqual({ ok: true });
    expect(H.saved?.latitude).toBe(38.3894);
    expect(H.saved?.longitude).toBe(27.1786);
    expect(H.requireAdmin).toHaveBeenCalled();
  });

  it("null koordinat (konum temizlendi) null olarak kaydedilir", async () => {
    const r = await saveSettings({ ...base, latitude: null, longitude: null });
    expect(r).toEqual({ ok: true });
    expect(H.saved?.latitude).toBeNull();
    expect(H.saved?.longitude).toBeNull();
  });

  it("koordinat alanları hiç gönderilmezse null olarak kaydedilir", async () => {
    const r = await saveSettings({ ...base });
    expect(r).toEqual({ ok: true });
    expect(H.saved?.latitude).toBeNull();
    expect(H.saved?.longitude).toBeNull();
  });

  it("sınır dışı enlem REDDEDİLİR (Türkçe hata), kaydedilmez", async () => {
    const r = await saveSettings({ ...base, latitude: 95, longitude: 27.1786 });
    expect(r).toMatchObject({ ok: false });
    if (!r.ok) expect(r.error).toMatch(/Enlem/);
    expect(H.saved).toBeNull();
  });

  it("sınır dışı boylam REDDEDİLİR (Türkçe hata), kaydedilmez", async () => {
    const r = await saveSettings({ ...base, latitude: 38.3894, longitude: 200 });
    expect(r).toMatchObject({ ok: false });
    if (!r.ok) expect(r.error).toMatch(/Boylam/);
    expect(H.saved).toBeNull();
  });
});
