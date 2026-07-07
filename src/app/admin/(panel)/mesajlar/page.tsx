import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AssignmentsAdminView } from "@/components/admin/views/AssignmentsAdminView";

export const metadata: Metadata = { title: "Mesaj & Doküman" };

export default async function MesajlarPage() {
  const [teams, athletes, assignments] = await Promise.all([
    prisma.team.findMany({ orderBy: [{ id: "asc" }], select: { id: true, name: true } }),
    prisma.athlete.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, teamId: true } }),
    prisma.athleteAssignment.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { athlete: { select: { name: true } } },
    }),
  ]);

  return (
    <AssignmentsAdminView
      teams={teams}
      athletes={athletes}
      assignments={assignments.map((a) => ({
        id: a.id,
        kind: a.kind,
        title: a.title,
        body: a.body,
        fileUrl: a.fileUrl,
        readAt: a.readAt ? a.readAt.toISOString() : null,
        createdAt: a.createdAt.toISOString(),
        athleteName: a.athlete.name,
      }))}
    />
  );
}
