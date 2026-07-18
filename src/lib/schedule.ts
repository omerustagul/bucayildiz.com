/**
 * Tekrarlı antrenman serisi — tarih genişletme (Faz 4.1).
 *
 * Proje kuralı: tarihler "YYYY-MM-DD" STRING tutulur (TZ sorunlarını önlemek için).
 * Bu yüzden burada `new Date("2026-07-18")` KULLANILMAZ — o biçim UTC olarak yorumlanır
 * ve TR saatinde bir gün KAYABİLİR. Bunun yerine parçalara ayrılıp `new Date(y, m-1, d)`
 * (YEREL) kurulur; çıktı yine elle biçimlenir.
 */

/** Bir seride üretilebilecek en fazla antrenman (kazara devasa seri kurulmasın). */
export const MAX_SERIES_TRAININGS = 60;

/** Güvenlik freni: aralık taraması bu kadar günü aşamaz (~2 yıl). */
const MAX_SCAN_DAYS = 800;

/** Hafta günleri — JS `getDay()` değerleriyle (0=Paz…6=Cmt), gösterim Pazartesi-başlangıçlı. */
export const WEEKDAYS: { value: number; short: string; label: string }[] = [
  { value: 1, short: "Pzt", label: "Pazartesi" },
  { value: 2, short: "Sal", label: "Salı" },
  { value: 3, short: "Çar", label: "Çarşamba" },
  { value: 4, short: "Per", label: "Perşembe" },
  { value: 5, short: "Cum", label: "Cuma" },
  { value: 6, short: "Cmt", label: "Cumartesi" },
  { value: 0, short: "Paz", label: "Pazar" },
];

export function parseYmd(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const [, y, mo, d] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d)); // YEREL — TZ kaymaz
  // Taşmayı yakala (ör. "2026-02-31" → 3 Mart olurdu)
  if (dt.getFullYear() !== Number(y) || dt.getMonth() !== Number(mo) - 1 || dt.getDate() !== Number(d)) return null;
  return dt;
}

export function toYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * `startDate`..`endDate` (İKİSİ DE DAHİL) aralığında, seçilen hafta günlerine düşen
 * tarihleri artan sırada döndürür. Geçersiz giriş / ters aralık / boş gün seçimi → [].
 * Üst sınır aşılırsa yalnız ilk `MAX_SERIES_TRAININGS` tarih döner (çağıran uyarır).
 */
export function expandWeekdays(startDate: string, endDate: string, weekdays: number[]): string[] {
  const start = parseYmd(startDate);
  const end = parseYmd(endDate);
  if (!start || !end || end < start) return [];
  const want = new Set(weekdays.filter((n) => Number.isInteger(n) && n >= 0 && n <= 6));
  if (want.size === 0) return [];

  const out: string[] = [];
  const cur = new Date(start);
  for (let i = 0; i < MAX_SCAN_DAYS && cur <= end && out.length < MAX_SERIES_TRAININGS; i++) {
    if (want.has(cur.getDay())) out.push(toYmd(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}
