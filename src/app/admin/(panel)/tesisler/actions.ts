"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(1, "Tesis adı zorunlu.").max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  capacity: z.string().trim().max(60).optional().or(z.literal("")),
  features: z.string().trim().max(500).optional().or(z.literal("")),
  photoUrl: z.string().trim().nullable().optional(),
  sort: z.coerce.number().int().min(0).max(999).default(0),
  // Harita konumu (opsiyonel). DİKKAT: `z.coerce.number()` KULLANILMAZ — null'ı 0'a
  // çevirir ve tesis (0,0)'a (Gine Körfezi) düşerdi. İstemci gerçek sayı veya null yollar.
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  // true ise Takvim Programı'nda "saha" seçeneği olarak listelenir (elle işaretlenir).
  isPitch: z.boolean().optional().default(false),
});

export type FacilityResult = { error: string };

function toData(d: z.infer<typeof schema>) {
  // Koordinat YA İKİSİ birden YA HİÇBİRİ — yarım koordinat haritayı yanlış yere koyar.
  const hasCoords = typeof d.latitude === "number" && typeof d.longitude === "number";
  return {
    name: d.name,
    description: d.description ?? "",
    capacity: d.capacity && d.capacity.trim() ? d.capacity : null,
    features: d.features ?? "",
    photoUrl: d.photoUrl && d.photoUrl.trim() ? d.photoUrl : null,
    sort: d.sort,
    latitude: hasCoords ? d.latitude! : null,
    longitude: hasCoords ? d.longitude! : null,
    isPitch: d.isPitch,
  };
}

function revalidateFacilityPages() {
  revalidatePath("/admin/tesisler");
  revalidatePath("/kurumsal/tesisler");
  // Detay sayfaları (ad'dan türetilen slug) — tüm dinamik örnekleri tazele,
  // yoksa admin foto/konum değişikliği detayda bayat kalır.
  revalidatePath("/kurumsal/tesisler/[slug]", "page");
}

export async function createFacility(input: unknown): Promise<FacilityResult | void> {
  await requirePermission("tesisler.manage");
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
  await requirePermission("tesisler.manage");
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
  await requirePermission("tesisler.manage");
  await prisma.facility.delete({ where: { id } }).catch(() => {});
  revalidateFacilityPages();
}
