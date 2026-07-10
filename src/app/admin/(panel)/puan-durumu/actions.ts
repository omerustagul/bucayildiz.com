"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

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

async function requireAuth() {
  const s = await getAdminSession();
  if (!s) redirect("/admin/giris");
}

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
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  await prisma.$transaction(async (tx) => {
    if (parsed.data.isOurs) await tx.standingRow.updateMany({ data: { isOurs: false } });
    await tx.standingRow.create({ data: parsed.data });
  });
  revalidateStandingsPages();
}

export async function updateStanding(id: string, input: unknown): Promise<StandingResult | void> {
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  if (parsed.data.isOurs) await clearOtherOurs(id);
  await prisma.standingRow.update({ where: { id }, data: parsed.data });
  revalidateStandingsPages();
}

export async function deleteStanding(id: string): Promise<void> {
  await requireAuth();
  await prisma.standingRow.delete({ where: { id } }).catch(() => {});
  revalidateStandingsPages();
}
