import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Site geneli arama (Faz 4.3).
 *
 * ⚠️ KVKK — SPORCULAR ARANMAZ. `Athlete` (ve ölçüm/sağlık/ödeme gibi kişisel kayıtlar)
 * bilerek kapsam DIŞIDIR: çocuk kişisel verisi halka açık aramada bulunabilir olamaz.
 * Yeni model eklerken bu kuralı koru — kapsam yalnız KURUMSAL/İÇERİK verisidir.
 *
 * ⚠️ YAYIN DURUMU — yalnız yayımlanmış içerik döner:
 *   Post → status 'published' (taslak/zamanlanmış haber sızmamalı)
 *   JobPosting → active = true (kapanmış ilan görünmemeli)
 *
 * ⚠️ NEDEN HAM SQL? Prisma'nın `mode: "insensitive"` (ILIKE) kıvırması veritabanı
 * collation'ına bağlıdır; bu DB `en_US.UTF-8` olduğu için TÜRKÇE'de YANLIŞ çalışır:
 * "TAKIM" → "takim" (noktalı i) olur, içerikteki "Takım" (noktasız ı) ile EŞLEŞMEZ.
 * Yani caps ile yazan kullanıcı var olan içeriği bulamıyordu (tarayıcıda doğrulandı).
 * Çözüm: sorguyu ve içeriği AYNI katlama ile ASCII'ye indirip karşılaştırmak
 * (`foldTr` ↔ SQL `translate`). Yan fayda: aksansız arama da çalışır —
 * "goztepe" → "Göztepe", "cim" → "çim".
 *
 * Perf: katlama indeks kullanmaz (seq scan). Bu içerik hacminde (yüzlerce satır,
 * 5 tablo) sorun değil; hacim büyürse çözüm ifade-indeksi (aynı translate ifadesi
 * üzerinde) veya pg_trgm olur — arama arayüzü değişmeden.
 */

export type SearchKind = "haber" | "takim" | "tesis" | "medya" | "kariyer";

export type SearchHit = {
  kind: SearchKind;
  /** Rozette gösterilen tür etiketi. */
  label: string;
  title: string;
  excerpt: string;
  href: string;
};

/** Bu uzunluğun altında arama yapılmaz (tek harf tüm siteyi döndürürdü). */
export const MIN_QUERY = 2;
const PER_KIND = 5;

// Katlama tablosu — JS ve SQL tarafı BİREBİR aynı olmak ZORUNDA, yoksa sessizce
// eşleşme kaçar. İki taraf da bu iki sabitten türetilir.
const FOLD_FROM = "ıİIiŞşĞğÜüÖöÇçÂâÎîÛû";
const FOLD_TO = "iiiiSsGgUuOoCcAaIiUu";

/** Türkçe harfleri ASCII'ye indirip küçültür ("TAKIM" ve "Takım" → "takim"). */
export function foldTr(s: string): string {
  let out = "";
  for (const ch of s) {
    const i = FOLD_FROM.indexOf(ch);
    out += i >= 0 ? FOLD_TO[i] : ch;
  }
  return out.toLowerCase();
}

/**
 * Sütunu SQL tarafında aynı biçime indirger (NULL → '').
 * ⚠️ `column` HAM SQL'e girer — YALNIZ bu dosyadaki sabit sütun adları geçilir.
 * Kullanıcı girdisi asla buraya verilmemeli (aranan metin `${p}` ile parametre olarak gider).
 */
function fold(column: string): Prisma.Sql {
  return Prisma.raw(`lower(translate(coalesce(${column},''), '${FOLD_FROM}', '${FOLD_TO}'))`);
}

/** LIKE joker karakterlerini kaçırır — kullanıcının yazdığı % veya _ desen olmasın. */
function pattern(q: string): string {
  return `%${foldTr(q).replace(/[\\%_]/g, (c) => "\\" + c)}%`;
}

const KIND_LABEL: Record<SearchKind, string> = {
  haber: "Haber",
  takim: "Takım",
  tesis: "Tesis",
  medya: "Medya",
  kariyer: "Kariyer",
};

/** Uzun metinden kısa özet — arama sonucunda satırı taşırmasın. */
function clip(s: string | null, n = 140): string {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
}

export async function searchSite(raw: string, perKind = PER_KIND): Promise<SearchHit[]> {
  const q = (raw || "").trim();
  if (q.length < MIN_QUERY) return [];
  const p = pattern(q);

  const [posts, teams, facilities, media, jobs] = await Promise.all([
    // YALNIZ yayımlanmış — taslak/zamanlanmış haber public aramada görünmez.
    prisma.$queryRaw<{ title: string; slug: string; excerpt: string | null }[]>(Prisma.sql`
      SELECT "title", "slug", "excerpt" FROM "Post"
      WHERE "status" = 'published'
        AND (${fold(`"title"`)} LIKE ${p} OR ${fold(`"excerpt"`)} LIKE ${p})
      ORDER BY "publishedAt" DESC NULLS LAST
      LIMIT ${perKind}
    `),
    prisma.$queryRaw<{ name: string; slug: string }[]>(Prisma.sql`
      SELECT "name", "slug" FROM "Team"
      WHERE ${fold(`"name"`)} LIKE ${p}
      LIMIT ${perKind}
    `),
    prisma.$queryRaw<{ name: string; description: string | null }[]>(Prisma.sql`
      SELECT "name", "description" FROM "Facility"
      WHERE ${fold(`"name"`)} LIKE ${p} OR ${fold(`"description"`)} LIKE ${p}
      LIMIT ${perKind}
    `),
    prisma.$queryRaw<{ title: string | null; kind: string }[]>(Prisma.sql`
      SELECT "title", "kind" FROM "MediaAsset"
      WHERE ${fold(`"title"`)} LIKE ${p}
      ORDER BY "createdAt" DESC
      LIMIT ${perKind}
    `),
    // YALNIZ açık ilan.
    prisma.$queryRaw<{ title: string; department: string | null; description: string | null }[]>(Prisma.sql`
      SELECT "title", "department", "description" FROM "JobPosting"
      WHERE "active" = true
        AND (${fold(`"title"`)} LIKE ${p} OR ${fold(`"department"`)} LIKE ${p} OR ${fold(`"description"`)} LIKE ${p})
      LIMIT ${perKind}
    `),
  ]);

  return [
    ...posts.map((x) => ({ kind: "haber" as const, label: KIND_LABEL.haber, title: x.title, excerpt: clip(x.excerpt), href: `/haberler/${x.slug}` })),
    ...teams.map((x) => ({ kind: "takim" as const, label: KIND_LABEL.takim, title: x.name, excerpt: "Kadro, fikstür ve takım bilgileri", href: `/takimlar/${x.slug}` })),
    ...facilities.map((x) => ({ kind: "tesis" as const, label: KIND_LABEL.tesis, title: x.name, excerpt: clip(x.description), href: "/kurumsal/tesisler" })),
    ...media.map((x) => ({
      kind: "medya" as const,
      label: KIND_LABEL.medya,
      title: x.title || "Medya",
      excerpt: x.kind === "video" ? "Video" : "Fotoğraf",
      href: x.kind === "video" ? "/medya/videolar" : "/medya/fotograflar",
    })),
    ...jobs.map((x) => ({ kind: "kariyer" as const, label: KIND_LABEL.kariyer, title: x.title, excerpt: clip(x.department || x.description), href: "/kurumsal/kariyer" })),
  ];
}
