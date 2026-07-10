"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(1, "Tesis adı zorunlu.").max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  capacity: z.string().trim().max(60).optional().or(z.literal("")),
  features: z.string().trim().max(500).optional().or(z.literal("")),
  photoUrl: z.string().trim().nullable().optional(),
  sort: z.coerce.number().int().min(0).max(999).default(0),
});

export type FacilityResult = { error: string };

function toData(d: z.infer<typeof schema>) {
  return {
    name: d.name,
    description: d.description ?? "",
    capacity: d.capacity && d.capacity.trim() ? d.capacity : null,
    features: d.features ?? "",
    photoUrl: d.photoUrl && d.photoUrl.trim() ? d.photoUrl : null,
    sort: d.sort,
  };
}

function revalidateFacilityPages() {
  revalidatePath("/admin/tesisler");
  revalidatePath("/kurumsal/tesisler");
}

export async function createFacility(input: unknown): Promise<FacilityResult | void> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.facility.create({ data: toData(parsed.data) });
  } catch {
    return { error: "Kayıt oluşturulamadı." };
  }
  revalidateFacilityPages();
}

export async function updateFacility(id: string, input: unknown): Promise<FacilityResult | void> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.facility.update({ where: { id }, data: toData(parsed.data) });
  } catch {
    return { error: "Güncellenemedi." };
  }
  revalidateFacilityPages();
}

export async function deleteFacility(id: string): Promise<void> {
  await requireAdmin();
  await prisma.facility.delete({ where: { id } }).catch(() => {});
  revalidateFacilityPages();
}
