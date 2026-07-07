// Dev/prod veritabanı yedeği — pg_dump (custom format) ile backups/ altına alır.
// Kullanım: npm run db:backup   (DATABASE_URL .env'den okunur)
// KURAL: her şema değişikliği / migration ÖNCESİ çalıştırılır (bkz. CLAUDE.md).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";

const KEEP = 14; // en yeni N yedek tutulur

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("HATA: DATABASE_URL tanımlı değil (.env). `node --env-file=.env` ile çalıştırın.");
  process.exit(1);
}

// pg_dump'ı bul: PATH → yaygın Windows kurulum yolları
function findPgDump() {
  const candidates = [
    "pg_dump", // PATH'te ise
    "C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe",
    "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe",
    "C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe",
  ];
  for (const c of candidates) {
    try {
      execFileSync(c, ["--version"], { stdio: "ignore" });
      return c;
    } catch {
      /* sıradakine bak */
    }
  }
  return null;
}

const pgDump = process.env.PG_DUMP_PATH ?? findPgDump();
if (!pgDump) {
  console.error("HATA: pg_dump bulunamadı. PG_DUMP_PATH env değişkeniyle tam yolu verin.");
  process.exit(1);
}

const outDir = path.resolve(process.cwd(), "backups");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const now = new Date();
const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
const outFile = path.join(outDir, `bucayildiz_${stamp}.dump`);

// DATABASE_URL'i doğrudan pg_dump'a ver (şifre dahil; komut satırında görünmesin
// diye env üzerinden değil argümanla — pg_dump connection string kabul eder).
// ?schema=public gibi Prisma'ya özgü parametreleri temizle.
const dsn = url.replace(/\?schema=[^&]+(&|$)/, (m, g1) => (g1 === "&" ? "?" : ""));

try {
  execFileSync(pgDump, ["-Fc", "--no-owner", "-f", outFile, "-d", dsn], { stdio: ["ignore", "inherit", "inherit"] });
} catch {
  console.error("HATA: pg_dump başarısız oldu.");
  process.exit(1);
}

const size = statSync(outFile).size;
console.log(`✔ Yedek alındı: ${path.relative(process.cwd(), outFile)} (${(size / 1024).toFixed(1)} KB)`);

// Rotasyon: en yeni KEEP dışındakileri sil
const dumps = readdirSync(outDir)
  .filter((f) => f.startsWith("bucayildiz_") && f.endsWith(".dump"))
  .sort()
  .reverse();
for (const old of dumps.slice(KEEP)) {
  unlinkSync(path.join(outDir, old));
  console.log(`  eski yedek silindi: ${old}`);
}
console.log(`  toplam ${Math.min(dumps.length, KEEP)} yedek tutuluyor (limit ${KEEP}).`);
console.log(`Geri yükleme: pg_restore -d "DATABASE_URL" --clean --no-owner ${path.relative(process.cwd(), outFile)}`);
