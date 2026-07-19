/**
 * KVKK rıza kayıtlarını CSV'ye dönüştürür (D7 — ispat yükü / md.11 bilgi talebi).
 *
 * SAF ve tek kaynak: tarih biçimleme çağırana bırakılır (deterministik test için
 * satırlar ÖN-BİÇİMLİ string tarih taşır — ApplicationConsentCell deseniyle aynı).
 *
 * Güvenlik/uyum detayları (kod incelemede sık kaçar, burada baştan):
 *  1) CSV injection: `= + - @` ile başlayan hücre Excel/Sheets'te FORMÜL çalıştırır
 *     (isim alanına "=cmd" yazan biri → alıcıda kod). Böyle hücreler `'` ile nötrlenir.
 *  2) UTF-8 BOM: başa `﻿` — yoksa Excel Türkçe'yi (ş/ğ/ı) bozuk açar.
 *  3) CRLF satır sonu: CSV (RFC 4180) + Windows Excel uyumu.
 */

export type ConsentExportRow = {
  documentTitle: string;
  documentVersion: string;
  granted: boolean;
  granterName: string;
  granterRelation: string | null;
  channel: string;
  /** Ön-biçimli (ör. "18.07.2026 14:30"). */
  createdAt: string;
  /** Geri alındıysa ön-biçimli tarih, değilse null. */
  withdrawnAt: string | null;
  ipAddress: string | null;
  otpVerified: boolean;
  textHash: string;
};

const COLUMNS = [
  "Belge", "Sürüm", "Durum", "Onaylayan", "İlişki", "Kanal",
  "Tarih", "Geri Alma Tarihi", "IP Adresi", "OTP Doğrulandı", "Metin Hash (SHA-256)",
] as const;

/** Kaydın anlamı: geri alma > verildi/reddedildi. */
export function consentStatus(r: Pick<ConsentExportRow, "granted" | "withdrawnAt">): string {
  if (r.withdrawnAt) return "Geri alındı";
  return r.granted ? "Verildi" : "Reddedildi";
}

/** Tek CSV hücresi: injection nötrle + tırnakla + iç tırnağı ikile. */
function cell(v: string | null | undefined): string {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // CSV injection savunması
  return `"${s.replace(/"/g, '""')}"`;
}

export function toConsentCsv(rows: ConsentExportRow[]): string {
  const lines: string[] = [COLUMNS.map(cell).join(",")];
  for (const r of rows) {
    lines.push([
      r.documentTitle,
      r.documentVersion,
      consentStatus(r),
      r.granterName,
      r.granterRelation ?? "",
      r.channel,
      r.createdAt,
      r.withdrawnAt ?? "",
      r.ipAddress ?? "",
      r.otpVerified ? "Evet" : "Hayır",
      r.textHash,
    ].map(cell).join(","));
  }
  return "﻿" + lines.join("\r\n"); // BOM + CRLF
}

/** İndirme dosya adı için güvenli slug ("Ayşe Yıldız" → "ayse-yildiz"). */
export function fileSlug(name: string): string {
  const map: Record<string, string> = { ı: "i", İ: "i", ş: "s", Ş: "s", ğ: "g", Ğ: "g", ü: "u", Ü: "u", ö: "o", Ö: "o", ç: "c", Ç: "c" };
  return (name || "kayit")
    .replace(/[ıİşŞğĞüÜöÖçÇ]/g, (c) => map[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "kayit";
}
