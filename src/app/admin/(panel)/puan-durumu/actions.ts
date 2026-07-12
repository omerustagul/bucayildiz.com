"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  teamName: z.string().trim().min(1, "Takım adı zorunlu.").max(80),
  isOurs: z.boolean().default(false),
  played: z.coerce.number().int().min(0).max(999).default(0),
  wins: z.coerce.number().int().min(0).max(999).default(0),
  draws: z.coerce.number().int().min(0).max(999).default(0),
  losses: z.coerce.number().int().min(0).max(999).default(0),
  goalsFor: z.coerce.number().int().min(0).max(999).default(0),
  goalsAgainst: z.coerce.number().int().min(0).max(999).default(0),
  points: z.coerce.number().int().min(0).max(999).default(0),
  sort: z.coerce.number().int().min(0).max(999).default(0),
});

export type StandingResult = { error: string };


/** "Bizim takım" tekildir: bir satır işaretlenirken diğerlerinin işareti kaldırılır. */
async function clearOtherOurs(exceptId?: string) {
  await prisma.standingRow.updateMany({
    where: exceptId ? { id: { not: exceptId } } : {},
    data: { isOurs: false },
  });
}

function revalidateStandingsPages() {
  revalidatePath("/admin/puan-durumu");
  revalidatePath("/fikstur/puan-durumu");
}

export async function createStanding(input: unknown): Promise<StandingResult | void> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.$transaction(async (tx) => {
      if (parsed.data.isOurs) await tx.standingRow.updateMany({ data: { isOurs: false } });
      await tx.standingRow.create({ data: parsed.data });
    });
  } catch {
    return { error: "Satır eklenemedi." };
  }
  revalidateStandingsPages();
}

export async function updateStanding(id: string, input: unknown): Promise<StandingResult | void> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    if (parsed.data.isOurs) await clearOtherOurs(id);
    await prisma.standingRow.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Satır güncellenemedi." };
  }
  revalidateStandingsPages();
}

export async function deleteStanding(id: string): Promise<void> {
  await requireAdmin();
  await prisma.standingRow.delete({ where: { id } }).catch(() => {});
  revalidateStandingsPages();
}
