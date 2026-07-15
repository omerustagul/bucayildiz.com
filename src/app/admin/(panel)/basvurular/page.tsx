import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ViewHeader, Panel } from "@/components/admin/ui";
import { BasvurularView, type ApplicationRow } from "@/components/admin/BasvurularView";
import { Icon } from "@/lib/icons";

export const metadata: Metadata = { title: "Başvurular" };

function fmtDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function fmtDateTime(d: Date) {
  return `${fmtDate(d)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function BasvurularPage() {
  await requirePermission("basvurular.view");
  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { consents: { orderBy: { documentKey: "asc" } } },
    take: 200,
  });

  // Server tarafında düzleştir (tarih formatı + consent map) → client view'a
  // serileştirilebilir düz veri geçer; filtreleme/renklendirme orada anlık yapılır.
  const rows: ApplicationRow[] = apps.map((a) => ({
    id: a.id,
    athleteName: a.athleteName,
    position: a.position,
    ageGroup: a.ageGroup,
    parentName: a.parentName,
    phone: a.phone,
    email: a.email,
    createdAt: fmtDate(a.createdAt),
    status: a.status,
    consents: a.consents.map((c) => ({
      documentKey: c.documentKey,
      documentTitle: c.documentTitle,
      documentVersion: c.documentVersion,
      granted: c.granted,
      granterName: c.granterName,
      granterRelation: c.granterRelation,
      channel: c.channel,
      textHash: c.textHash,
      ipAddress: c.ipAddress,
      otpVerified: c.otpVerified,
      createdAt: fmtDateTime(c.createdAt),
      withdrawnAt: c.withdrawnAt ? fmtDateTime(c.withdrawnAt) : null,
    })),
  }));

  return (
    <>
      <ViewHeader title="Başvurular" subtitle={`Toplam ${apps.length} başvuru`} />

      <Panel>
        {rows.length === 0 ? (
          <div style={{ padding: "56px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <span style={{ display: "inline-grid", placeItems: "center", width: 56, height: 56, borderRadius: "50%", background: "var(--surface-subtle)", color: "var(--ink-400)", marginBottom: 14 }}>
              <Icon name="inbox" size={26} />
            </span>
            <p style={{ margin: 0, fontSize: 15 }}>Henüz başvuru bulunmuyor.</p>
            <p style={{ margin: "6px 0 0", fontSize: 13 }}>Sitedeki başvuru formundan gelen kayıtlar burada listelenir.</p>
          </div>
        ) : (
          <BasvurularView apps={rows} />
        )}
      </Panel>
    </>
  );
}
