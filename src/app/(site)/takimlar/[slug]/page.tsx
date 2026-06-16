import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose, StatStrip } from "@/components/content/blocks";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findUnique({ where: { slug } });
  return { title: team ? team.name : "Takım" };
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({ where: { slug }, include: { _count: { select: { athletes: true } } } });
  if (!team) notFound();

  const born = team.born === "Üst yapı" ? "Üst yapı" : team.born;

  return (
    <>
      <PageHero kicker="Akademi" title={team.name} breadcrumb={[{ label: "Takımlar", href: "/takimlar" }, { label: team.name }]} />
      <Section>
        <StatStrip
          stats={[
            { value: String(team._count.athletes), label: "Sporcu" },
            { value: born || "—", label: "Doğum Yılı" },
            { value: team.short, label: "Kategori" },
          ]}
        />
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
