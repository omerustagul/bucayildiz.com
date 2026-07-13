"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Toolbar, Field } from "@/components/admin/kit";
import { TextInput, SearchBox, Drawer } from "@/components/admin/controls";
import { MediaLibraryPicker } from "@/components/admin/MediaLibraryPicker";
import { Table, type Column } from "@/components/ui/Table";
import { CardList, CardEmpty, DataCard, CardHeader, CardFields } from "@/components/admin/MobileCardList";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { POSITIONS } from "@/lib/enums";
import { toast } from "@/components/ui/Toast";
import { createAthlete, updateAthlete, deleteAthlete, provisionAthleteLogin } from "@/app/admin/(panel)/sporcular/actions";

export type Team = { id: string; name: string };
export type AthleteRow = {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  position: string;
  number: number | null;
  height: number | null;
  weight: number | null;
  birthDate: string | null;
  foot: string | null;
  status: string;
  licenseNo: string | null;
  photoUrl: string | null;
  parentPhone: string | null;
  hasLogin: boolean;
  username: string | null;
};

const STATUS: Record<string, { tone: "success" | "live" | "neutral"; label: string }> = {
  active: { tone: "success", label: "Aktif" },
  injured: { tone: "live", label: "Sakat" },
  rest: { tone: "neutral", label: "İzinli" },
};

const num = (v: string) => (v.trim() === "" ? null : Number(v));

