import type { Metadata } from "next";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ViewHeader } from "@/components/admin/ui";
import { KullanicilarView, type AdminUserRow, type AuditRow } from "@/components/admin/KullanicilarView";

export const metadata: Metadata = { title: "Yöneticiler & Yetkiler" };

function fmtDateTime(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Owner-exclusive yönetici & yetki yönetimi (requireOwner). Server tarafında düz
 *  veri hazırlanır → client view CRUD + izin matrisi + denetim izini gösterir. */
export default async function KullanicilarPage() {
  const session = await requireOwner();
  const [users, audit] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["owner", "admin"] } },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, username: true, role: true, permissions: true, createdAt: true },
    }),
    prisma.adminAuditLog.findMany({ orderBy: { createdAt: "desc" }, take: 40 }),
  ]);
  const ownerCount = users.filter((u) => u.role === "owner").length;
  const userRows: AdminUserRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    username: u.username,
    role: u.role,
    permissions: u.permissions,
    createdAt: fmtDateTime(u.createdAt),
  }));
  const auditRows: AuditRow[] = audit.map((a) => ({
    id: a.id,
    actorName: a.actorName,
    action: a.action,
    targetName: a.targetName,
    detail: a.detail,
    createdAt: fmtDateTime(a.createdAt),
  }));

  return (
    <>
      <ViewHeader title="Yöneticiler & Yetkiler" subtitle={`${userRows.length} yönetici · yalnız Sahip erişebilir`} />
      <KullanicilarView currentUserId={session.sub} ownerCount={ownerCount} users={userRows} audit={auditRows} />
    </>
  );
}
