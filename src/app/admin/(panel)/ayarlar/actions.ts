"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isOwnStorageUrl } from "@/lib/storage";
import { SEO_PAGE_PATHS } from "@/lib/page-seo";

export type SettingsResult = { ok: true } | { ok: false; error: string };

const imageUrlSchema = z.string().trim().max(500).nullable().optional();

/**
 * Tek bir görsel-URL ayar alanını kaydeder (öne çıkan görsel / mobil hero).
 * URL varsa yalnız kendi depolamamızdan olabilir (isOwnStorageUrl). null/boş =
 * kaldır. saveSettings bu alanlara dokunmaz — bağımsız kaydedilir (medya seçici /
 * FileDrop anında kaydeder).
 */
async function saveImageSetting(field: "homeGalleryFeaturedUrl" | "heroMobileImageUrl", input: unknown): Promise<SettingsResult> {
  await requireAdmin();
  const parsed = imageUrlSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz veri." };
  const raw = parsed.data?.trim() || null;
  if (raw && !isOwnStorageUrl(raw)) return { ok: false, error: "Geçersiz görsel adresi." };
  const data = { [field]: raw } as { homeGalleryFeaturedUrl?: string | null; heroMobileImageUrl?: string | null };
  try {
    await prisma.siteSetting.upsert({ where: { id: "site" }, update: data, create: { id: "site", ...data } });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Kaydedilemedi." };
  }
}

/** "Akademiden Kareler" öne çıkan görseli (medya seçici popup'ından). */
export async function setHomeGalleryFeatured(input: unknown): Promise<SettingsResult> {
  return saveImageSetting("homeGalleryFeaturedUrl", input);
}

/** Mobil (1:1) hero görseli — boşsa masaüstü hero'ya düşer (bkz. TrialHero). */
export async function setHeroMobileImage(input: unknown): Promise<SettingsResult> {
  return saveImageSetting("heroMobileImageUrl", input);
}

const str = z.string().trim().max(300).optional().or(z.literal(""));
const url = z.string().trim().max(500).refine((v) => !v || /^(https?:\/\/|\/)/.test(v), "Geçersiz URL.").optional().or(z.literal(""));

const schema = z.object({
  // Kulüp
  clubName: z.string().trim().min(1, "Kulüp adı zorunlu.").max(120),
  clubShortName: z.string().trim().min(1, "Kısa ad zorunlu.").max(60),
  logoUrl: url,
  foundedYear: z.number().int().min(1900).max(2100).nullable().optional(),
  phone: str,
  email: z.string().trim().email("Geçerli e-posta giriniz.").optional().or(z.literal("")),
  address: z.string().trim().max(400).optional().or(z.literal("")),
  latitude: z.number().min(-90, "Enlem -90 ile 90 arasında olmalı.").max(90, "Enlem -90 ile 90 arasında olmalı.").nullable().optional(),
  longitude: z.number().min(-180, "Boylam -180 ile 180 arasında olmalı.").max(180, "Boylam -180 ile 180 arasında olmalı.").nullable().optional(),
  socialLinks: z.string().max(4000).default("[]"),
  // SEO
  metaTitle: str,
  metaDescription: z.string().trim().max(400).optional().or(z.literal("")),
  ogImageUrl: url,
  keywords: str,
  // SMTP
  smtpHost: str,
  smtpPort: z.number().int().min(1).max(65535).nullable().optional(),
  smtpUser: str,
  smtpPass: z.string().max(300).optional(), // boşsa mevcut korunur
  mailFrom: str,
  mailToAdmin: z.string().trim().email("Geçerli e-posta giriniz.").optional().or(z.literal("")),
  // Görünüm
  heroImageUrl: z.string().trim().max(500).optional().or(z.literal("")),
  homeGalleryCategoryId: z.string().trim().max(60).optional().or(z.literal("")),
  customCursor: z.boolean().default(false),
  cursorStyle: z.enum(["default", "star", "ball", "whistle"]).default("star"),
  mobileNavAdmin: z.boolean().default(true),
  mobileNavPanel: z.boolean().default(true),
});

import { parseSocialLinks } from "@/lib/social";

/** İstemciden gelen JSON'u katalogla süzüp kanonik biçimde saklar. */
function sanitizeSocialLinks(json: string): string {
  const links = parseSocialLinks(json)
    .map((l) => ({ platform: l.platform, url: l.url.trim().slice(0, 300) }))
    .filter((l) => l.url !== "");
  return JSON.stringify(links);
}

