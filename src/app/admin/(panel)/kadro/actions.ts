"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(1, "İsim zorunlu.").max(120),
  title: z.string().trim().min(1, "Unvan zorunlu.").max(120),
  group: z.enum(["antrenor", "yonetim"], { message: "Geçerli bir grup seçiniz." }),
  licence: z.string().trim().max(60).optional().or(z.literal("")),
  photoUrl: z.string().trim().nullable().optional(),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  sort: z.coerce.number().int().min(0).max(999).default(0),
});

export type StaffResult = { error: string };

function toData(d: z.infer<typeof schema>) {
  return {
    name: d.name,
    title: d.title,
    group: d.group,
    licence: d.licence && d.licence.trim() ? d.licence : null,
    photoUrl: d.photoUrl && d.photoUrl.trim() ? d.photoUrl : null,
    bio: d.bio ?? "",
    sort: d.sort,
  };
}

function revalidateStaffPages() {
  revalidatePath("/admin/kadro");
  revalidatePath("/kurumsal/yonetim");
  revalidatePath("/altyapi/antrenorler");
}

export async function createStaff(input: unknown): Promise<StaffResult | void> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.staffMember.create({ data: toData(parsed.data) });
  } catch {
    return { error: "Kayıt oluşturulamadı." };
  }
  revalidateStaffPages();
}

export async function updateStaff(id: string, input: unknown): Promise<StaffResult | void> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.staffMember.update({ where: { id }, data: toData(parsed.data) });
  } catch {
    return { error: "Güncellenemedi." };
  }
  revalidateStaffPages();
}

export async function deleteStaff(id: string): Promise<void> {
  await requireAdmin();
  await prisma.staffMember.delete({ where: { id } }).catch(() => {});
  revalidateStaffPages();
}
