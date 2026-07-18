#!/usr/bin/env node
/**
 * Web Push (VAPID) anahtar çifti üretir ve `.env`'e YAZAR.
 *
 * GÜVENLİK: Üretilen anahtarlar STDOUT'a **BASILMAZ** — private anahtar sırdır ve
 * terminal geçmişine/log'a düşmemelidir. Yalnızca doğrulama özeti yazılır.
 *
 * Yazdığı değişkenler:
 *   NEXT_PUBLIC_VAPID_PUBLIC_KEY  → istemci (PushToggle → pushManager.subscribe)
 *   VAPID_PUBLIC_KEY              → sunucu (lib/push.ts → webpush.setVapidDetails)
 *   VAPID_PRIVATE_KEY             → sunucu (gönderim imzası) — SIR
 *   VAPID_SUBJECT                 → yoksa varsayılan mailto ile eklenir
 * Public anahtar İKİ değişkende de AYNI olmalıdır; aksi halde abonelik ile gönderim
 * imzası uyuşmaz ve push sessizce başarısız olur.
 *
 * Kullanım:  node scripts/generate-vapid.mjs
 * ⚠️ Sonrasında YENİDEN BUILD gerekir — `NEXT_PUBLIC_*` derleme anında gömülür,
 *    yalnız .env'i değiştirmek istemciyi güncellemez (deploy.sh build alır).
 * ⚠️ Anahtarları DEĞİŞTİRMEK mevcut tüm abonelikleri geçersiz kılar; kullanıcılar
 *    bildirimi yeniden açmalıdır (eski endpoint'ler gönderimde 410 alıp temizlenir).
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import webpush from "web-push";

const ENV_PATH = path.join(process.cwd(), ".env");
if (!existsSync(ENV_PATH)) {
  console.error(`HATA: .env bulunamadı → ${ENV_PATH}`);
  console.error("Bu betiği projenin kök dizininde çalıştırın.");
  process.exit(1);
}

const { publicKey, privateKey } = webpush.generateVAPIDKeys();

// Geri dönüş için mevcut .env'i yedekle (.env* gitignore'da).
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backup = `${ENV_PATH}.bak-${stamp}`;
copyFileSync(ENV_PATH, backup);

let env = readFileSync(ENV_PATH, "utf8");
function setVar(name, value) {
  const line = `${name}="${value}"`;
  const re = new RegExp(`^${name}=.*$`, "m");
  if (re.test(env)) {
    env = env.replace(re, line);
  } else {
    if (!env.endsWith("\n")) env += "\n";
    env += `${line}\n`;
  }
}

setVar("NEXT_PUBLIC_VAPID_PUBLIC_KEY", publicKey);
setVar("VAPID_PUBLIC_KEY", publicKey);
setVar("VAPID_PRIVATE_KEY", privateKey);
if (!/^VAPID_SUBJECT=.+$/m.test(env)) setVar("VAPID_SUBJECT", "mailto:bilgi@bucayildiz.com");

writeFileSync(ENV_PATH, env, "utf8");

// Yalnız doğrulama özeti — anahtar DEĞERLERİ yazılmaz.
const ok = /^B[A-Za-z0-9_-]{79,95}$/.test(publicKey);
console.log("✔ VAPID anahtar çifti üretildi ve .env'e yazıldı.");
console.log(`  public  : ${publicKey.length} karakter, "${publicKey[0]}" ile başlıyor → biçim ${ok ? "GEÇERLİ" : "BEKLENMEDİK"}`);
console.log(`  private : .env'e yazıldı (ekrana BASILMADI)`);
console.log(`  yedek   : ${path.basename(backup)}`);
console.log("→ Şimdi yeniden build/deploy gerekir (NEXT_PUBLIC_* derleme anında gömülür).");
if (!ok) process.exit(2);
