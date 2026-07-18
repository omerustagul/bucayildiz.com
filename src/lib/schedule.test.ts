// @vitest-environment node
// Tekrarlı seri tarih genişletmesi. Bu fonksiyon TOPLU KAYIT üretir — bir gün kayması
// veya sınır hatası onlarca yanlış antrenman demektir. TZ tuzağı: "YYYY-MM-DD" stringi
// `new Date(s)` ile UTC yorumlanır ve TR'de bir gün kayar; bu yüzden yerel kurulum
// kullanılır. Testler sınırları, ay/yıl geçişini ve üst sınırı sabitler.
import { describe, it, expect } from "vitest";
import { expandWeekdays, parseYmd, toYmd, MAX_SERIES_TRAININGS, WEEKDAYS } from "@/lib/schedule";

// 2026-07-13 Pazartesi, 2026-07-18 Cumartesi, 2026-07-19 Pazar
const MON = 1, WED = 3, SAT = 6, SUN = 0;

describe("parseYmd / toYmd (TZ-güvenli)", () => {
  it("yerel tarih kurar — gün KAYMAZ", () => {
    const d = parseYmd("2026-07-18")!;
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6); // Temmuz
    expect(d.getDate()).toBe(18);
    expect(toYmd(d)).toBe("2026-07-18");
  });

  it("gidiş-dönüş kayıpsız", () => {
    for (const s of ["2026-01-01", "2026-12-31", "2024-02-29"]) {
      expect(toYmd(parseYmd(s)!)).toBe(s);
    }
  });

  it("geçersiz biçim ve TAŞAN tarih reddedilir", () => {
    expect(parseYmd("18-07-2026")).toBeNull();
    expect(parseYmd("2026-7-8")).toBeNull();
    expect(parseYmd("2026-02-31")).toBeNull(); // 3 Mart'a taşardı
    expect(parseYmd("2025-02-29")).toBeNull(); // artık yıl değil
    expect(parseYmd("")).toBeNull();
  });
});

describe("expandWeekdays", () => {
  it("tek gün / 3 hafta → 3 tarih (haftalık aralıklarla)", () => {
    expect(expandWeekdays("2026-07-13", "2026-07-31", [MON])).toEqual(["2026-07-13", "2026-07-20", "2026-07-27"]);
  });

  it("birden çok gün artan sırada üretilir", () => {
    expect(expandWeekdays("2026-07-13", "2026-07-19", [MON, WED, SAT])).toEqual([
      "2026-07-13", "2026-07-15", "2026-07-18",
    ]);
  });

  it("SINIRLAR DAHİL (başlangıç ve bitiş uyuyorsa listeye girer)", () => {
    expect(expandWeekdays("2026-07-13", "2026-07-20", [MON])).toEqual(["2026-07-13", "2026-07-20"]);
  });

  it("ay ve yıl geçişini doğru aşar", () => {
    expect(expandWeekdays("2026-12-28", "2027-01-11", [MON])).toEqual(["2026-12-28", "2027-01-04", "2027-01-11"]);
  });

  it("Pazar (0) doğru eşleşir — 0 'boş' sanılıp düşmez", () => {
    expect(expandWeekdays("2026-07-13", "2026-07-19", [SUN])).toEqual(["2026-07-19"]);
  });

  it("ters aralık / boş gün / geçersiz tarih → boş dizi", () => {
    expect(expandWeekdays("2026-07-31", "2026-07-01", [MON])).toEqual([]);
    expect(expandWeekdays("2026-07-01", "2026-07-31", [])).toEqual([]);
    expect(expandWeekdays("bozuk", "2026-07-31", [MON])).toEqual([]);
    expect(expandWeekdays("2026-07-01", "2026-02-31", [MON])).toEqual([]);
  });

  it("aralık dışı gün numaraları yok sayılır", () => {
    expect(expandWeekdays("2026-07-13", "2026-07-19", [9, -1])).toEqual([]);
    expect(expandWeekdays("2026-07-13", "2026-07-19", [MON, 42])).toEqual(["2026-07-13"]);
  });

  it("aynı gün başlangıç=bitiş → uyuyorsa 1, uymuyorsa 0", () => {
    expect(expandWeekdays("2026-07-13", "2026-07-13", [MON])).toEqual(["2026-07-13"]);
    expect(expandWeekdays("2026-07-14", "2026-07-14", [MON])).toEqual([]);
  });

  it("ÜST SINIR aşılmaz (kazara devasa seri kurulamaz)", () => {
    const r = expandWeekdays("2026-01-01", "2030-01-01", [MON, WED, SAT]);
    expect(r.length).toBe(MAX_SERIES_TRAININGS);
  });
});

describe("WEEKDAYS listesi", () => {
  it("7 gün, Pazartesi ile başlar, Pazar 0 ile biter", () => {
    expect(WEEKDAYS).toHaveLength(7);
    expect(WEEKDAYS[0]).toMatchObject({ value: 1, short: "Pzt" });
    expect(WEEKDAYS[6]).toMatchObject({ value: 0, short: "Paz" });
    expect(new Set(WEEKDAYS.map((d) => d.value)).size).toBe(7);
  });
});
