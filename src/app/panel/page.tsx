import type { Metadata } from "next";
import { requireAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AthleteCard } from "@/components/panel/AthleteCard";
import { TrainingCalendar, type CalFixture, type CalTraining } from "@/components/panel/TrainingCalendar";
import { PerformanceMatrix } from "@/components/panel/PerformanceMatrix";
import { PushToggle } from "@/components/panel/PushToggle";
import { ReportCards, QuickAccess, type ReportItem } from "@/components/panel/OverviewSections";
import { measurementsToPerf } from "@/lib/perf";

/** "YYYY-MM-DD" → "12 Tem" gibi kısa Türkçe tarih. */
function fmtShortDate(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  return `${d} ${months[m - 1]}`;
}

export const metadata: Metadata = { title: "Genel Bakış — Sporcu Paneli" };

export default async function PanelDashboard() {
  // requireAthlete: oturum güncel DEĞİLSE (şifre değişimi → tokenVersion, kullanıcı
  // silinmiş vb.) /giris'e yönlendirir. Eski `getPanelSession()! ` deseni bu durumda
  // 500 atıyordu: middleware yalnız EDGE'de JWT imzasına bakar (DB'ye bakmaz), sayfa
  // ise DB kontrolüyle null alırdı; layout'un redirect'i de yetişmez çünkü Next
  // layout ile page'i PARALEL render eder → page'in TypeError'ı redirect'i yener.
  const session = await requireAthlete();
  const athlete = await prisma.athlete.findUnique({
    where: { id: session.athleteId! },
    include: { team: true, measurements: { orderBy: { measuredAt: "asc" } } },
  });
  if (!athlete) return null;

  // Takım antrenmanları + yalnız bu sporcunun katılımcı olduğu bireysel antrenmanlar.
  const [rawTrainings, rawFixtures, unreadCount, pendingPayments] = await Promise.all([
    prisma.training.findMany({
      where: { teamId: athlete.teamId, OR: [{ scope: "team" }, { attendance: { some: { athleteId: athlete.id } } }] },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      include: { drills: { orderBy: { sort: "asc" }, select: { id: true, text: true, done: true } } },
    }),
    // Tüm maçlar (geçmiş dahil) — büyük takvimde geçmişe dönük gezinme için.
    prisma.fixture.findMany({
      orderBy: { date: "asc" },
      select: { id: true, competition: true, opponent: true, isHome: true, date: true, time: true, venue: true, status: true, ourScore: true, oppScore: true },
    }),
    prisma.athleteAssignment.count({ where: { athleteId: athlete.id, readAt: null } }),
    prisma.payment.count({ where: { athleteId: athlete.id, status: { not: "paid" } } }),
  ]);
  const trainings: CalTraining[] = rawTrainings.map((t) => ({
    id: t.id, date: t.date, time: t.time, scope: t.scope, duration: t.duration,
    status: t.status, pitch: t.pitch, notes: t.notes, drills: t.drills,
  }));
  const fixtures: CalFixture[] = rawFixtures;

  const now = new Date();
  const todayYmd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const upcoming = trainings.find((t) => t.date >= todayYmd);
  const initialAnchor = upcoming?.date ?? trainings[0]?.date ?? todayYmd;

  // Rapor kartları: sporcunun ilk bakışta görmesi gerekenler
  const nextFixture = fixtures.find((f) => f.date >= todayYmd && f.status !== "played");
  const lastMeasurement = athlete.measurements.at(-1);
  const reports: ReportItem[] = [
    {
      href: "/panel/antrenmanlar",
      icon: "calendar-days",
      label: "Sıradaki Antrenman",
      value: upcoming ? fmtShortDate(upcoming.date) : "—",
      sub: upcoming ? (upcoming.time || "Saat açıklanacak") : "Planlı antrenman yok",
    },
    {
      href: "/panel/maclar",
      icon: "trophy",
      label: "Sıradaki Maç",
      value: nextFixture ? fmtShortDate(nextFixture.date) : "—",
      sub: nextFixture ? `${nextFixture.isHome ? "vs" : "@"} ${nextFixture.opponent}` : "Planlı maç yok",
    },
    {
      href: "/panel/mesajlar",
      icon: "mail",
      label: "Okunmamış Mesaj",
      value: String(unreadCount),
      sub: unreadCount > 0 ? "Yeni mesajınız var" : "Hepsi okundu",
      accent: unreadCount > 0,
    },
    {
      href: "/panel/performans",
      icon: "heart-pulse",
      label: "Son Ölçüm",
      value: lastMeasurement ? fmtShortDate(lastMeasurement.measuredAt.slice(0, 10)) : "—",
      sub: `${athlete.measurements.length} kayıtlı ölçüm`,
    },
  ];
  // Bekleyen ödeme yalnız varsa gösterilir — gereksiz olumsuz vurgu yapmayız
  if (pendingPayments > 0) {
    reports.push({ href: "/panel/odemeler", icon: "clipboard-list", label: "Bekleyen Ödeme", value: String(pendingPayments), sub: "Ödeme bekleniyor", accent: true });
  }

  return (
    <>
      <AthleteCard
        athlete={{
          name: athlete.name,
          teamName: athlete.team.name,
          position: athlete.position,
          number: athlete.number,
          height: athlete.height,
          weight: athlete.weight,
          foot: athlete.foot,
          licenseNo: athlete.licenseNo,
          birthYear: athlete.birthYear,
          photoUrl: athlete.photoUrl,
        }}
      />
      <PushToggle />
      <ReportCards items={reports} />
      <QuickAccess
        items={[
          { href: "/panel/antrenmanlar", icon: "calendar-days", label: "Antrenmanlar" },
          { href: "/panel/beslenme", icon: "apple", label: "Beslenme" },
          { href: "/panel/mesajlar", icon: "mail", label: "Mesajlar", badge: unreadCount },
          { href: "/panel/performans", icon: "heart-pulse", label: "Performans" },
          { href: "/panel/maclar", icon: "trophy", label: "Maçlar" },
          { href: "/panel/izinler", icon: "shield-check", label: "İzinler" },
          { href: "/panel/odemeler", icon: "clipboard-list", label: "Ödemeler" },
          { href: "/panel/profil", icon: "user-round", label: "Profil" },
        ]}
      />
      <TrainingCalendar trainings={trainings} fixtures={fixtures} todayYmd={todayYmd} initialAnchor={initialAnchor} />
      <PerformanceMatrix perf={measurementsToPerf(athlete.measurements)} />
    </>
  );
}
