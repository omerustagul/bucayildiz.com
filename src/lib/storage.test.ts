// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({})); // node testinde server-only no-op
import { isOwnStorageUrl, sniffVideo, sniffDocument, saveUpload, deleteUpload } from "@/lib/storage";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

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

// CV yüklemesi (iş başvurusu) için PDF magic-byte + document modu.
describe("sniffDocument (PDF magic-byte)", () => {
  it("%PDF- imzası tanınır → application/pdf", () => {
    expect(sniffDocument(Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]))).toEqual({ type: "application/pdf", ext: "pdf" });
  });
  it("PDF olmayan (PNG imzası) REDDEDİLİR → null", () => {
    expect(sniffDocument(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]))).toBeNull();
  });
  it("çok kısa buffer null", () => {
    expect(sniffDocument(Buffer.from([0x25, 0x50]))).toBeNull();
  });
});

describe("saveUpload document modu — PDF-dışı REDDEDİLİR (istemci MIME'ına güvenmez)", () => {
  const notPdf = () => Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  it("PDF-olmayan MIME (image/png) reddedilir", async () => {
    const file = new File([notPdf()], "sahte.png", { type: "image/png" });
    await expect(saveUpload(file, { kind: "document" })).rejects.toThrow(/PDF/i);
  });
  it("MIME 'application/pdf' ama içerik PDF DEĞİL → magic-byte reddi", async () => {
    const file = new File([notPdf()], "sahte.pdf", { type: "application/pdf" });
    await expect(saveUpload(file, { kind: "document" })).rejects.toThrow(/PDF/i);
  });
});

// KVKK dosya imhası (deleteUpload): sporcu silininde foto gerçekten diskten gitmeli.
describe("deleteUpload (KVKK dosya imhası)", () => {
  const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

  it("yerel /uploads dosyasını GERÇEKTEN siler", async () => {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const name = "__test_erasure__.txt";
    const fp = path.join(UPLOAD_DIR, name);
    await writeFile(fp, "x");
    expect(existsSync(fp)).toBe(true);
    await deleteUpload(`/uploads/${name}`);
    expect(existsSync(fp)).toBe(false); // gerçekten silindi
  });

  it("kendi depomuzda OLMAYAN URL'e / boşa dokunmaz (best-effort, hata fırlatmaz)", async () => {
    await expect(deleteUpload("https://evil.example/x.png")).resolves.toBeUndefined();
    await expect(deleteUpload(null)).resolves.toBeUndefined();
    await expect(deleteUpload("")).resolves.toBeUndefined();
  });

  it("var olmayan yerel dosyada HATA FIRLATMAZ (best-effort — DB silmesini bloklamaz)", async () => {
    await expect(deleteUpload("/uploads/__olmayan__.webp")).resolves.toBeUndefined();
  });
});
