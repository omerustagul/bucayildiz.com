import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/content/blocks";
import { prisma } from "@/lib/prisma";
import { JobApplicationForm } from "@/components/forms/JobApplicationForm";

export const metadata: Metadata = { title: "Kariyer" };
export const revalidate = 60;

const EMPLOYMENT_LABEL: Record<string, string> = {
  "full-time": "Tam Zamanlı",
  "part-time": "Yarı Zamanlı",
  stajyer: "Stajyer",
};

export default async function KariyerPage() {
  const postings = await prisma.jobPosting.findMany({
    where: { active: true },
    orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
    select: { id: true, title: true, department: true, location: true, employment: true, description: true },
  });

  return (
    <>
      <PageHero
        kicker="Kariyer"
        title="Ekibimize Katılın"
        lead="Genç yetenekleri birlikte yetiştirmek isteyen tutkulu profesyonelleri kadromuza bekliyoruz."
        breadcrumb={[{ label: "Kurumsal", href: "/kurumsal" }, { label: "Kariyer" }]}
      />
      <Section>
        <div style={{ maxWidth: 760 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 16px" }}>Açık Pozisyonlar</h2>
          {postings.length === 0 ? (
            <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>
              Şu anda yayında açık bir pozisyon bulunmuyor. Yine de aşağıdaki formla genel başvuru yapabilirsiniz.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {postings.map((o) => (
                <div
                  key={o.id}
                  style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "18px 22px", boxShadow: "var(--shadow-sm)" }}
                >
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)" }}>{o.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>
                    {[EMPLOYMENT_LABEL[o.employment] ?? o.employment, o.department, o.location].filter(Boolean).join(" · ")}
                  </div>
                  {o.description && <p style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.6, margin: "10px 0 0", whiteSpace: "pre-wrap" }}>{o.description}</p>}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 34 }}>
            <JobApplicationForm postings={postings.map((p) => ({ id: p.id, title: p.title }))} />
          </div>
        </div>
      </Section>
    </>
  );
}
