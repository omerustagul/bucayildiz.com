import { prisma } from "@/lib/prisma";

/**
 * Takvim Programı'nda "saha" olarak seçilebilir tesisler — YALNIZ isPitch=true.
 * Salt-okuma; dropdown kaynağı. Antrenman oluşturmada seçilen id ayrıca
 * `createTraining` içinde tekrar (isPitch=true) doğrulanır (güven sınırı).
 */
export function listPitchFacilities() {
  return prisma.facility.findMany({
    where: { isPitch: true },
    orderBy: { sort: "asc" },
    select: { id: true, name: true },
  });
}
