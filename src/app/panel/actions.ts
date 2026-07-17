"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { destroyPanelSession, requireAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientIp } from "@/lib/net";
import { missingRequiredConsents, recordConsents } from "@/lib/consent.server";
import { ageFromBirthDate, CONSENT_AGE } from "@/lib/validation";

export async function panelLogout() {
  await destroyPanelSession();
  redirect("/giris");
}

const captureSchema = z.object({
  consents: z.record(z.string(), z.boolean()),
  granterName: z.string().trim().min(2, "Ad soyad giriniz."),
  granterRelation: z.enum(["veli", "kendisi"]),
});

export type ConsentCaptureResult = { ok: true } | { ok: false; error: string };

/**
 * Panel İLK-GİRİŞ sözleşme kapısında rızaları yazar (KVKK Faz 0.1).
 * Server-enforced: `requireAthlete` → SUNUCUDA zorunluları yeniden doğrula
 * (istemci `consents` map'ine GÜVENME) → minörde `granterRelation="veli"` ZORLA →
 * `recordConsents` (athleteId + hash/sürüm/IP/UA denetim izi).
 * Bkz. docs/superpowers/specs/2026-07-17-panel-ilk-giris-sozlesme-kapisi-design.md
 */
export async function captureInitialConsents(input: unknown): Promise<ConsentCaptureResult> {
  const session = await requireAthlete();
  const athleteId = session.athleteId!; // verifyPanelToken athleteId'yi garanti eder

  const parsed = captureSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const { consents, granterName, granterRelation } = parsed.data;

  // İstemci bloğu atlayamasın: eksik zorunluları SUNUCUDAN hesapla; hepsi bu istekte
  // onaylanıyor mu doğrula.
  const missing = await missingRequiredConsents(athleteId);
  if (missing.some((k) => consents[k] !== true)) {
    return { ok: false, error: "Zorunlu sözleşmeleri onaylamanız gerekir." };
  }

  // Minörde rızayı VELİ verir (KVKK) — istemci "kendisi" gönderse de zorla.
  const athlete = await prisma.athlete.findUnique({ where: { id: athleteId }, select: { birthDate: true } });
  const age = athlete?.birthDate ? ageFromBirthDate(athlete.birthDate) : null;
  const relation = age !== null && age < CONSENT_AGE ? "veli" : granterRelation;

  const h = await headers();
  try {
    // recordConsents AKTİF tüm belgeler için satır yazar (verilen + reddedilen);
    // yalnız athleteId + audit meta buradan gelir. Zorunlular yukarıda doğrulandı.
    await recordConsents(
      consents,
      { athleteId },
      { granterName, granterRelation: relation, channel: "panel-ilk-giris", ipAddress: clientIp(h), userAgent: h.get("user-agent") || null },
    );
  } catch {
    return { ok: false, error: "Kaydedilemedi. Lütfen tekrar deneyin." };
  }
  return { ok: true };
}
