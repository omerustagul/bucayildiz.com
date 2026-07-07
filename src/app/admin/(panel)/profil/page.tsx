import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { ViewHeader } from "@/components/admin/kit";
import { AdminProfileView } from "@/components/admin/views/AdminProfileView";

export const metadata: Metadata = { title: "Profilim — Yönetim Paneli" };

export default async function AdminProfilPage() {
  const session = await requireAdmin();

  return (
    <>
      <ViewHeader title="Profilim" subtitle="Hesap bilgileriniz ve şifre yönetimi" />
      <AdminProfileView name={session.name} email={session.email} role={session.role} />
    </>
  );
}
