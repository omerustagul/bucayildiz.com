"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { jobPostingSchema, JOB_APPLICATION_STATUSES } from "@/lib/validation";

export type JobResult = { error: string };

function toData(d: z.infer<typeof jobPostingSchema>) {
  return {
    title: d.title,
    department: d.department ?? "",
    location: d.location ?? "",
    employment: d.employment,
    description: d.description ?? "",
    active: d.active,
    sort: d.sort,
  };
}

function revalidate() {
  revalidatePath("/admin/kariyer");
  revalidatePath("/kurumsal/kariyer");
}

// --- İlan CRUD (requireAdmin + Zod) ---
export async function createJobPosting(input: unknown): Promise<JobResult | void> {
  await requireAdmin();
  const parsed = jobPostingSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.jobPosting.create({ data: toData(parsed.data) });
  } catch {
    return { error: "İlan oluşturulamadı." };
  }
  revalidate();
}

export async function updateJobPosting(id: string, input: unknown): Promise<JobResult | void> {
  await requireAdmin();
  const parsed = jobPostingSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  try {
    await prisma.jobPosting.update({ where: { id }, data: toData(parsed.data) });
  } catch {
    return { error: "İlan güncellenemedi." };
  }
  revalidate();
}

export async function deleteJobPosting(id: string): Promise<void> {
  await requireAdmin();
  await prisma.jobPosting.delete({ where: { id } }).catch(() => {});
  revalidate();
}

// --- Başvuru yönetimi (requireAdmin) ---
export async function updateJobApplicationStatus(id: string, status: string): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = z.enum(JOB_APPLICATION_STATUSES).safeParse(status);
  if (!parsed.success) return { error: "Geçersiz durum." };
  await prisma.jobApplication.update({ where: { id }, data: { status: parsed.data } }).catch(() => {});
  revalidate();
}

export async function deleteJobApplication(id: string): Promise<void> {
  await requireAdmin();
  await prisma.jobApplication.delete({ where: { id } }).catch(() => {});
  revalidate();
}
