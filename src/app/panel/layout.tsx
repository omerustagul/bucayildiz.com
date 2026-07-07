import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PanelShell } from "@/components/panel/PanelShell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/giris");
  if (!session.athleteId) redirect("/admin");

  const [athlete, unreadCount] = await Promise.all([
    prisma.athlete.findUnique({ where: { id: session.athleteId }, include: { team: true } }),
    prisma.athleteAssignment.count({ where: { athleteId: session.athleteId, readAt: null } }),
  ]);
  if (!athlete) redirect("/giris");

  return (
    <PanelShell
      athlete={{
        name: athlete.name,
        teamName: athlete.team.name,
        number: athlete.number,
        position: athlete.position,
        photoUrl: athlete.photoUrl,
      }}
      unreadCount={unreadCount}
    >
      {children}
    </PanelShell>
  );
}
