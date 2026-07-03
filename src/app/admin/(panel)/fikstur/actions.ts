"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  competition: z.string().trim().min(1, "Lig/turnuva zorunlu.").max(80),
  opponent: z.string().trim().min(1, "Rakip zorunlu.").max(80),
  opponentLogo: z.string().trim().nullable().optional(),
  isHome: z.boolean().default(true),
  date: z.string().trim().min(1, "Tarih zorunlu."),
  time: z.string().trim().max(5).optional().or(z.literal("")),
  venue: z.string().trim().max(120).optional().or(z.literal("")),
  status: z.enum(["upcoming", "finished"]).default("upcoming"),
  ourScore: z.number().int().min(0).max(99).nullable().optional(),
  oppScore: z.number().int().min(0).max(99).nullable().optional(),
  teamId: z.string().trim().nullable().optional(),
});

export type FixtureResult = { error: string };

async function requireAuth() {
  const s = await getSession();
  if (!s) redirect("/admin/giris");
  if (s.role !== "admin") redirect("/panel");
}

function toData(d: z.infer<typeof schema>) {
  const finished = d.status === "finished";
  return {
    competition: d.competition,
    opponent: d.opponent,
    opponentLogo: d.opponentLogo && d.opponentLogo.trim() ? d.opponentLogo : null,
    isHome: d.isHome,
    date: d.date,
    time: d.time || "",
    venue: d.venue || "",
    status: d.status,
    ourScore: finished ? d.ourScore ?? null : null,
    oppScore: finished ? d.oppScore ?? null : null,
    teamId: d.teamId && d.teamId.trim() ? d.teamId : null,
  };
}

export async function createFixture(input: unknown): Promise<FixtureResult | void> {
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  await prisma.fixture.create({ data: toData(parsed.data) });
  revalidatePath("/admin/fikstur");
  revalidatePath("/fikstur");
  revalidatePath("/fikstur/sonuclar");
  revalidatePath("/");
}

export async function updateFixture(id: string, input: unknown): Promise<FixtureResult | void> {
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  await prisma.fixture.update({ where: { id }, data: toData(parsed.data) });
  revalidatePath("/admin/fikstur");
  revalidatePath("/fikstur");
  revalidatePath("/fikstur/sonuclar");
  revalidatePath("/");
}

export async function deleteFixture(id: string): Promise<void> {
  await requireAuth();
  await prisma.fixture.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/fikstur");
  revalidatePath("/fikstur");
  revalidatePath("/fikstur/sonuclar");
  revalidatePath("/");
}
