import type { Metadata } from "next";
import { requireAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssignmentsPanelView, type PanelAssignment } from "@/components/panel/AssignmentsPanelView";

export const metadata: Metadata = { title: "Mesajlar — Sporcu Paneli" };

export default async function PanelMesajlar() {
  // requireAthlete: oturum bayatsa (şifre değişimi vb.) 500 yerine /giris'e yönlendirir.
  const session = await requireAthlete();
  const athleteId = session.athleteId!;

  const rawAssignments = await prisma.athleteAssignment.findMany({
    where: { athleteId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const assignments: PanelAssignment[] = rawAssignments.map((a) => ({
    id: a.id,
    kind: a.kind,
    title: a.title,
    body: a.body,
    fileUrl: a.fileUrl,
    readAt: a.readAt ? a.readAt.toISOString() : null,
    createdAt: a.createdAt.toISOString(),
  }));

  return <AssignmentsPanelView assignments={assignments} />;
}
