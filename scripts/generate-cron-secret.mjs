#!/usr/bin/env node
/**
 * Zamanlanmış görev anahtarı (`CRON_SECRET`) üretir ve env dosyasına YAZAR.
 *
 * GÜVENLİK: Anahtar STDOUT'a **BASILMAZ** (terminal geçmişi/log). Yalnız uzunluk özeti.
 *
 * ⚠️ HANGİ DOSYA? Next.js üretimde `.env.production` > `.env` önceliğiyle okur; bu araç
 *    en YÜKSEK öncelikli MEVCUT dosyayı hedefler (yanlış dosyaya yazıp "neden çalışmıyor"
 *    tuzağına düşmemek için — bkz. DEPLOYMENT.md VAPID notu).
 *
 * Kullanım:  node scripts/generate-cron-secret.mjs [--force]
 * Var olan anahtar KORUNUR; değiştirmek için --force (cron script'i env'den okuduğu için
 * ayrıca bir yeri güncellemek gerekmez).
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const FORCE = process.argv.includes("--force");
const CANDIDATES = [".env.production.local", ".env.local", ".env.production", ".env"];

const target = CANDIDATES.map((f) => path.join(process.cwd(), f)).find(existsSync);
if (!target) {
  console.error(`HATA: env dosyası yok (${CANDIDATES.join(", ")}). Proje kökünde çalıştırın.`);
  process.exit(1);
}
console.log(`env dosyası: ${path.basename(target)}`);

let env = readFileSync(target, "utf8");
const existing = /^CRON_SECRET=\s*"?([^"\n]*)"?/m.exec(env)?.[1]?.trim();
if (existing && !FORCE) {
  console.log(`✔ CRON_SECRET zaten tanımlı (${existing.length} karakter) — değiştirilmedi.`);
  console.log("  Yenilemek için: node scripts/generate-cron-secret.mjs --force");
  process.exit(0);
}

const secret = crypto.randomBytes(32).toString("hex"); // 64 karakter
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backup = `${target}.bak-${stamp}`;
copyFileSync(target, backup);

const line = `CRON_SECRET="${secret}"`;
const re = /^CRON_SECRET=.*$/m;
env = re.test(env) ? env.replace(re, line) : (env.endsWith("\n") ? env : env + "\n") + line + "\n";
writeFileSync(target, env, "utf8");

console.log(`✔ CRON_SECRET üretildi ve yazıldı (${secret.length} karakter, ekrana BASILMADI).`);
console.log(`  yedek: ${path.basename(backup)}`);
console.log("→ Uygulamanın yeni değeri okuması için PM2 reload gerekir (deploy bunu yapar).");
