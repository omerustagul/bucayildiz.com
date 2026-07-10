"use server";

import { redirect } from "next/navigation";
import { destroyPanelSession } from "@/lib/auth";

export async function panelLogout() {
  await destroyPanelSession();
  redirect("/giris");
}
