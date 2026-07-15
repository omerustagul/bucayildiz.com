import { redirect } from "next/navigation";
import { getAdminSession, getAdminPermissions } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/giris");
  // Rol + izinler DB'den (güncel/authoritative) — izin değişikliği anında nav'a yansır.
  // getAdminPermissions cache()'li: sayfa/action aynı istekte kullanıcıyı TEKRAR sorgulamaz.
  const [settings, perms] = await Promise.all([getSettings(), getAdminPermissions()]);
  return (
    <AdminShell
      user={{ name: session.name, role: perms?.role ?? session.role, permissions: perms?.permissions ?? [] }}
      mobileNav={settings.mobileNavAdmin}
      logoUrl={settings.logoUrl}
    >
      {children}
    </AdminShell>
  );
}
