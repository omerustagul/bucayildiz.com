"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ViewHeader, Toolbar, Field } from "@/components/admin/kit";
import { TextInput, SearchBox, Drawer, FileDrop } from "@/components/admin/controls";
import { Table, type Column } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { createFixture, updateFixture, deleteFixture } from "@/app/admin/(panel)/fikstur/actions";

const CREST = "/brand/logo-emblem.png";

export type FixtureRow = {
  id: string;
  competition: string;
  opponent: string;
  opponentLogo: string | null;
  isHome: boolean;
  date: string;
  time: string;
  venue: string;
  status: string;
  ourScore: number | null;
  oppScore: number | null;
  teamId: string | null;
};

export type TeamOpt = { id: string; name: string };

const STATUS: Record<string, { tone: "navy" | "neutral"; label: string }> = {
  upcoming: { tone: "navy", label: "Yaklaşan" },
  finished: { tone: "neutral", label: "Bitti" },
};
const fmtDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return day && m && y ? `${day}.${m}.${y}` : d;
};
const num = (v: string) => (v.trim() === "" ? null : Number(v));

function FixtureDrawer({ fx, teams, onClose }: { fx: FixtureRow | null; teams: TeamOpt[]; onClose: () => void }) {
  const router = useRouter();
  const isNew = !fx;
  const [v, setV] = useState({
    teamId: fx?.teamId ?? "",
    competition: fx?.competition ?? "",
    opponent: fx?.opponent ?? "",
    opponentLogo: fx?.opponentLogo ?? "",
    side: fx ? (fx.isHome ? "home" : "away") : "home",
    date: fx?.date ?? "",
    time: fx?.time ?? "",
    venue: fx?.venue ?? "",
    status: fx?.status ?? "upcoming",
    ourScore: fx?.ourScore?.toString() ?? "",
    oppScore: fx?.oppScore?.toString() ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));
  const finished = v.status === "finished";

  const save = () => {
    setError(null);
    const payload = {
      teamId: v.teamId || null,
      competition: v.competition,
      opponent: v.opponent,
      opponentLogo: v.opponentLogo || null,
      isHome: v.side === "home",
      date: v.date,
      time: v.time,
      venue: v.venue,
      status: v.status,
      ourScore: num(v.ourScore),
      oppScore: num(v.oppScore),
    };
    startTransition(async () => {
      const res = isNew ? await createFixture(payload) : await updateFixture(fx!.id, payload);
      if (res?.error) setError(res.error);
      else {
        onClose();
        router.refresh();
      }
    });
  };
  const remove = () => {
    if (!fx || !window.confirm("Bu maçı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteFixture(fx.id);
      onClose();
      router.refresh();
    });
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={fx ? "Maçı Düzenle" : "Yeni Maç"}
      subtitle="Rakip bilgilerini ve logosunu manuel girebilirsin"
      width={540}
      footer={
        <>
          {fx && (
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
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Select
          label="Takım"
          required
          placeholder="Takım seçiniz…"
          options={teams.map((t) => ({ value: t.id, label: t.name }))}
          value={v.teamId}
          onChange={(e) => set("teamId", e.target.value)}
        />
        <Field label="Müsabaka / Lig" required>
          <TextInput value={v.competition} onChange={(e) => set("competition", e.target.value)} placeholder="örn. U-17 Gelişim Ligi" />
        </Field>

        <div>
          <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", marginBottom: 8 }}>Ev Sahibi / Deplasman</div>
          <Tabs tabs={[{ id: "home", label: "Biz Ev Sahibiyiz" }, { id: "away", label: "Biz Deplasmandayız" }]} variant="pill" value={v.side} onChange={(id) => set("side", id)} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 14, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", padding: 14, border: "1.5px solid var(--navy-300)", borderRadius: "var(--radius-md)", background: "var(--navy-50)" }}>
            <Image src={CREST} alt="" width={52} height={52} style={{ objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, textTransform: "uppercase", color: "var(--navy-800)" }}>Buca Yıldız</span>
            <Badge tone="gold">{v.side === "home" ? "Ev Sahibi" : "Deplasman"}</Badge>
          </div>
          <div style={{ alignSelf: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, color: "var(--ink-400)" }}>VS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ width: 72, alignSelf: "center" }}>
              <FileDrop value={v.opponentLogo || null} onChange={(url) => set("opponentLogo", url ?? "")} label="Rakip logosu" icon="image" aspect="1 / 1" />
            </div>
            <Field label="Rakip Takım" required>
              <TextInput value={v.opponent} onChange={(e) => set("opponent", e.target.value)} placeholder="Rakip takım adı" />
            </Field>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border-subtle)" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Tarih" required>
            <TextInput type="date" value={v.date} onChange={(e) => set("date", e.target.value)} />
          </Field>
          <Field label="Saat">
            <TextInput type="time" value={v.time} onChange={(e) => set("time", e.target.value)} />
          </Field>
        </div>
        <Field label="Saha / Stadyum">
          <TextInput value={v.venue} onChange={(e) => set("venue", e.target.value)} placeholder="örn. Buca Yıldız Tesisleri" />
        </Field>

        <div style={{ height: 1, background: "var(--border-subtle)" }} />
        <Select label="Durum" options={[{ value: "upcoming", label: "Yaklaşan" }, { value: "finished", label: "Tamamlandı" }]} value={v.status} onChange={(e) => set("status", e.target.value)} />
        {finished && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end" }}>
            <Field label="Skor (biz)">
              <TextInput type="number" value={v.ourScore} onChange={(e) => set("ourScore", e.target.value)} placeholder="0" />
            </Field>
            <div style={{ paddingBottom: 12, fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--ink-400)" }}>–</div>
            <Field label="Skor (rakip)">
              <TextInput type="number" value={v.oppScore} onChange={(e) => set("oppScore", e.target.value)} placeholder="0" />
            </Field>
          </div>
        )}
        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Drawer>
  );
}

