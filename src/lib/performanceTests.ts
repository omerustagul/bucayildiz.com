/**
 * Ücretsiz deneme performans testleri — TEK KAYNAK.
 *
 * Aynı 9 test iki yerde görünür: anasayfadaki "Örnek Rapor" kartı
 * (`HowItWorksSection`) ve `/ucretsiz-deneme` yolculuğu (`TrialJourney`).
 * Eskiden ikisi BAĞIMSIZ hardcoded listelerdi (anasayfada 4, yolculukta 9) →
 * veli sitede farklı test setleri görüyordu. Artık isim/sıra buradan gelir;
 * yeni test eklemek/çıkarmak için YALNIZ bu dosya değişir.
 *
 * `sample` değerleri TEMSİLİdir (örnek rapor vitrini) — gerçek ölçüm değildir;
 * 11 yaş civarı bir sporcu için makul aralıklardır.
 */
export type PerformanceTest = {
  key: string;
  /** Uzun başlık — yolculuk sahnelerinde. */
  title: string;
  /** Kısa etiket — örnek rapor gibi dar alanlarda. */
  short: string;
  /** Örnek rapordaki temsili sonuç. */
  sample: string;
};

export const PERFORMANCE_TESTS: PerformanceTest[] = [
  { key: "vucut", title: "Vücut Profili Çıkarılır", short: "Vücut Profili", sample: "%14 yağ" },
  { key: "esneklik", title: "Esneklik Testi", short: "Esneklik", sample: "32 cm" },
  { key: "dikey", title: "Dikey Sıçrama Testi", short: "Dikey Sıçrama", sample: "38 cm" },
  { key: "uzun", title: "Uzun Atlama", short: "Uzun Atlama", sample: "1.85 m" },
  { key: "koordinasyon", title: "Koordinasyon Testi", short: "Koordinasyon", sample: "8.4 sn" },
  { key: "sprint", title: "Sprint Testleri", short: "20 m Sprint", sample: "3.45 sn" },
  { key: "cev505", title: "505 Çeviklik Testi", short: "505 Çeviklik", sample: "2.61 sn" },
  { key: "ttest", title: "T Testi", short: "T Testi", sample: "11.20 sn" },
  { key: "yoyo", title: "Yo-Yo Testi", short: "Yo-Yo", sample: "1200 m" },
];

/** Anahtarla test getirir (yolculuk sahneleri sırayı bozmadan eşlesin diye). */
export function perfTest(key: string): PerformanceTest {
  const t = PERFORMANCE_TESTS.find((x) => x.key === key);
  if (!t) throw new Error(`Bilinmeyen performans testi: ${key}`);
  return t;
}
