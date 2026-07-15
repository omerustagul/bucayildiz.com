"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(1, "Takım adı zorunlu.").max(60),
  short: z.string().trim().min(1, "Kısa ad zorunlu.").max(8),
  slug: z
    .string()
    .trim()
    .min(1, "Slug zorunlu.")
    .regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve - içerebilir."),
  coach: z.string().trim().max(120).optional().or(z.literal("")),
  born: z.string().trim().max(60).optional().or(z.literal("")),
  coverImage: z.string().trim().max(1000).nullish(),
  sort: z.coerce.number().int().min(0).max(999).default(0),
  isMain: z.boolean().default(false),
});

export type TeamResult = { error: string };


/** Ana takım tekildir: bir takım ana yapılırken diğerlerinin işareti kaldırılır. */
async function clearOtherMains(exceptId?: string) {
  await prisma.team.updateMany({
    where: exceptId ? { id: { not: exceptId } } : {},
    data: { isMain: false },
  });
}

function revalidateTeamPages() {
  revalidatePath("/admin/takimlar");
  revalidatePath("/"); // anasayfa takım kartları
  revalidatePath("/takimlar");
}

export async function createTeam(input: unknown): Promise<TeamResult | void> {
  await requirePermission("takimlar.manage");
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.$transaction(async (tx) => {
      if (parsed.data.isMain) await tx.team.updateMany({ data: { isMain: false } });
      await tx.team.create({ data: parsed.data });
    });
  } catch {
    return { error: "Bu slug zaten kullanımda. Farklı bir slug deneyin." };
  }
  revalidateTeamPages();
}

export async function updateTeam(id: string, input: unknown): Promise<TeamResult | void> {
  await requirePermission("takimlar.manage");
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    if (parsed.data.isMain) await clearOtherMains(id);
    await prisma.team.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Güncellenemedi. Slug benzersiz olmalı." };
  }
  revalidateTeamPages();
}

export async function deleteTeam(id: string): Promise<{ ok: boolean; error?: string }> {
  await requirePermission("takimlar.manage");
  const count = await prisma.athlete.count({ where: { teamId: id } });
  if (count > 0) return { ok: false, error: `Bu takımda ${count} sporcu var. Önce sporcuları başka takıma taşıyın.` };
  await prisma.team.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/takimlar");
  return { ok: true };
}

export async function assignAthletesToTeam(teamId: string, athleteIds: string[]): Promise<{ ok: boolean }> {
  await requirePermission("takimlar.manage");
  try {
    if (athleteIds.length > 0) {
      await prisma.athlete.updateMany({ where: { id: { in: athleteIds } }, data: { teamId } });
    }
  } catch {
    return { ok: false };
  }
  revalidatePath("/admin/takimlar");
  revalidatePath("/admin/sporcular");
  return { ok: true };
}
