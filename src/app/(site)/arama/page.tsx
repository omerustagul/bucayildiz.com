import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { searchSite, MIN_QUERY, type SearchHit } from "@/lib/search";

/** Arama sonuçları indekslenmez (ince içerikli sonsuz URL uzayı — SEO zararı). */
export const metadata: Metadata = { title: "Arama", robots: { index: false } };
export const dynamic = "force-dynamic"; // sorguya bağlı — önbelleğe alınmaz

const KIND_ORDER: SearchHit["kind"][] = ["haber", "takim", "medya", "tesis", "kariyer"];

export default async function AramaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const hits = await searchSite(query);

  // Tür başlıklarıyla grupla — karışık liste yerine okunur bloklar.
  const groups = KIND_ORDER.map((kind) => ({
    kind,
    label: hits.find((h) => h.kind === kind)?.label ?? "",
    items: hits.filter((h) => h.kind === kind),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero
        kicker="Site içi arama"
        title={query ? `“${query}” için sonuçlar` : "Arama"}
        lead={query && hits.length > 0 ? `${hits.length} sonuç bulundu.` : "Haber, takım, tesis, medya ve kariyer içeriklerinde arayın."}
        breadcrumb={[{ label: "Arama" }]}
      />
      <Section>
        <div style={{ maxWidth: 760, marginBottom: "var(--space-7)" }}>
          <div style={{ maxWidth: 420 }}>
            <HeaderSearch variant="page" defaultValue={query} />
          </div>
        </div>

        {query.length < MIN_QUERY ? (
          <p style={{ color: "var(--text-muted)" }}>
            Aramak için en az {MIN_QUERY} karakter girin.
          </p>
        ) : hits.length === 0 ? (
          <div style={{ maxWidth: 620, display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              “{query}” için sonuç bulunamadı. Farklı bir kelime deneyebilir veya aşağıdaki bölümlere göz atabilirsiniz.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { label: "Haberler", href: "/haberler" },
                { label: "Takımlar", href: "/takimlar" },
                { label: "Tesisler", href: "/kurumsal/tesisler" },
                { label: "Medya", href: "/medya" },
                { label: "Kariyer", href: "/kurumsal/kariyer" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid var(--border-subtle)",
                    background: "var(--surface-card)",
                    fontSize: 14,
                    color: "var(--ink-700)",
                    textDecoration: "none",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
            {groups.map((g) => (
              <div key={g.kind}>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--gold-700)",
                    margin: "0 0 var(--space-4)",
                  }}
                >
                  {g.label} ({g.items.length})
                </h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {g.items.map((h) => (
                    <Link
                      key={`${h.kind}-${h.href}-${h.title}`}
                      href={h.href}
                      className="link-card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        padding: "var(--space-5)",
                        background: "var(--surface-card)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-lg)",
                        textDecoration: "none",
                        // grid öğesinde ellipsis için şart (CLAUDE.md taşma kuralı)
                        minWidth: 0,
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, color: "var(--ink-900)" }}>
                        {h.title}
                      </span>
                      {h.excerpt && (
                        <span style={{ fontSize: 14, color: "var(--text-muted)", minWidth: 0 }}>{h.excerpt}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
