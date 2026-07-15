"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { idSchema } from "@/lib/validation";

const updateStatusSchema = z.object({
  id: idSchema,
  status: z.enum(["new", "contacted", "scheduled", "closed"]),
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
