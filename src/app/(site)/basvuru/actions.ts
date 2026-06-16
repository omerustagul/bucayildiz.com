"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validation";
import { CONSENT_VERSION } from "@/lib/consent";
import { recordConsents } from "@/lib/consent.server";
import { notifyNewApplication } from "@/lib/mail";

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Başvuru gönderimi — sunucu tarafında doğrular. Her KVKK onayı AYRI bir
 * denetim kaydına (ConsentRecord) yazılır: hangi metin (key+sürüm+hash), kim
 * (veli), nasıl (IP/UA) ve ne zaman. İspat yükü veri sorumlusundadır.
 */
export async function submitApplication(input: unknown): Promise<SubmitResult> {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Lütfen formu kontrol edin.", fieldErrors };
  }

  const data = parsed.data;
  const consents = data.consents ?? {};

  // KVKK audit izi: ispat yükü veri sorumlusunda.
  const h = await headers();
  const ipAddress = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  const userAgent = h.get("user-agent") || null;

  try {
    const application = await prisma.application.create({
      data: {
        athleteName: data.athleteName,
        birthDate: data.birthDate,
        ageGroup: data.ageGroup,
        position: data.position || null,
        parentName: data.parentName,
        phone: data.phone,
        email: data.email || null,
        // Geriye dönük özet alanlar (detay ConsentRecord'da):
        kvkkConsent: consents["acik-riza"] === true,
        marketingConsent: consents["pazarlama"] === true,
        consentVersion: CONSENT_VERSION,
        ipAddress,
        userAgent,
      },
    });

    // Her belge için ayrı denetim kaydı (verilen + verilmeyen).
    await recordConsents(consents, { applicationId: application.id }, {
      granterName: data.parentName,
      granterRelation: "veli",
      channel: "basvuru",
      ipAddress,
      userAgent,
    });

    // E-posta bildirimi — non-blocking (SMTP yoksa sessizce atlanır).
    try {
      await notifyNewApplication({
        athleteName: data.athleteName,
        ageGroup: data.ageGroup,
        parentName: data.parentName,
        phone: data.phone,
        email: data.email || null,
      });
    } catch (e) {
      console.error("[basvuru] e-posta bildirimi başarısız:", e);
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Başvuru kaydedilemedi. Lütfen daha sonra tekrar deneyin." };
  }
}
