"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApplicationStatusSelect } from "@/components/admin/ApplicationStatusSelect";
import { ApplicationConsentCell, type ConsentRow } from "@/components/admin/ApplicationConsentCell";
import { CardList, DataCard, CardHeader, CardFields, CardActions } from "@/components/admin/MobileCardList";
import { Modal, TextInput } from "@/components/admin/controls";
import { Field } from "@/components/admin/kit";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { APPLICATION_STATUSES, applicationStatusMeta } from "@/lib/applicationStatus";
import { createAthleteFromApplication } from "@/app/admin/(panel)/basvurular/actions";

export type TeamOption = { id: string; name: string };

/** Sayfadan (server) gelen düzleştirilmiş, serileştirilebilir başvuru satırı. */
export type ApplicationRow = {
  id: string;
  athleteName: string;
  position: string | null;
  ageGroup: string;
  birthDate: string; // "YYYY-MM-DD"
  /** Dönüşüm yapıldıysa oluşan sporcu — varsa eylem gizlenir, link gösterilir. */
  athlete: { id: string; name: string } | null;
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

/** Başvurudan sporcu oluşturma formu. Takım ZORUNLU (Athlete.teamId zorunlu,
 *  başvuruda takım yok — yalnız ageGroup); kalan alanlar başvurudan taşınır. */
function ConvertModal({ app, teams, onClose }: { app: ApplicationRow; teams: TeamOption[]; onClose: () => void }) {
  const router = useRouter();
  // ageGroup ("U-16" / "A Takım") takım ADIYLA birebir eşleşir
  // (validation.ts ageGroupFromBirthDate ↔ takım adları) → ön-seçim. Eşleşmezse boş.
  const [teamId, setTeamId] = useState(() => teams.find((t) => t.name === app.ageGroup)?.id ?? "");
  const [number, setNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await createAthleteFromApplication(app.id, {
        teamId,
        number: number.trim() ? Number(number) : null,
      });
      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  };

  const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, minWidth: 0 };
  const val: React.CSSProperties = { color: "var(--text-strong)", fontWeight: 600, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 };

  return (
    <Modal
      open
      onClose={onClose}
      title="Başvurudan Sporcu Oluştur"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={pending}>İptal</Button>
          <Button variant="primary" size="sm" onClick={submit} disabled={pending || !teamId}>
            {pending ? "Oluşturuluyor…" : "Sporcu Oluştur"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Başvurudan taşınacak alanlar — salt okunur (düzeltme sporcu ekranında) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, padding: "12px 14px", borderRadius: "var(--radius-md)", background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)" }}>
          <div style={row}><span style={{ color: "var(--text-muted)" }}>Sporcu</span><span style={val}>{app.athleteName}</span></div>
          <div style={row}><span style={{ color: "var(--text-muted)" }}>Doğum Tarihi</span><span style={val}>{app.birthDate}</span></div>
          <div style={row}><span style={{ color: "var(--text-muted)" }}>Yaş Grubu</span><span style={val}>{app.ageGroup}</span></div>
          <div style={row}><span style={{ color: "var(--text-muted)" }}>Mevki</span><span style={val}>{app.position || "—"}</span></div>
          <div style={row}><span style={{ color: "var(--text-muted)" }}>Veli</span><span style={val}>{app.parentName}</span></div>
          <div style={row}><span style={{ color: "var(--text-muted)" }}>Telefon</span><span style={val}>{app.phone}</span></div>
        </div>

        <Select
          label="Takım"
          required
          placeholder="Takım seç"
          options={teams.map((t) => ({ value: t.id, label: t.name }))}
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          hint="Yaş grubuna uyan takım ön-seçili — antrenör kararına göre değiştirebilirsiniz."
        />
        <Field label="Forma No">
          <TextInput inputMode="numeric" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Opsiyonel" />
        </Field>

        {/* KVKK: yönetici ne olacağını bilerek onaylasın */}
        <div style={{ display: "flex", gap: 9, padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--surface-subtle)", fontSize: 12.5, lineHeight: 1.45, color: "var(--ink-700)" }}>
          <span style={{ flex: "none", display: "inline-flex", color: "var(--navy-600)" }}><Icon name="shield-check" size={16} /></span>
          <span style={{ minWidth: 0 }}>
            Başvurudaki <strong>KVKK rıza kayıtları</strong> (foto-video dahil) sporcuya bağlanacak — denetim izi (tarih, IP, veli) korunur.
          </span>
        </div>

        {error && (
          <div style={{ padding: "10px 12px", borderRadius: "var(--radius-md)", background: "var(--amber-100)", border: "1px solid var(--amber-600)", fontSize: 13, color: "var(--ink-800)" }}>{error}</div>
        )}
      </div>
    </Modal>
  );
}

/** Satır/kartta: dönüşmüşse sporcuya link, değilse (ve yetki varsa) eylem. */
function ConvertCell({ app, teams, canConvert }: { app: ApplicationRow; teams: TeamOption[]; canConvert: boolean }) {
  const [open, setOpen] = useState(false);

  if (app.athlete) {
    return (
      <Link href="/admin/sporcular" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--navy-700)", textDecoration: "none", minWidth: 0 }}>
        <Icon name="user-round" size={14} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.athlete.name}</span>
      </Link>
    );
  }
  if (!canConvert) return <span style={{ color: "var(--ink-400)", fontSize: 13 }}>—</span>;

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)} leftIcon={<Icon name="user-round" size={14} />}>
        Sporcu Oluştur
      </Button>
      {open && <ConvertModal app={app} teams={teams} onClose={() => setOpen(false)} />}
    </>
  );
}

/**
 * Başvurular tablosu + mobil kartlar. Faz 4: (1) duruma göre filtre sekmeleri
 * (client-side, anlık + canlı sayaç), (2) her satır/kart durum rengine bürünür.
 * Durum meta'sı (etiket + renk) tek kaynaktan: lib/applicationStatus.
 * 2026-07-16: başvurudan sporcu oluşturma (KVKK rıza taşıma) eylemi.
 */
export function BasvurularView({ apps, teams, canConvert }: { apps: ApplicationRow[]; teams: TeamOption[]; canConvert: boolean }) {
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
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1080 }}>
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
                    <th style={TH}>Sporcu</th>
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
                        <td style={TD}>
                          <ConvertCell app={a} teams={teams} canConvert={canConvert} />
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
                    <ConvertCell app={a} teams={teams} canConvert={canConvert} />
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
