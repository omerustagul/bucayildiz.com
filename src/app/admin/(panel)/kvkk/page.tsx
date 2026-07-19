import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ViewHeader } from "@/components/admin/ui";
import { ConsentAuditCell, type ConsentRow } from "@/components/admin/ConsentAuditCell";

export const metadata: Metadata = { title: "KVKK Onay Kayıtları" };

/** Denetim kaydı için tarih+saat (ispat: hangi an). */
function fmtDateTime(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * KVKK rıza denetim izi (D6/D7). Ayrı `kvkk.view` izniyle korunur — roster'ı
 * yöneten herkes IP/rıza izini görmesin (erişim minimizasyonu). Sporcu başına
 * tam kayıt + CSV dışa aktarım (md.11 bilgi talebi / ispat yükü).
 *
 * Not: dönüştürülmüş sporcularda başvuru-anı rızaları `athleteId`'ye taşındığı
 * için sporcu sorgusu TÜM geçmişi kapsar. Başvuru rızaları ayrıca başvurular
 * sayfasında görünür (orası `basvurular` izniyle).
 */
export default async function KvkkPage() {
  await requirePermission("kvkk.view");

  const athletes = await prisma.athlete.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      team: { select: { name: true } },
      consents: { orderBy: { createdAt: "desc" } },
    },
  });

  const rows = athletes.map((a) => ({
    id: a.id,
    name: a.name,
    teamName: a.team.name,
    consents: a.consents.map(
      (c): ConsentRow => ({
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
      }),
    ),
  }));

  const withRecords = rows.filter((r) => r.consents.length > 0).length;

  return (
    <>
      <ViewHeader
        title="KVKK Onay Kayıtları"
        subtitle={`${rows.length} sporcu · ${withRecords} kayıtlı · ispat ve bilgi talebi için`}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
        {rows.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Henüz sporcu yok.</p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                padding: "13px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--surface-card)",
              }}
            >
              {/* min-width:0 → uzun ad 320px'te taşmasın (CLAUDE.md taşma kuralı) */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14.5, color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{r.teamName}</div>
              </div>
              <div style={{ flex: "none" }}>
                <ConsentAuditCell consents={r.consents} exportHref={`/admin/kvkk/consent-export?athleteId=${r.id}`} />
              </div>
            </div>
          ))
        )}
      </div>

      <p style={{ margin: "18px 0 0", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, maxWidth: 720 }}>
        Bu kayıtlar KVKK ispat yükümlülüğü ve md.11 bilgi talepleri içindir. Bir veli kendi kaydını istediğinde
        ilgili sporcunun satırından <strong>CSV indir</strong> ile tam denetim izini (belge, sürüm, hash, onaylayan,
        kanal, tarih, IP) dışa aktarabilirsiniz.
      </p>
    </>
  );
}
