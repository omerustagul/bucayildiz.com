/**
 * Başvuru durumları — TEK KAYNAK. Etiket + renk buradan; hem durum select'i
 * (ApplicationStatusSelect), hem filtre sekmeleri, hem satır/kart renklendirmesi
 * bunu kullanır.
 *
 * ÖNEMLİ: `value` alanları (stored string'ler: "new" vb.) DEĞİŞMEZ — DB'de
 * migration gerekmesin diye yalnız görünen `label`'lar güncellenir. Şema sade:
 * Application.status String (bkz. prisma/schema.prisma).
 *
 * Renk anlamı: new = dikkat bekliyor (amber), contacted = süreçte (navy),
 * scheduled = olumlu adım (green), registered = kazanıldı/terminal (altın = marka
 * başarı rengi), closed = arşiv (ink/nötr).
 */
export type ApplicationStatusMeta = {
  value: string;
  label: string;
  /** Satır/kart arka planı — açık tint (metni bozmayacak kadar hafif). */
  tint: string;
  /** Vurgu: sol şerit + sekme noktası. */
  accent: string;
  /** true = yalnız SİSTEM yazar, elle SEÇİLEMEZ. "registered" başvurudan sporcu
   *  oluşturulunca (createAthleteFromApplication) konur; elle seçilebilseydi
   *  sporcu yokken "Kayıtlandı" görünür, yani durum YALAN söylerdi. Görüntüleme
   *  (etiket/renk) ve filtre sekmesi yine çalışır; yalnız select'ten gizlenir.
   *  Bu durumdan ÇIKMAK serbesttir (ör. sporcu silindiyse admin başka duruma alır). */
  system?: boolean;
};

export const APPLICATION_STATUSES: ApplicationStatusMeta[] = [
  { value: "new", label: "Yeni Başvuru", tint: "var(--amber-100)", accent: "var(--amber-600)" },
  { value: "contacted", label: "İletişime Geçildi", tint: "var(--navy-50)", accent: "var(--navy-700)" },
  { value: "scheduled", label: "Randevu Verildi", tint: "var(--green-100)", accent: "var(--green-600)" },
  { value: "registered", label: "Kayıtlandı", tint: "var(--gold-100)", accent: "var(--gold-700)", system: true },
  { value: "closed", label: "Kapandı", tint: "var(--ink-50)", accent: "var(--ink-600)" },
];

/** Yöneticinin ELLE seçebileceği durumlar — durum select'i ve
 *  updateApplicationStatus doğrulaması bunu kullanır (sistem-yazımlılar hariç). */
export const MANUAL_APPLICATION_STATUSES = APPLICATION_STATUSES.filter((s) => !s.system);

const BY_VALUE = new Map(APPLICATION_STATUSES.map((s) => [s.value, s]));

/** Değere karşılık gelen meta; bilinmeyen/eski değerde güvenli nötr varsayılan. */
export function applicationStatusMeta(value: string): ApplicationStatusMeta {
  return BY_VALUE.get(value) ?? { value, label: value || "—", tint: "transparent", accent: "var(--ink-400)" };
}
