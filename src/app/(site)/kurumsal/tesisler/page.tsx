import { getPageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { trSlug } from "@/lib/slug";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/lib/icons";

export const generateMetadata = () => getPageMetadata("/kurumsal/tesisler");

export default async function TesislerPage() {
  const facilities = await prisma.facility.findMany({ orderBy: [{ sort: "asc" }, { name: "asc" }] });

  return (
    <>
      <PageHero
        kicker="Tesisler"
        title="Antrenman Tesislerimiz"
        lead="Sporcularımızın gelişimi için tasarlanmış modern saha ve gelişim alanları."
        breadcrumb={[{ label: "Kurumsal", href: "/kurumsal" }, { label: "Tesisler" }]}
      />
      <Section>
        <Prose>
          <p>
            Buca Yıldız Tesisleri; hibrit çim antrenman sahaları, kondisyon ve gelişim salonları ile sporcularımıza
            her mevsim kesintisiz çalışma imkânı sunar. Tüm alanlarımız yaş gruplarına uygun güvenlik standartlarında
            tasarlanmıştır.
          </p>
        </Prose>
        {facilities.length === 0 ? (
          <p style={{ marginTop: 28, color: "var(--text-muted)" }}>Henüz içerik eklenmedi.</p>
        ) : (
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {facilities.map((f) => {
              const features = f.features
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean);
              // Kartın TAMAMI detay sayfasına link — foto/konum/açıklama orada.
              // (Haritayı karta gömüp kartı da linke sarmak iç-içe interaktif çakışması
              //  yaratırdı; harita detay sayfasında tam genişlik gösterilir.)
              return (
                <Link
                  key={f.id}
                  href={`/kurumsal/tesisler/${trSlug(f.name)}`}
                  className="link-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ position: "relative", aspectRatio: "16 / 10", background: "var(--grad-navy)", display: "grid", placeItems: "center" }}>
                    {f.photoUrl ? (
                      <Image src={f.photoUrl} alt="" fill style={{ objectFit: "cover" }} sizes="(max-width: 600px) 100vw, 400px" />
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.08)", fontFamily: "var(--font-heading)", fontSize: 96 }}>★</span>
                    )}
                    {f.latitude != null && f.longitude != null && (
                      <span style={{ position: "absolute", top: 12, right: 12, display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: "var(--radius-pill)", background: "rgba(8,18,38,0.72)", color: "#fff", fontSize: 12, fontWeight: 600, backdropFilter: "blur(4px)" }}>
                        <Icon name="map-pin" size={13} /> Konumlu
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 19, textTransform: "uppercase", color: "var(--text-strong)", margin: 0, minWidth: 0 }}>{f.name}</h3>
                      {f.capacity && <Badge tone="gold" style={{ flex: "none" }}>{f.capacity}</Badge>}
                    </div>
                    {f.description && <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>{f.description}</p>}
                    {features.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 6 }}>
                        {features.map((ft) => (
                          <Badge key={ft} tone="neutral">{ft}</Badge>
                        ))}
                      </div>
                    )}
                    <span style={{ marginTop: "auto", paddingTop: 8, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "var(--text-link)" }}>
                      Detayları gör <Icon name="arrow-right" size={15} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
