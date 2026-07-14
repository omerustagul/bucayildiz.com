"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Toolbar, Field } from "@/components/admin/kit";
import { TextInput, TextArea, SearchBox, Drawer } from "@/components/admin/controls";
import { Table, type Column } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";
import { IconButton } from "@/components/ui/IconButton";
import { Tabs } from "@/components/ui/Tabs";
import { Icon } from "@/lib/icons";
import { toast } from "@/components/ui/Toast";
import {
  createJobPosting, updateJobPosting, deleteJobPosting,
  updateJobApplicationStatus, deleteJobApplication,
} from "@/app/admin/(panel)/kariyer/actions";

export type PostingRow = { id: string; title: string; department: string; location: string; employment: string; description: string; active: boolean; sort: number; appCount: number };
export type ApplicationRow = { id: string; name: string; email: string; phone: string | null; message: string; cvUrl: string | null; status: string; postingTitle: string | null; createdAt: string };

const EMP_OPTIONS = [
  { value: "full-time", label: "Tam Zamanlı" },
  { value: "part-time", label: "Yarı Zamanlı" },
  { value: "stajyer", label: "Stajyer" },
];
const empLabel = (v: string) => EMP_OPTIONS.find((o) => o.value === v)?.label ?? v;

const APP_STATUS = [
  { value: "new", label: "Yeni", tone: "gold" as const },
  { value: "reviewing", label: "İnceleniyor", tone: "navy" as const },
  { value: "closed", label: "Kapandı", tone: "neutral" as const },
];
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });

