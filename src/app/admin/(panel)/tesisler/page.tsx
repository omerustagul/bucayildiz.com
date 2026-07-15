import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TesislerView, type FacilityRow } from "@/components/admin/views/TesislerView";

export const metadata: Metadata = { title: "Tesisler" };

export default async function TesislerPage() {
  await requirePermission("tesisler.view");
  const facilities = await prisma.facility.findMany({ orderBy: [{ sort: "asc" }, { name: "asc" }] });

  const rows: FacilityRow[] = facilities.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description,
    capacity: f.capacity,
    features: f.features,
    photoUrl: f.photoUrl,
    sort: f.sort,
    isPitch: f.isPitch,
  }));

  return <TesislerView facilities={rows} />;
}
