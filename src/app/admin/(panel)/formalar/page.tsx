import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FormalarView, type JerseyRow } from "@/components/admin/views/FormalarView";

export const metadata: Metadata = { title: "Formalar" };

export default async function FormalarPage() {
  const jerseys = await prisma.jersey.findMany({ orderBy: { sort: "asc" } });
  return <FormalarView jerseys={jerseys as JerseyRow[]} />;
}
