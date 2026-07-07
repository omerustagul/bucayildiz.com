import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/giris");
  const settings = await getSettings();
  return (
    <AdminShell user={{ name: session.name, role: session.role }} mobileNav={settings.mobileNavAdmin}>
      {children}
    </AdminShell>
  );
}
