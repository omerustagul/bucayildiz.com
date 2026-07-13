"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isOwnStorageUrl } from "@/lib/storage";

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
