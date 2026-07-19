// @vitest-environment node
// KVKK CSV dışa aktarım — ispat belgesi üretir; güvenlik/uyum kuralları sabitlenir:
// injection nötrleme, UTF-8 BOM, tırnak kaçışı, durum eşlemesi.
import { describe, it, expect } from "vitest";
import { toConsentCsv, consentStatus, fileSlug, type ConsentExportRow } from "@/lib/consentExport";

const base: ConsentExportRow = {
  documentTitle: "Foto/Video Muvafakati",
  documentVersion: "v1",
  granted: true,
  granterName: "Ayşe Yılmaz",
  granterRelation: "veli",
  channel: "veli-panel",
  createdAt: "18.07.2026 14:30",
  withdrawnAt: null,
  ipAddress: "1.2.3.4",
  otpVerified: false,
  textHash: "abc123",
};

describe("consentStatus", () => {
  it("geri alma her şeyi ezer", () => {
    expect(consentStatus({ granted: true, withdrawnAt: "18.07.2026" })).toBe("Geri alındı");
    expect(consentStatus({ granted: false, withdrawnAt: "18.07.2026" })).toBe("Geri alındı");
  });
  it("verildi / reddedildi", () => {
    expect(consentStatus({ granted: true, withdrawnAt: null })).toBe("Verildi");
    expect(consentStatus({ granted: false, withdrawnAt: null })).toBe("Reddedildi");
  });
});

describe("toConsentCsv", () => {
  it("BOM ile başlar (Excel Türkçe'yi doğru açsın)", () => {
    expect(toConsentCsv([]).startsWith("﻿")).toBe(true);
  });

  it("CRLF satır sonu kullanır", () => {
    const csv = toConsentCsv([base]);
    expect(csv).toContain("\r\n");
    expect(csv).not.toMatch(/[^\r]\n/); // yalnız-LF olmamalı
  });

  it("başlık satırı tüm sütunları içerir", () => {
    const head = toConsentCsv([]).replace("﻿", "");
    for (const col of ["Belge", "Sürüm", "Durum", "Onaylayan", "İlişki", "Kanal", "Tarih", "Geri Alma Tarihi", "IP Adresi", "OTP Doğrulandı", "Metin Hash (SHA-256)"]) {
      expect(head).toContain(`"${col}"`);
    }
  });

  it("verilen kaydı doğru alanlarla yazar", () => {
    const line = toConsentCsv([base]).split("\r\n")[1];
    expect(line).toContain('"Foto/Video Muvafakati"');
    expect(line).toContain('"Verildi"');
    expect(line).toContain('"Ayşe Yılmaz"');
    expect(line).toContain('"veli"');
    expect(line).toContain('"Hayır"'); // otpVerified false
  });

  it("geri alınmış kayıt 'Geri alındı' + geri alma tarihi", () => {
    const line = toConsentCsv([{ ...base, withdrawnAt: "20.07.2026 09:00" }]).split("\r\n")[1];
    expect(line).toContain('"Geri alındı"');
    expect(line).toContain('"20.07.2026 09:00"');
  });

  it("null ilişki/IP boş hücre olur (çökmez)", () => {
    const line = toConsentCsv([{ ...base, granterRelation: null, ipAddress: null }]).split("\r\n")[1];
    // ardışık boş tırnaklı hücreler
    expect(line).toContain('""');
  });

  it("CSV injection: = + - @ ile başlayan hücre ' ile nötrlenir", () => {
    const evil = toConsentCsv([{ ...base, granterName: "=HYPERLINK(\"http://x\")" }]).split("\r\n")[1];
    expect(evil).toContain(`"'=HYPERLINK`); // baştaki ' eklendi
  });

  it("virgül/tırnak/newline içeren alan doğru kaçırılır", () => {
    const line = toConsentCsv([{ ...base, documentTitle: 'A, "B"\nC' }]).split("﻿")[1];
    // iç tırnak ikilenir
    expect(line).toContain('""B""');
    // virgül tırnak içinde → alanı bölmez (11 sütun korunur)
    const cells = toConsentCsv([{ ...base, documentTitle: "X,Y,Z" }]).replace("﻿", "").split("\r\n")[1].match(/"(?:[^"]|"")*"/g);
    expect(cells).toHaveLength(11);
  });

  it("OTP doğrulanmış → Evet", () => {
    expect(toConsentCsv([{ ...base, otpVerified: true }]).split("\r\n")[1]).toContain('"Evet"');
  });
});

describe("fileSlug", () => {
  it("Türkçe karakterleri ASCII'ye indirir, boşlukları tireler", () => {
    expect(fileSlug("Ayşe Yıldız")).toBe("ayse-yildiz");
    expect(fileSlug("İĞÜÇÖŞ")).toBe("igucos");
  });
  it("boş/özel karakter güvenli", () => {
    expect(fileSlug("")).toBe("kayit");
    expect(fileSlug("!!!")).toBe("kayit");
    expect(fileSlug("  a  b  ")).toBe("a-b");
  });
});
