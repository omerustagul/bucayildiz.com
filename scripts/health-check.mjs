// Sunucu sağlık kontrolü + e-posta uyarısı (#7).
//
// Kontroller: disk kullanımı · DB erişilebilir + boyut · SON YEDEK tazeliği ·
// PM2 durumu · (varsa) off-site yedek tazeliği. Herhangi biri EŞİĞİ aşarsa
// mailToAdmin'e uyarı e-postası gider (mevcut SMTP; DB ayarı → env fallback).
//
// GÜVENLİK: hiçbir sır loglanmaz/e-postaya girmez.
// Kullanım: node --env-file=.env.production scripts/health-check.mjs
// Cron (saatlik): docs/DEPLOYMENT.md
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const DISK_ALARM_PCT = 85;
const BACKUP_MAX_AGE_H = 26; // günlük yedek + pay

const alarms = [];
const info = [];

// --- disk (kök bölüm) ---
try {
  const out = execFileSync("df", ["-P", process.cwd()], { encoding: "utf8" });
  const line = out.trim().split("\n").pop();
  const pct = Number((line.match(/(\d+)%/) || [])[1]);
  info.push(`Disk: %${pct} dolu`);
  if (pct >= DISK_ALARM_PCT) alarms.push(`Disk kullanımı %${pct} (eşik %${DISK_ALARM_PCT}).`);
} catch { alarms.push("Disk kullanımı okunamadı (df)."); }

// --- son yerel yedek tazeliği ---
try {
  const dir = path.resolve(process.cwd(), "backups");
  const dumps = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".dump")) : [];
  if (dumps.length === 0) {
    alarms.push("Hiç yerel yedek yok (backups/ boş).");
  } else {
    const newest = dumps.map((f) => statSync(path.join(dir, f)).mtimeMs).sort((a, b) => b - a)[0];
    const ageH = (Date.now() - newest) / 3.6e6;
    info.push(`Son yedek: ${ageH.toFixed(1)} saat önce (${dumps.length} yedek)`);
    if (ageH > BACKUP_MAX_AGE_H) alarms.push(`Son yedek ${ageH.toFixed(1)} saat önce (eşik ${BACKUP_MAX_AGE_H}s) — yedekleme çalışmıyor olabilir.`);
  }
} catch { alarms.push("Yedek tazeliği okunamadı."); }

// --- PM2 durumu ---
try {
  const out = execFileSync("pm2", ["jlist"], { encoding: "utf8" });
  const procs = JSON.parse(out);
  const app = procs.filter((p) => p.name === "bucayildiz");
  const online = app.filter((p) => p.pm2_env?.status === "online").length;
  info.push(`PM2: ${online}/${app.length} online`);
  if (app.length === 0) alarms.push("PM2'de 'bucayildiz' süreci yok.");
  else if (online < app.length) alarms.push(`PM2: ${app.length - online} süreç online DEĞİL.`);
} catch { /* PM2 yoksa (dev) sessiz geç — prod cron'da anlamlı */ info.push("PM2: kontrol edilemedi (dev?)"); }

// --- DB erişim + boyut (+ off-site tazeliği) ---
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();
let smtp = null;
try {
  const rows = await prisma.$queryRawUnsafe("SELECT pg_database_size(current_database()) AS size");
  const mb = Number(rows[0].size) / 1048576;
  info.push(`DB boyutu: ${mb.toFixed(1)} MB`);
  const s = await prisma.siteSetting.findUnique({ where: { id: "site" }, select: { smtpHost: true, smtpPort: true, smtpUser: true, smtpPass: true, mailFrom: true, mailToAdmin: true, email: true } });
  smtp = s;
} catch {
  alarms.push("VERİTABANINA ERİŞİLEMİYOR (pg).");
}

// off-site yedek tazeliği (env doluysa)
if (process.env.BACKUP_S3_BUCKET) {
  try {
    const { S3Client, ListObjectsV2Command } = await import("@aws-sdk/client-s3");
    const client = new S3Client({ region: process.env.BACKUP_S3_REGION || "auto", endpoint: process.env.BACKUP_S3_ENDPOINT || undefined, forcePathStyle: true, credentials: { accessKeyId: process.env.BACKUP_S3_ACCESS_KEY_ID || "", secretAccessKey: process.env.BACKUP_S3_SECRET_ACCESS_KEY || "" } });
    const listed = await client.send(new ListObjectsV2Command({ Bucket: process.env.BACKUP_S3_BUCKET, Prefix: "db/" }));
    const objs = (listed.Contents || []).filter((o) => o.Key?.endsWith(".dump"));
    if (objs.length === 0) alarms.push("Off-site kovada hiç yedek yok.");
    else {
      const newest = objs.map((o) => o.LastModified?.getTime() || 0).sort((a, b) => b - a)[0];
      const ageH = (Date.now() - newest) / 3.6e6;
      info.push(`Off-site son yedek: ${ageH.toFixed(1)} saat önce`);
      if (ageH > BACKUP_MAX_AGE_H) alarms.push(`Off-site yedek ${ageH.toFixed(1)} saat önce — S3 yükleme çalışmıyor olabilir.`);
    }
  } catch { alarms.push("Off-site kova kontrol edilemedi (S3)."); }
} else {
  info.push("Off-site: yapılandırılmamış (BACKUP_S3_* boş)");
}

console.log("── Sağlık ──");
info.forEach((i) => console.log("  " + i));
console.log(alarms.length ? `⚠ ${alarms.length} ALARM` : "✔ sorun yok");

// --- alarm varsa e-posta ---
if (alarms.length > 0) {
  const host = smtp?.smtpHost || process.env.SMTP_HOST || "";
  const to = smtp?.mailToAdmin || process.env.MAIL_TO_ADMIN || smtp?.email || "";
  if (!host || !to) {
    console.warn("⚠ SMTP/alıcı yok → uyarı e-postası GÖNDERİLEMEDİ. (Ayarlar→E-posta doldurun.)");
  } else {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const transport = nodemailer.createTransport({
        host, port: smtp?.smtpPort || Number(process.env.SMTP_PORT || 587),
        secure: (smtp?.smtpPort || 587) === 465,
        auth: (smtp?.smtpUser || process.env.SMTP_USER) ? { user: smtp?.smtpUser || process.env.SMTP_USER, pass: smtp?.smtpPass || process.env.SMTP_PASS } : undefined,
      });
      await transport.sendMail({
        from: smtp?.mailFrom || process.env.MAIL_FROM || "Buca Yıldız <bilgi@bucayildiz.com>",
        to,
        subject: `⚠ Buca Yıldız sunucu uyarısı — ${alarms.length} sorun`,
        text: `Sunucu sağlık kontrolü ${alarms.length} sorun buldu:\n\n${alarms.map((a) => "• " + a).join("\n")}\n\nDurum:\n${info.map((i) => "  " + i).join("\n")}\n\n— otomatik izleme (health-check.mjs)`,
      });
      console.log(`  uyarı e-postası gönderildi → ${to.replace(/(.{2}).*(@.*)/, "$1***$2")}`);
    } catch (e) {
      console.warn(`⚠ uyarı e-postası gönderilemedi (${e?.name || "hata"}).`);
    }
  }
}

await prisma.$disconnect();
