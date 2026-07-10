"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Toolbar, Field } from "@/components/admin/kit";
import { TextInput, TextArea, SearchBox, Drawer, FileDrop } from "@/components/admin/controls";
import { Table, type Column } from "@/components/ui/Table";
import { CardList, CardEmpty, DataCard, CardHeader, CardFields } from "@/components/admin/MobileCardList";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { toast } from "@/components/ui/Toast";
import { createStaff, updateStaff, deleteStaff } from "@/app/admin/(panel)/kadro/actions";

export type StaffRow = {
  id: string;
  name: string;
  title: string;
  group: string;
  licence: string | null;
  photoUrl: string | null;
  bio: string;
  sort: number;
};

const GROUP: Record<string, { tone: "navy" | "gold"; label: string }> = {
  antrenor: { tone: "navy", label: "Antrenör" },
  yonetim: { tone: "gold", label: "Yönetim" },
};
const GROUP_OPTIONS = [
  { value: "antrenor", label: "Antrenör" },
  { value: "yonetim", label: "Yönetim" },
];

function StaffDrawer({ staff, onClose }: { staff: StaffRow | null; onClose: () => void }) {
  const router = useRouter();
  const isNew = !staff;
  const [v, setV] = useState({
    name: staff?.name ?? "",
    title: staff?.title ?? "",
    group: staff?.group ?? "antrenor",
    licence: staff?.licence ?? "",
    photoUrl: staff?.photoUrl ?? "",
    bio: staff?.bio ?? "",
    sort: staff?.sort?.toString() ?? "0",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));

  const save = () => {
    setError(null);
    const payload = {
      name: v.name,
      title: v.title,
      group: v.group,
      licence: v.licence,
      photoUrl: v.photoUrl || null,
      bio: v.bio,
      sort: v.sort.trim() === "" ? 0 : Number(v.sort),
    };
    startTransition(async () => {
      const res = isNew ? await createStaff(payload) : await updateStaff(staff!.id, payload);
      if (res?.error) setError(res.error);
      else {
        toast.success(isNew ? "Kayıt oluşturuldu." : "Kayıt güncellendi.");
        onClose();
        router.refresh();
      }
    });
  };

  const remove = () => {
    if (!staff) return;
    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteStaff(staff.id);
      toast.success("Kayıt silindi.");
      onClose();
      router.refresh();
    });
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={staff ? staff.name : "Yeni Kayıt"}
      subtitle={staff ? "Teknik ekip / yönetim bilgilerini düzenle" : "Yeni teknik ekip veya yönetim kaydı oluştur"}
      width={520}
      footer={
        <>
          {staff && (
            <Button variant="ghost" size="sm" style={{ color: "var(--red-600)", marginRight: "auto" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>
              Sil
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>
            İptal
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>
            {pending ? "Kaydediliyor…" : staff ? "Kaydet" : "Oluştur"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 96, flex: "none" }}>
            <FileDrop value={v.photoUrl || null} onChange={(url) => set("photoUrl", url ?? "")} label="Fotoğraf" compact icon="user-round" aspect="1 / 1" />
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Ad Soyad" required>
              <TextInput value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="Ad Soyad" />
            </Field>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Unvan" required>
            <TextInput value={v.title} onChange={(e) => set("title", e.target.value)} placeholder="örn. U-15 Antrenörü" />
          </Field>
          <Select label="Grup" required options={GROUP_OPTIONS} value={v.group} onChange={(e) => set("group", e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Lisans" hint="örn. UEFA A">
            <TextInput value={v.licence} onChange={(e) => set("licence", e.target.value)} placeholder="UEFA A" />
          </Field>
          <Field label="Sıra">
            <TextInput type="number" value={v.sort} onChange={(e) => set("sort", e.target.value)} />
          </Field>
        </div>
        <Field label="Kısa Biyografi">
          <TextArea rows={4} value={v.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Kısa özgeçmiş / tanıtım metni" />
        </Field>

        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Drawer>
  );
}

export function KadroView({ staff }: { staff: StaffRow[] }) {
  const [group, setGroup] = useState("all");
  const [q, setQ] = useState("");
  const [drawer, setDrawer] = useState<{ staff: StaffRow | null } | null>(null);

  const rows = useMemo(
    () =>
      staff.filter(
        (s) => (group === "all" || s.group === group) && s.name.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")),
      ),
    [staff, group, q],
  );

  const tabs = [
    { id: "all", label: "Tümü", count: staff.length },
    { id: "antrenor", label: "Antrenörler", count: staff.filter((s) => s.group === "antrenor").length },
    { id: "yonetim", label: "Yönetim", count: staff.filter((s) => s.group === "yonetim").length },
  ];

  const cols: Column<StaffRow>[] = [
    {
      key: "name",
      label: "Ad Soyad",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name={r.name} src={r.photoUrl} size="sm" />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "var(--ink-400)", whiteSpace: "nowrap" }}>{r.title}</div>
          </div>
        </div>
      ),
    },
    { key: "group", label: "Grup", render: (r) => <Badge tone={GROUP[r.group]?.tone ?? "navy"}>{GROUP[r.group]?.label ?? r.group}</Badge> },
    { key: "licence", label: "Lisans", render: (r) => r.licence ?? "—" },
    { key: "sort", label: "Sıra", align: "right", render: (r) => <span style={{ fontFamily: "var(--font-stat)" }}>{r.sort}</span> },
    { key: "go", label: "", width: 44, align: "right", render: () => <span style={{ color: "var(--ink-300)", display: "inline-flex" }}><Icon name="chevron-right" size={16} /></span> },
  ];

  return (
    <>
      <ViewHeader
        title="Teknik Ekip & Yönetim"
        subtitle={`${staff.length} kayıtlı kişi`}
        actions={
          <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setDrawer({ staff: null })}>
            Kişi Ekle
          </Button>
        }
        tabs={<Tabs tabs={tabs} value={group} onChange={setGroup} />}
      />

      <Toolbar>
        <SearchBox placeholder="İsimle ara…" value={q} onChange={setQ} />
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--ink-400)" }}>{rows.length} sonuç</span>
      </Toolbar>

      <div key={`${group}|${q}`} className="adm-table-wrap by-anim-pane">
        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setDrawer({ staff: r })} empty="Bu filtreye uygun kayıt yok." />
      </div>
      <CardList key={`${group}|${q}-cards`} className="by-anim-pane">
        {rows.length === 0 ? (
          <CardEmpty>Bu filtreye uygun kayıt yok.</CardEmpty>
        ) : (
          rows.map((r) => (
            <DataCard key={r.id} onClick={() => setDrawer({ staff: r })}>
              <CardHeader
                avatar={<Avatar name={r.name} src={r.photoUrl} size="sm" />}
                title={r.name}
                subtitle={r.title}
                badge={<Badge tone={GROUP[r.group]?.tone ?? "navy"}>{GROUP[r.group]?.label ?? r.group}</Badge>}
              />
              <CardFields
                items={[
                  { label: "Lisans", value: r.licence ?? "—" },
                  { label: "Sıra", value: r.sort },
                ]}
              />
            </DataCard>
          ))
        )}
      </CardList>

      {drawer && <StaffDrawer staff={drawer.staff} onClose={() => setDrawer(null)} />}
    </>
  );
}
