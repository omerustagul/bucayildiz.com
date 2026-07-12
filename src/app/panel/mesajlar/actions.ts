"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAthlete } from "@/lib/auth";
import { idSchema } from "@/lib/validation";

export async function markAssignmentRead(id: unknown): Promise<void> {
  const s = await requireAthlete();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return;
  await prisma.athleteAssignment
    .updateMany({
      where: { id: parsed.data, athleteId: s.athleteId!, readAt: null },
      data: { readAt: new Date() },
    })
    .catch(() => {});
  revalidatePath("/panel/mesajlar");
  revalidatePath("/admin/mesajlar");
}
