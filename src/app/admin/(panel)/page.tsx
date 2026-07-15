import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getAdminPermissions } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { DashboardView } from "@/components/admin/views/DashboardView";

export const metadata: Metadata = { title: "Genel Bakış" };

export default async function DashboardPage() {
  // Genel Bakış HER yöneticiye açıktır (izin katalogunda yok) — ANCAK sporcu verisi,
  // özellikle SAKATLIK (KVKK'da özel nitelikli SAĞLIK verisi), yalnız `sporcular.view`
  // iznine sahip yöneticiye gösterilir. Yetkisiz rol (ör. içerik editörü) sporcu
  // listesi sayfasını göremiyorken burada sakatlık durumunu görmemeli.
  // Yetki yoksa sorgu HİÇ ÇALIŞTIRILMAZ (veri sunucuda da toplanmaz).
  const perms = await getAdminPermissions();
  const canSeeAthletes = !!perms && hasPermission(perms.role, perms.permissions, "sporcular.view");

  const [athletes, teamsCount, trainings, injured, teams, upcomingFx, featuredAthletes] = await Promise.all([
    prisma.athlete.count(),
    prisma.team.count(),
    prisma.training.count(),
    canSeeAthletes ? prisma.athlete.count({ where: { status: "injured" } }) : Promise.resolve<number | null>(null),
    prisma.team.findMany({ orderBy: { sort: "asc" }, include: { _count: { select: { athletes: true } } } }),
    prisma.fixture.findMany({ where: { status: "upcoming" }, orderBy: { date: "asc" }, take: 3 }),
    canSeeAthletes ? prisma.athlete.findMany({ include: { team: true }, orderBy: { createdAt: "desc" }, take: 6 }) : Promise.resolve([]),
  ]);

  const maxCount = Math.max(0, ...teams.map((t) => t._count.athletes));
  const bars = teams.map((t) => ({ name: t.name, count: t._count.athletes, highlight: t._count.athletes === maxCount && maxCount > 0 }));

  const upcoming = upcomingFx.map((f) => ({
    id: f.id,
    day: f.date.slice(8),
    competition: f.competition,
    time: f.time,
    home: f.isHome ? "Buca Yıldız" : f.opponent,
    away: f.isHome ? f.opponent : "Buca Yıldız",
  }));

  // null = yetkisiz → DashboardView "Öne Çıkan Sporcular" panelini HİÇ göstermez
  // (boş liste ile karıştırılmasın diye açıkça null).
  const featured = canSeeAthletes
    ? featuredAthletes.map((a) => ({
      id: a.id,
      name: a.name,
      number: a.number,
      position: a.position,
      teamName: a.team.name,
      status: a.status,
      photoUrl: a.photoUrl,
    }))
    : null;

  const today = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <DashboardView
      stats={{ athletes, teams: teamsCount, trainings, injured }}
      bars={bars}
      upcoming={upcoming}
      featured={featured}
      today={today}
    />
  );
}
