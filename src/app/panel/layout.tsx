import { redirect } from "next/navigation";
import { getPanelSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { PanelShell } from "@/components/panel/PanelShell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getPanelSession();
  if (!session?.athleteId) redirect("/giris");

  const [athlete, unreadCount, settings] = await Promise.all([
    prisma.athlete.findUnique({ where: { id: session.athleteId }, include: { team: true } }),
    prisma.athleteAssignment.count({ where: { athleteId: session.athleteId, readAt: null } }),
    getSettings(),
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
      mobileNav={settings.mobileNavPanel}
    >
      {children}
    </PanelShell>
  );
}
