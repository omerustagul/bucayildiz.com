/** Loglama yardımcıları. KVKK: sunucu loglarına kişisel veri (telefon, e-posta,
 *  çocuk adı/yaş, mesaj içeriği) YAZMA. Hata nesnesinin tamamı çoğu zaman alıcı
 *  adresini/gövdeyi içerir — bunun yerine yalnız kararlı bir etiket logla. */

/** Hatadan PII içermeyen kısa etiket (ör. "EAUTH", "TypeError"). */
export function errLabel(e: unknown): string {
  if (e && typeof e === "object") {
    const code = (e as { code?: unknown }).code;
    if (typeof code === "string" && code) return code;
    if (e instanceof Error) return e.name;
  }
  return "hata";
}
