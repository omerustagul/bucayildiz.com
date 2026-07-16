"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { clientIp } from "@/lib/net";
import { idSchema } from "@/lib/validation";
import { MANUAL_APPLICATION_STATUSES } from "@/lib/applicationStatus";

// Durum listesi TEK KAYNAKTAN türetilir (elle hardcode edilmez — katalog büyüyünce
// sessizce drift ederdi). Sistem-yazımlı durumlar (ör. "registered") HARİÇ: onları
// yalnız createAthleteFromApplication yazar, elle set EDİLEMEZ (sporcu yokken
// "Kayıtlandı" demek durumu yalanlamak olurdu). O duruma düşmüş bir başvuruyu
// başka duruma ALMAK serbesttir.
const MANUAL_STATUS_VALUES = MANUAL_APPLICATION_STATUSES.map((s) => s.value) as [string, ...string[]];

const updateStatusSchema = z.object({
  id: idSchema,
  status: z.enum(MANUAL_STATUS_VALUES),
});

export async function updateApplicationStatus(id: unknown, status: unknown): Promise<{ ok: boolean }> {
  await requirePermission("basvurular.manage");

  const parsed = updateStatusSchema.safeParse({ id, status });
  if (!parsed.success) return { ok: false };

  try {
    await prisma.application.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
    revalidatePath("/admin/basvurular");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

// --- Başvuru → Sporcu dönüşümü (KVKK rıza taşıma) ---
// Spec: docs/superpowers/specs/2026-07-16-basvuru-sporcu-donusumu-design.md

const fromApplicationSchema = z.object({
  // Athlete.teamId ZORUNLU; Application'da takım yok (yalnız ageGroup) → admin seçer.
  teamId: z.string().min(1, "Takım seçiniz."),
  number: z.number().int().min(0).max(99).nullable().optional(),
});

export type ConvertResult = { ok: true; athleteId: string } | { ok: false; error: string };

/**
 * Başvurudan sporcu oluşturur ve başvurunun KVKK rıza kayıtlarını sporcuya BAĞLAR.
 *
 * Neden önemli: rıza satırları başvuruda `applicationId` ile yazılır; sporcuya
 * bağlanmazsa foto-video/sağlık kapıları (photoConsentedAthleteIds, hasHealthConsent)
 * "rıza yok" görür — veli başvuruda onaylamış olsa bile fotoğraf yayımlanamaz.
 */
export async function createAthleteFromApplication(applicationId: unknown, input: unknown): Promise<ConvertResult> {
  // İki varlıkta da mutasyon var (başvuru durumu + sporcu) → İKİ kapı, en az ayrıcalık.
  await requirePermission("basvurular.manage");
  const actor = await requirePermission("sporcular.manage");

  const parsedId = idSchema.safeParse(applicationId);
  if (!parsedId.success) return { ok: false, error: "Geçersiz başvuru." };
  const parsed = fromApplicationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };

  const app = await prisma.application.findUnique({
    where: { id: parsedId.data },
    include: { athlete: { select: { id: true, name: true } } },
  });
  if (!app) return { ok: false, error: "Başvuru bulunamadı." };
  // Dostane ön-kontrol; DB'deki @unique son kapıdır (bkz. aşağıdaki P2002).
  if (app.athlete) return { ok: false, error: `Bu başvurudan zaten sporcu oluşturulmuş: ${app.athlete.name}` };

  let athleteId: string;
  try {
    // ATOMİK (kritik): üçü de olur ya da hiçbiri. Yarıda kalırsa "sporcu var ama
    // rızası yok" hayaleti oluşur ve foto/sağlık kapıları SEBEBİ GÖRÜNMEDEN kapalı kalır.
    athleteId = await prisma.$transaction(async (tx) => {
      // 1) Sporcu — alan eşlemesi spec'teki tabloya göre
      const athlete = await tx.athlete.create({
        data: {
          name: app.athleteName,
          birthDate: app.birthDate,
          position: app.position ?? "",
          parentPhone: app.phone,
          teamId: parsed.data.teamId,
          number: parsed.data.number ?? null,
          applicationId: app.id,
        },
      });
      // 2) KVKK rıza taşıma: YALNIZ athleteId yazılır. applicationId KALIR (soykütük:
      //    "bu rıza X başvurusunda şu an/IP/UA ile verildi, artık Y sporcusuna ait");
      //    granted/withdrawnAt/textHash/documentVersion/ipAddress/userAgent/createdAt/
      //    granterRelation'a DOKUNULMAZ → denetim izi birebir korunur.
      //    where YALNIZ applicationId: REDDEDİLEN rızalar da taşınmalı, yoksa
      //    "reddetti" ile "hiç sorulmadı" ayırt edilemez hale gelir.
      await tx.consentRecord.updateMany({
        where: { applicationId: app.id },
        data: { athleteId: athlete.id },
      });
      // 3) Durum — sistem-yazımlı (elle seçilemez, bkz. applicationStatus.ts)
      await tx.application.update({ where: { id: app.id }, data: { status: "registered" } });
      return athlete.id;
    });
  } catch (e) {
    // @unique yarışı: iki yönetici aynı anda dönüştürürse ön-kontrol yetmez.
    // Ham Prisma hatası kullanıcıya gitmez.
    if (typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002") {
      return { ok: false, error: "Bu başvurudan zaten sporcu oluşturulmuş." };
    }
    return { ok: false, error: "Sporcu oluşturulamadı. Lütfen tekrar deneyin." };
  }

  // Denetim izi (kullanicilar/actions.ts writeAudit deseni; burada tek kullanım → satır içi)
  await prisma.adminAuditLog
    .create({
      data: {
        actorId: actor.sub,
        actorName: actor.name,
        action: "athlete.create_from_application",
        targetId: athleteId,
        targetName: app.athleteName,
        detail: `Başvuru ${app.id} → sporcu; KVKK rıza kayıtları sporcuya bağlandı.`,
        ipAddress: clientIp(await headers()),
      },
    })
    .catch(() => { });

  revalidatePath("/admin/basvurular");
  revalidatePath("/admin/sporcular");
  return { ok: true, athleteId };
}
