import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { fmtTrDate } from "@/lib/publicData";
import { getSettings } from "@/lib/settings";
import { logoSrc } from "@/lib/branding";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/lib/icons";
import { FixtureCard } from "@/components/home/FixtureCard";
import { MediaGallery, type GalleryAsset } from "@/components/content/MediaGallery";
import { parseTemplateData, type MacraporuData, type GaleriData, type RoportajData, type DuyuruData } from "@/lib/postTemplates";

// Build sırasında yayınlanmış tüm haberler statik üretilir; sonradan eklenenler
// on-demand render edilir (dynamicParams varsayılan true).
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findFirst({ where: { slug, status: "published" } });
  return { title: post ? post.title : "Haber" };
}

/** Kapak görseli — standart/sondakika/galeri şablonlarında paylaşılır. */
function CoverImage({ url, title }: { url: string; title: string }) {
  return (
    <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border-subtle)", marginBottom: 32, maxWidth: 880 }}>
      <Image src={url} alt={title} fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 100vw, 880px" priority />
    </div>
  );
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({ where: { slug, status: "published" } });
  if (!post) notFound();

  const paragraphs = post.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const sonDakika = post.template === "sondakika";
  // Sadece kulüp logosu gereken şablonlarda ayar sorgusu çalıştır (perf).
  const needsClub = post.template === "macraporu" || post.template === "duyuru";
  const settings = needsClub ? await getSettings() : null;
  const clubName = settings?.clubShortName || "Buca Yıldız";
  const clubCrest = logoSrc(settings?.logoUrl);

  return (
    <>
      <PageHero
        kicker={`${post.category || "Haber"} · ${fmtTrDate(post.publishedAt)}`}
        title={post.title}
        breadcrumb={[{ label: "Haberler", href: "/haberler" }, { label: post.category || "Haber" }]}
        badge={
          sonDakika ? (
            <Badge tone="live" dot>
              Son Dakika
            </Badge>
          ) : undefined
        }
      />
      <Section>
        {post.template === "macraporu" && (() => {
          const m = parseTemplateData(post.template, post.templateData) as unknown as MacraporuData;
          const toScore = (s: string) => (s.trim() !== "" ? Number(s) : undefined);
          const us = { name: clubName, crest: clubCrest, score: toScore(m.ourScore) };
          const them = { name: m.opponent || "Rakip", score: toScore(m.oppScore) };
          const home = m.isHome ? us : them;
          const away = m.isHome ? them : us;
          const goals = [...m.goals].sort((a, b) => (parseInt(a.minute, 10) || 0) - (parseInt(b.minute, 10) || 0));
          const galleryItems: GalleryAsset[] = m.gallery.map((url, i) => ({ id: `${post.id}-kare-${i}`, url, title: "", kind: "image", category: null, date: fmtTrDate(post.publishedAt) }));
          return (
            <>
              <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
                <FixtureCard competition={m.competition || "Maç"} date={fmtTrDate(m.matchDate)} venue={m.isHome ? "Ev Sahibi" : "Deplasman"} status="finished" home={home} away={away} />
              </div>
              {goals.length > 0 && (
                <div style={{ maxWidth: 640, margin: "0 auto 36px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, textTransform: "uppercase", color: "var(--text-strong)", marginBottom: 4 }}>Gol Listesi</div>
                  {goals.map((g, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        background: g.team === "us" ? "var(--gold-100)" : "var(--surface-subtle)",
                        border: `1px solid ${g.team === "us" ? "var(--gold-300)" : "var(--border-subtle)"}`,
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <span style={{ flex: "none", minWidth: 40, fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 15, color: g.team === "us" ? "var(--gold-800)" : "var(--ink-500)" }}>{g.minute || "—"}</span>
                      <span style={{ minWidth: 0, fontWeight: g.team === "us" ? 700 : 500, color: g.team === "us" ? "var(--gold-800)" : "var(--text-body)" }}>{g.player || "—"}</span>
                      {g.team !== "us" && <span style={{ marginLeft: "auto", flex: "none", fontSize: 12, color: "var(--ink-400)" }}>Rakip</span>}
                    </div>
                  ))}
                </div>
              )}
              <Prose>
                {post.excerpt && <p style={{ fontWeight: 600, color: "var(--text-strong)" }}>{post.excerpt}</p>}
                {paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </Prose>
              {galleryItems.length > 0 && (
                <div style={{ marginTop: 36 }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", marginBottom: 16 }}>Maç Kareleri</div>
                  <MediaGallery items={galleryItems} />
                </div>
              )}
            </>
          );
        })()}

        {post.template === "galeri" && (() => {
          const g = parseTemplateData(post.template, post.templateData) as unknown as GaleriData;
          const photoItems: GalleryAsset[] = g.photos
            .filter((p) => p.url)
            .map((p, i) => ({ id: `${post.id}-foto-${i}`, url: p.url, title: p.caption || "", kind: "image", category: null, date: fmtTrDate(post.publishedAt) }));
          return (
            <>
              {post.coverUrl && <CoverImage url={post.coverUrl} title={post.title} />}
              <Prose>
                {post.excerpt && <p style={{ fontWeight: 600, color: "var(--text-strong)" }}>{post.excerpt}</p>}
                {paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </Prose>
              {photoItems.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <MediaGallery items={photoItems} />
                </div>
              )}
            </>
          );
        })()}

        {post.template === "roportaj" && (() => {
          const r = parseTemplateData(post.template, post.templateData) as unknown as RoportajData;
          return (
            <>
              {r.portraitUrl && (
                <div style={{ position: "relative", width: 220, aspectRatio: "3 / 4", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border-subtle)", marginBottom: 28 }}>
                  <Image src={r.portraitUrl} alt={post.title} fill style={{ objectFit: "cover" }} sizes="220px" />
                </div>
              )}
              {r.quote && (
                <blockquote style={{ margin: "0 0 28px", maxWidth: 760 }}>
                  <span aria-hidden style={{ display: "block", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 56, lineHeight: 0.6, color: "var(--gold-400)", marginBottom: 6 }}>
                    &ldquo;
                  </span>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 25, lineHeight: 1.3, color: "var(--gold-700)" }}>{r.quote}</span>
                </blockquote>
              )}
              <Prose>
                {post.excerpt && <p style={{ fontWeight: 600, color: "var(--text-strong)" }}>{post.excerpt}</p>}
                {paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </Prose>
              {r.qa.length > 0 && (
                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 22, maxWidth: 760 }}>
                  {r.qa.map((row, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "var(--gold-700)", marginBottom: 6 }}>{row.q}</div>
                      <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-body)" }}>{row.a}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()}

        {post.template === "duyuru" && (() => {
          const d = parseTemplateData(post.template, post.templateData) as unknown as DuyuruData;
          return (
            <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
              <Image src={clubCrest} alt={clubName} width={64} height={64} style={{ objectFit: "contain", marginBottom: 20 }} />
              <Prose maxWidth={680}>
                {post.excerpt && <p style={{ fontWeight: 600, color: "var(--text-strong)", textAlign: "left" }}>{post.excerpt}</p>}
                {paragraphs.map((para, i) => (
                  <p key={i} style={{ textAlign: "left" }}>{para}</p>
                ))}
              </Prose>
              {d.contact && (
                <div style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--text-body)" }}>
                  <Icon name="phone" size={15} /> {d.contact}
                </div>
              )}
            </div>
          );
        })()}

        {(post.template === "standart" || post.template === "sondakika") && (
          <>
            {post.coverUrl && <CoverImage url={post.coverUrl} title={post.title} />}
            <Prose>
              {post.excerpt && <p style={{ fontWeight: 600, color: "var(--text-strong)" }}>{post.excerpt}</p>}
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </Prose>
          </>
        )}

        <div style={{ marginTop: 32 }}>
          <Button as="a" href="/haberler" variant="secondary" size="sm" leftIcon={<Icon name="arrow-left" size={15} />}>
            Tüm Haberler
          </Button>
        </div>
      </Section>
    </>
  );
}
