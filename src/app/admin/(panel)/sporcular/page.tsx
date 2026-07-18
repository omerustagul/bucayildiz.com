import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { photoConsentedAthleteIds } from "@/lib/consent.server";
import { AthletesView, type AthleteRow } from "@/components/admin/views/AthletesView";

export const metadata: Metadata = { title: "Sporcular" };

export default async function SporcularPage() {
  await requirePermission("sporcular.view");
  const [athletes, teams] = await Promise.all([
    prisma.athlete.findMany({ include: { team: true, user: true }, orderBy: [{ team: { sort: "asc" } }, { name: "asc" }] }),
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
  ]);
  // Foto-video rızası: fotoğrafın PUBLIC kadroda görünüp görünmeyeceğini belirler.
  // Yönetici formda bunu görsün ki foto yükleyip "neden görünmüyor" diye şaşırmasın.
  const photoOk = await photoConsentedAthleteIds(athletes.map((a) => a.id));

  const rows: AthleteRow[] = athletes.map((a) => ({
    id: a.id,
    name: a.name,
    teamId: a.teamId,
    teamName: a.team.name,
    position: a.position,
    number: a.number,
    height: a.height,
    weight: a.weight,
    birthDate: a.birthDate,
    foot: a.foot,
    status: a.status,
    licenseNo: a.licenseNo,
    photoUrl: a.photoUrl,
    parentName: a.parentName,
    parentPhone: a.parentPhone,
    hasLogin: !!a.user,
    username: a.user?.username ?? null,
    photoConsent: photoOk.has(a.id),
  }));

  return <AthletesView athletes={rows} teams={teams} />;
}
