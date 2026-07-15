"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { applicationSchema, ageFromBirthDate, ageGroupFromBirthDate, CONSENT_AGE } from "@/lib/validation";
import { CONSENT_VERSION } from "@/lib/consent";
import { recordConsents } from "@/lib/consent.server";
import { notifyNewApplication } from "@/lib/mail";
import { clientIp } from "@/lib/net";
import { rateLimit } from "@/lib/rate-limit-db";
import { errLabel } from "@/lib/log";

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Başvuru gönderimi — sunucu tarafında doğrular. Her KVKK onayı AYRI bir
 * denetim kaydına (ConsentRecord) yazılır: hangi metin (key+sürüm+hash), kim
 * (veli), nasıl (IP/UA) ve ne zaman. İspat yükü veri sorumlusundadır.
 */
export async function submitApplication(input: unknown): Promise<SubmitResult> {
  // Honeypot: gizli alan doluysa gönderen bir bottur → sessizce başarı taklidi
  // yap (saldırgana ipucu verme), hiçbir şey yazma.
  const honeypot = (input as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { ok: true };

  // KVKK audit izi + rate-limit için güvenilir IP (CF-Connecting-IP → x-real-ip).
  const h = await headers();
  const ipAddress = clientIp(h);
  const userAgent = h.get("user-agent") || null;

  // Spam/DoS koruması: IP başına 10 dakikada en çok 5 başvuru (uygulama-katmanı
  // savunma derinliği; asıl kaba filtre reverse-proxy/Cloudflare'de olmalı).
  const rl = await rateLimit(`basvuru:${ipAddress ?? "unknown"}`, 5, 10 * 60 * 1000);
  if (!rl.ok) return { ok: false, error: "Çok fazla başvuru denemesi. Lütfen birkaç dakika sonra tekrar deneyin." };

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

  // Yaş dalı HUKUKİ: <18 ise rızayı VELİ verir; ≥18 ise sporcunun KENDİSİ.
  // Yaş grubu (U-15…A Takım) doğum tarihinden türetilir (form'da seçilmez).
  const age = ageFromBirthDate(data.birthDate);
  const isMinor = age !== null && age < CONSENT_AGE;
  const ageGroup = ageGroupFromBirthDate(data.birthDate);
  // Sorumlu/iletişim kişisi + audit granter: minörde VELİ, yetişkinde SPORCUNUN KENDİSİ.
  const contactName = isMinor ? (data.parentName || "").trim() : data.athleteName;
  const granterRelation = isMinor ? "veli" : "kendisi";

  try {
    // KVKK atomiklik: Application + her belgenin denetim kaydı TEK transaction'da.
    // recordConsents aktif belge yoksa hata fırlatır → transaction geri alınır,
    // audit izi olmayan (yetim) Application ASLA kalmaz.
    await prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          athleteName: data.athleteName,
          birthDate: data.birthDate,
          ageGroup,
          position: data.position || null,
          currentClub: data.currentClub || null,
          parentName: contactName,
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

      // Her belge için ayrı denetim kaydı (verilen + verilmeyen) — aynı tx.
      // Minör: granter = veli; Yetişkin: granter = sporcunun kendisi (hukuki).
      await recordConsents(consents, { applicationId: application.id }, {
        granterName: contactName,
        granterRelation,
        channel: "basvuru",
        ipAddress,
        userAgent,
      }, tx);
    });
  } catch {
    return { ok: false, error: "Başvuru kaydedilemedi. Lütfen daha sonra tekrar deneyin." };
  }

  // E-posta bildirimi — transaction DIŞINDA + non-blocking (harici/yavaş işlem
  // DB transaction'ını tutmamalı; SMTP yoksa sessizce atlanır).
  try {
    await notifyNewApplication({
      athleteName: data.athleteName,
      ageGroup,
      parentName: contactName,
      phone: data.phone,
      email: data.email || null,
    });
  } catch (e) {
    console.error("[basvuru] e-posta bildirimi başarısız:", errLabel(e));
  }

  return { ok: true };
}
