// @vitest-environment node
// Madde 4: dinamik başvuru — yaş helper'ları + yaş dallı applicationSchema.
import { describe, it, expect } from "vitest";
import {
  ageFromBirthDate,
  ageGroupFromBirthDate,
  applicationSchema,
  isValidIsoDate,
} from "@/lib/validation";

// Bugüne göreli tarih (yıl-brittleness'e karşı): n yıl önce.
const yearsAgo = (n: number): string => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const ADULT = yearsAgo(25); // açıkça ≥18
const MINOR = yearsAgo(12); // açıkça <18

const baseValid = (over: Record<string, unknown> = {}) => ({
  athleteName: "Arda Yılmaz",
  birthDate: MINOR,
  phone: "0532 000 00 00",
  email: "",
  parentName: "Mehmet Yılmaz",
  consents: { aydinlatma: true, "acik-riza": true, "saglik-verisi": true },
  ...over,
});

describe("ageFromBirthDate", () => {
  it("minör tarih <18, yetişkin tarih ≥18; geçersiz → null", () => {
    expect(ageFromBirthDate(MINOR)! < 18).toBe(true);
    expect(ageFromBirthDate(ADULT)! >= 18).toBe(true);
    expect(ageFromBirthDate("2012-13-40")).toBeNull(); // isValidIsoDate ile tutarlı
    expect(isValidIsoDate("2012-13-40")).toBe(false);
  });
});

describe("ageGroupFromBirthDate (admin/e-posta türetimi)", () => {
  it("yaşa göre grup: ≥18→A Takım, 17→U-18, 16→U-17, 15→U-16, ≤14→U-15", () => {
    expect(ageGroupFromBirthDate(yearsAgo(25))).toBe("A Takım");
    expect(ageGroupFromBirthDate(yearsAgo(17))).toBe("U-18");
    expect(ageGroupFromBirthDate(yearsAgo(16))).toBe("U-17");
    expect(ageGroupFromBirthDate(yearsAgo(15))).toBe("U-16");
    expect(ageGroupFromBirthDate(yearsAgo(12))).toBe("U-15");
    expect(ageGroupFromBirthDate("2012-13-40")).toBe(""); // geçersiz
  });
});

describe("applicationSchema — yaş dallı veli zorunluluğu + opsiyonel alanlar", () => {
  it("(a) yaş ≥18: veli adı OLMADAN geçer (Zod veli istemiyor)", () => {
    const r = applicationSchema.safeParse(baseValid({ birthDate: ADULT, parentName: "" }));
    expect(r.success).toBe(true);
  });

  it("(b) yaş <18: veli adı BOŞsa REDDEDİLİR (path=parentName)", () => {
    const r = applicationSchema.safeParse(baseValid({ birthDate: MINOR, parentName: "" }));
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.path[0] === "parentName")).toBe(true);
  });

  it("yaş <18 + veli adı dolu → geçer", () => {
    expect(applicationSchema.safeParse(baseValid({ birthDate: MINOR })).success).toBe(true);
  });

  it("(d) 'mevcut kulüp' opsiyonel: boşken geçer, doluyken saklanır", () => {
    const empty = applicationSchema.safeParse(baseValid({ birthDate: ADULT, parentName: "" }));
    expect(empty.success).toBe(true);
    if (empty.success) expect(empty.data.currentClub ?? "").toBe(""); // boş → sorun değil
    const filled = applicationSchema.safeParse(baseValid({ birthDate: ADULT, parentName: "", currentClub: "Karşıyaka SK" }));
    expect(filled.success).toBe(true);
    if (filled.success) expect(filled.data.currentClub).toBe("Karşıyaka SK");
  });

  it("regresyon: geçersiz doğum tarihi hâlâ reddedilir; zorunlu KVKK onayı hâlâ şart", () => {
    expect(applicationSchema.safeParse(baseValid({ birthDate: "2012-13-40" })).success).toBe(false);
    expect(applicationSchema.safeParse(baseValid({ consents: { aydinlatma: true } })).success).toBe(false);
  });
});
