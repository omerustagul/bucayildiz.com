import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { KariyerView, type PostingRow, type ApplicationRow } from "@/components/admin/views/KariyerView";

export const metadata: Metadata = { title: "Kariyer" };

export default async function AdminKariyerPage() {
  const [postings, applications] = await Promise.all([
    prisma.jobPosting.findMany({
      orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
      include: { _count: { select: { applications: true } } },
    }),
    prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: { posting: { select: { title: true } } },
    }),
  ]);

  const postingRows: PostingRow[] = postings.map((p) => ({
    id: p.id, title: p.title, department: p.department, location: p.location, employment: p.employment,
    description: p.description, active: p.active, sort: p.sort, appCount: p._count.applications,
  }));
  const appRows: ApplicationRow[] = applications.map((a) => ({
    id: a.id, name: a.name, email: a.email, phone: a.phone, message: a.message, cvUrl: a.cvUrl,
    status: a.status, postingTitle: a.posting?.title ?? null, createdAt: a.createdAt.toISOString(),
  }));

  return <KariyerView postings={postingRows} applications={appRows} />;
}
