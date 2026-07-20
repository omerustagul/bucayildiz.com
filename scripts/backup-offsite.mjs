// Sunucu-DIŞI (off-site) veritabanı yedeği (#7).
//
// 1) pg_dump (custom format, sıkışık) → backups/ (yerel — hızlı geri yükleme)
// 2) BACKUP_S3_* env DOLUYSA → aynı dosyayı S3-uyumlu KOVAYA yükler (off-site).
//    Env boşsa YALNIZ yerel yedek alınır + uyarı (env-driven sessiz devre dışı — kural 4).
//
// NEDEN off-site: yerel yedekler VPS diskinde; sunucu/disk ölürse DB ile birlikte
// giderler. Off-site kopya, felaket kurtarmanın tek gerçek garantisidir.
//
// GÜVENLİK: hiçbir sır (S3 anahtarı, DB şifresi) STDOUT'a basılmaz.
//
// Kullanım: node --env-file=.env.production scripts/backup-offsite.mjs
// Cron: docs/DEPLOYMENT.md
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync, readFileSync } from "node:fs";
import path from "node:path";

const KEEP_LOCAL = 14;   // yerel: en yeni N .dump
const KEEP_S3 = 30;      // off-site: en yeni N nesne (7 günlük + haftalık için bol pay)
const S3_PREFIX = "db/"; // kova içinde yedeklerin ön eki

function fail(msg) { console.error(`HATA: ${msg}`); process.exit(1); }

const url = process.env.DATABASE_URL;
if (!url) fail("DATABASE_URL tanımlı değil. `node --env-file=.env.production` ile çalıştırın.");

// --- 1) pg_dump → yerel ---
function findPgDump() {
  for (const c of ["pg_dump", process.env.PG_DUMP_PATH].filter(Boolean)) {
    try { execFileSync(c, ["--version"], { stdio: "ignore" }); return c; } catch { /* dene */ }
  }
  return null;
}
const pgDump = findPgDump();
if (!pgDump) fail("pg_dump bulunamadı (PATH veya PG_DUMP_PATH).");

const outDir = path.resolve(process.cwd(), "backups");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const now = new Date();
const p2 = (n) => String(n).padStart(2, "0");
const stamp = `${now.getFullYear()}-${p2(now.getMonth() + 1)}-${p2(now.getDate())}_${p2(now.getHours())}${p2(now.getMinutes())}${p2(now.getSeconds())}`;
const fileName = `bucayildiz_${stamp}.dump`;
const outFile = path.join(outDir, fileName);
const dsn = url.replace(/\?schema=[^&]+(&|$)/, (m, g1) => (g1 === "&" ? "?" : ""));

try {
  execFileSync(pgDump, ["-Fc", "--no-owner", "-f", outFile, "-d", dsn], { stdio: ["ignore", "inherit", "inherit"] });
} catch {
  fail("pg_dump başarısız oldu.");
}
const size = statSync(outFile).size;
console.log(`✔ Yerel yedek: backups/${fileName} (${(size / 1024).toFixed(1)} KB)`);

// yerel rotasyon
const localDumps = readdirSync(outDir).filter((f) => f.startsWith("bucayildiz_") && f.endsWith(".dump")).sort().reverse();
for (const old of localDumps.slice(KEEP_LOCAL)) { unlinkSync(path.join(outDir, old)); }
console.log(`  yerel: ${Math.min(localDumps.length, KEEP_LOCAL)} yedek tutuluyor (limit ${KEEP_LOCAL}).`);

// --- 2) off-site S3 (env doluysa) ---
const bucket = process.env.BACKUP_S3_BUCKET;
if (!bucket) {
  console.warn("⚠ BACKUP_S3_BUCKET tanımlı değil → OFF-SITE yükleme ATLANDI (yalnız yerel yedek).");
  console.warn("  Felaket kurtarma için S3-uyumlu kova açıp BACKUP_S3_* env'lerini doldurun (bkz. DEPLOYMENT.md §Yedekleme).");
  process.exit(0);
}

const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = await import("@aws-sdk/client-s3");
const client = new S3Client({
  region: process.env.BACKUP_S3_REGION || "auto",
  endpoint: process.env.BACKUP_S3_ENDPOINT || undefined,
  credentials: {
    accessKeyId: process.env.BACKUP_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.BACKUP_S3_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true, // S3-uyumlu sağlayıcıların çoğu (B2/Wasabi/iDrive) path-style ister
});

const key = `${S3_PREFIX}${fileName}`;
try {
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: readFileSync(outFile), ContentType: "application/octet-stream" }));
  console.log(`✔ Off-site yüklendi: s3://${bucket}/${key}`);
} catch (e) {
  // Yükleme başarısız olsa da yerel yedek DURUYOR; sağlık kontrolü bunu alarma çevirir.
  fail(`S3 yükleme başarısız (${e?.name || "hata"}). Yerel yedek alındı, off-site YAPILAMADI.`);
}

// off-site rotasyon (en eski nesneleri sil)
try {
  const listed = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: S3_PREFIX }));
  const objs = (listed.Contents || []).filter((o) => o.Key?.endsWith(".dump")).sort((a, b) => (a.Key < b.Key ? 1 : -1)); // yeni→eski (isimde zaman damgası)
  for (const o of objs.slice(KEEP_S3)) {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: o.Key }));
  }
  console.log(`  off-site: ${Math.min(objs.length, KEEP_S3)} yedek tutuluyor (limit ${KEEP_S3}).`);
} catch {
  console.warn("⚠ off-site rotasyon atlandı (liste/silme hatası) — yükleme başarılıydı.");
}
