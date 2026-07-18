"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";
import { clientIp } from "@/lib/net";
import { errLabel } from "@/lib/log";
import { collectExpired, applyRetention, type RetentionCounts } from "@/lib/retention";

export type PurgeResult = { ok: true; counts: RetentionCounts } | { ok: false; error: string };

/**
 * KVKK periyodik imha (Faz 2.4/B) — süresi dolmuş kayıtları KALICI siler.
 *
 * GÜVENLİK: İstemciden HİÇBİR kimlik/liste kabul edilmez; silinecekler SUNUCUDA
 * yeniden toplanır (`collectExpired`). Aksi halde istemci keyfi kayıt sildirebilirdi.
 * Yetki: `ayarlar.manage` (görüntüleme `ayarlar.view`'dan AYRI — yıkıcı işlem daha dar).
 * Denetim izi `applyRetention` içinde `adminAuditLog`'a yazılır.
 */
export async function purgeExpiredData(): Promise<PurgeResult> {
  await requirePermission("ayarlar.manage");
  try {
    const plan = await collectExpired(new Date());
    const counts = await applyRetention(plan, { ipAddress: clientIp(await headers()) });
    revalidatePath("/admin/ayarlar");
    return { ok: true, counts };
  } catch (e) {
    console.error("[retention] imha başarısız:", errLabel(e));
    return { ok: false, error: "İmha işlemi tamamlanamadı. Lütfen tekrar deneyin." };
  }
}
