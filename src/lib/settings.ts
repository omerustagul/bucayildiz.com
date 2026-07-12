import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type SiteSettings = Awaited<ReturnType<typeof getSettings>>;

const SETTINGS_ID = "site";

/** Tekil ayar satırını getirir; yoksa varsayılanlarla oluşturur.
 *  React `cache` ile sarılı: tek render/istek içinde birden çok çağrı (layout +
 *  header + footer + sayfa) TEK DB sorgusuna indirgenir (dedupe). */
export const getSettings = cache(async () => {
  const existing = await prisma.siteSetting.findUnique({ where: { id: SETTINGS_ID } });
  if (existing) return existing;
  // İlk erişimde oluştur; eşzamanlı çağrı yarışına karşı dayanıklı.
  try {
    return await prisma.siteSetting.create({ data: { id: SETTINGS_ID } });
  } catch {
    return prisma.siteSetting.findUniqueOrThrow({ where: { id: SETTINGS_ID } });
  }
});

/** Geçerli cursor stilini döndürür ("default" = kapalı). */
export function activeCursor(s: { customCursor: boolean; cursorStyle: string }): string {
  return s.customCursor ? s.cursorStyle : "default";
}
