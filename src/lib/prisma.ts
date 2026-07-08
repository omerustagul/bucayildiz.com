import { PrismaClient } from "@prisma/client";

/** Singleton Prisma client — avoids exhausting connections during dev HMR.
 *  Anahtar sürümlüdür: şema değişince (migration) sürümü artır ki dev
 *  sunucusu yeniden başlatılmadan taze client yüklensin — eski örnek yeni
 *  alanları tanımaz ve mutasyonlar "unknown argument" ile düşer. */
const PRISMA_KEY = "prisma_v2" as const;
const globalForPrisma = globalThis as unknown as Record<string, PrismaClient | undefined>;

export const prisma =
  globalForPrisma[PRISMA_KEY] ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma[PRISMA_KEY] = prisma;
