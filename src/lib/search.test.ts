// @vitest-environment node
// Site araması — ÜÇ kural sorgu düzeyinde sabitlenir:
//  1) KVKK: sporcu/veli/kullanıcı tabloları HİÇBİR koşulda aranmaz.
//  2) Yayın durumu: taslak haber / kapanmış ilan public aramaya sızmaz.
//  3) Türkçe katlama: "TAKIM" ile "Takım" eşleşmeli (en_US collation'da ILIKE
//     bunu yapamıyordu — tarayıcıda 0 sonuç dönerek yakalandı).
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({ raw: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ prisma: { $queryRaw: H.raw } }));

import { searchSite, foldTr, MIN_QUERY } from "@/lib/search";

/** Çağrılan tüm sorguların SQL metni (parametreler $1.. olarak). */
function sqls(): string[] {
  return H.raw.mock.calls.map((c) => (c[0] as { sql: string }).sql);
}
/** Belirli bir tabloyu hedefleyen sorgunun SQL'i. */
function sqlFor(table: string): string {
  const found = sqls().find((s) => s.includes(`"${table}"`));
  if (!found) throw new Error(`${table} sorgusu yok`);
  return found;
}
/** Tüm sorgulara geçirilen LIKE desenleri. */
function patterns(): string[] {
  return H.raw.mock.calls.flatMap((c) => (c[0] as { values: unknown[] }).values).filter((v): v is string => typeof v === "string");
}

beforeEach(() => {
  H.raw.mockReset();
  H.raw.mockResolvedValue([]);
});

describe("KVKK — kişisel veri aramada YOK", () => {
  it("hiçbir sorgu Athlete/User/Parent tablosuna dokunmaz", async () => {
    await searchSite("ahmet");
    const all = sqls().join("\n");
    expect(all).not.toMatch(/"Athlete"/);
    expect(all).not.toMatch(/"User"/);
    expect(all).not.toMatch(/"Application"/);
  });
});

describe("Yayın filtreleri (sızıntı koruması)", () => {
  it("haberlerde YALNIZ status='published' sorgulanır", async () => {
    await searchSite("kamp");
    expect(sqlFor("Post")).toMatch(/"status"\s*=\s*'published'/);
  });

  it("iş ilanlarında YALNIZ active=true sorgulanır", async () => {
    await searchSite("antrenör");
    expect(sqlFor("JobPosting")).toMatch(/"active"\s*=\s*true/);
  });
});

describe("Türkçe harf katlama", () => {
  it("noktalı/noktasız i ayrımı kaldırılır", () => {
    expect(foldTr("TAKIM")).toBe(foldTr("Takım"));
    expect(foldTr("İZMİR")).toBe(foldTr("izmir"));
  });

  it("aksanlar kaldırılır (kullanıcı Türkçe karakter yazmadan da bulsun)", () => {
    expect(foldTr("Göztepe")).toBe("goztepe");
    expect(foldTr("ÇİM SAHA")).toBe("cim saha");
    expect(foldTr("Şükrü")).toBe("sukru");
  });

  it("sorgu, katlanmış LIKE deseni olarak gider", async () => {
    await searchSite("TAKIM");
    expect(patterns()).toContain("%takim%");
  });

  it("her sütun SQL tarafında da aynı translate ile katlanır", async () => {
    await searchSite("takım");
    expect(sqlFor("Team")).toMatch(/lower\(translate\(coalesce\("name"/);
  });
});

describe("Sorgu davranışı", () => {
  it(`${MIN_QUERY} karakterden kısa sorguda DB'ye hiç gidilmez`, async () => {
    expect(await searchSite("a")).toEqual([]);
    expect(await searchSite("   ")).toEqual([]);
    expect(H.raw).not.toHaveBeenCalled();
  });

  it("LIKE jokerleri kaçırılır (kullanıcının % işareti desen olmaz)", async () => {
    await searchSite("50%");
    expect(patterns()).toContain("%50\\%%");
  });

  it("baştaki/sondaki boşluk kırpılır", async () => {
    await searchSite("  kamp  ");
    expect(patterns()).toContain("%kamp%");
  });
});

describe("Sonuç eşleme", () => {
  /** Sorgular Promise.all sırasına göre: Post, Team, Facility, MediaAsset, JobPosting. */
  function stub(rows: unknown[][]) {
    let i = 0;
    H.raw.mockImplementation(() => Promise.resolve(rows[i++] ?? []));
  }

  it("her tür doğru bağlantıya gider", async () => {
    stub([
      [{ title: "Kamp", slug: "kamp-2026", excerpt: "özet" }],
      [{ name: "A Takım", slug: "a-takim" }],
      [{ name: "Saha 1", description: "çim" }],
      [{ title: "Maç", kind: "video" }],
      [{ title: "Antrenör", department: "Altyapı", description: "d" }],
    ]);
    const r = await searchSite("kamp");
    expect(Object.fromEntries(r.map((h) => [h.kind, h.href]))).toEqual({
      haber: "/haberler/kamp-2026",
      takim: "/takimlar/a-takim",
      tesis: "/kurumsal/tesisler",
      medya: "/medya/videolar",
      kariyer: "/kurumsal/kariyer",
    });
  });

  it("fotoğraf medyası fotoğraf galerisine gider", async () => {
    stub([[], [], [], [{ title: "Antrenman", kind: "photo" }], []]);
    const r = await searchSite("antrenman");
    expect(r.find((h) => h.kind === "medya")?.href).toBe("/medya/fotograflar");
  });

  it("uzun özet kırpılır, NULL özet çökertmez", async () => {
    stub([[{ title: "T", slug: "s", excerpt: "x".repeat(300) }, { title: "U", slug: "u", excerpt: null }]]);
    const r = await searchSite("turnuva");
    expect(r[0]!.excerpt.length).toBeLessThanOrEqual(140);
    expect(r[0]!.excerpt.endsWith("…")).toBe(true);
    expect(r[1]!.excerpt).toBe("");
  });
});
