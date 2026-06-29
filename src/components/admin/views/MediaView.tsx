"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ViewHeader, Panel, Toolbar, Field, cardStyle } from "@/components/admin/kit";
import { TextInput, Modal, Drawer, FileDrop } from "@/components/admin/controls";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { createMediaCategory, deleteMediaCategory, createMediaAsset, deleteMediaAsset, createFolder, updateHomeCard } from "@/app/admin/(panel)/medya/actions";

export type FolderNode = { id: string; name: string; parentId: string | null };
export type AssetItem = { id: string; url: string; title: string; kind: string; categoryId: string | null; folderId: string | null };
export type CategoryItem = { id: string; name: string; color: string; count: number };
export type HomeCardItem = { id: string; title: string; categoryId: string | null; kind: string; featured: boolean; coverUrl: string | null; count: number };

/* ---------- Folder tree ---------- */
function FolderTree({ folders, counts, active, onPick }: { folders: FolderNode[]; counts: Record<string, number>; active: string; onPick: (id: string) => void }) {
  const children = (pid: string | null) => folders.filter((f) => f.parentId === pid);
  const Node = ({ f, depth }: { f: FolderNode; depth: number }) => {
    const kids = children(f.id);
    const [open, setOpen] = useState(depth < 2);
    const on = active === f.id;
    return (
      <div>
        <div
          onClick={() => onPick(f.id)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", paddingLeft: 10 + depth * 16, borderRadius: "var(--radius-sm)", cursor: "pointer", background: on ? "var(--navy-50)" : "transparent", color: on ? "var(--navy-800)" : "var(--ink-700)", fontWeight: on ? 600 : 500, fontSize: 13.5 }}
        >
          {kids.length > 0 ? (
            <span onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{ display: "inline-flex", color: "var(--ink-400)" }}>
              <Icon name={open ? "chevron-down" : "chevron-right"} size={14} />
            </span>
          ) : (
            <span style={{ width: 14 }} />
          )}
          <span style={{ display: "inline-flex", color: on ? "var(--gold-600)" : "var(--navy-400)" }}>
            <Icon name={on ? "folder-open" : "folder"} size={15} />
          </span>
          <span style={{ flex: 1 }}>{f.name}</span>
          <span style={{ fontSize: 11.5, color: "var(--ink-400)", fontFamily: "var(--font-stat)" }}>{counts[f.id] ?? 0}</span>
        </div>
        {open && kids.map((k) => <Node key={k.id} f={k} depth={depth + 1} />)}
      </div>
    );
  };
  return <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{children(null).map((r) => <Node key={r.id} f={r} depth={0} />)}</div>;
}

