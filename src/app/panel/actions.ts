"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";

export async function panelLogout() {
  await destroySession();
  redirect("/giris");
}
