import { describe, it, expect } from "vitest";
import { hasPermission, isValidPermission, ALL_PERMISSIONS, PERMISSION_AREAS } from "./permissions";

describe("hasPermission", () => {
  it("owner her şeye erişir (izin kümesi boş olsa bile)", () => {
    expect(hasPermission("owner", [], "sporcular.manage")).toBe(true);
    expect(hasPermission("owner", [], "kullanicilar.manage")).toBe(true);
    expect(hasPermission("owner", [], "olmayan.anahtar")).toBe(true);
  });

  it("admin yalnız kümesindeki izne erişir", () => {
    expect(hasPermission("admin", ["sporcular.view"], "sporcular.view")).toBe(true);
    expect(hasPermission("admin", ["sporcular.view"], "sporcular.manage")).toBe(false);
    expect(hasPermission("admin", [], "sporcular.view")).toBe(false);
  });

  it("manage otomatik view'ı ima eder; view manage'i ETMEZ", () => {
    expect(hasPermission("admin", ["sporcular.manage"], "sporcular.view")).toBe(true);
    expect(hasPermission("admin", ["sporcular.view"], "sporcular.manage")).toBe(false);
  });

  it("admin/owner dışı roller reddedilir", () => {
    expect(hasPermission("athlete", ["sporcular.manage"], "sporcular.manage")).toBe(false);
    expect(hasPermission("", [], "sporcular.view")).toBe(false);
  });
});

describe("izin kataloğu", () => {
  it("her alan view+manage üretir ve hepsi geçerlidir", () => {
    expect(ALL_PERMISSIONS.length).toBe(PERMISSION_AREAS.length * 2);
    for (const k of ALL_PERMISSIONS) expect(isValidPermission(k)).toBe(true);
  });

  it("geçersiz anahtar reddedilir", () => {
    expect(isValidPermission("olmayan.view")).toBe(false);
    expect(isValidPermission("sporcular.delete")).toBe(false);
    expect(isValidPermission("sporcular")).toBe(false);
  });
});
