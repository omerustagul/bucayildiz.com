import "server-only";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";

/** Sistem/yedek durumu — YALNIZ owner sayfası (/admin/sistem) kullanır.
 *  Sunucu tarafı: fs (yerel yedekler), df (disk), pm2 (süreç), pg (DB boyutu). */

export const BACKUP_DIR = path.resolve(process.cwd(), "backups");
const DUMP_RE = /^bucayildiz_[\d_-]+\.dump$/; // path-traversal savunması: indirmede de bu desen

export type BackupFile = { name: string; sizeKB: number; mtime: number };

export function listBackups(): BackupFile[] {
  if (!existsSync(BACKUP_DIR)) return [];
  return readdirSync(BACKUP_DIR)
    .filter((f) => DUMP_RE.test(f))
    .map((f) => { const s = statSync(path.join(BACKUP_DIR, f)); return { name: f, sizeKB: Math.round(s.size / 1024), mtime: s.mtimeMs }; })
    .sort((a, b) => b.mtime - a.mtime);
}

export function isValidBackupName(name: string): boolean {
  return DUMP_RE.test(name) && !name.includes("/") && !name.includes("..");
}

export function diskUsage(): { pct: number; used: string; total: string } | null {
  try {
    const out = execFileSync("df", ["-Pk", process.cwd()], { encoding: "utf8" });
    const cols = out.trim().split("\n").pop()!.split(/\s+/); // Filesystem 1K-blocks Used Available Use% Mounted
    const totalK = Number(cols[1]), usedK = Number(cols[2]);
    const pct = Number((cols[4] || "").replace("%", ""));
    const gb = (k: number) => `${(k / 1048576).toFixed(1)} GB`;
    return { pct, used: gb(usedK), total: gb(totalK) };
  } catch { return null; }
}

export async function dbSizeMB(): Promise<number | null> {
  try {
    const rows = await prisma.$queryRawUnsafe<{ size: bigint }[]>("SELECT pg_database_size(current_database()) AS size");
    return Math.round(Number(rows[0].size) / 1048576 * 10) / 10;
  } catch { return null; }
}

export function pm2Status(): { online: number; total: number } | null {
  try {
    const procs = JSON.parse(execFileSync("pm2", ["jlist"], { encoding: "utf8" }));
    const app = procs.filter((p: { name?: string }) => p.name === "bucayildiz");
    return { online: app.filter((p: { pm2_env?: { status?: string } }) => p.pm2_env?.status === "online").length, total: app.length };
  } catch { return null; }
}

export function offsiteConfigured(): boolean {
  return Boolean(process.env.BACKUP_S3_BUCKET);
}

/** En yeni yedeğin yaşı (saat) — Date.now() burada (component render saflık kuralı dışı). */
export function lastBackupAgeHours(backups: BackupFile[]): number | null {
  if (!backups.length) return null;
  return (Date.now() - backups[0].mtime) / 3.6e6;
}
