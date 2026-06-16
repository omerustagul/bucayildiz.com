"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const VALID = ["new", "contacted", "scheduled", "closed"];

export async function updateApplicationStatus(id: string, status: string): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  if (!VALID.includes(status)) return { ok: false };

  try {
    await prisma.application.update({ where: { id }, data: { status } });
    revalidatePath("/admin/basvurular");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
