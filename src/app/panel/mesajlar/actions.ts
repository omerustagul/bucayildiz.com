"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAthlete } from "@/lib/auth";

export async function markAssignmentRead(id: string): Promise<void> {
  const s = await requireAthlete();
  await prisma.athleteAssignment
    .updateMany({
      where: { id, athleteId: s.athleteId!, readAt: null },
      data: { readAt: new Date() },
    })
    .catch(() => {});
  revalidatePath("/panel/mesajlar");
  revalidatePath("/admin/mesajlar");
}