// --- İlan Drawer (oluştur/düzenle/sil) ---
function PostingDrawer({ posting, onClose }: { posting: PostingRow | null; onClose: () => void }) {
  const router = useRouter();
  const isNew = !posting;
  const [v, setV] = useState({
    title: posting?.title ?? "",
    department: posting?.department ?? "",
    location: posting?.location ?? "",
    employment: posting?.employment ?? "full-time",
    description: posting?.description ?? "",
    active: posting?.active ?? true,
    sort: posting?.sort?.toString() ?? "0",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));

  const save = () => {
    setError(null);
    const payload = { ...v, sort: v.sort.trim() === "" ? 0 : Number(v.sort) };
    startTransition(async () => {
      const res = isNew ? await createJobPosting(payload) : await updateJobPosting(posting!.id, payload);
      if (res?.error) setError(res.error);
      else { toast.success(isNew ? "İlan oluşturuldu." : "İlan güncellendi."); onClose(); router.refresh(); }
    });
  };
  const remove = () => {
    if (!posting) return;
    if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => { await deleteJobPosting(posting.id); toast.success("İlan silindi."); onClose(); router.refresh(); });
  };

  return (
    <Drawer
      open onClose={onClose}
      title={posting ? posting.title : "Yeni İlan"}
      subtitle={posting ? "İlan bilgilerini düzenle" : "Yeni iş ilanı oluştur"}
      width={560}
      footer={
        <>
          {posting && (
            <Button variant="ghost" size="sm" style={{ color: "var(--red-600)", marginRight: "auto" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>Sil</Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>İptal</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>{pending ? "Kaydediliyor…" : posting ? "Kaydet" : "Oluştur"}</Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="İlan Başlığı" required><TextInput value={v.title} onChange={(e) => set("title", e.target.value)} placeholder="örn. Altyapı Antrenörü (UEFA C/B)" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Departman"><TextInput value={v.department} onChange={(e) => set("department", e.target.value)} placeholder="örn. Teknik Ekip" /></Field>
          <Field label="Konum"><TextInput value={v.location} onChange={(e) => set("location", e.target.value)} placeholder="örn. İzmir" /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Çalışma Türü"><Select options={EMP_OPTIONS} value={v.employment} onChange={(e) => set("employment", e.target.value)} /></Field>
          <Field label="Sıra"><TextInput type="number" value={v.sort} onChange={(e) => set("sort", e.target.value)} /></Field>
        </div>
        <Field label="Açıklama"><TextArea rows={5} value={v.description} onChange={(e) => set("description", e.target.value)} placeholder="Pozisyonun kısa açıklaması, aranan nitelikler…" /></Field>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 14px", borderRadius: "var(--radius-md)", background: "var(--navy-50)", border: "1px solid var(--navy-100)" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-strong)" }}>Yayında</div>
            <div style={{ fontSize: 12, color: "var(--ink-400)" }}>Açıkken kariyer sayfasında görünür</div>
          </div>
          <Switch checked={v.active} onChange={(val) => set("active", val)} />
        </div>
        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Drawer>
  );
}

// --- Başvuru durum seçimi (ApplicationStatusSelect deseni) ---
function JobStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Select
      defaultValue={status}
      disabled={pending}
      options={APP_STATUS.map((s) => ({ value: s.value, label: s.label }))}
      onChange={(e) => { const value = e.target.value; startTransition(async () => { await updateJobApplicationStatus(id, value); router.refresh(); }); }}
      style={{ fontSize: 13, fontWeight: 600, padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--text-body)", cursor: pending ? "wait" : "pointer" }}
    />
  );
}

export function KariyerView({ postings, applications }: { postings: PostingRow[]; applications: ApplicationRow[] }) {
  const [tab, setTab] = useState("postings");
  const [q, setQ] = useState("");
  const [drawer, setDrawer] = useState<{ posting: PostingRow | null } | null>(null);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const postingRows = useMemo(() => postings.filter((p) => p.title.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr"))), [postings, q]);
  const appRows = useMemo(() => applications.filter((a) => (a.name + a.email + (a.postingTitle ?? "")).toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr"))), [applications, q]);

  const postingCols: Column<PostingRow>[] = [
    { key: "title", label: "İlan", render: (r) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{ fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{r.title}</span>
        {!r.active && <Badge tone="neutral">Pasif</Badge>}
      </div>
    ) },
    { key: "employment", label: "Tür", render: (r) => empLabel(r.employment) },
    { key: "location", label: "Konum", render: (r) => r.location || "—" },
    { key: "appCount", label: "Başvuru", align: "right", render: (r) => <span style={{ fontFamily: "var(--font-stat)" }}>{r.appCount}</span> },
    { key: "go", label: "", width: 44, align: "right", render: () => <span style={{ color: "var(--ink-300)", display: "inline-flex" }}><Icon name="chevron-right" size={16} /></span> },
  ];

  const removeApp = (a: ApplicationRow) => {
    if (!window.confirm(`${a.name} adlı başvuruyu silmek istediğinize emin misiniz?`)) return;
    startTransition(async () => {
      try {
        await deleteJobApplication(a.id);
        toast.success("Başvuru silindi.");
        router.refresh();
      } catch {
        toast.error("İşlem başarısız. Lütfen tekrar deneyin.");
      }
    });
  };

  const appCols: Column<ApplicationRow>[] = [
    { key: "name", label: "Aday", render: (r) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{r.name}</div>
        <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{r.email}{r.phone ? ` · ${r.phone}` : ""}</div>
      </div>
    ) },
    { key: "postingTitle", label: "Pozisyon", render: (r) => r.postingTitle ?? <span style={{ color: "var(--ink-400)" }}>Genel</span> },
    { key: "cvUrl", label: "CV", render: (r) => r.cvUrl ? <a href={r.cvUrl} target="_blank" rel="noreferrer" style={{ color: "var(--navy-700)", fontWeight: 600, fontSize: 13, textDecoration: "underline" }}>PDF</a> : <span style={{ color: "var(--ink-400)" }}>—</span> },
    { key: "createdAt", label: "Tarih", render: (r) => <span style={{ fontFamily: "var(--font-stat)", fontSize: 13 }}>{fmtDate(r.createdAt)}</span> },
    { key: "status", label: "Durum", render: (r) => <JobStatusSelect id={r.id} status={r.status} /> },
    { key: "del", label: "", width: 44, align: "right", render: (r) => <IconButton label="Başvuruyu sil" variant="outline" size="sm" disabled={pending} onClick={() => removeApp(r)}><Icon name="trash-2" size={14} /></IconButton> },
  ];

  const newCount = applications.filter((a) => a.status === "new").length;

  return (
    <>
      <ViewHeader
        title="Kariyer"
        subtitle="İş ilanlarını yönet ve gelen başvuruları değerlendir"
        actions={tab === "postings" ? (
          <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setDrawer({ posting: null })}>İlan Ekle</Button>
        ) : undefined}
        tabs={<Tabs tabs={[{ id: "postings", label: "İlanlar", count: postings.length }, { id: "applications", label: "Başvurular", count: newCount }]} value={tab} onChange={setTab} />}
      />

      <Toolbar>
        <SearchBox placeholder={tab === "postings" ? "İlan ara…" : "Aday/e-posta ara…"} value={q} onChange={setQ} />
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--ink-400)" }}>{(tab === "postings" ? postingRows : appRows).length} sonuç</span>
      </Toolbar>

      {tab === "postings" ? (
        <div key={`p-${q}`} className="adm-table-wrap by-anim-pane">
          <Table columns={postingCols} rows={postingRows} getRowKey={(r) => r.id} onRowClick={(r) => setDrawer({ posting: r })} empty="Henüz ilan yok. Sağ üstten ekleyin." />
        </div>
      ) : (
        <div key={`a-${q}`} className="adm-table-wrap by-anim-pane">
          <Table columns={appCols} rows={appRows} getRowKey={(r) => r.id} empty="Henüz başvuru yok." />
        </div>
      )}

      {drawer && <PostingDrawer posting={drawer.posting} onClose={() => setDrawer(null)} />}
    </>
  );
}
