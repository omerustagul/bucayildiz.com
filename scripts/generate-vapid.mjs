#!/usr/bin/env node
/**
 * Web Push (VAPID) anahtar aracı — DOĞRULA veya ÜRET.
 *
 *   npm run vapid:check      → mevcut yapılandırmayı doğrular (hiçbir şey değiştirmez)
 *   npm run vapid:generate   → yeni çift üretir ve env dosyasına YAZAR
 *
 * ⚠️ HANGİ DOSYA? Next.js üretimde şu ÖNCELİKLE okur:
 *      .env.production.local > .env.local > .env.production > .env
 *    Yani `.env.production` varsa `.env`'e yazmak HİÇBİR ŞEY DEĞİŞTİRMEZ. Bu araç
 *    en YÜKSEK öncelikli mevcut dosyayı hedefler (elle: `node scripts/generate-vapid.mjs <dosya>`).
 *
 * GÜVENLİK: Anahtar DEĞERLERİ asla STDOUT'a basılmaz (private sırdır) — yalnız
 * uzunluk/biçim/eşleşme özeti yazılır. Public anahtar sır değildir ama gereksiz
 * yere log'a düşmesin diye o da basılmaz.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import webpush from "web-push";

const MODE = process.argv.includes("--check") ? "check" : "generate";
const explicit = process.argv.slice(2).find((a) => !a.startsWith("--"));

/** Next.js üretim öncelik sırası (yüksek → düşük). */
const CANDIDATES = [".env.production.local", ".env.local", ".env.production", ".env"];

function resolveTarget() {
  if (explicit) return path.resolve(process.cwd(), explicit);
  const found = CANDIDATES.map((f) => path.join(process.cwd(), f)).filter(existsSync);
  if (found.length === 0) return null;
  return found[0]; // en yüksek öncelikli
}

/**
 * .env ayrıştırıcı — `KEY="deger"  # yorum` ve `KEY=deger # yorum` biçimlerini
 * DOĞRU okur. (Naif `split("=")[1]` yorumu değere katar; bu tuzak 2026-07-18'de
 * yanlış teşhise yol açtı: geçerli 87 karakterlik anahtar "143 karakter geçersiz"
 * göründü.)
 */
function parseEnv(file) {
  const out = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v.startsWith('"')) {
      const end = v.indexOf('"', 1);
      v = end > 0 ? v.slice(1, end) : v.slice(1);
    } else if (v.startsWith("'")) {
      const end = v.indexOf("'", 1);
      v = end > 0 ? v.slice(1, end) : v.slice(1);
    } else {
      v = v.split("#")[0].trim();
    }
    out[m[1]] = v;
  }
  return out;
}

const isValidPublic = (k) => /^B[A-Za-z0-9_-]{79,95}$/.test(k || "");

/** private → public türetip yapılandırılanla karşılaştırır (çift tutarlı mı). */
function derivesPublic(priv, pub) {
  try {
    const ec = crypto.createECDH("prime256v1");
    ec.setPrivateKey(Buffer.from(priv, "base64url"));
    return ec.getPublicKey().toString("base64url") === pub;
  } catch {
    return false;
  }
}

const target = resolveTarget();
if (!target) {
  console.error(`HATA: env dosyası yok (${CANDIDATES.join(", ")}). Proje kökünde çalıştırın.`);
  process.exit(1);
}

const others = CANDIDATES.map((f) => path.join(process.cwd(), f)).filter((f) => existsSync(f) && f !== target);
console.log(`env dosyası: ${path.basename(target)}${others.length ? `  (öncelik altında kalanlar: ${others.map((f) => path.basename(f)).join(", ")})` : ""}`);

if (MODE === "check") {
  const e = parseEnv(target);
  const pubC = e.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
  const pubS = e.VAPID_PUBLIC_KEY || "";
  const priv = e.VAPID_PRIVATE_KEY || "";
  const checks = [
    ["istemci public biçimi (87 kr, B ile başlar)", isValidPublic(pubC)],
    ["sunucu public biçimi", isValidPublic(pubS)],
    ["istemci public == sunucu public", !!pubC && pubC === pubS],
    ["private uzunluğu (43)", priv.length === 43],
    ["private → public türetimi yapılandırmayla EŞLEŞİYOR", derivesPublic(priv, pubC)],
    ["VAPID_SUBJECT tanımlı", !!(e.VAPID_SUBJECT || "").trim()],
  ];
  let ok = true;
  for (const [label, pass] of checks) {
    if (!pass) ok = false;
    console.log(`  ${pass ? "✔" : "✘"} ${label}`);
  }
  console.log(ok ? "\n✔ VAPID yapılandırması GEÇERLİ." : "\n✘ VAPID yapılandırması EKSİK/HATALI → `npm run vapid:generate`");
  process.exit(ok ? 0 : 1);
}

// --- üretim modu ---
const { publicKey, privateKey } = webpush.generateVAPIDKeys();
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backup = `${target}.bak-${stamp}`;
copyFileSync(target, backup);

let env = readFileSync(target, "utf8");
function setVar(name, value) {
  const line = `${name}="${value}"`;
  const re = new RegExp(`^${name}=.*$`, "m");
  if (re.test(env)) env = env.replace(re, line);
  else env = (env.endsWith("\n") ? env : env + "\n") + line + "\n";
}
setVar("NEXT_PUBLIC_VAPID_PUBLIC_KEY", publicKey);
setVar("VAPID_PUBLIC_KEY", publicKey);
setVar("VAPID_PRIVATE_KEY", privateKey);
if (!/^VAPID_SUBJECT=.+$/m.test(env)) setVar("VAPID_SUBJECT", "mailto:bilgi@bucayildiz.com");
writeFileSync(target, env, "utf8");

console.log("✔ Yeni VAPID çifti üretildi ve yazıldı (değerler BASILMADI).");
console.log(`  public : ${publicKey.length} karakter, biçim ${isValidPublic(publicKey) ? "GEÇERLİ" : "BEKLENMEDİK"}`);
console.log(`  çift tutarlı: ${derivesPublic(privateKey, publicKey) ? "EVET" : "HAYIR"}`);
console.log(`  yedek  : ${path.basename(backup)}`);
console.log("→ Yeniden BUILD gerekir (NEXT_PUBLIC_* derleme anında gömülür).");
console.log("→ Anahtar değişti: mevcut abonelikler geçersizleşir, kullanıcılar yeniden açmalı.");
