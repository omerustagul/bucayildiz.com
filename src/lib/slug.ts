/**
 * Türkçe-güvenli URL slug üreteci. Tesis gibi DB'de slug alanı OLMAYAN modeller
 * için ad'dan türetilir (şema değişikliği gerektirmez): eşleşme request anında
 * `trSlug(name) === param` ile yapılır.
 *
 * Türkçe harfler ASCII'ye indirgenir ("Kuruçeşme" → "kurucesme") — foldTr ile
 * aynı harita; yoksa aksanlı slug bozuk/çift olurdu.
 */
const MAP: Record<string, string> = {
  ı: "i", İ: "i", ş: "s", Ş: "s", ğ: "g", Ğ: "g",
  ü: "u", Ü: "u", ö: "o", Ö: "o", ç: "c", Ç: "c", â: "a", î: "i", û: "u",
};

export function trSlug(name: string): string {
  return (name || "")
    .replace(/[ıİşŞğĞüÜöÖçÇâîû]/g, (c) => MAP[c] ?? c)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
