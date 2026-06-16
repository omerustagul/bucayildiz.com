"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
  sort: z.coerce.number().int().min(0).max(999).default(0),
});

export type TeamResult = { error: string };

async function requireAuth() {
  const s = await getSession();
  if (!s) redirect("/admin/giris");
}

export async function createTeam(input: unknown): Promise<TeamResult | void> {
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.team.create({ data: parsed.data });
  } catch {
    return { error: "Bu slug zaten kullanımda. Farklı bir slug deneyin." };
  }
  revalidatePath("/admin/takimlar");
}

export async function updateTeam(id: string, input: unknown): Promise<TeamResult | void> {
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.team.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Güncellenemedi. Slug benzersiz olmalı." };
  }
  revalidatePath("/admin/takimlar");
}

export async function deleteTeam(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAuth();
  const count = await prisma.athlete.count({ where: { teamId: id } });
  if (count > 0) return { ok: false, error: `Bu takımda ${count} sporcu var. Önce sporcuları başka takıma taşıyın.` };
  await prisma.team.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/takimlar");
  return { ok: true };
}

export async function assignAthletesToTeam(teamId: string, athleteIds: string[]): Promise<{ ok: boolean }> {
  await requireAuth();
  if (athleteIds.length > 0) {
    await prisma.athlete.updateMany({ where: { id: { in: athleteIds } }, data: { teamId } });
  }
  revalidatePath("/admin/takimlar");
  revalidatePath("/admin/sporcular");
  return { ok: true };
}
