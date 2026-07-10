"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Toolbar, Field } from "@/components/admin/kit";
import { TextInput, Drawer } from "@/components/admin/controls";
import { Table, type Column } from "@/components/ui/Table";
import { CardList, CardEmpty, DataCard, CardHeader, CardFields } from "@/components/admin/MobileCardList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { toast } from "@/components/ui/Toast";
import { createStanding, updateStanding, deleteStanding } from "@/app/admin/(panel)/puan-durumu/actions";

export type StandingRowData = {
  id: string;
  teamName: string;
  isOurs: boolean;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  sort: number;
};

const NUM_FIELDS = [
  { key: "played", label: "O — Oynanan" },
  { key: "wins", label: "G — Galibiyet" },
  { key: "draws", label: "B — Beraberlik" },
  { key: "losses", label: "M — Mağlubiyet" },
  { key: "goalsFor", label: "Attığı Gol" },
  { key: "goalsAgainst", label: "Yediği Gol" },
  { key: "points", label: "P — Puan" },
] as const;

type NumKey = (typeof NUM_FIELDS)[number]["key"];

function averaj(r: { goalsFor: number; goalsAgainst: number }) {
  const av = r.goalsFor - r.goalsAgainst;
  return av > 0 ? `+${av}` : String(av);
}

