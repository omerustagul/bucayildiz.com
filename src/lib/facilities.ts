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

/**
 * Antrenman kaydı için saha id'sini doğrular ve ADINI döndürür. Oluşturma ve
 * düzenleme action'ları bunu ORTAK kullanır (serbest metin deliği yok):
 * - `""` (boş) → `""`: saha seçilmedi, geçerli — DB'ye gidilmez.
 * - dolu id → gerçekten VAR OLAN + isPitch=true Facility olmalı; adını döndürür.
 * - id var ama tesis yok / isPitch=false / silinmiş → `null` (çağıran reddeder).
 */
export async function resolvePitchName(pitchId: string): Promise<string | null> {
  if (!pitchId) return "";
  const facility = await prisma.facility.findFirst({ where: { id: pitchId, isPitch: true }, select: { name: true } });
  return facility ? facility.name : null;
}
