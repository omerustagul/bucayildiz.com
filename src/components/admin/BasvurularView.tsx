"use client";

import { useState } from "react";
import { ApplicationStatusSelect } from "@/components/admin/ApplicationStatusSelect";
import { ApplicationConsentCell, type ConsentRow } from "@/components/admin/ApplicationConsentCell";
import { CardList, DataCard, CardHeader, CardFields, CardActions } from "@/components/admin/MobileCardList";
import { APPLICATION_STATUSES, applicationStatusMeta } from "@/lib/applicationStatus";

/** Sayfadan (server) gelen düzleştirilmiş, serileştirilebilir başvuru satırı. */
export type ApplicationRow = {
  id: string;
  athleteName: string;
  position: string | null;
  ageGroup: string;
  parentName: string;
  phone: string;
  email: string | null;
  createdAt: string; // önceden formatlanmış (dd.mm.yyyy)
  status: string;
  consents: ConsentRow[];
};

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

/**
 * Başvurular tablosu + mobil kartlar. Faz 4: (1) duruma göre filtre sekmeleri
 * (client-side, anlık + canlı sayaç), (2) her satır/kart durum rengine bürünür.
 * Durum meta'sı (etiket + renk) tek kaynaktan: lib/applicationStatus.
 */
export function BasvurularView({ apps }: { apps: ApplicationRow[] }) {
  const [filter, setFilter] = useState<string>("all");

  // Durum sayaçları — sekmelerde canlı gösterilir.
  const counts: Record<string, number> = {};
  for (const a of apps) counts[a.status] = (counts[a.status] ?? 0) + 1;

  const shown = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  const tabs = [
    { value: "all", label: "Tümü", accent: "var(--navy-700)", count: apps.length },
    ...APPLICATION_STATUSES.map((s) => ({ value: s.value, label: s.label, accent: s.accent, count: counts[s.value] ?? 0 })),
  ];

  return (
    <>
      {/* Filtre sekmeleri */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
        {tabs.map((t) => {
          const active = filter === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setFilter(t.value)}
              aria-pressed={active}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 13px",
                borderRadius: "var(--radius-pill)",
                border: `1px solid ${active ? "var(--navy-700)" : "var(--border-subtle)"}`,
                background: active ? "var(--navy-700)" : "var(--surface-card)",
                color: active ? "#fff" : "var(--text-body)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "background var(--dur-fast), border-color var(--dur-fast), color var(--dur-fast)",
              }}
            >
              {t.value !== "all" && <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent, flex: "none" }} />}
              {t.label}
              <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 12, opacity: active ? 0.85 : 0.55 }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Bu durumda başvuru yok.</div>
      ) : (
        <>
          {/* Desktop tablo */}
          <div className="adm-table-wrap">
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
                  {shown.map((a) => {
                    const meta = applicationStatusMeta(a.status);
                    return (
                      <tr key={a.id} style={{ background: meta.tint }}>
                        <td style={{ ...TD, fontWeight: 600, color: "var(--text-strong)", boxShadow: `inset 3px 0 0 0 ${meta.accent}` }}>
                          {a.athleteName}
                          {a.position && <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> · {a.position}</span>}
                        </td>
                        <td style={TD}>{a.ageGroup}</td>
                        <td style={TD}>{a.parentName}</td>
                        <td style={TD}>{a.phone}</td>
                        <td style={{ ...TD, color: a.email ? "var(--text-body)" : "var(--ink-400)" }}>{a.email || "—"}</td>
                        <td style={{ ...TD, color: "var(--text-muted)" }}>{a.createdAt}</td>
                        <td style={TD}>
                          <ApplicationConsentCell consents={a.consents} />
                        </td>
                        <td style={TD}>
                          <ApplicationStatusSelect id={a.id} status={a.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobil kartlar */}
          <CardList style={{ padding: 14 }}>
            {shown.map((a) => {
              const meta = applicationStatusMeta(a.status);
              return (
                <DataCard key={a.id} style={{ background: meta.tint, borderLeft: `3px solid ${meta.accent}` }}>
                  <CardHeader
                    title={
                      <>
                        {a.athleteName}
                        {a.position && <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> · {a.position}</span>}
                      </>
                    }
                    subtitle={a.ageGroup}
                    badge={<ApplicationStatusSelect id={a.id} status={a.status} />}
                  />
                  <CardFields
                    items={[
                      { label: "Veli", value: a.parentName },
                      { label: "Telefon", value: a.phone },
                      { label: "E-posta", value: a.email || "—" },
                      { label: "Tarih", value: a.createdAt },
                    ]}
                  />
                  <CardActions>
                    <ApplicationConsentCell consents={a.consents} />
                  </CardActions>
                </DataCard>
              );
            })}
          </CardList>
        </>
      )}
    </>
  );
}