/* ---------- Library tab ---------- */
function LibraryTab({ folders, assets, categories }: { folders: FolderNode[]; assets: AssetItem[]; categories: CategoryItem[] }) {
  const router = useRouter();
  const root = folders.find((f) => f.parentId === null);
  const [folder, setFolder] = useState(root?.id ?? "");
  const [catFilter, setCatFilter] = useState("");
  const [newFolder, setNewFolder] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const counts: Record<string, number> = {};
  for (const a of assets) if (a.folderId) counts[a.folderId] = (counts[a.folderId] ?? 0) + 1;
  if (root) counts[root.id] = assets.length;

  const current = folders.find((f) => f.id === folder) ?? root;
  const isRoot = current?.id === root?.id;
  const shown = assets.filter((a) => (isRoot || a.folderId === folder) && (catFilter === "" || a.categoryId === catFilter));

  async function upload(file: File) {
    setBusy(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUploadError(data?.error || "Yükleme başarısız. Lütfen tekrar deneyin.");
        return;
      }
      const created = await createMediaAsset({ url: data.url, title: file.name, folderId: isRoot ? "" : folder, categoryId: catFilter, kind: "photo" });
      if (!created.ok) {
        setUploadError(created.error || "Dosya kaydedilemedi.");
        return;
      }
      startTransition(() => router.refresh());
    } catch {
      setUploadError("Yükleme sırasında bir hata oluştu.");
    } finally {
      setBusy(false);
    }
  }
  const removeAsset = (id: string) =>
    startTransition(async () => {
      await deleteMediaAsset(id);
      router.refresh();
    });

  return (
    <div className="media-lib-grid" style={{ display: "grid", gridTemplateColumns: "252px 1fr", gap: 18, alignItems: "start" }}>
      <Panel title="Klasörler" pad={10} action={<IconButton label="Yeni klasör" variant="ghost" size="sm" onClick={() => setNewFolder(true)}><Icon name="folder-plus" size={16} /></IconButton>}>
        <FolderTree folders={folders} counts={counts} active={folder} onPick={setFolder} />
      </Panel>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Toolbar>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)" }}>
            <Icon name="folder-open" size={18} />
            {current?.name}
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13, textTransform: "none", color: "var(--ink-400)" }}>· {shown.length} dosya</span>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Select options={["Tüm kategoriler", ...categories.map((c) => c.name)]} value={catFilter === "" ? "Tüm kategoriler" : categories.find((c) => c.id === catFilter)?.name} onChange={(e) => { const c = categories.find((x) => x.name === e.target.value); setCatFilter(c?.id ?? ""); }} containerStyle={{ minWidth: 160 }} />
          </div>
        </Toolbar>
        {uploadError && (
          <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{uploadError}</div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))", gap: 12 }}>
          <label style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: "var(--radius-md)", border: "1.5px dashed var(--ink-300)", background: "var(--ink-50)", display: "grid", placeItems: "center", cursor: busy ? "wait" : "pointer", textAlign: "center" }}>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "var(--ink-600)", padding: 12 }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--navy-50)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}><Icon name="image" size={18} /></span>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>{busy ? "Yükleniyor…" : "Sürükle / yükle"}</span>
              <span style={{ fontSize: 11, color: "var(--ink-400)" }}>JPG, PNG</span>
            </span>
          </label>
          {shown.map((a) => (
            <div key={a.id} style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-subtle)", background: "var(--surface-subtle)" }}>
              <Image src={a.url} alt={a.title} fill style={{ objectFit: "cover" }} sizes="132px" />
              <button type="button" onClick={() => removeAsset(a.id)} style={{ position: "absolute", top: 6, right: 6, display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: "var(--radius-sm)", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", cursor: "pointer" }}>
                <Icon name="trash-2" size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {newFolder && <NewFolderModal folders={folders} defaultParent={root?.id ?? null} onClose={() => setNewFolder(false)} />}
    </div>
  );
}

function NewFolderModal({ folders, defaultParent, onClose }: { folders: FolderNode[]; defaultParent: string | null; onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [parent, setParent] = useState(defaultParent ?? "");
  const [pending, startTransition] = useTransition();
  const save = () =>
    startTransition(async () => {
      const res = await createFolder(name, parent || null);
      if (res.ok) {
        onClose();
        router.refresh();
      }
    });
  return (
    <Modal open onClose={onClose} title="Yeni Klasör" width={420} footer={<><Button variant="secondary" size="sm" onClick={onClose}>İptal</Button><Button variant="primary" size="sm" onClick={save} disabled={pending}>Oluştur</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Klasör Adı" required><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="örn. U-16 Kamp" /></Field>
        <Select label="Üst Klasör" options={folders.map((f) => ({ value: f.id, label: f.name }))} value={parent} onChange={(e) => setParent(e.target.value)} />
      </div>
    </Modal>
  );
}

/* ---------- Categories tab ---------- */
function CategoriesTab({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter();
  const [newCat, setNewCat] = useState(false);
  const remove = (id: string, name: string) => {
    if (!window.confirm(`"${name}" kategorisini silmek istiyor musunuz?`)) return;
    void deleteMediaCategory(id).then(() => router.refresh());
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Toolbar>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-500)", maxWidth: 560 }}>Kategoriler, ana sayfadaki “Görseller & Videolar” kartlarını besler. Bir medyayı bir kategoriye atadığında, o kategorinin kartına tıklayınca otomatik görünür.</p>
        <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={15} />} style={{ marginLeft: "auto" }} onClick={() => setNewCat(true)}>Kategori Oluştur</Button>
      </Toolbar>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {categories.map((c) => (
          <div key={c.id} style={{ ...cardStyle, padding: 16, display: "flex", alignItems: "center", gap: 13 }}>
            <span style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: c.color, display: "grid", placeItems: "center", color: "#fff", flex: "none" }}><Icon name="image" size={18} /></span>
            <div style={{ flex: 1, lineHeight: 1.3 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 17, color: "var(--text-strong)" }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{c.count} medya</div>
            </div>
            <IconButton label="Sil" variant="ghost" size="sm" onClick={() => remove(c.id, c.name)}><Icon name="trash-2" size={15} /></IconButton>
          </div>
        ))}
      </div>
      {newCat && <NewCategoryModal onClose={() => setNewCat(false)} />}
    </div>
  );
}

function NewCategoryModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#15295A");
  const [pending, startTransition] = useTransition();
  const COLORS = ["#15295A", "#C9A227", "#1E7D4F", "#B23A3A", "#3D5790"];
  const save = () =>
    startTransition(async () => {
      const res = await createMediaCategory({ name, color });
      if (res.ok) {
        onClose();
        router.refresh();
      }
    });
  return (
    <Modal open onClose={onClose} title="Yeni Kategori" width={420} footer={<><Button variant="secondary" size="sm" onClick={onClose}>İptal</Button><Button variant="primary" size="sm" onClick={save} disabled={pending}>Oluştur</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Kategori Adı" required><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="örn. Alt Yapı Seçmeleri" /></Field>
        <Field label="Renk">
          <div style={{ display: "flex", gap: 8 }}>
            {COLORS.map((col) => (
              <span key={col} onClick={() => setColor(col)} style={{ width: 30, height: 30, borderRadius: "var(--radius-sm)", background: col, cursor: "pointer", border: color === col ? "2px solid var(--navy-800)" : "2px solid #fff", boxShadow: "0 0 0 1px var(--ink-200)" }} />
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

/* ---------- Home cards tab ---------- */
function CardsTab({ cards, categories }: { cards: HomeCardItem[]; categories: CategoryItem[] }) {
  const [edit, setEdit] = useState<HomeCardItem | null>(null);
  const catColor = (id: string | null) => categories.find((c) => c.id === id)?.color ?? "var(--ink-400)";
  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "—";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-500)", maxWidth: 620 }}>Ana sayfadaki “Görseller & Videolar” bölümünü yönet. Kartın adını değiştir, bir kategori ata; ziyaretçi karta tıkladığında yalnızca o kategorideki medya görünür.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {cards.map((c) => (
          <div key={c.id} style={{ ...cardStyle, overflow: "hidden", display: "flex" }}>
            <div style={{ width: 120, flex: "none", background: "var(--grad-navy)", display: "grid", placeItems: "center", position: "relative" }}>
              {c.coverUrl ? <Image src={c.coverUrl} alt="" fill style={{ objectFit: "cover" }} sizes="120px" /> : <span style={{ color: "rgba(255,255,255,.16)" }}><Icon name={c.kind === "video" ? "play" : "image"} size={26} /></span>}
              {c.featured && <span style={{ position: "absolute", top: 8, left: 8 }}><Badge tone="gold">Öne çıkan</Badge></span>}
            </div>
            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 17, color: "var(--text-strong)", lineHeight: 1.1 }}>{c.title}</div>
                <IconButton label="Düzenle" variant="ghost" size="sm" onClick={() => setEdit(c)}><Icon name="pencil" size={15} /></IconButton>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--ink-600)" }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: catColor(c.categoryId) }} />
                  {catName(c.categoryId)}
                </span>
                <span style={{ fontSize: 12, color: "var(--ink-400)" }}>· {c.count} medya</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {edit && <CardDrawer card={edit} categories={categories} onClose={() => setEdit(null)} />}
    </div>
  );
}

function CardDrawer({ card, categories, onClose }: { card: HomeCardItem; categories: CategoryItem[]; onClose: () => void }) {
  const router = useRouter();
  const [v, setV] = useState({ title: card.title, categoryId: card.categoryId ?? "", featured: card.featured, coverUrl: card.coverUrl ?? "" });
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));
  const save = () =>
    startTransition(async () => {
      const res = await updateHomeCard(card.id, { title: v.title, categoryId: v.categoryId, featured: v.featured, coverUrl: v.coverUrl || null });
      if (res.ok) {
        onClose();
        router.refresh();
      }
    });
  return (
    <Drawer open onClose={onClose} title="Kartı Düzenle" subtitle="Ana sayfa medya kartı" width={460} footer={<><Button variant="secondary" size="sm" onClick={onClose}>İptal</Button><Button variant="primary" size="sm" onClick={save} disabled={pending}>Kaydet</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Kart Adı" required><TextInput value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>
        <Select label="Kategori" hint="Bu kategorideki medya karta otomatik dolar" placeholder="Seç" options={categories.map((c) => ({ value: c.id, label: c.name }))} value={v.categoryId} onChange={(e) => set("categoryId", e.target.value)} />
        <Field label="Kapak Görseli"><FileDrop value={v.coverUrl || null} onChange={(url) => set("coverUrl", url ?? "")} label="Kapak seç" aspect="16 / 10" /></Field>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13.5, color: "var(--ink-600)" }}>Öne çıkan kart (büyük gösterim)</span>
          <Switch checked={v.featured} onChange={(n) => set("featured", n)} />
        </div>
      </div>
    </Drawer>
  );
}

/* ---------- Root ---------- */
export function MediaView({ folders, assets, categories, cards }: { folders: FolderNode[]; assets: AssetItem[]; categories: CategoryItem[]; cards: HomeCardItem[] }) {
  const [tab, setTab] = useState("library");
  return (
    <>
      <ViewHeader
        title="Medya Kütüphanesi"
        subtitle="Görselleri ve videoları klasörle, kategorile ve ana sayfayı yönet"
        tabs={
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "library", label: "Kütüphane", icon: <Icon name="images" size={15} /> },
              { id: "categories", label: "Kategoriler", icon: <Icon name="folder" size={15} /> },
              { id: "cards", label: "Ana Sayfa Kartları", icon: <Icon name="layout-dashboard" size={15} /> },
            ]}
          />
        }
      />
      {tab === "library" && <LibraryTab folders={folders} assets={assets} categories={categories} />}
      {tab === "categories" && <CategoriesTab categories={categories} />}
      {tab === "cards" && <CardsTab cards={cards} categories={categories} />}
    </>
  );
}
