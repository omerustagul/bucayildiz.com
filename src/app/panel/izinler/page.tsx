import type { Metadata } from "next";
import { requireAthlete } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveConsentDocuments } from "@/lib/consent.server";
import { ConsentManager, type ConsentItem } from "@/components/panel/ConsentManager";

export const metadata: Metadata = { title: "İzinler & Onaylar — Sporcu Paneli" };

function fmt(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

export default async function IzinlerPage() {
  // requireAthlete: oturum bayatsa (şifre değişimi vb.) 500 yerine /giris'e yönlendirir.
  const session = await requireAthlete();
  const athleteId = session.athleteId!;

  const [docs, records] = await Promise.all([
    getActiveConsentDocuments(),
    prisma.consentRecord.findMany({ where: { athleteId }, orderBy: { createdAt: "desc" } }),
  ]);

  // records createdAt DESC → her belgenin ilk kaydı = güncel durum; tümü = geçmiş.
  const latest = new Map<string, (typeof records)[number]>();
  const byDoc = new Map<string, typeof records>();
  for (const r of records) {
    if (!latest.has(r.documentKey)) latest.set(r.documentKey, r);
    (byDoc.get(r.documentKey) ?? byDoc.set(r.documentKey, []).get(r.documentKey)!).push(r);
  }

  // Bir rıza olayının insan-dostu etiketi (veli'ye hash/IP GÖSTERİLMEZ — sade).
  const eventLabel = (r: (typeof records)[number], isConsent: boolean) =>
    r.withdrawnAt ? "Geri alındı" : r.granted ? (isConsent ? "Verildi" : "Okundu") : "Reddedildi";

  const items: ConsentItem[] = docs.map((d) => {
    const r = latest.get(d.key);
    const events = byDoc.get(d.key) ?? [];
    return {
      key: d.key,
      title: d.title,
      summary: d.summary,
      required: d.required,
      isConsent: d.isConsent,
      version: d.version,
      granted: r ? r.granted : false,
      updatedAt: r ? fmt(r.createdAt) : null,
      // Geçmiş: yeni→eski. Tek olay varsa güncel durumla aynı → gösterme (>1 anlamlı).
      history: events.map((e) => ({ label: eventLabel(e, d.isConsent), date: fmt(e.createdAt) })),
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
