"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { isOwnStorageUrl } from "@/lib/storage";
import { POST_TEMPLATE_IDS } from "@/lib/enums";

const schema = z.object({
  title: z.string().trim().min(1, "Başlık zorunlu.").max(160),
  slug: z
    .string()
    .trim()
    .min(1, "Slug zorunlu.")
    .regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve - içerebilir."),
  category: z.string().trim().max(40).optional().or(z.literal("")),
  template: z.enum(POST_TEMPLATE_IDS).default("standart"),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  // Kapak yalnız KENDİ depomuzdan (medya alanındaki kuralla aynı — bkz.
  // medya/actions.ts createHomeCard). Şema seviyesinde: createPost ve updatePost
  // aynı şemayı kullandığı için ikisi de kapsanır.
  coverUrl: z.string().trim()
    .refine((v) => !v || /^(https?:\/\/|\/)/.test(v), "Geçersiz URL.")
    .refine((v) => !v || isOwnStorageUrl(v), "Kapak görseli yalnız kendi medya kütüphanenizden seçilebilir.")
    .nullable().optional(),
  excerpt: z.string().trim().max(400).optional().or(z.literal("")),
  body: z.string().trim().max(20000).optional().or(z.literal("")),
  templateData: z.string().max(20000).default("{}"),
  author: z.string().trim().max(80).optional().or(z.literal("")),
  featured: z.boolean().default(false),
  publishedAt: z.string().trim().optional().or(z.literal("")),
});

// ---------- Şablona özgü içerik (templateData) doğrulaması ----------
// Her alan tolerant (optional + default) — eksik/bozuk anahtarları kırmadan
// tamamlar; yalnız biçimi belli olan alanlar (skor gibi) Türkçe hata verir.

const goalRowSchema = z.object({
  minute: z.string().trim().max(6).optional().default(""),
  player: z.string().trim().max(60).optional().default(""),
  team: z.enum(["us", "them"]).optional().default("us"),
});

const macraporuDataSchema = z.object({
  opponent: z.string().trim().max(80).optional().default(""),
  ourScore: z.string().trim().max(3).regex(/^\d*$/, "Skor yalnızca rakam olmalı.").optional().default(""),
  oppScore: z.string().trim().max(3).regex(/^\d*$/, "Skor yalnızca rakam olmalı.").optional().default(""),
  isHome: z.boolean().optional().default(true),
  competition: z.string().trim().max(80).optional().default(""),
  matchDate: z.string().trim().max(10).optional().default(""),
  goals: z.array(goalRowSchema).max(40).optional().default([]),
  gallery: z.array(z.string().trim().max(500)).max(60).optional().default([]),
});

const galeriDataSchema = z.object({
  photos: z
    .array(
      z.object({
        url: z.string().trim().max(500).optional().default(""),
        caption: z.string().trim().max(140).optional().default(""),
      }),
    )
    .max(80)
    .optional()
    .default([]),
});

const roportajDataSchema = z.object({
  portraitUrl: z.string().trim().max(500).optional().default(""),
  quote: z.string().trim().max(300).optional().default(""),
  qa: z
    .array(
      z.object({
        q: z.string().trim().max(200).optional().default(""),
        a: z.string().trim().max(3000).optional().default(""),
      }),
    )
    .max(30)
    .optional()
    .default([]),
});

const duyuruDataSchema = z.object({
  contact: z.string().trim().max(200).optional().default(""),
});

// Alan gerektirmeyen şablonlar (sondakika, standart) — bilinmeyen anahtarlar
// zod'un varsayılan davranışıyla sessizce atılır.
const emptyDataSchema = z.object({});

const TEMPLATE_DATA_SCHEMAS: Record<string, z.ZodTypeAny> = {
  macraporu: macraporuDataSchema,
  galeri: galeriDataSchema,
  roportaj: roportajDataSchema,
  duyuru: duyuruDataSchema,
  sondakika: emptyDataSchema,
  standart: emptyDataSchema,
};

export type PostResult = { error: string };


/** templateData JSON'unu şablona göre doğrular; başarısızsa Türkçe hata döner. */
function validateTemplateData(template: string, raw: string): { error: string } | { data: string } {
  let obj: unknown = {};
  try {
    obj = raw ? JSON.parse(raw) : {};
  } catch {
    obj = {};
  }
  const tSchema = TEMPLATE_DATA_SCHEMAS[template] ?? emptyDataSchema;
  const parsed = tSchema.safeParse(obj);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Şablon içeriği geçersiz." };
  return { data: JSON.stringify(parsed.data) };
}

function toData(d: z.infer<typeof schema>, templateData: string) {
  return {
    title: d.title,
    slug: d.slug,
    category: d.category || "",
    template: d.template,
    status: d.status,
    coverUrl: d.coverUrl && d.coverUrl.trim() ? d.coverUrl : null,
    excerpt: d.excerpt || "",
    body: d.body || "",
    templateData,
    author: d.author || "",
    featured: d.featured,
    publishedAt: d.publishedAt || null,
  };
}

export async function createPost(input: unknown): Promise<PostResult | void> {
  await requirePermission("haberler.manage");
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const tResult = validateTemplateData(parsed.data.template, parsed.data.templateData);
  if ("error" in tResult) return tResult;
  try {
    await prisma.post.create({ data: toData(parsed.data, tResult.data) });
  } catch {
    return { error: "Bu slug zaten kullanımda. Farklı bir slug deneyin." };
  }
  revalidatePath("/admin/haberler");
  revalidatePath("/haberler");
  revalidatePath("/");
  redirect("/admin/haberler");
}

export async function updatePost(id: string, input: unknown): Promise<PostResult | void> {
  await requirePermission("haberler.manage");
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const tResult = validateTemplateData(parsed.data.template, parsed.data.templateData);
  if ("error" in tResult) return tResult;
  try {
    await prisma.post.update({ where: { id }, data: toData(parsed.data, tResult.data) });
  } catch {
    return { error: "Güncellenemedi. Slug benzersiz olmalı." };
  }
  revalidatePath("/admin/haberler");
  revalidatePath("/haberler");
  revalidatePath("/");
  redirect("/admin/haberler");
}

export async function deletePost(id: string): Promise<void> {
  await requirePermission("haberler.manage");
  await prisma.post.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/haberler");
  revalidatePath("/haberler");
  revalidatePath("/");
  redirect("/admin/haberler");
}
