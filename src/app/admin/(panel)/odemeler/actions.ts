"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type PaymentResult = { ok: true } | { ok: false; error: string };

const STATUSES = ["paid", "pending", "overdue"] as const;

const createSchema = z.object({
  athleteId: z.string().min(1, "Sporcu seçiniz."),
  amount: z.number().int("Tutar tam sayı olmalı.").positive("Tutar pozitif olmalı.").max(1_000_000),
  period: z.string().trim().min(1, "Dönem giriniz.").max(60),
  dueDate: z.string().trim().max(10).optional().or(z.literal("")),
  status: z.enum(STATUSES).default("pending"),
  note: z.string().trim().max(200).optional().or(z.literal("")),
});

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function createPayment(input: unknown): Promise<PaymentResult> {
  await requirePermission("odemeler.manage");
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  try {
    await prisma.payment.create({
      data: {
        athleteId: d.athleteId,
        amount: d.amount,
        period: d.period,
        status: d.status,
        dueDate: d.dueDate || null,
        paidAt: d.status === "paid" ? todayYmd() : null,
        note: d.note || null,
      },
    });
    revalidatePath("/admin/odemeler");
    revalidatePath("/panel/odemeler");
    return { ok: true };
  } catch {
    return { ok: false, error: "Ödeme kaydedilemedi." };
  }
}

export async function setPaymentStatus(id: unknown, status: unknown): Promise<PaymentResult> {
  await requirePermission("odemeler.manage");
  const parsed = z.object({ id: z.string().trim().min(1).max(60), status: z.enum(STATUSES) }).safeParse({ id, status });
  if (!parsed.success) return { ok: false, error: "Geçersiz durum." };
  try {
    await prisma.payment.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status, paidAt: parsed.data.status === "paid" ? todayYmd() : null },
    });
    revalidatePath("/admin/odemeler");
    revalidatePath("/panel/odemeler");
    return { ok: true };
  } catch {
    return { ok: false, error: "Durum güncellenemedi." };
  }
}

export async function deletePayment(id: string): Promise<PaymentResult> {
  await requirePermission("odemeler.manage");
  try {
    await prisma.payment.delete({ where: { id } });
    revalidatePath("/admin/odemeler");
    revalidatePath("/panel/odemeler");
    return { ok: true };
  } catch {
    return { ok: false, error: "Silinemedi." };
  }
}
