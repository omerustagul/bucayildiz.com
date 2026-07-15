"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { notifyTeam, notifyAllAthletes } from "@/lib/notify";
import { errLabel } from "@/lib/log";

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
  await requirePermission("fikstur.manage");
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const fx = toData(parsed.data);
  try {
    await prisma.fixture.create({ data: fx });
  } catch {
    return { error: "Maç kaydedilemedi." };
  }
  revalidatePath("/admin/fikstur");
  revalidatePath("/fikstur");
  revalidatePath("/fikstur/sonuclar");
  revalidatePath("/");

  // Bildirim — takım maçıysa o takıma, kulüp maçıysa herkese. opponent public (PII değil).
  try {
    const payload = { type: "match" as const, title: "Yeni maç eklendi", body: `Rakip: ${fx.opponent}${fx.date ? ` · ${fx.date}` : ""}`, url: "/panel/maclar" };
    if (fx.teamId) await notifyTeam(fx.teamId, payload);
    else await notifyAllAthletes(payload);
  } catch (e) {
    console.error("[bildirim] maç:", errLabel(e));
  }
}

export async function updateFixture(id: string, input: unknown): Promise<FixtureResult | void> {
  await requirePermission("fikstur.manage");
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.fixture.update({ where: { id }, data: toData(parsed.data) });
  } catch {
    return { error: "Maç güncellenemedi." };
  }
  revalidatePath("/admin/fikstur");
  revalidatePath("/fikstur");
  revalidatePath("/fikstur/sonuclar");
  revalidatePath("/");
}

export async function deleteFixture(id: string): Promise<void> {
  await requirePermission("fikstur.manage");
  await prisma.fixture.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/fikstur");
  revalidatePath("/fikstur");
  revalidatePath("/fikstur/sonuclar");
  revalidatePath("/");
}
