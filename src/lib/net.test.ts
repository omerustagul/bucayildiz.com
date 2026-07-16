// @vitest-environment node
import { describe, it, expect } from "vitest";
import { clientIp, isSameOrigin } from "@/lib/net";

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

// CSRF savunma derinliği. sameSite=lax çapraz-SİTE POST'ta çerezi zaten göndermez;
// bu kontrol SameSite'ın bıraktığı boşluğu kapatır: SameSite *site* kapsamlıdır
// (eTLD+1) → ele geçmiş/eski bir ALT ALAN kurbanın çerezleriyle POST atabilir.
describe("isSameOrigin (CSRF savunma derinliği)", () => {
  it("Origin isteğin host'uyla eşleşiyorsa geçer", () => {
    expect(isSameOrigin(H({ origin: "https://bucayildiz.com", host: "bucayildiz.com" }))).toBe(true);
  });

  it("ALT ALAN farklıysa REDDEDİLİR (sameSite=lax'ın bıraktığı asıl boşluk)", () => {
    expect(isSameOrigin(H({ origin: "https://evil.bucayildiz.com", host: "bucayildiz.com" }))).toBe(false);
  });

  it("tamamen farklı site REDDEDİLİR", () => {
    expect(isSameOrigin(H({ origin: "https://evil.example", host: "bucayildiz.com" }))).toBe(false);
  });

  it("X-Forwarded-Host'a GÜVENİLMEZ (nginx onu set etmez; istemci uydurup kapıyı aşardı)", () => {
    // Saldırgan kendi Origin'ini eşleştirmek için X-Forwarded-Host enjekte ederse
    // yine reddedilmeli — karşılaştırma YALNIZ gerçek Host ile yapılır.
    expect(
      isSameOrigin(H({ origin: "https://evil.bucayildiz.com", host: "bucayildiz.com", "x-forwarded-host": "evil.bucayildiz.com" })),
    ).toBe(false);
  });

  it("Origin YOKSA geçer (tarayıcı-dışı istemcide kurbanın çerezi de yok → CSRF değil)", () => {
    expect(isSameOrigin(H({ host: "bucayildiz.com" }))).toBe(true);
  });

  it("Origin bozuk/null ise REDDEDİLİR (fail-closed)", () => {
    expect(isSameOrigin(H({ origin: "null", host: "bucayildiz.com" }))).toBe(false);
    expect(isSameOrigin(H({ origin: "sacma", host: "bucayildiz.com" }))).toBe(false);
  });

  it("port dahil eşleşir (yerel geliştirme)", () => {
    expect(isSameOrigin(H({ origin: "http://localhost:3000", host: "localhost:3000" }))).toBe(true);
    expect(isSameOrigin(H({ origin: "http://localhost:3001", host: "localhost:3000" }))).toBe(false);
  });

  it("Host yoksa REDDEDİLİR (karşılaştıracak referans yok)", () => {
    expect(isSameOrigin(H({ origin: "https://bucayildiz.com" }))).toBe(false);
  });
});
