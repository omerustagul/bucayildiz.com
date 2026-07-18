// @vitest-environment node
// VAPID anahtar kapısı: tüm bildirim özelliği buna bağlı. Geçersiz/placeholder anahtar
// geçerse `pushManager.subscribe` fırlatır ve kullanıcı anlamsız "Bildirim açılamadı"
// hatası alır (prod'da tam bu oldu: 142 karakterlik Türkçe placeholder metin).
import { describe, it, expect } from "vitest";
import { isValidVapidKey } from "@/components/panel/PushToggle";

// Gerçek biçim: base64url P-256 noktası, 87 karakter, "B" ile başlar.
const GECERLI = "B" + "A".repeat(86);

describe("isValidVapidKey (bildirim yapılandırma kapısı)", () => {
  it("gerçek biçimli 87 karakterlik anahtar → true", () => {
    expect(isValidVapidKey(GECERLI)).toBe(true);
    expect(GECERLI).toHaveLength(87);
  });

  it("base64url karakter kümesi (-, _) kabul edilir", () => {
    expect(isValidVapidKey("B" + "a-b_c".repeat(17) + "xy")).toBe(true);
  });

  it("PROD'daki placeholder (uzun + Türkçe + parantez) → false", () => {
    expect(isValidVapidKey("BURAYA_VAPID_PUBLIC_KEY_GELECEK (openssl ile üretilmiş olmalır)")).toBe(false);
  });

  it("boş / kısa / yanlış başlangıç → false", () => {
    expect(isValidVapidKey("")).toBe(false);
    expect(isValidVapidKey("Bkisa")).toBe(false);
    expect(isValidVapidKey("A".repeat(87))).toBe(false); // "B" ile başlamıyor
  });

  it("geçersiz karakter (boşluk, +, /, =) → false", () => {
    expect(isValidVapidKey("B" + "A".repeat(80) + " abc")).toBe(false);
    expect(isValidVapidKey("B" + "A/B+C=".repeat(14))).toBe(false);
  });
});
