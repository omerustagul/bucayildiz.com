// @vitest-environment node
// Bayat-chunk algısı: hangi hatalar "bir kez yenile" ile kurtarılabilir sayılır.
// Yanlış pozitif (gerçek arızayı chunk sanmak) döngü koruması + ilk-hata-göster ile
// sınırlı; yanlış negatif (bayat-chunk'ı kaçırmak) kullanıcıya crash gösterir → geniş tut.
import { describe, it, expect } from "vitest";
import { isChunkError } from "@/lib/chunkRecovery";

describe("isChunkError (deploy sürüm-kayması algısı)", () => {
  it("ChunkLoadError adı → true", () => {
    expect(isChunkError({ name: "ChunkLoadError", message: "x" })).toBe(true);
  });

  it("bayat-chunk mesajları → true", () => {
    for (const m of [
      "Loading chunk 482 failed.",
      "Loading CSS chunk 12 failed",
      "Failed to fetch dynamically imported module: https://x/_next/static/chunks/a.js",
      "error loading dynamically imported module",
      "Importing a module script failed.",
      "'text/html' is not a valid JavaScript MIME type",
      "Minified React error #130; visit https://react.dev/errors/130",
      "Element type is invalid: expected a string ... but got: undefined",
      "Hydration failed because the initial UI does not match",
    ]) {
      expect(isChunkError({ message: m }), m).toBe(true);
    }
  });

  it("hydration ailesi (React #418/#423/#425) → true", () => {
    expect(isChunkError({ message: "Minified React error #418" })).toBe(true);
    expect(isChunkError({ message: "Minified React error #423" })).toBe(true);
  });

  it("GERÇEK uygulama hataları → false (yenileme tetiklemez)", () => {
    expect(isChunkError({ message: "Cannot read properties of null (reading 'athleteId')" })).toBe(false);
    expect(isChunkError({ name: "TypeError", message: "x.map is not a function" })).toBe(false);
    expect(isChunkError({ message: "Network request failed" })).toBe(false);
  });

  it("null/undefined/boş → false", () => {
    expect(isChunkError(null)).toBe(false);
    expect(isChunkError(undefined)).toBe(false);
    expect(isChunkError({})).toBe(false);
  });
});
