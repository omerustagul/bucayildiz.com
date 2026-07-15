"use client";

import { useRouter } from "next/navigation";
import { ViewHeader, Panel, StatTile } from "@/components/admin/kit";
import { Table, type Column } from "@/components/ui/Table";
import { CardList, CardEmpty, DataCard, CardHeader, CardFields } from "@/components/admin/MobileCardList";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

// injured/featured `null` = yetkisiz yönetici (sporcular.view yok) → sakatlık (KVKK
// sağlık verisi) ve sporcu listesi HİÇ gösterilmez. Boş liste ile karıştırılmasın diye null.
type Stats = { athletes: number; teams: number; trainings: number; injured: number | null };
type Bar = { name: string; count: number; highlight: boolean };
type Up = { id: string; day: string; competition: string; time: string; home: string; away: string };
type Featured = { id: string; name: string; number: number | null; position: string; teamName: string; status: string; photoUrl: string | null };

const STATUS: Record<string, { tone: "success" | "live" | "neutral"; label: string }> = {
  active: { tone: "success", label: "Aktif" },
  injured: { tone: "live", label: "Sakat" },
  rest: { tone: "neutral", label: "İzinli" },
};

function SquadChart({ bars }: { bars: Bar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.count));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 180, padding: "8px 4px 0" }}>
      {bars.map((b) => (
        <div key={b.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, height: "100%", justifyContent: "flex-end" }}>
          <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>{b.count}</span>
          <div style={{ width: "100%", maxWidth: 54, height: `${(b.count / max) * 130}px`, background: b.highlight ? "var(--grad-gold)" : "var(--grad-navy)", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0" }} />
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 13, textTransform: "uppercase", color: "var(--ink-600)" }}>{b.name}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardView({ stats, bars, upcoming, featured, today }: { stats: Stats; bars: Bar[]; upcoming: Up[]; featured: Featured[] | null; today: string }) {
  const router = useRouter();

  const cols: Column<Featured>[] = [
    {
      key: "name",
      label: "Sporcu",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name={r.name} src={r.photoUrl} size="sm" />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "var(--ink-400)", whiteSpace: "nowrap" }}>{r.number != null ? `#${r.number}` : ""} {r.position ? `· ${r.position}` : ""}</div>
          </div>
        </div>
      ),
    },
    { key: "teamName", label: "Takım", render: (r) => <Badge tone="navy">{r.teamName}</Badge> },
    { key: "position", label: "Mevki", render: (r) => r.position || "—" },
    { key: "status", label: "Durum", align: "right", render: (r) => <Badge tone={STATUS[r.status]?.tone ?? "neutral"} dot={r.status === "injured"}>{STATUS[r.status]?.label ?? r.status}</Badge> },
  ];

  return (
    <>
      <ViewHeader
        title="Genel Bakış"
        subtitle={`Kulüp geneli özet rapor — ${today}`}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatTile label="Toplam Sporcu" value={stats.athletes} icon="users" accent />
        <StatTile label="Aktif Takım" value={stats.teams} icon="shield" sub="A → U-15" deltaTone="neutral" />
        <StatTile label="Planlı Antrenman" value={stats.trainings} unit="seans" icon="dumbbell" deltaTone="neutral" />
        {stats.injured != null && <StatTile label="Sakatlık" value={stats.injured} icon="heart-pulse" sub="takipte" deltaTone="neutral" />}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }} className="hp-grid-2">
        <Panel title="Takım Mevcutları" action={<Button variant="ghost" size="sm" onClick={() => router.push("/admin/takimlar")} rightIcon={<Icon name="arrow-right" size={15} />}>Takımlar</Button>}>
          <SquadChart bars={bars} />
        </Panel>
        <Panel title="Yaklaşan Maçlar" action={<Button variant="ghost" size="sm" onClick={() => router.push("/admin/fikstur")} rightIcon={<Icon name="arrow-right" size={15} />}>Fikstür</Button>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.length === 0 && <div style={{ fontSize: 13, color: "var(--ink-400)" }}>Yaklaşan maç yok.</div>}
            {upcoming.map((f) => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ width: 44, textAlign: "center", flex: "none" }}>
                  <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 18, color: "var(--navy-700)", lineHeight: 1 }}>{f.day}</div>
                  <div style={{ fontSize: 10.5, textTransform: "uppercase", color: "var(--ink-400)", letterSpacing: ".06em" }}>Haz</div>
                </div>
                <span style={{ width: 1, height: 30, background: "var(--ink-200)" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.home} <span style={{ color: "var(--ink-400)" }}>vs</span> {f.away}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{f.competition} · {f.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Yalnız sporcular.view izni olan yöneticiye — sporcu adı/foto + SAKATLIK durumu. */}
      {featured && (
        <Panel title="Öne Çıkan Sporcular" action={<Button variant="ghost" size="sm" onClick={() => router.push("/admin/sporcular")} rightIcon={<Icon name="arrow-right" size={15} />}>Tüm Sporcular</Button>} pad={0}>
          <div className="adm-table-wrap">
            <Table columns={cols} rows={featured} getRowKey={(r) => r.id} onRowClick={() => router.push("/admin/sporcular")} style={{ border: "none", borderRadius: 0 }} />
          </div>
          <CardList style={{ padding: 14 }}>
            {featured.length === 0 ? (
              <CardEmpty>Öne çıkan sporcu yok.</CardEmpty>
            ) : (
              featured.map((r) => (
                <DataCard key={r.id} onClick={() => router.push("/admin/sporcular")}>
                  <CardHeader
                    avatar={<Avatar name={r.name} src={r.photoUrl} size="sm" />}
                    title={r.name}
                    subtitle={`${r.number != null ? `#${r.number} ` : ""}${r.position ? `· ${r.position}` : ""}`}
                    badge={<Badge tone={STATUS[r.status]?.tone ?? "neutral"} dot={r.status === "injured"}>{STATUS[r.status]?.label ?? r.status}</Badge>}
                  />
                  <CardFields
                    items={[
                      { label: "Takım", value: <Badge tone="navy">{r.teamName}</Badge> },
                      { label: "Mevki", value: r.position || "—" },
                    ]}
                  />
                </DataCard>
              ))
            )}
          </CardList>
        </Panel>
      )}
    </>
  );
}
