import type { Metadata } from "next";
import { getPanelSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveConsentDocuments } from "@/lib/consent.server";
import { ConsentManager, type ConsentItem } from "@/components/panel/ConsentManager";

export const metadata: Metadata = { title: "İzinler & Onaylar — Sporcu Paneli" };

function fmt(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

export default async function IzinlerPage() {
  const session = await getPanelSession();
  const athleteId = session!.athleteId!;

  const [docs, records] = await Promise.all([
    getActiveConsentDocuments(),
    prisma.consentRecord.findMany({ where: { athleteId }, orderBy: { createdAt: "desc" } }),
  ]);

  // Her belge için en son kayıt = güncel durum.
  const latest = new Map<string, (typeof records)[number]>();
  for (const r of records) if (!latest.has(r.documentKey)) latest.set(r.documentKey, r);

  const items: ConsentItem[] = docs.map((d) => {
    const r = latest.get(d.key);
    return {
      key: d.key,
      title: d.title,
      summary: d.summary,
      required: d.required,
      isConsent: d.isConsent,
      version: d.version,
      granted: r ? r.granted : false,
      updatedAt: r ? fmt(r.createdAt) : null,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>İzinler & Onaylar</h2>
        <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: "6px 0 0", lineHeight: 1.5 }}>
          KVKK kapsamında verdiğiniz onayları buradan görüntüleyebilir, opsiyonel olanları yönetebilirsiniz.
        </p>
      </div>
      <ConsentManager items={items} />
    </div>
  );
}
