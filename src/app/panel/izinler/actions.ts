"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPanelSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { idSchema } from "@/lib/validation";
import { clientIp } from "@/lib/net";
import { consentTextHash, getConsentDocumentByKey, resolveAthleteGranter } from "@/lib/consent.server";

export type ConsentActionResult = { ok: true } | { ok: false; error: string };

const setConsentSchema = z.object({ documentKey: idSchema, granted: z.boolean() });

/**
 * Veli/sporcu panelinden bir onayı verir veya GERİ ALIR (KVKK md.11).
 * Her işlem yeni bir ConsentRecord olayı yazar (audit); güncel durum = en son kayıt.
 */
export async function setAthleteConsent(documentKey: unknown, granted: unknown): Promise<ConsentActionResult> {
  const session = await getPanelSession();
  if (!session?.athleteId) return { ok: false, error: "Yetkisiz." };

  const parsed = setConsentSchema.safeParse({ documentKey, granted });
  if (!parsed.success) return { ok: false, error: "Geçersiz istek." };
  const { documentKey: docKey, granted: grant } = parsed.data;

  const doc = await getConsentDocumentByKey(docKey);
  if (!doc) return { ok: false, error: "Belge bulunamadı." };
  if (doc.required) return { ok: false, error: "Zorunlu onaylar panelden geri alınamaz; kulüple iletişime geçin." };

  // Çift-tık/idempotanlık: bu belge için EN SON kayıt zaten istenen durumdaysa
  // (verildi/geri-alındı) yeni satır YAZMA — append-only audit'i şişirmeden
  // mükerrer kaydı önler. Gerçek bir durum değişikliği yine yeni satır yazar.
  const latest = await prisma.consentRecord.findFirst({
    where: { athleteId: session.athleteId, documentKey: doc.key },
    orderBy: { createdAt: "desc" },
    select: { granted: true, withdrawnAt: true },
  });
  const currentlyGranted = Boolean(latest && latest.granted && !latest.withdrawnAt);
  if (latest && currentlyGranted === grant) return { ok: true };

  const h = await headers();
  const ipAddress = clientIp(h); // #8: CF-Connecting-IP önceliği (spoof'a açık XFF değil)
  const userAgent = h.get("user-agent") || null;

  // Onaylayan kişi: hesabın adı ÇOCUĞUN adıdır — "veli" diye yazmak denetim izini
  // yanlış kılıyordu. Gerçek sorumlu kişiyi çöz; bilinmiyorsa yakınlık İDDİA ETME.
  const granter = await resolveAthleteGranter(session.athleteId, session.name);

  try {
    await prisma.consentRecord.create({
      data: {
        documentKey: doc.key,
        documentVersion: doc.version,
        documentTitle: doc.title,
        textHash: consentTextHash(doc.body),
        granted: grant,
        granterName: granter.name,
        granterRelation: granter.relation,
        channel: "veli-panel",
        ipAddress,
        userAgent,
        athleteId: session.athleteId,
        withdrawnAt: grant ? null : new Date(),
      },
    });
  } catch {
    return { ok: false, error: "İşlem kaydedilemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/panel/izinler");

  // foto-video, PUBLIC kadroda fotoğrafın gösterilip gösterilmeyeceğini belirler
  // (bkz. takimlar/[slug] + consent.server.ts photoConsentedAthleteIds). O sayfa
  // ISR'li (site layout revalidate=60) → tazelemezsek GERİ ALMA 60sn'ye kadar
  // gecikir. KVKK'da geri alma gecikmeksizin işlemeli: sporcunun takım sayfasını
  // hemen tazele. Yalnız bu belgede yapılır (diğerleri public kadroyu etkilemez).
  if (doc.key === "foto-video") {
    const ath = await prisma.athlete.findUnique({
      where: { id: session.athleteId },
      select: { team: { select: { slug: true } } },
    });
    if (ath?.team?.slug) revalidatePath(`/takimlar/${ath.team.slug}`);
  }
  return { ok: true };
}
