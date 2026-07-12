"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { assignmentCreateSchema } from "@/lib/validation";
import { isOwnStorageUrl } from "@/lib/storage";

function revalidate() {
  revalidatePath("/admin/mesajlar");
  revalidatePath("/panel/mesajlar");
}

export async function createAssignments(input: unknown): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = assignmentCreateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  if (d.fileUrl && !isOwnStorageUrl(d.fileUrl)) return { error: "Geçersiz dosya adresi." };
  try {
    await prisma.athleteAssignment.createMany({
      data: d.athleteIds.map((id) => ({
        athleteId: id,
        kind: d.kind,
        title: d.title,
        body: d.body || "",
        fileUrl: d.fileUrl || null,
      })),
    });
  } catch {
    return { error: "Gönderilemedi." };
  }
  revalidate();
}

export async function deleteAssignment(id: string): Promise<void> {
  await requireAdmin();
  await prisma.athleteAssignment.delete({ where: { id } }).catch(() => {});
  revalidate();
}
