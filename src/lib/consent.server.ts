// Sunucuya özel: node:crypto + prisma kullanır. Yalnızca server action /
// server component'lerden import edilmeli (istemciye sızmamalı).
import { createHash } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** recordConsents bir prisma.$transaction içinde çağrılabilsin diye: normal
 *  client VEYA transaction client kabul eder (atomiklik için — bkz. basvuru). */
type DbClient = Prisma.TransactionClient;

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
  db: DbClient = prisma,
) {
  // db üzerinden sorgula (transaction client geçilebilir) — böylece çağıran
  // Application create'i ile aynı transaction'da atomik yazabilir.
  const docs = await db.consentDocument.findMany({
    where: { active: true },
    orderBy: { ordering: "asc" },
  });
  // KVKK: denetim izi olmadan onay kaydı OLMAZ. Aktif belge yoksa createMany([])
  // sessizce 0 satır yazıyordu; bunun yerine hata fırlat ki çağıran transaction
  // geri alsın ve audit izsiz (yetim) Application kalmasın.
  if (docs.length === 0) {
    throw new Error("Aktif KVKK onay belgesi bulunamadı; başvuru denetim izi olmadan kaydedilemez.");
  }
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
  await db.consentRecord.createMany({ data: rows });
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

/** Sporcunun 'foto-video' (Fotoğraf ve Video Paylaşım Muvafakatnamesi) onayı aktif mi?
 *  hasHealthConsent ile AYNI kurala dayanır (en yeni kayıt + geri alınmamış).
 *  KVKK: bu onay OPSİYONELdir (reddedilebilir) — yokluğu hizmeti engellemez, yalnız
 *  görüntünün PAYLAŞIMINI engeller. Bkz. photoConsentedAthleteIds (kadro için toplu). */
export async function hasPhotoConsent(athleteId: string): Promise<boolean> {
  const rec = await prisma.consentRecord.findFirst({
    where: { athleteId, documentKey: "foto-video" },
    orderBy: { createdAt: "desc" },
  });
  return Boolean(rec && rec.granted && !rec.withdrawnAt);
}

/** Verilen sporculardan foto-video onayı AKTİF olanların id kümesi — kadro gibi
 *  listelerde hasPhotoConsent'i sporcu başına çağırmak (N+1) yerine TEK sorgu.
 *  Kayıtlar createdAt DESC geldiği için her sporcunun İLK görülen satırı en yenisidir;
 *  eskiler atlanır (append-only model — bkz. hasHealthConsent notu).
 *  Kayıt YOKSA sporcu kümeye girmez → "hiç sorulmamış" da "rıza yok" sayılır
 *  (fail-closed: rızayı kanıtlayamıyorsak çocuğun fotoğrafını yayımlamayız). */
/** Sporcunun EKSİK zorunlu rıza anahtarları — panel ilk-giriş kapısının tetikleyicisi.
 *  Aktif+required ConsentDocument'ların hangileri bu sporcuda AKTİF onaylı DEĞİL
 *  (en yeni kayıt granted && geri-alınmamış olmayan). Boş dizi = tüm zorunlular tam →
 *  kapı tetiklenmez. DB-güdümlü (statik liste değil): kapının gösterdiği aktif
 *  belgelerle birebir tutarlı. Bkz. docs/superpowers/specs/2026-07-17-panel-ilk-giris-*. */
export async function missingRequiredConsents(athleteId: string): Promise<string[]> {
  const requiredDocs = await prisma.consentDocument.findMany({
    where: { active: true, required: true },
    select: { key: true, version: true },
  });
  if (requiredDocs.length === 0) return [];
  // Anahtar başına GÜNCEL (en yüksek) aktif sürüm. Sürüm string ("2026-06-15" — ISO
  // olduğundan sözlüksel karşılaştırma kronolojiktir); normalde anahtar başına tek aktif
  // satır olur, ama birden çoksa en yenisini alırız.
  const currentVersion = new Map<string, string>();
  for (const d of requiredDocs) {
    const cur = currentVersion.get(d.key);
    if (cur === undefined || d.version > cur) currentVersion.set(d.key, d.version);
  }
  const requiredKeys = [...currentVersion.keys()];

  const rows = await prisma.consentRecord.findMany({
    where: { athleteId, documentKey: { in: requiredKeys } },
    orderBy: { createdAt: "desc" },
    select: { documentKey: true, documentVersion: true, granted: true, withdrawnAt: true },
  });
  // Anahtar başına yalnız EN YENİ kayıt belirleyici (append-only model).
  const latest = new Map<string, { documentVersion: string; granted: boolean; withdrawnAt: Date | null }>();
  for (const r of rows) {
    if (latest.has(r.documentKey)) continue;
    latest.set(r.documentKey, r);
  }
  // EKSİK sayılır: (a) kayıt yok · (b) reddedilmiş/geri alınmış · (c) SÜRÜM KAYMASI —
  // en yeni kaydın sürümü güncel aktif belge sürümünden farklı (belge güncellenmiş →
  // KVKK: değişen/yeni işleme için taze rıza gerekir; kapı yeniden tetiklenir).
  return requiredKeys.filter((k) => {
    const rec = latest.get(k);
    if (!rec || !rec.granted || rec.withdrawnAt) return true;
    return rec.documentVersion !== currentVersion.get(k);
  });
}

export async function photoConsentedAthleteIds(athleteIds: string[]): Promise<Set<string>> {
  if (athleteIds.length === 0) return new Set();
  const rows = await prisma.consentRecord.findMany({
    where: { athleteId: { in: athleteIds }, documentKey: "foto-video" },
    orderBy: { createdAt: "desc" },
    select: { athleteId: true, granted: true, withdrawnAt: true },
  });
  const seen = new Set<string>();
  const allowed = new Set<string>();
  for (const r of rows) {
    if (!r.athleteId || seen.has(r.athleteId)) continue; // yalnız EN YENİ kayıt sayılır
    seen.add(r.athleteId);
    if (r.granted && !r.withdrawnAt) allowed.add(r.athleteId);
  }
  return allowed;
}
