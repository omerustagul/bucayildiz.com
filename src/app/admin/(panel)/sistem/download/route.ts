import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getAdminPermissions } from "@/lib/auth";
import { BACKUP_DIR, isValidBackupName } from "@/lib/systemInfo";

/**
 * Bir DB yedeğini indirir — YALNIZ owner. Yedek dosyası hassas veri içerir; ayrı,
 * doğrudan çağrılabilir uç olduğu için kendi yetki kontrolünü yapar (403).
 * Dosya adı katı desenle doğrulanır (path-traversal savunması: ../ engellenir).
 */
export async function GET(req: Request) {
  const perms = await getAdminPermissions();
  if (!perms) return NextResponse.json({ error: "Oturum yok." }, { status: 401 });
  if (perms.role !== "owner") return NextResponse.json({ error: "Yalnız Sahip erişebilir." }, { status: 403 });

  const name = new URL(req.url).searchParams.get("name") ?? "";
  if (!isValidBackupName(name)) return NextResponse.json({ error: "Geçersiz dosya adı." }, { status: 400 });

  const file = path.join(BACKUP_DIR, name);
  // Ekstra güvence: çözülen yol yedek dizininin İÇİNDE mi (symlink/edge'e karşı).
  if (!file.startsWith(BACKUP_DIR + path.sep) || !existsSync(file)) {
    return NextResponse.json({ error: "Yedek bulunamadı." }, { status: 404 });
  }

  const buf = readFileSync(file);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
