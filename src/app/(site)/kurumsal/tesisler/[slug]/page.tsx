import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { trSlug } from "@/lib/slug";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/lib/icons";
import { LocationMap } from "@/components/ui/LeafletMap";

/** Tesis, DB'de slug taşımaz → ad'dan türetilen slug ile eşleştirilir (trSlug). */
async function findBySlug(slug: string) {
  const all = await prisma.facility.findMany({ orderBy: [{ sort: "asc" }, { name: "asc" }] });
  return all.find((f) => trSlug(f.name) === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = await findBySlug(slug);
  return { title: f ? `${f.name} — Tesisler` : "Tesis" };
}

export default async function TesisDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await findBySlug(slug);
  if (!f) notFound();

  const features = f.features.split(",").map((x) => x.trim()).filter(Boolean);
  const hasMap = f.latitude != null && f.longitude != null;

  return (
    <>
      <PageHero
        kicker="Tesisler"
        title={f.name}
        lead={f.description || "Buca Yıldız antrenman tesisi."}
        breadcrumb={[
          { label: "Kurumsal", href: "/kurumsal" },
          { label: "Tesisler", href: "/kurumsal/tesisler" },
          { label: f.name },
        ]}
      />

      <Section>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          {/* Büyük foto (varsa) */}
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              background: "var(--grad-navy)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {f.photoUrl ? (
              <Image src={f.photoUrl} alt={f.name} fill priority style={{ objectFit: "cover" }} sizes="(max-width: 1000px) 100vw, 980px" />
            ) : (
              <span style={{ color: "rgba(255,255,255,0.08)", fontFamily: "var(--font-heading)", fontSize: 140 }}>★</span>
            )}
          </div>

          {/* Kapasite + açıklama + özellikler */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {f.capacity && <Badge tone="gold">{f.capacity}</Badge>}
              {f.isPitch && <Badge tone="neutral">Antrenman sahası</Badge>}
            </div>

            {f.description && (
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-body)", margin: 0 }}>{f.description}</p>
            )}

            {features.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)", margin: "0 0 12px" }}>
                  Özellikler
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {features.map((ft) => (
                    <Badge key={ft} tone="neutral">{ft}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tam genişlik harita (konum girilmişse) */}
          {hasMap && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-700)", margin: "0 0 12px" }}>
                Konum
              </h2>
              <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                <LocationMap lat={f.latitude!} lng={f.longitude!} height={380} />
              </div>
            </div>
          )}

          <div>
            <Link
              href="/kurumsal/tesisler"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--text-link)", textDecoration: "none" }}
            >
              <Icon name="arrow-left" size={16} /> Tüm tesisler
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
