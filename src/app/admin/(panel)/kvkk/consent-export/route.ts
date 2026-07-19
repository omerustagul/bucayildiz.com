import { NextResponse } from "next/server";
import { getAdminPermissions } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { toConsentCsv, fileSlug, type ConsentExportRow } from "@/lib/consentExport";

/**
 * Bir sporcunun KVKK rıza kayıtlarını CSV olarak indirir (D7 — ispat / md.11).
 *
 * KAPI: sayfa `kvkk.view` ile korunuyor ama bu ayrı bir POST/GET ucu — DOĞRUDAN
 * çağrılabilir → kendi yetki kontrolünü YAPAR (savunma derinliği; server actions
 * kuralı 1 ile aynı mantık). İzin yoksa redirect değil, temiz 403.
 */
function fmtDateTime(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export async function GET(req: Request) {
  const perms = await getAdminPermissions();
  if (!perms) return NextResponse.json({ error: "Oturum yok." }, { status: 401 });
  if (!hasPermission(perms.role, perms.permissions, "kvkk.view")) {
    return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
  }

  const athleteId = new URL(req.url).searchParams.get("athleteId");
  if (!athleteId) return NextResponse.json({ error: "athleteId gerekli." }, { status: 400 });

  const athlete = await prisma.athlete.findUnique({
    where: { id: athleteId },
    select: { name: true, consents: { orderBy: { createdAt: "desc" } } },
  });
  if (!athlete) return NextResponse.json({ error: "Sporcu bulunamadı." }, { status: 404 });

  const rows: ConsentExportRow[] = athlete.consents.map((c) => ({
    documentTitle: c.documentTitle,
    documentVersion: c.documentVersion,
    granted: c.granted,
    granterName: c.granterName,
    granterRelation: c.granterRelation,
    channel: c.channel,
    createdAt: fmtDateTime(c.createdAt),
    withdrawnAt: c.withdrawnAt ? fmtDateTime(c.withdrawnAt) : null,
    ipAddress: c.ipAddress,
    otpVerified: c.otpVerified,
    textHash: c.textHash,
  }));

  const csv = toConsentCsv(rows);
  const stamp = fmtDateTime(new Date()).slice(0, 10).replace(/\./g, "-");
  const filename = `kvkk-onay-${fileSlug(athlete.name)}-${stamp}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Hassas PII — ara katman/tarayıcı önbelleğe ALMASIN.
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
