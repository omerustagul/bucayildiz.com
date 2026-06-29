"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consentTextHash, getConsentDocumentByKey } from "@/lib/consent.server";

export type ConsentActionResult = { ok: true } | { ok: false; error: string };

/**
 * Veli/sporcu panelinden bir onayı verir veya GERİ ALIR (KVKK md.11).
 * Her işlem yeni bir ConsentRecord olayı yazar (audit); güncel durum = en son kayıt.
 */
export async function setAthleteConsent(documentKey: string, granted: boolean): Promise<ConsentActionResult> {
  const session = await getSession();
  if (!session?.athleteId) return { ok: false, error: "Yetkisiz." };

  const doc = await getConsentDocumentByKey(documentKey);
  if (!doc) return { ok: false, error: "Belge bulunamadı." };
  if (doc.required) return { ok: false, error: "Zorunlu onaylar panelden geri alınamaz; kulüple iletişime geçin." };

  const h = await headers();
  const ipAddress = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  const userAgent = h.get("user-agent") || null;

  try {
    await prisma.consentRecord.create({
      data: {
        documentKey: doc.key,
        documentVersion: doc.version,
        documentTitle: doc.title,
        textHash: consentTextHash(doc.body),
        granted,
        granterName: session.name,
        granterRelation: "veli",
        channel: "veli-panel",
        ipAddress,
        userAgent,
        athleteId: session.athleteId,
        withdrawnAt: granted ? null : new Date(),
      },
    });
  } catch {
    return { ok: false, error: "İşlem kaydedilemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/panel/izinler");
  return { ok: true };
}
