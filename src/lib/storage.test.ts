// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({})); // node testinde server-only no-op
import { isOwnStorageUrl } from "@/lib/storage";

// S3_* env yok → yalnız yerel /uploads/ geçerli; tüm harici adresler reddedilir.
describe("isOwnStorageUrl (yükleme allowlist)", () => {
  it("yerel /uploads/ kabul edilir", () => {
    expect(isOwnStorageUrl("/uploads/123-abc.webp")).toBe(true);
  });
  it("keyfi harici https REDDEDİLİR (tracking-pixel deliği kapalı)", () => {
    expect(isOwnStorageUrl("https://evil.example/pixel.gif")).toBe(false);
  });
  it("http:// REDDEDİLİR", () => {
    expect(isOwnStorageUrl("http://evil.example/x.png")).toBe(false);
  });
  it("/uploads öneki taklidi REDDEDİLİR", () => {
    expect(isOwnStorageUrl("/uploadsx/y.png")).toBe(false);
    expect(isOwnStorageUrl("https://e.com/uploads/x.png")).toBe(false);
  });
});
