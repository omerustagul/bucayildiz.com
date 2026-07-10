/** Ortak tarih biçimleyiciler (TZ-güvenli, sunucu/istemci aynı sonuç). */

const AYLAR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

/** Date → "10 Tem 2026" */
export function fmtTrDateShort(d: Date): string {
  return `${d.getDate()} ${AYLAR[d.getMonth()]} ${d.getFullYear()}`;
}
