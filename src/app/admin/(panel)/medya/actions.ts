"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const hex = /^#[0-9a-fA-F]{6}$/;

export type MediaResult = { ok: boolean; error?: string };

async function authed() {
  const s = await getAdminSession();
  return !!s && s.role === "admin";
}

// --- Categories ---
const catSchema = z.object({
  name: z.string().trim().min(1, "Kategori adı zorunlu.").max(40),
  color: z.string().trim().regex(hex).default("#15295A"),
});

export async function createMediaCategory(input: unknown): Promise<MediaResult> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz." };
  const parsed = catSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const count = await prisma.mediaCategory.count();
  await prisma.mediaCategory.create({ data: { ...parsed.data, sort: count } });
  revalidatePath("/admin/medya");
  revalidatePath("/medya");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteMediaCategory(id: string): Promise<void> {
  if (!(await authed())) return;
  await prisma.mediaAsset.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  await prisma.mediaCategory.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/medya");
  revalidatePath("/medya");
  revalidatePath("/");
}

// --- Assets ---
const assetSchema = z.object({
  url: z.string().trim().min(1, "URL zorunlu.").refine((v) => /^(https?:\/\/|\/)/.test(v), "Geçersiz URL."),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  categoryId: z.string().trim().optional().or(z.literal("")),
  folderId: z.string().trim().optional().or(z.literal("")),
  kind: z.enum(["photo", "video"]).default("photo"),
});

export async function createMediaAsset(input: unknown): Promise<MediaResult> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz." };
  const parsed = assetSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;

  // Kategori kuralı: klasör bir kategoriye bağlıysa medya onu devralır — istemciden
  // gelen categoryId'ye güvenme, klasörünkiyle EZ. Klasör bağlı değilse (kök yükleme
  // dahil) kategori seçimi zorunludur.
  let categoryId = d.categoryId ? d.categoryId : null;
  if (d.folderId) {
    const folder = await prisma.folder.findUnique({ where: { id: d.folderId }, select: { categoryId: true } });
    if (folder?.categoryId) categoryId = folder.categoryId;
  }
  if (!categoryId) return { ok: false, error: "Kategori seçiniz." };

  await prisma.mediaAsset.create({
    data: { url: d.url, title: d.title || "", kind: d.kind, categoryId, folderId: d.folderId ? d.folderId : null },
  });
  revalidatePath("/admin/medya");
  revalidatePath("/medya");
  revalidatePath("/");
  return { ok: true };
}

// --- Folders ---
const folderSchema = z.object({
  name: z.string().trim().min(1, "Klasör adı zorunlu.").max(60),
  parentId: z.string().trim().optional().or(z.literal("")),
  categoryId: z.string().trim().optional().or(z.literal("")),
});

export async function createFolder(input: unknown): Promise<MediaResult> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz." };
  const parsed = folderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  await prisma.folder.create({
    data: { name: d.name, parentId: d.parentId ? d.parentId : null, categoryId: d.categoryId ? d.categoryId : null },
  });
  revalidatePath("/admin/medya");
  revalidatePath("/medya");
  revalidatePath("/");
  return { ok: true };
}

const folderUpdateSchema = folderSchema.omit({ parentId: true });

export async function updateFolder(id: string, input: unknown): Promise<MediaResult> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz." };
  const parsed = folderUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  await prisma.folder.update({
    where: { id },
    data: { name: d.name, categoryId: d.categoryId ? d.categoryId : null },
  });
  revalidatePath("/admin/medya");
  revalidatePath("/medya");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteFolder(id: string): Promise<void> {
  if (!(await authed())) return;
  const folder = await prisma.folder.findUnique({ where: { id } });
  await prisma.folder.updateMany({ where: { parentId: id }, data: { parentId: folder?.parentId ?? null } });
  await prisma.mediaAsset.updateMany({ where: { folderId: id }, data: { folderId: null } });
  await prisma.folder.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/medya");
  revalidatePath("/medya");
  revalidatePath("/");
}

// --- Home media cards ---
const cardSchema = z.object({
  title: z.string().trim().min(1, "Kart adı zorunlu.").max(80),
  categoryId: z.string().trim().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  coverUrl: z.string().trim().refine((v) => !v || /^(https?:\/\/|\/)/.test(v), "Geçersiz URL.").nullable().optional(),
});

export async function updateHomeCard(id: string, input: unknown): Promise<MediaResult> {
  if (!(await authed())) return { ok: false, error: "Yetkisiz." };
  const parsed = cardSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  await prisma.homeMediaCard.update({
    where: { id },
    data: { title: d.title, categoryId: d.categoryId ? d.categoryId : null, featured: d.featured, coverUrl: d.coverUrl && d.coverUrl.trim() ? d.coverUrl : null },
  });
  revalidatePath("/admin/medya");
  revalidatePath("/medya");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteMediaAsset(id: string): Promise<void> {
  if (!(await authed())) return;
  await prisma.mediaAsset.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/medya");
  revalidatePath("/medya");
  revalidatePath("/");
}
