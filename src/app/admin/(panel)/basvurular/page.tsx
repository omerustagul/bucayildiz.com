import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ViewHeader, Panel } from "@/components/admin/ui";
import { ApplicationStatusSelect } from "@/components/admin/ApplicationStatusSelect";
import { ApplicationConsentCell } from "@/components/admin/ApplicationConsentCell";
import { Icon } from "@/lib/icons";

export const metadata: Metadata = { title: "Başvurular" };

function fmtDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

const TH: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: 11.5,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  whiteSpace: "nowrap",
};

const TD: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 14,
  color: "var(--text-body)",
  borderTop: "1px solid var(--border-subtle)",
  whiteSpace: "nowrap",
};

function fmtDateTime(d: Date) {
  return `${fmtDate(d)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function BasvurularPage() {
  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { consents: { orderBy: { documentKey: "asc" } } },
  });

  return (
    <>
      <ViewHeader title="Başvurular" subtitle={`Toplam ${apps.length} başvuru`} />

      <Panel>
        {apps.length === 0 ? (
          <div style={{ padding: "56px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <span style={{ display: "inline-grid", placeItems: "center", width: 56, height: 56, borderRadius: "50%", background: "var(--surface-subtle)", color: "var(--ink-400)", marginBottom: 14 }}>
              <Icon name="inbox" size={26} />
            </span>
            <p style={{ margin: 0, fontSize: 15 }}>Henüz başvuru bulunmuyor.</p>
            <p style={{ margin: "6px 0 0", fontSize: 13 }}>Sitedeki başvuru formundan gelen kayıtlar burada listelenir.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}>
              <thead>
                <tr style={{ background: "var(--surface-subtle)" }}>
                  <th style={TH}>Sporcu</th>
                  <th style={TH}>Yaş Grubu</th>
                  <th style={TH}>Veli</th>
                  <th style={TH}>Telefon</th>
                  <th style={TH}>E-posta</th>
                  <th style={TH}>Tarih</th>
                  <th style={TH}>KVKK Onayları</th>
                  <th style={TH}>Durum</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id}>
                    <td style={{ ...TD, fontWeight: 600, color: "var(--text-strong)" }}>
                      {a.athleteName}
                      {a.position && <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> · {a.position}</span>}
                    </td>
                    <td style={TD}>{a.ageGroup}</td>
                    <td style={TD}>{a.parentName}</td>
                    <td style={TD}>{a.phone}</td>
                    <td style={{ ...TD, color: a.email ? "var(--text-body)" : "var(--ink-400)" }}>{a.email || "—"}</td>
                    <td style={{ ...TD, color: "var(--text-muted)" }}>{fmtDate(a.createdAt)}</td>
                    <td style={TD}>
                      <ApplicationConsentCell
                        consents={a.consents.map((c) => ({
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
                        }))}
                      />
                    </td>
                    <td style={TD}>
                      <ApplicationStatusSelect id={a.id} status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
