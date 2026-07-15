import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";

// Build sırasında tüm takımlar statik üretilir; sonradan eklenenler on-demand
// render edilir (dynamicParams varsayılan true).
export async function generateStaticParams() {
  const teams = await prisma.team.findMany({ select: { slug: true } });
  return teams.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findUnique({ where: { slug } });
  return { title: team ? team.name : "Takım" };
}

// KVKK veri minimizasyonu: PUBLIC kadroda çocuğun TAM doğum tarihi değil yalnız
// doğum YILI gösterilir (yaş grubu bağlamı yeterli; tam DOB hassas PII).
function birthYear(d?: string | null) {
  return d ? d.slice(0, 4) : "—";
}
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "BY";
}

const th: React.CSSProperties = { textAlign: "left", padding: "12px 14px", fontSize: 11.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-500)", whiteSpace: "nowrap", background: "var(--ink-50)" };
const td: React.CSSProperties = { padding: "12px 14px", fontSize: 14, color: "var(--ink-700)", borderTop: "1px solid var(--ink-100)", whiteSpace: "nowrap" };
const stat: React.CSSProperties = { fontFamily: "var(--font-stat)", fontWeight: 700, color: "var(--navy-900)" };

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      _count: { select: { athletes: true } },
      // Veri minimizasyonu: yalnız public kadroda gösterilen alanlar — parentPhone,
      // licenseNo gibi kişisel alanlar yetkisiz route'un sorgusuna DAHİL EDİLMEZ.
      athletes: {
        where: { status: "active" },
        orderBy: [{ number: "asc" }, { name: "asc" }],
        select: {
          // Boy/kilo (fiziksel ölçüm) PUBLIC kadrodan çıkarıldı — reşit olmayan
          // sporcularda hassas veri; yalnız panel/admin'de görünür.
          id: true, name: true, position: true, birthDate: true,
          number: true, foot: true, photoUrl: true,
        },
      },
    },
  });
  if (!team) notFound();

  const cover = team.coverImage ?? null;
  const bornLabel = team.born === "Üst yapı" ? "Üst yapı kadrosu" : team.born ? `${team.born} doğumlular` : "";
  const meta = [`${team._count.athletes} sporcu`, bornLabel, team.coach].filter(Boolean).join("  ·  ");

  return (
    <>
      {cover ? (
        <section
          style={{
            background: `linear-gradient(90deg, rgba(8,18,38,.9), rgba(8,18,38,.5) 55%, rgba(8,18,38,.22)), linear-gradient(to top, rgba(8,18,38,.92), rgba(8,18,38,0) 55%), center/cover no-repeat url("${cover}")`,
            borderBottom: "3px solid var(--gold-500)",
          }}
        >
          <div style={{ maxWidth: 1680, margin: "0 auto", padding: "clamp(72px, 15vw, 150px) clamp(16px, 5vw, 32px) 30px", color: "#fff" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-400)" }}>
              <span style={{ width: 22, height: 2, background: "var(--gold-500)" }} /> Akademi · Kadro
            </span>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 0.98, textTransform: "uppercase", color: "#fff", margin: "12px 0 10px" }}>{team.name}</h1>
            <div style={{ fontSize: 14.5, color: "var(--navy-100)" }}>{meta}</div>
          </div>
        </section>
      ) : (
        <PageHero kicker="Akademi · Kadro" title={team.name} lead={meta} breadcrumb={[{ label: "Takımlar", href: "/takimlar" }, { label: team.name }]} />
      )}

      <Section>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--text-h3)", textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 18px" }}>Kadro</h2>
        {team.athletes.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--ink-400)", fontSize: 15, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", background: "var(--surface-card)" }}>
            Bu takımda henüz aktif sporcu yok.
          </div>
        ) : (
          <>
            {/* Masaüstü/tablet (≥900px): tablo — bkz. globals.css .by-squad-table */}
            <div className="by-squad-table" style={{ overflowX: "auto", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", background: "var(--surface-card)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr>
                    <th style={th}>Sporcu</th>
                    <th style={th}>Mevki</th>
                    <th style={th}>Doğum Yılı</th>
                    <th style={{ ...th, textAlign: "center" }}>Forma No</th>
                    <th style={{ ...th, textAlign: "center" }}>Ayak</th>
                  </tr>
                </thead>
                <tbody>
                  {team.athletes.map((a) => (
                    <tr key={a.id}>
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <span style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", overflow: "hidden", background: "var(--navy-50)", border: "1px solid var(--border-subtle)", display: "grid", placeItems: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--navy-600)", position: "relative" }}>
                            {a.photoUrl ? <Image src={a.photoUrl} alt="" fill sizes="36px" style={{ objectFit: "cover" }} /> : initials(a.name)}
                          </span>
                          <span style={{ fontWeight: 600, color: "var(--text-strong)" }}>{a.name}</span>
                        </div>
                      </td>
                      <td style={td}>{a.position || "—"}</td>
                      <td style={td}>{birthYear(a.birthDate)}</td>
                      <td style={{ ...td, textAlign: "center" }}>{a.number != null ? <span style={stat}>#{a.number}</span> : "—"}</td>
                      <td style={{ ...td, textAlign: "center" }}>{a.foot || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobil (<900px): kart listesi — yatay kaydırma yerine dikey akış, bkz. globals.css .by-squad-cards */}
            <div className="by-squad-cards">
              {team.athletes.map((a) => (
                <div className="by-squad-card" key={a.id}>
                  <div className="by-squad-card-head">
                    <span style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", overflow: "hidden", background: "var(--navy-50)", border: "1px solid var(--border-subtle)", display: "grid", placeItems: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13, color: "var(--navy-600)", position: "relative" }}>
                      {a.photoUrl ? <Image src={a.photoUrl} alt="" fill sizes="36px" style={{ objectFit: "cover" }} /> : initials(a.name)}
                    </span>
                    <span className="by-squad-card-name">{a.name}</span>
                    <span className="by-squad-card-number">{a.number != null ? `#${a.number}` : "—"}</span>
                  </div>
                  <div className="by-squad-card-grid">
                    <div className="by-squad-card-field">
                      <span className="by-squad-card-label">Mevki</span>
                      <span className="by-squad-card-value">{a.position || "—"}</span>
                    </div>
                    <div className="by-squad-card-field">
                      <span className="by-squad-card-label">Doğum Yılı</span>
                      <span className="by-squad-card-value">{birthYear(a.birthDate)}</span>
                    </div>
                    <div className="by-squad-card-field">
                      <span className="by-squad-card-label">Ayak</span>
                      <span className="by-squad-card-value">{a.foot || "—"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>

      <Section background="subtle">
        <Prose>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "var(--text-h3)", textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Teknik Sorumlu</h2>
          <p>
            <strong>{team.coach || "—"}</strong> yönetimindeki {team.name}, akademimizin gelişim felsefesi doğrultusunda haftalık antrenman ve maç programını sürdürmektedir.
          </p>
        </Prose>
      </Section>
    </>
  );
}
