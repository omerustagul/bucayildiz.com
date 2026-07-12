"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { jobApplicationSchema } from "@/lib/validation";
import { CAREER_CONSENT_TEXT, CAREER_CONSENT_VERSION } from "@/lib/consent";
import { consentTextHash } from "@/lib/consent.server";
import { isOwnStorageUrl } from "@/lib/storage";
import { clientIp } from "@/lib/net";
import { rateLimit } from "@/lib/rate-limit";
import { errLabel } from "@/lib/log";

export type JobSubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * PUBLIC iş başvurusu — sitenin İKİNCİ PII-toplayan ucu. /basvuru ile AYNI
 * korumalar: honeypot + IP rate-limit + clientIp + unknown→Zod + errLabel'lı
 * PII'siz log. KVKK: aydınlatma+rıza kayıt-İÇİNDE denetim izli (metin hash +
 * sürüm + an + IP/UA) — sporcu tarafının çok-belgeli ConsentRecord'u TEKRARLANMAZ.
 */
export async function submitJobApplication(input: unknown): Promise<JobSubmitResult> {
  // Honeypot: gizli alan doluysa bot → sessizce başarı taklidi, hiçbir şey yazma.
  const honeypot = (input as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { ok: true };

  const h = await headers();
  const ipAddress = clientIp(h);
  const userAgent = h.get("user-agent") || null;

  // Spam/DoS: IP başına 10 dakikada en çok 5 başvuru (basvuru ile aynı deseni miras).
  const rl = rateLimit(`kariyer:${ipAddress ?? "unknown"}`, 5, 10 * 60 * 1000);
  if (!rl.ok) return { ok: false, error: "Çok fazla başvuru denemesi. Lütfen birkaç dakika sonra tekrar deneyin." };

  const parsed = jobApplicationSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Lütfen formu kontrol edin.", fieldErrors };
  }
  const data = parsed.data;

  // CV: yalnız KENDİ depomuz olabilir (harici/SSRF/tracking engeli). Harici URL reddedilir.
  if (data.cvUrl && !isOwnStorageUrl(data.cvUrl)) {
    return { ok: false, error: "Geçersiz CV adresi.", fieldErrors: { cvUrl: "Geçersiz CV adresi." } };
  }

  // İlana bağla: verilmişse GERÇEK bir ilan olmalı; değilse null (başvuru yine kaydedilir).
  let postingId: string | null = null;
  if (data.postingId) {
    const posting = await prisma.jobPosting.findUnique({ where: { id: data.postingId }, select: { id: true } });
    postingId = posting?.id ?? null;
  }

  try {
    await prisma.jobApplication.create({
      data: {
        postingId,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message || "",
        cvUrl: data.cvUrl || null,
        // KVKK kayıt-içi denetim izi — gösterilen metnin hash'i + sürüm + an + IP/UA.
        consentTextHash: consentTextHash(CAREER_CONSENT_TEXT),
        consentVersion: CAREER_CONSENT_VERSION,
        consentedAt: new Date(),
        ipAddress,
        userAgent,
      },
    });
  } catch (e) {
    console.error("[kariyer] başvuru kaydı başarısız:", errLabel(e));
    return { ok: false, error: "Başvuru kaydedilemedi. Lütfen daha sonra tekrar deneyin." };
  }

  return { ok: true };
}
