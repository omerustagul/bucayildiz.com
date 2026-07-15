import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KadroView, type StaffRow } from "@/components/admin/views/KadroView";

export const metadata: Metadata = { title: "Teknik Ekip & Yönetim" };

export default async function KadroPage() {
  await requirePermission("kadro.view");
  const staff = await prisma.staffMember.findMany({ orderBy: [{ sort: "asc" }, { name: "asc" }] });

  const rows: StaffRow[] = staff.map((s) => ({
    id: s.id,
    name: s.name,
    title: s.title,
    group: s.group,
    licence: s.licence,
    photoUrl: s.photoUrl,
    bio: s.bio,
    sort: s.sort,
  }));

  return <KadroView staff={rows} />;
}
