// Sunucuya özel: node:crypto + prisma kullanır. Yalnızca server action /
// server component'lerden import edilmeli (istemciye sızmamalı).
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

/** Metnin değişmediğinin ispatı için SHA-256 (hex). */
export function consentTextHash(body: string): string {
  return createHash("sha256").update(body, "utf8").digest("hex");
}

/** Aktif onay belgelerini DB'den getirir (sıralı, source of truth). */
export async function getActiveConsentDocuments() {
  return prisma.consentDocument.findMany({
    where: { active: true },
    orderBy: { ordering: "asc" },
  });
}

/** Tek bir aktif belgeyi key ile getirir. */
export async function getConsentDocumentByKey(key: string) {
  return prisma.consentDocument.findFirst({
    where: { key, active: true },
    orderBy: { version: "desc" },
  });
}

type AuditMeta = { granterName: string; granterRelation?: string | null; channel: string; ipAddress?: string | null; userAgent?: string | null };

/**
 * Verilen onay kümesini DB'deki AKTİF belgelere göre denetim kaydına yazar.
 * `granted` haritası: { [docKey]: boolean }. Belge gövdesi/başlığı/sürümü ve
 * hash'i DB'den (authoritative) alınır — istemciye güvenilmez.
 * Application veya Athlete'e bağlanabilir.
 */
export async function recordConsents(
  granted: Record<string, boolean>,
  target: { applicationId?: string; athleteId?: string },
  meta: AuditMeta,
) {
  const docs = await getActiveConsentDocuments();
  const rows = docs.map((d) => ({
    documentKey: d.key,
    documentVersion: d.version,
    documentTitle: d.title,
    textHash: consentTextHash(d.body),
    granted: Boolean(granted[d.key]),
    granterName: meta.granterName,
    granterRelation: meta.granterRelation ?? null,
    channel: meta.channel,
    ipAddress: meta.ipAddress ?? null,
    userAgent: meta.userAgent ?? null,
    applicationId: target.applicationId ?? null,
    athleteId: target.athleteId ?? null,
  }));
  await prisma.consentRecord.createMany({ data: rows });
  return rows.length;
}

/** Sporcunun 'saglik-verisi' onayı aktif mi? (en yeni kayıt granted && geri alınmamış)
 *  DEĞİŞMEZ KURAL: onay yazan her akış (bkz. panel/izinler/actions.ts) her
 *  ver/geri-al işleminde YENİ bir satır ekler (kayıtlar değişmez/immutable);
 *  bu yardımcı o kurala dayanır. Mevcut satırı mutasyonla güncelleyen bir akış
 *  eklenirse burayı birlikte gözden geçirin. */
export async function hasHealthConsent(athleteId: string): Promise<boolean> {
  const rec = await prisma.consentRecord.findFirst({
    where: { athleteId, documentKey: "saglik-verisi" },
    orderBy: { createdAt: "desc" },
  });
  return Boolean(rec && rec.granted && !rec.withdrawnAt);
}
