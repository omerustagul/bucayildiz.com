"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const hex = /^#[0-9a-fA-F]{6}$/;

const schema = z.object({
  name: z.string().trim().min(1, "Forma adı zorunlu.").max(60),
  kind: z.enum(["home", "away", "third", "gk", "other"]).default("home"),
  primary: z.string().trim().regex(hex, "Geçerli bir renk seçin.").default("#26215F"),
  accent: z.string().trim().regex(hex, "Geçerli bir renk seçin.").default("#C9A227"),
  description: z.string().trim().max(160).optional().or(z.literal("")),
  imageUrl: z.string().trim().nullable().optional(),
  active: z.boolean().default(true),
  sort: z.number().int().min(0).max(999).default(0),
});

export type JerseyResult = { error: string };


function toData(d: z.infer<typeof schema>) {
  return {
    name: d.name,
    kind: d.kind,
    primary: d.primary,
    accent: d.accent,
    description: d.description || "",
    imageUrl: d.imageUrl && d.imageUrl.trim() ? d.imageUrl : null,
    active: d.active,
    sort: d.sort,
  };
}

export async function createJersey(input: unknown): Promise<JerseyResult | void> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.jersey.create({ data: toData(parsed.data) });
  } catch {
    return { error: "Forma kaydedilemedi." };
  }
  revalidatePath("/admin/formalar");
  revalidatePath("/");
}

export async function updateJersey(id: string, input: unknown): Promise<JerseyResult | void> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.jersey.update({ where: { id }, data: toData(parsed.data) });
  } catch {
    return { error: "Forma güncellenemedi." };
  }
  revalidatePath("/admin/formalar");
  revalidatePath("/");
}

export async function deleteJersey(id: string): Promise<void> {
  await requireAdmin();
  await prisma.jersey.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/formalar");
  revalidatePath("/");
}
