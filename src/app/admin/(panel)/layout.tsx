import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/giris");
  // Rol + izinler DB'den (güncel/authoritative) — izin değişikliği anında nav'a yansır.
  const [settings, dbUser] = await Promise.all([
    getSettings(),
    prisma.user.findUnique({ where: { id: session.sub }, select: { role: true, permissions: true } }),
  ]);
  return (
    <AdminShell
      user={{ name: session.name, role: dbUser?.role ?? session.role, permissions: dbUser?.permissions ?? [] }}
      mobileNav={settings.mobileNavAdmin}
      logoUrl={settings.logoUrl}
    >
      {children}
    </AdminShell>
  );
}