const orNull = (v: string | undefined | null) => (v && v.trim() !== "" ? v.trim() : null);

export async function saveSettings(input: unknown): Promise<SettingsResult> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;

  const data: Record<string, unknown> = {
    clubName: d.clubName,
    clubShortName: d.clubShortName,
    logoUrl: orNull(d.logoUrl),
    foundedYear: d.foundedYear ?? null,
    phone: orNull(d.phone),
    email: orNull(d.email),
    address: orNull(d.address),
    latitude: d.latitude ?? null,
    longitude: d.longitude ?? null,
    socialLinks: sanitizeSocialLinks(d.socialLinks),
    metaTitle: orNull(d.metaTitle),
    metaDescription: orNull(d.metaDescription),
    ogImageUrl: orNull(d.ogImageUrl),
    keywords: orNull(d.keywords),
    smtpHost: orNull(d.smtpHost),
    smtpPort: d.smtpPort ?? null,
    smtpUser: orNull(d.smtpUser),
    mailFrom: orNull(d.mailFrom),
    mailToAdmin: orNull(d.mailToAdmin),
    heroImageUrl: orNull(d.heroImageUrl),
    homeGalleryCategoryId: orNull(d.homeGalleryCategoryId),
    customCursor: d.customCursor,
    cursorStyle: d.cursorStyle,
    mobileNavAdmin: d.mobileNavAdmin,
    mobileNavPanel: d.mobileNavPanel,
  };
  // SMTP şifresi yalnızca yeni değer girilirse güncellenir.
  if (d.smtpPass && d.smtpPass.trim() !== "") data.smtpPass = d.smtpPass;

  try {
    await prisma.siteSetting.upsert({ where: { id: "site" }, update: data, create: { id: "site", ...data } });
    // Ayarlar her yeri etkiler — public + paneller revalidate.
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Ayarlar kaydedilemedi." };
  }
}

// --- Sayfa-bazlı SEO (Madde 6) ---

export type PageSeoOverride = { title: string; description: string; ogImageUrl: string };

/** Tüm sayfa SEO override'ları — path → alanlar. Admin PageSeoManager çeker. */
export async function getPageSeoOverrides(): Promise<Record<string, PageSeoOverride>> {
  await requireAdmin();
  const rows = await prisma.pageSeo.findMany();
  const map: Record<string, PageSeoOverride> = {};
  for (const r of rows) map[r.path] = { title: r.title ?? "", description: r.description ?? "", ogImageUrl: r.ogImageUrl ?? "" };
  return map;
}

const pageSeoSchema = z.object({
  path: z.string().trim().min(1),
  title: z.string().trim().max(120, "Başlık en fazla 120 karakter.").optional().or(z.literal("")),
  description: z.string().trim().max(300, "Açıklama en fazla 300 karakter.").optional().or(z.literal("")),
  ogImageUrl: z.string().trim().max(500).optional().or(z.literal("")),
});

/** Bir sayfanın SEO override'ını kaydeder. Tüm alanlar boşsa override silinir
 *  (site-geneli varsayılana döner). Path allowlist'te (SEO_PAGES) olmalı. */
export async function savePageSeo(input: unknown): Promise<SettingsResult> {
  await requireAdmin();
  const parsed = pageSeoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  if (!SEO_PAGE_PATHS.has(d.path)) return { ok: false, error: "Geçersiz sayfa." };

  const og = d.ogImageUrl?.trim() || "";
  if (og && !isOwnStorageUrl(og)) return { ok: false, error: "Görsel yalnız medya kütüphanesinden olabilir." };

  const title = d.title?.trim() || null;
  const description = d.description?.trim() || null;
  const ogImageUrl = og || null;

  try {
    if (!title && !description && !ogImageUrl) {
      await prisma.pageSeo.deleteMany({ where: { path: d.path } });
    } else {
      await prisma.pageSeo.upsert({
        where: { path: d.path },
        update: { title, description, ogImageUrl },
        create: { path: d.path, title, description, ogImageUrl },
      });
    }
  } catch {
    return { ok: false, error: "SEO ayarı kaydedilemedi." };
  }
  revalidatePath(d.path);
  return { ok: true };
}