/** Mobil (<=560px) kart listesi — Table yerine; tıklayınca aynı Drawer açılır. */
function FixtureCards({ rows, onOpen }: { rows: FixtureRow[]; onOpen: (r: FixtureRow) => void }) {
  if (rows.length === 0) {
    return (
      <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--ink-400)", fontSize: 14, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
        Maç bulunamadı.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((r) => {
        const home = r.isHome ? "Buca Yıldız" : r.opponent;
        const away = r.isHome ? r.opponent : "Buca Yıldız";
        const hs = r.isHome ? r.ourScore : r.oppScore;
        const as = r.isHome ? r.oppScore : r.ourScore;
        const finished = r.status === "finished";
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onOpen(r)}
            style={{ font: "inherit", textAlign: "left", cursor: "pointer", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "var(--shadow-xs)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <Badge tone="outline">{r.competition}</Badge>
              <span style={{ marginLeft: "auto", flex: "none" }}>
                <Badge tone={STATUS[r.status]?.tone ?? "neutral"}>{STATUS[r.status]?.label ?? r.status}</Badge>
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 13.5 }}>
              <span style={{ minWidth: 0, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: home === "Buca Yıldız" ? "var(--navy-700)" : "var(--ink-700)" }}>{home}</span>
              <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, background: "var(--ink-100)", borderRadius: "var(--radius-sm)", padding: "2px 9px", fontVariantNumeric: "tabular-nums" }}>
                {finished ? `${hs ?? 0}–${as ?? 0}` : "vs"}
              </span>
              <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: away === "Buca Yıldız" ? "var(--navy-700)" : "var(--ink-700)" }}>{away}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-500)", minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, color: "var(--text-strong)", flex: "none" }}>{fmtDate(r.date)}</span>
              {r.time && <span style={{ flex: "none" }}>{r.time}</span>}
              {r.venue && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>· {r.venue}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function FixturesView({ fixtures, teams }: { fixtures: FixtureRow[]; teams: TeamOpt[] }) {
  const [tab, setTab] = useState("all"); // takım filtresi: "all" | teamId
  const [statusFilter, setStatusFilter] = useState("all"); // all | upcoming | finished
  const [q, setQ] = useState("");
  const [drawer, setDrawer] = useState<{ fx: FixtureRow | null } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const rows = useMemo(
    () =>
      fixtures.filter(
        (f) =>
          (tab === "all" || f.teamId === tab) &&
          (statusFilter === "all" || f.status === statusFilter) &&
          (q.trim() === "" || `${f.opponent} ${f.competition}`.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr"))),
      ),
    [fixtures, tab, statusFilter, q],
  );

  const tabs = [
    { id: "all", label: "Tümü", count: fixtures.length },
    ...teams.map((t) => ({ id: t.id, label: t.name, count: fixtures.filter((f) => f.teamId === t.id).length })),
  ];

  const cols: Column<FixtureRow>[] = [
    {
      key: "date",
      label: "Tarih",
      render: (r) => (
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, color: "var(--text-strong)" }}>{fmtDate(r.date)}</div>
          <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{r.time}</div>
        </div>
      ),
    },
    { key: "competition", label: "Lig", render: (r) => <Badge tone="outline">{r.competition}</Badge> },
    {
      key: "match",
      label: "Maç",
      align: "center",
      render: (r) => {
        const home = r.isHome ? "Buca Yıldız" : r.opponent;
        const away = r.isHome ? r.opponent : "Buca Yıldız";
        const homeScore = r.isHome ? r.ourScore : r.oppScore;
        const awayScore = r.isHome ? r.oppScore : r.ourScore;
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontWeight: 600, color: home === "Buca Yıldız" ? "var(--navy-700)" : "var(--ink-700)" }}>{home}</span>
            {r.status === "finished" ? (
              <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, background: "var(--ink-100)", borderRadius: "var(--radius-sm)", padding: "2px 9px", color: "var(--text-strong)" }}>{homeScore ?? 0}–{awayScore ?? 0}</span>
            ) : (
              <span style={{ color: "var(--ink-400)", fontSize: 12, fontWeight: 600 }}>vs</span>
            )}
            <span style={{ fontWeight: 600, color: away === "Buca Yıldız" ? "var(--navy-700)" : "var(--ink-700)" }}>{away}</span>
          </div>
        );
      },
    },
    { key: "venue", label: "Saha", render: (r) => <span style={{ fontSize: 13, color: "var(--ink-500)" }}>{r.venue || "—"}</span> },
    { key: "status", label: "Durum", align: "center", render: (r) => <Badge tone={STATUS[r.status]?.tone ?? "neutral"}>{STATUS[r.status]?.label ?? r.status}</Badge> },
    { key: "go", label: "", width: 44, align: "right", render: () => <span style={{ color: "var(--ink-300)", display: "inline-flex" }}><Icon name="pencil" size={15} /></span> },
  ];

  return (
    <>
      <ViewHeader
        title="Fikstür"
        subtitle="Maç programını görüntüle ve manuel yönet"
        actions={
          <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setDrawer({ fx: null })}>
            Maç Ekle
          </Button>
        }
        tabs={<Tabs tabs={tabs} value={tab} onChange={setTab} />}
      />
      <Toolbar style={{ flexWrap: "nowrap" }}>
        <div style={{ flex: "1 1 140px", minWidth: 120, maxWidth: 280 }}>
          <SearchBox placeholder="Rakip / lig ara…" value={q} onChange={setQ} width="100%" />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, flex: "none" }}>
          <span className="fx-count" style={{ fontSize: 13, color: "var(--ink-400)", whiteSpace: "nowrap" }}>{rows.length} maç</span>
          <Select
            options={[{ value: "all", label: "Tümü" }, { value: "upcoming", label: "Yaklaşan" }, { value: "finished", label: "Tamamlanan" }]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            containerStyle={{ minWidth: 152 }}
            style={{ padding: "8px 34px 8px 12px", fontSize: 13.5 }}
          />
        </div>
      </Toolbar>
      {isMobile ? (
        <FixtureCards rows={rows} onOpen={(r) => setDrawer({ fx: r })} />
      ) : (
        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setDrawer({ fx: r })} empty="Maç bulunamadı." />
      )}
      {drawer && <FixtureDrawer fx={drawer.fx} teams={teams} onClose={() => setDrawer(null)} />}
    </>
  );
}
