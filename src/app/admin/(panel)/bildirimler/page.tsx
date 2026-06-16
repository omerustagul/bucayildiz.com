import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ViewHeader, Panel } from "@/components/admin/ui";
import { NotificationComposer } from "@/components/admin/NotificationComposer";

export const metadata: Metadata = { title: "Bildirimler" };

export default async function BildirimlerPage() {
  const [teams, totalSubs, subs] = await Promise.all([
    prisma.team.findMany({ orderBy: { sort: "asc" } }),
    prisma.pushSubscription.count(),
    prisma.pushSubscription.findMany({ where: { athleteId: { not: null } }, select: { athlete: { select: { teamId: true } } } }),
  ]);

  const byTeam = new Map<string, number>();
  for (const s of subs) {
    const tid = s.athlete?.teamId;
    if (tid) byTeam.set(tid, (byTeam.get(tid) ?? 0) + 1);
  }

  const teamData = teams.map((t) => ({ id: t.id, name: t.name, subCount: byTeam.get(t.id) ?? 0 }));

  return (
    <>
      <ViewHeader title="Bildirimler" subtitle="Sporcu ve velilere anlık push bildirimi gönderin" />
      <Panel>
        <NotificationComposer teams={teamData} totalSubs={totalSubs} />
      </Panel>
    </>
  );
}
