"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(1, "İsim zorunlu.").max(120),
  teamId: z.string().min(1, "Takım seçiniz."),
  position: z.string().trim().max(40).optional().or(z.literal("")),
  number: z.number().int().min(0).max(99).nullable().optional(),
  height: z.number().int().min(100).max(230).nullable().optional(),
  weight: z.number().int().min(20).max(150).nullable().optional(),
  birthYear: z.number().int().min(1980).max(2025).nullable().optional(),
  foot: z.enum(["Sağ", "Sol", "Çift"]).nullable().optional(),
  status: z.enum(["active", "injured", "rest"]).default("active"),
  licenseNo: z.string().trim().max(40).optional().or(z.literal("")),
  parentPhone: z.string().trim().max(20).optional().or(z.literal("")),
  photoUrl: z.string().trim().nullable().optional(),
});

export type AthleteResult = { error: string };

async function requireAuth() {
  const s = await getSession();
  if (!s) redirect("/admin/giris");
}

function toData(d: z.infer<typeof schema>) {
  return {
    name: d.name,
    teamId: d.teamId,
    position: d.position || "",
    number: d.number ?? null,
    height: d.height ?? null,
    weight: d.weight ?? null,
    birthYear: d.birthYear ?? null,
    foot: d.foot ?? null,
    status: d.status,
    licenseNo: d.licenseNo || null,
    parentPhone: d.parentPhone || null,
    photoUrl: d.photoUrl && d.photoUrl.trim() ? d.photoUrl : null,
  };
}

export async function createAthlete(input: unknown): Promise<AthleteResult | void> {
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.athlete.create({ data: toData(parsed.data) });
  } catch {
    return { error: "Sporcu kaydedilemedi. Takım seçimini kontrol edin." };
  }
  revalidatePath("/admin/sporcular");
}

export async function updateAthlete(id: string, input: unknown): Promise<AthleteResult | void> {
  await requireAuth();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.athlete.update({ where: { id }, data: toData(parsed.data) });
  } catch {
    return { error: "Güncellenemedi." };
  }
  revalidatePath("/admin/sporcular");
}

const perfNum = z.number().nullable().optional();
const perfInt = z.number().int().nullable().optional();
const perfSchema = z.object({
  vo2: perfNum,
  vo2History: z.array(z.number()).default([]),
  percentile: perfInt,
  bodyFat: perfNum,
  muscle: perfNum,
  speed: perfInt,
  endurance: perfInt,
  power: perfInt,
  technique: perfInt,
  tactic: perfInt,
  passing: perfInt,
  sprint30: perfNum,
  verticalJump: perfInt,
  maxHr: perfInt,
  trainingLoad: perfInt,
  measuredAt: z.string().trim().optional().or(z.literal("")),
});

/** Sporcunun performans ölçümünü kaydeder (upsert). */
export async function savePerformance(athleteId: string, input: unknown): Promise<{ ok?: boolean; error?: string }> {
  await requireAuth();
  const parsed = perfSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  const data = {
    vo2: d.vo2 ?? null,
    vo2History: JSON.stringify(d.vo2History ?? []),
    percentile: d.percentile ?? null,
    bodyFat: d.bodyFat ?? null,
    muscle: d.muscle ?? null,
    speed: d.speed ?? null,
    endurance: d.endurance ?? null,
    power: d.power ?? null,
    technique: d.technique ?? null,
    tactic: d.tactic ?? null,
    passing: d.passing ?? null,
    sprint30: d.sprint30 ?? null,
    verticalJump: d.verticalJump ?? null,
    maxHr: d.maxHr ?? null,
    trainingLoad: d.trainingLoad ?? null,
    measuredAt: d.measuredAt || null,
  };
  await prisma.performance.upsert({ where: { athleteId }, create: { athleteId, ...data }, update: data });
  revalidatePath("/admin/sporcular");
  return { ok: true };
}

/** Sporcuya panel giriş bilgisi oluşturur/günceller. */
export async function provisionAthleteLogin(athleteId: string, username: string, password: string): Promise<{ ok?: boolean; error?: string }> {
  await requireAuth();
  const u = username.trim().toLowerCase();
  if (!u || !/^[a-z0-9._-]{3,40}$/.test(u)) return { error: "Geçerli bir kullanıcı adı girin (a-z, 0-9, . _ -)." };
  if (password && password.length < 6) return { error: "Şifre en az 6 karakter olmalı." };

  const athlete = await prisma.athlete.findUnique({ where: { id: athleteId }, include: { user: true } });
  if (!athlete) return { error: "Sporcu bulunamadı." };

  try {
    if (athlete.user) {
      const data: { username: string; passwordHash?: string } = { username: u };
      if (password) data.passwordHash = await hashPassword(password);
      await prisma.user.update({ where: { id: athlete.user.id }, data });
    } else {
      if (!password) return { error: "Yeni hesap için şifre gerekli." };
      await prisma.user.create({ data: { username: u, passwordHash: await hashPassword(password), name: athlete.name, role: "athlete", athleteId } });
    }
  } catch {
    return { error: "Bu kullanıcı adı zaten kullanımda." };
  }
  revalidatePath("/admin/sporcular");
  return { ok: true };
}

export async function deleteAthlete(id: string): Promise<void> {
  await requireAuth();
  await prisma.athlete.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/sporcular");
}
