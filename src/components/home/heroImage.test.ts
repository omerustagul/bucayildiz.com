// @vitest-environment node
import { describe, it, expect } from "vitest";
import { heroImageVars } from "@/components/home/heroImage";

describe("heroImageVars (mobil hero + fallback)", () => {
  it("mobil seçiliyse mobil 1:1 kullanılır, masaüstü ayrı", () => {
    const r = heroImageVars("/uploads/desk.jpg", "/uploads/mob.jpg");
    expect(r.desktop).toBe('url("/uploads/desk.jpg")');
    expect(r.mobile).toBe('url("/uploads/mob.jpg")');
  });

  it("mobil YOKSA masaüstü görseline düşer (fallback — boş duruma güvenli)", () => {
    const r = heroImageVars("/uploads/desk.jpg", "");
    expect(r.mobile).toBe('url("/uploads/desk.jpg")');
    expect(heroImageVars("/uploads/desk.jpg", null).mobile).toBe('url("/uploads/desk.jpg")');
  });

  it("ikisi de yoksa varsayılan marka görselleri", () => {
    const r = heroImageVars(null, null);
    expect(r.desktop).toBe('url("/brand/hero-trial.jpg")');
    expect(r.mobile).toBe('url("/brand/hero-trial-square.jpg")');
  });
});