function StandingDrawer({ row, onClose }: { row: StandingRowData | null; onClose: () => void }) {
  const router = useRouter();
  const isNew = !row;
  const [v, setV] = useState({
    teamName: row?.teamName ?? "",
    isOurs: row?.isOurs ?? false,
    sort: row?.sort?.toString() ?? "0",
    played: row?.played?.toString() ?? "0",
    wins: row?.wins?.toString() ?? "0",
    draws: row?.draws?.toString() ?? "0",
    losses: row?.losses?.toString() ?? "0",
    goalsFor: row?.goalsFor?.toString() ?? "0",
    goalsAgainst: row?.goalsAgainst?.toString() ?? "0",
    points: row?.points?.toString() ?? "0",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));

  const save = () => {
    setError(null);
    const payload = {
      teamName: v.teamName,
      isOurs: v.isOurs,
      sort: Number(v.sort) || 0,
      played: Number(v.played) || 0,
      wins: Number(v.wins) || 0,
      draws: Number(v.draws) || 0,
      losses: Number(v.losses) || 0,
      goalsFor: Number(v.goalsFor) || 0,
      goalsAgainst: Number(v.goalsAgainst) || 0,
      points: Number(v.points) || 0,
    };
    startTransition(async () => {
      const res = isNew ? await createStanding(payload) : await updateStanding(row!.id, payload);
      if (res?.error) setError(res.error);
      else {
        toast.success(isNew ? "Satır eklendi." : "Satır güncellendi.");
        onClose();
        router.refresh();
      }
    });
  };
  const remove = () => {
    if (!row || !window.confirm("Bu satırı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteStanding(row.id);
      toast.success("Satır silindi.");
      onClose();
      router.refresh();
    });
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={row ? "Satırı Düzenle" : "Yeni Satır"}
      subtitle="Lig tablosundaki bir takımın istatistiklerini gir"
      width={480}
      footer={
        <>
          {row && (
            <Button variant="ghost" size="sm" style={{ color: "var(--red-600)", marginRight: "auto" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>
              Sil
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>
            İptal
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Takım Adı" required>
          <TextInput value={v.teamName} onChange={(e) => set("teamName", e.target.value)} placeholder="örn. Buca Yıldız" />
        </Field>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 13px",
            border: `1px solid ${v.isOurs ? "var(--gold-500)" : "var(--border-subtle)"}`,
            background: v.isOurs ? "rgba(201,162,39,0.08)" : "transparent",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
          }}
        >
          <input type="checkbox" checked={v.isOurs} onChange={(e) => set("isOurs", e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--gold-600)", flex: "none" }} />
          <span style={{ display: "inline-flex", color: v.isOurs ? "var(--gold-600)" : "var(--ink-400)", flex: "none" }}>
            <Icon name="star" size={17} />
          </span>
          <span style={{ lineHeight: 1.35 }}>
            <span style={{ display: "block", fontWeight: 600, fontSize: 13.5, color: "var(--text-strong)" }}>Bizim Takımımız</span>
            <span style={{ display: "block", fontSize: 12, color: "var(--ink-400)" }}>Tabloda vurgulanır. Yalnız bir satır işaretli olabilir; seçince öncekinden alınır.</span>
          </span>
        </label>

        <Field label="Sıra (1 = lider)" required hint="Küçük sayı üstte listelenir">
          <TextInput type="number" value={v.sort} onChange={(e) => set("sort", e.target.value)} placeholder="1" />
        </Field>

        <div style={{ height: 1, background: "var(--border-subtle)" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {NUM_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              <TextInput type="number" value={v[f.key as NumKey]} onChange={(e) => set(f.key as NumKey, e.target.value)} placeholder="0" />
            </Field>
          ))}
        </div>

        <div style={{ padding: "10px 13px", background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--ink-500)" }}>
          Averaj otomatik hesaplanır: <strong style={{ color: "var(--text-strong)" }}>{averaj({ goalsFor: Number(v.goalsFor) || 0, goalsAgainst: Number(v.goalsAgainst) || 0 })}</strong>
        </div>

        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Drawer>
  );
}

export function StandingsView({ rows }: { rows: StandingRowData[] }) {
  const [drawer, setDrawer] = useState<{ row: StandingRowData | null } | null>(null);

  const cols: Column<StandingRowData>[] = [
    { key: "sort", label: "#", width: 44, align: "center", render: (r) => <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, color: "var(--ink-500)" }}>{r.sort}</span> },
    {
      key: "teamName",
      label: "Takım",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {r.isOurs && (
            <span style={{ display: "inline-flex", color: "var(--gold-600)", flex: "none" }}>
              <Icon name="star" size={14} />
            </span>
          )}
          <span style={{ fontWeight: 700, color: r.isOurs ? "var(--navy-700)" : "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{r.teamName}</span>
        </div>
      ),
    },
    { key: "played", label: "O", align: "center" },
    { key: "wins", label: "G", align: "center" },
    { key: "draws", label: "B", align: "center" },
    { key: "losses", label: "M", align: "center" },
    { key: "av", label: "Av", align: "center", render: (r) => <span style={{ fontFamily: "var(--font-stat)", color: "var(--ink-500)" }}>{averaj(r)}</span> },
    { key: "points", label: "P", align: "center", render: (r) => <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, color: "var(--navy-800)" }}>{r.points}</span> },
    { key: "go", label: "", width: 44, align: "right", render: () => <span style={{ color: "var(--ink-300)", display: "inline-flex" }}><Icon name="pencil" size={15} /></span> },
  ];

  return (
    <>
      <ViewHeader
        title="Puan Durumu"
        subtitle="Lig tablosunu yönet — site tarafında /fikstur/puan-durumu üzerinde görünür"
        actions={
          <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setDrawer({ row: null })}>
            Satır Ekle
          </Button>
        }
      />
      <Toolbar>
        <span style={{ fontSize: 13, color: "var(--ink-400)" }}>{rows.length} takım</span>
      </Toolbar>
      <div className="adm-table-wrap">
        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setDrawer({ row: r })} empty="Henüz puan durumu satırı yok." />
      </div>
      <CardList>
        {rows.length === 0 ? (
          <CardEmpty>Henüz puan durumu satırı yok.</CardEmpty>
        ) : (
          rows.map((r) => (
            <DataCard key={r.id} onClick={() => setDrawer({ row: r })}>
              <CardHeader
                title={
                  <>
                    {r.isOurs && <span style={{ color: "var(--gold-600)", marginRight: 5 }}>★</span>}
                    {r.teamName}
                  </>
                }
                subtitle={`Sıra ${r.sort}`}
                badge={<Badge tone="navy">{r.points} P</Badge>}
              />
              <CardFields
                items={[
                  { label: "O / G / B / M", value: `${r.played} / ${r.wins} / ${r.draws} / ${r.losses}` },
                  { label: "Averaj", value: averaj(r) },
                ]}
              />
            </DataCard>
          ))
        )}
      </CardList>
      {drawer && <StandingDrawer row={drawer.row} onClose={() => setDrawer(null)} />}
    </>
  );
}
