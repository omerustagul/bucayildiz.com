// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({})); // node testinde server-only no-op
import { isOwnStorageUrl, sniffVideo } from "@/lib/storage";

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

// Kapak videosu için magic-byte: istemci MIME'ına güvenmeden mp4/webm doğrula.
describe("sniffVideo (video magic-byte)", () => {
  const mp4 = Buffer.from([0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32]); // ...ftypmp42
  const webm = Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0, 0, 0, 0, 0]); // EBML
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0, 0, 0, 0]); // PNG (video değil)

  it("MP4 (ftyp) tanınır", () => {
    expect(sniffVideo(mp4)).toEqual({ type: "video/mp4", ext: "mp4" });
  });
  it("WebM (EBML) tanınır", () => {
    expect(sniffVideo(webm)).toEqual({ type: "video/webm", ext: "webm" });
  });
  it("video olmayan (PNG) REDDEDİLİR → null (sahte uzantı işe yaramaz)", () => {
    expect(sniffVideo(png)).toBeNull();
  });
  it("çok kısa buffer null", () => {
    expect(sniffVideo(Buffer.from([1, 2, 3]))).toBeNull();
  });
});
