// @vitest-environment node
import { describe, it, expect } from "vitest";
import { clientIp } from "@/lib/net";

// Başlıkları büyük/küçük harf duyarsız taklit et (Web Headers gibi).
const H = (m: Record<string, string>) => ({ get: (k: string) => m[k.toLowerCase()] ?? null });

describe("clientIp (#8 güvenilir IP)", () => {
  it("CF-Connecting-IP önceliklidir (XFF/X-Real-IP'yi ezer)", () => {
    expect(
      clientIp(H({ "cf-connecting-ip": "9.9.9.9", "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2, 3.3.3.3" })),
    ).toBe("9.9.9.9");
  });
  it("CF yoksa X-Real-IP", () => {
    expect(clientIp(H({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" }))).toBe("1.1.1.1");
  });
  it("yalnız XFF varsa ilk parça (son çare fallback)", () => {
    expect(clientIp(H({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" }))).toBe("2.2.2.2");
  });
  it("hiçbiri yoksa null", () => {
    expect(clientIp(H({}))).toBeNull();
  });
});