function AthleteDrawer({ athlete, teams, onClose }: { athlete: AthleteRow | null; teams: Team[]; onClose: () => void }) {
  const router = useRouter();
  const isNew = !athlete;
  const [v, setV] = useState({
    name: athlete?.name ?? "",
    teamId: athlete?.teamId ?? "",
    position: athlete?.position ?? "",
    number: athlete?.number?.toString() ?? "",
    foot: athlete?.foot ?? "Sağ",
    height: athlete?.height?.toString() ?? "",
    weight: athlete?.weight?.toString() ?? "",
    birthDate: athlete?.birthDate ?? "",
    licenseNo: athlete?.licenseNo ?? "",
    parentPhone: athlete?.parentPhone ?? "",
    photoUrl: athlete?.photoUrl ?? "",
    active: athlete ? athlete.status === "active" : true,
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));

  const trSlug = (s: string) =>
    s.toLocaleLowerCase("tr").replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9 ]/g, "").trim().replace(/\s+/g, ".");
  const [credUser, setCredUser] = useState(athlete?.username ?? (athlete ? trSlug(athlete.name) : ""));
  const [credPass, setCredPass] = useState("");
  const [credMsg, setCredMsg] = useState<{ ok?: boolean; text: string } | null>(null);
  const provision = () => {
    setCredMsg(null);
    startTransition(async () => {
      const res = await provisionAthleteLogin(athlete!.id, credUser, credPass);
      if (res.error) setCredMsg({ text: res.error });
      else {
        setCredMsg({ ok: true, text: "Giriş bilgileri kaydedildi." });
        setCredPass("");
        router.refresh();
      }
    });
  };

  const save = () => {
    setError(null);
    const payload = {
      name: v.name,
      teamId: v.teamId,
      position: v.position,
      number: num(v.number),
      height: num(v.height),
      weight: num(v.weight),
      birthDate: v.birthDate || null,
      foot: v.foot || null,
      status: v.active ? "active" : "rest",
      licenseNo: v.licenseNo,
      parentPhone: v.parentPhone,
      photoUrl: v.photoUrl || null,
    };
    startTransition(async () => {
      const res = isNew ? await createAthlete(payload) : await updateAthlete(athlete!.id, payload);
      if (res?.error) setError(res.error);
      else {
        toast.success(isNew ? "Sporcu oluşturuldu." : "Sporcu kaydedildi.");
        onClose();
        router.refresh();
      }
    });
  };

  const remove = () => {
    if (!athlete) return;
    if (!window.confirm("Bu sporcuyu silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteAthlete(athlete.id);
      toast.success("Sporcu silindi.");
      onClose();
      router.refresh();
    });
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "var(--gold-700)",
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={athlete ? athlete.name : "Yeni Sporcu"}
      subtitle={athlete ? "Sporcu bilgilerini düzenle" : "Yeni sporcu kaydı oluştur"}
      width={520}
      footer={
        <>
          {athlete && (
            <Button variant="ghost" size="sm" style={{ color: "var(--red-600)", marginRight: "auto" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>
              Sil
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>
            İptal
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>
            {pending ? "Kaydediliyor…" : athlete ? "Kaydet" : "Sporcu Oluştur"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 96, flex: "none" }}>
            <MediaLibraryPicker value={v.photoUrl || null} onChange={(url) => set("photoUrl", url ?? "")} label="Fotoğraf" compact icon="user-round" aspect="1 / 1" />
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Ad Soyad" required>
              <TextInput value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="Sporcunun adı soyadı" />
            </Field>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border-subtle)" }} />
        <div style={sectionTitle}>Takım & Mevki</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Select label="Takım" required placeholder="Takım seç" options={teams.map((t) => ({ value: t.id, label: t.name }))} value={v.teamId} onChange={(e) => set("teamId", e.target.value)} />
          <Select label="Mevki" placeholder="Mevki seç" options={[...POSITIONS]} value={v.position} onChange={(e) => set("position", e.target.value)} />
          <Field label="Forma No">
            <TextInput type="number" value={v.number} onChange={(e) => set("number", e.target.value)} placeholder="10" />
          </Field>
          <Select label="Ayak" options={["Sağ", "Sol", "Çift"]} value={v.foot ?? ""} onChange={(e) => set("foot", e.target.value)} />
        </div>

        <div style={{ height: 1, background: "var(--border-subtle)" }} />
        <div style={sectionTitle}>Fiziksel & İletişim</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Field label="Boy" hint="cm">
            <TextInput type="number" value={v.height} onChange={(e) => set("height", e.target.value)} placeholder="178" />
          </Field>
          <Field label="Kilo" hint="kg">
            <TextInput type="number" value={v.weight} onChange={(e) => set("weight", e.target.value)} placeholder="68" />
          </Field>
          <Field label="Doğum Tarihi">
            <TextInput type="date" value={v.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Lisans No">
            <TextInput value={v.licenseNo} onChange={(e) => set("licenseNo", e.target.value)} placeholder="BY-1001" />
          </Field>
          <Field label="Veli Telefon">
            <TextInput value={v.parentPhone} onChange={(e) => set("parentPhone", e.target.value)} placeholder="05xx xxx xx xx" />
          </Field>
        </div>

        <div style={{ height: 1, background: "var(--border-subtle)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)" }}>Aktif sporcu</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-400)" }}>Pasif sporcular kadro listelerinde görünmez.</div>
          </div>
          <Switch checked={v.active} onChange={(next) => set("active", next)} />
        </div>

        {athlete && (
          <>
            <div style={{ height: 1, background: "var(--border-subtle)" }} />
            <div style={sectionTitle}>Panel Girişi</div>
            <p style={{ fontSize: 12.5, color: "var(--ink-400)", margin: "-10px 0 0" }}>
              {athlete.hasLogin
                ? "Bu sporcunun panel hesabı var. Kullanıcı adını değiştirebilir veya şifre sıfırlayabilirsiniz."
                : "Sporcuya panel girişi oluşturun; kullanıcı adı ve şifreyi sporcuyla paylaşın."}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Kullanıcı Adı">
                <TextInput value={credUser} onChange={(e) => setCredUser(e.target.value)} placeholder="arda.yilmaz" />
              </Field>
              <Field label={athlete.hasLogin ? "Yeni Şifre" : "Şifre"}>
                <TextInput type="text" value={credPass} onChange={(e) => setCredPass(e.target.value)} placeholder={athlete.hasLogin ? "boş = değişmez" : "en az 6 karakter"} />
              </Field>
            </div>
            {credMsg && <div style={{ fontSize: 12.5, fontWeight: 600, color: credMsg.ok ? "var(--green-600)" : "var(--red-600)" }}>{credMsg.text}</div>}
            <Button variant="secondary" size="sm" onClick={provision} disabled={pending} leftIcon={<Icon name="lock" size={15} />} style={{ alignSelf: "flex-start" }}>
              {athlete.hasLogin ? "Giriş Bilgilerini Güncelle" : "Panel Girişi Oluştur"}
            </Button>

            <div style={{ height: 1, background: "var(--border-subtle)" }} />
            <div style={sectionTitle}>Performans</div>
            <p style={{ fontSize: 12.5, color: "var(--ink-400)", margin: "-10px 0 0" }}>Periyodik performans ölçümleri ayrı sayfada yönetilir; geçmiş ölçümler raporlama için korunur.</p>
            <Button as="a" href={`/admin/performans?athlete=${athlete.id}`} variant="secondary" size="sm" leftIcon={<Icon name="heart-pulse" size={15} />} style={{ alignSelf: "flex-start" }}>
              Performans Ölçümleri
            </Button>
          </>
        )}

        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Drawer>
  );
}

export function AthletesView({ athletes, teams }: { athletes: AthleteRow[]; teams: Team[] }) {
  const [team, setTeam] = useState("all");
  const [q, setQ] = useState("");
  const [pos, setPos] = useState("");
  const [status, setStatus] = useState("");
  const [drawer, setDrawer] = useState<{ athlete: AthleteRow | null } | null>(null);

  const rows = useMemo(
    () =>
      athletes.filter(
        (a) =>
          (team === "all" || a.teamId === team) &&
          a.name.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")) &&
          (pos === "" || a.position === pos) &&
          (status === "" || a.status === status),
      ),
    [athletes, team, q, pos, status],
  );

  const tabs = [
    { id: "all", label: "Tümü", count: athletes.length },
    ...teams.map((t) => ({ id: t.id, label: t.name, count: athletes.filter((a) => a.teamId === t.id).length })),
  ];

  const cols: Column<AthleteRow>[] = [
    {
      key: "name",
      label: "Sporcu",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name={r.name} src={r.photoUrl} size="sm" />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "var(--ink-400)", whiteSpace: "nowrap" }}>
              {r.number != null ? `#${r.number}` : ""} {r.position ? `· ${r.position}` : ""}
            </div>
          </div>
        </div>
      ),
    },
    { key: "teamName", label: "Takım", render: (r) => <Badge tone="navy">{r.teamName}</Badge> },
    { key: "height", label: "Boy", align: "right", render: (r) => (r.height ? <span style={{ fontFamily: "var(--font-stat)" }}>{r.height}<span style={{ color: "var(--ink-400)", fontSize: 12 }}> cm</span></span> : "—") },
    { key: "weight", label: "Kilo", align: "right", render: (r) => (r.weight ? <span style={{ fontFamily: "var(--font-stat)" }}>{r.weight}<span style={{ color: "var(--ink-400)", fontSize: 12 }}> kg</span></span> : "—") },
    { key: "foot", label: "Ayak", align: "center", render: (r) => r.foot ?? "—" },
    { key: "status", label: "Durum", align: "right", render: (r) => <Badge tone={STATUS[r.status]?.tone ?? "neutral"} dot={r.status === "injured"}>{STATUS[r.status]?.label ?? r.status}</Badge> },
    { key: "go", label: "", width: 44, align: "right", render: () => <span style={{ color: "var(--ink-300)", display: "inline-flex" }}><Icon name="chevron-right" size={16} /></span> },
  ];

  return (
    <>
      <ViewHeader
        title="Sporcular"
        subtitle={`${athletes.length} kayıtlı sporcu`}
        actions={
          <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setDrawer({ athlete: null })}>
            Sporcu Ekle
          </Button>
        }
        tabs={<Tabs tabs={tabs} value={team} onChange={setTeam} />}
      />

      <Toolbar>
        <SearchBox placeholder="İsimle ara…" value={q} onChange={setQ} />
        <Select options={["Tüm mevkiler", ...POSITIONS]} value={pos === "" ? "Tüm mevkiler" : pos} onChange={(e) => setPos(e.target.value === "Tüm mevkiler" ? "" : e.target.value)} containerStyle={{ minWidth: 160 }} />
        <Select options={["Tüm durumlar", "Aktif", "Sakat", "İzinli"]} value={status === "" ? "Tüm durumlar" : STATUS[status]?.label} onChange={(e) => { const m = { Aktif: "active", Sakat: "injured", İzinli: "rest" } as Record<string, string>; setStatus(m[e.target.value] ?? ""); }} containerStyle={{ minWidth: 150 }} />
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--ink-400)" }}>{rows.length} sonuç</span>
      </Toolbar>

      {/* Filtre değişince satırlara hafif giriş: kapsayıcı key ile yeniden mount
          edilir, .by-anim-pane fade+translateY oynatır (basit stagger yerine). */}
      <div key={`${team}|${pos}|${status}|${q}`} className="adm-table-wrap by-anim-pane">
        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setDrawer({ athlete: r })} empty="Bu filtreye uygun sporcu yok." />
      </div>
      <CardList key={`${team}|${pos}|${status}|${q}-cards`} className="by-anim-pane">
        {rows.length === 0 ? (
          <CardEmpty>Bu filtreye uygun sporcu yok.</CardEmpty>
        ) : (
          rows.map((r) => (
            <DataCard key={r.id} onClick={() => setDrawer({ athlete: r })}>
              <CardHeader
                avatar={<Avatar name={r.name} src={r.photoUrl} size="sm" />}
                title={r.name}
                subtitle={`${r.number != null ? `#${r.number} ` : ""}${r.position ? `· ${r.position}` : ""}`}
                badge={<Badge tone={STATUS[r.status]?.tone ?? "neutral"} dot={r.status === "injured"}>{STATUS[r.status]?.label ?? r.status}</Badge>}
              />
              <CardFields
                items={[
                  { label: "Takım", value: <Badge tone="navy">{r.teamName}</Badge> },
                  { label: "Ayak", value: r.foot ?? "—" },
                  { label: "Boy", value: r.height ? `${r.height} cm` : "—" },
                  { label: "Kilo", value: r.weight ? `${r.weight} kg` : "—" },
                ]}
              />
            </DataCard>
          ))
        )}
      </CardList>

      {drawer && <AthleteDrawer athlete={drawer.athlete} teams={teams} onClose={() => setDrawer(null)} />}
    </>
  );
}
