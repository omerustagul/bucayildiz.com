/**
 * Performans verisi — tek doğruluk kaynağı (form, geçmiş tablosu ve matris ortak kullanır).
 * Ham test değerleri girilir; VO2max ve radar skorları buradan TÜRETİLİR.
 */

/* ----------------------------------------------------------------- VO2max */

export type YoyoLevel = "IR1" | "IR2";
export const YOYO_LEVELS: { value: YoyoLevel; label: string; formula: string }[] = [
  { value: "IR1", label: "Yo-Yo IR1", formula: "mesafe × 0.0084 + 36.4" },
  { value: "IR2", label: "Yo-Yo IR2", formula: "mesafe × 0.0136 + 45.3" },
];

/** Yo-Yo IR mesafesinden (m) VO2max (ml/kg/dk). Seviye ölçümde seçilir. */
export function computeVo2(level: string | null | undefined, distance: number | null | undefined): number | null {
  if (distance == null || !level) return null;
  if (level === "IR2") return Math.round((distance * 0.0136 + 45.3) * 10) / 10;
  return Math.round((distance * 0.0084 + 36.4) * 10) / 10; // IR1 (varsayılan)
}

/* ------------------------------------------------------- Ham test alanları */

export type TestKey =
  | "yoyoDistance" | "repeatedSprint"
  | "bodyFat" | "muscle"
  | "sprint10" | "sprint20" | "sprint30"
  | "verticalJump" | "standingLongJump"
  | "tTest" | "agility505";

export type Category = "endurance" | "speed" | "strength" | "agility";
export const CATEGORY_LABELS: Record<Category, string> = {
  endurance: "Dayanıklılık", speed: "Sürat", strength: "Kuvvet", agility: "Çeviklik",
};

export type TestMeta = {
  key: TestKey;
  label: string;
  short: string;
  unit: string;
  better: "up" | "down"; // değer yükseldikçe mi iyi, düştükçe mi iyi
  category?: Category; // radar kategorisi (vücut kompozisyonu radar'a girmez)
  /** 0–100 normalizasyon sınırları — yaş grubu için yaklaşık, gerekirse buradan ayarlanır. */
  worst: number;
  best: number;
};

export const TESTS: TestMeta[] = [
  { key: "yoyoDistance",     label: "Yo-Yo Mesafesi",       short: "Yo-Yo",      unit: "m",  better: "up",   category: "endurance", worst: 240,  best: 2000 },
  { key: "repeatedSprint",   label: "Tekrarlı Sprint",      short: "Tek.Sprint", unit: "sn", better: "down", category: "endurance", worst: 8.0,  best: 5.0 },
  { key: "bodyFat",          label: "Yağ Oranı",            short: "Yağ%",       unit: "%",  better: "down", worst: 25,   best: 8 },
  { key: "muscle",           label: "Kas Oranı",            short: "Kas%",       unit: "%",  better: "up",   worst: 30,   best: 50 },
  { key: "sprint10",         label: "Sprint 10m",           short: "10m",        unit: "sn", better: "down", category: "speed",     worst: 2.6,  best: 1.6 },
  { key: "sprint20",         label: "Sprint 20m",           short: "20m",        unit: "sn", better: "down", category: "speed",     worst: 4.2,  best: 2.9 },
  { key: "sprint30",         label: "Max Sürat 30m",        short: "30m",        unit: "sn", better: "down", category: "speed",     worst: 5.8,  best: 4.0 },
  { key: "verticalJump",     label: "Dikey Sıçrama",        short: "Dikey",      unit: "cm", better: "up",   category: "strength",  worst: 18,   best: 65 },
  { key: "standingLongJump", label: "Durarak Uzun Atlama",  short: "Uzun Atl.",  unit: "cm", better: "up",   category: "strength",  worst: 120,  best: 260 },
  { key: "tTest",            label: "T-Test",               short: "T-Test",     unit: "sn", better: "down", category: "agility",   worst: 14,   best: 9 },
  { key: "agility505",       label: "505 Çeviklik",         short: "505",        unit: "sn", better: "down", category: "agility",   worst: 3.2,  best: 2.2 },
];

export const TEST_BY_KEY = Object.fromEntries(TESTS.map((t) => [t.key, t])) as Record<TestKey, TestMeta>;
export const CATEGORIES: Category[] = ["endurance", "speed", "strength", "agility"];

export type RawValues = Partial<Record<TestKey, number | null>>;

/** Ham değeri 0–100 skora çevirir (worst→0, best→100, sınırlanır). Yön worst/best ile kodlanır. */
export function scoreTest(meta: TestMeta, value: number | null | undefined): number | null {
  if (value == null) return null;
  const t = (value - meta.worst) / (meta.best - meta.worst);
  return Math.max(0, Math.min(100, Math.round(t * 100)));
}

/** Bir kategorinin radar skoru = o kategorideki testlerin (mevcut olanların) skor ortalaması. */
export function categoryScore(cat: Category, m: RawValues): number | null {
  const scores = TESTS.filter((t) => t.category === cat)
    .map((t) => scoreTest(t, m[t.key]))
    .filter((n): n is number => n != null);
  if (!scores.length) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/* ----------------------------------------------------- Matris (Perf) prop'u */

export type Perf = {
  vo2: number | null;
  vo2History: number[];
  yoyoLevel: string | null;
  raw: Record<TestKey, number | null>;
  scores: Record<Category, number | null>;
  bodyFat: number | null;
  muscle: number | null;
  measuredAt: string | null;
};

type DbMeasurement = { measuredAt: string; yoyoLevel: string | null } & RawValues;

const pickRaw = (m: RawValues): Record<TestKey, number | null> =>
  Object.fromEntries(TESTS.map((t) => [t.key, m[t.key] ?? null])) as Record<TestKey, number | null>;

/**
 * Periyodik ölçüm dizisinden matris prop'u üretir.
 * - Mevcut durum = en GÜNCEL tarihli ölçüm.
 * - vo2History = tüm ölçümlerin (tarihe göre artan) hesaplanan VO2max serisi.
 */
export function measurementsToPerf(measurements: DbMeasurement[]): Perf | null {
  if (!measurements.length) return null;
  const sorted = [...measurements].sort((a, b) => a.measuredAt.localeCompare(b.measuredAt));
  const latest = sorted[sorted.length - 1];
  const vo2History = sorted
    .map((m) => computeVo2(m.yoyoLevel, m.yoyoDistance))
    .filter((n): n is number => typeof n === "number");
  return {
    vo2: computeVo2(latest.yoyoLevel, latest.yoyoDistance),
    vo2History,
    yoyoLevel: latest.yoyoLevel,
    raw: pickRaw(latest),
    scores: {
      endurance: categoryScore("endurance", latest),
      speed: categoryScore("speed", latest),
      strength: categoryScore("strength", latest),
      agility: categoryScore("agility", latest),
    },
    bodyFat: latest.bodyFat ?? null,
    muscle: latest.muscle ?? null,
    measuredAt: latest.measuredAt,
  };
}
