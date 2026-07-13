"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ViewHeader, Panel, Toolbar, Field, cardStyle } from "@/components/admin/kit";
import { TextInput, Modal, Drawer } from "@/components/admin/controls";
import { MediaLibraryPicker } from "@/components/admin/MediaLibraryPicker";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { createMediaCategory, deleteMediaCategory, createMediaAsset, deleteMediaAsset, createFolder, updateFolder, deleteFolder, createHomeCard, updateHomeCard, deleteHomeCard } from "@/app/admin/(panel)/medya/actions";
import { uploadFiles } from "@/lib/mediaUpload";
import { UploadDropzone } from "./UploadDropzone";

export type FolderNode = { id: string; name: string; parentId: string | null; categoryId: string | null };
export type AssetItem = { id: string; url: string; title: string; kind: string; categoryId: string | null; folderId: string | null };
export type CategoryItem = { id: string; name: string; color: string; count: number };
export type HomeCardItem = { id: string; title: string; categoryId: string | null; kind: string; featured: boolean; coverUrl: string | null; coverVideoUrl: string | null; count: number };

/** Seçilen dosya video mu? (MIME türünden — sunucu magic-byte ile doğrular). */
const isVideoFile = (file: File) => file.type.startsWith("video/");

/* ---------- Folder tree ---------- */
function FolderTree({ folders, counts, active, categories, onPick, onEdit }: { folders: FolderNode[]; counts: Record<string, number>; active: string; categories: CategoryItem[]; onPick: (id: string) => void; onEdit: (f: FolderNode) => void }) {
  const children = (pid: string | null) => folders.filter((f) => f.parentId === pid);
  const catColor = (id: string | null) => (id ? categories.find((c) => c.id === id)?.color : undefined);
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
          <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
          {f.categoryId && <span title="Kategoriye bağlı" style={{ width: 7, height: 7, borderRadius: "50%", background: catColor(f.categoryId) ?? "var(--ink-300)", flex: "none" }} />}
          <span style={{ fontSize: 11.5, color: "var(--ink-400)", fontFamily: "var(--font-stat)" }}>{counts[f.id] ?? 0}</span>
          <span
            onClick={(e) => { e.stopPropagation(); onEdit(f); }}
            title="Düzenle"
            style={{ display: "inline-flex", color: "var(--ink-300)", padding: 2, borderRadius: "var(--radius-sm)", flex: "none" }}
          >
            <Icon name="pencil" size={12} />
          </span>
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
  const [editFolder, setEditFolder] = useState<FolderNode | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [failures, setFailures] = useState<{ name: string; reason: string }[]>([]);
  const [uploadCategoryId, setUploadCategoryId] = useState("");
  const [, startTransition] = useTransition();

  const counts: Record<string, number> = {};
  for (const a of assets) if (a.folderId) counts[a.folderId] = (counts[a.folderId] ?? 0) + 1;
  if (root) counts[root.id] = assets.length;

  const current = folders.find((f) => f.id === folder) ?? root;
  const isRoot = current?.id === root?.id;
  // Kök klasörde tek bir kategoriye zorlamak yanlış olur (kök tüm klasörlerin
  // dosyalarını gösterir) — yalnız alt klasörlerin kendi kategorisi bağlayıcıdır.
  const folderCategoryId = !isRoot ? current?.categoryId ?? null : null;
  const folderCategory = folderCategoryId ? categories.find((c) => c.id === folderCategoryId) ?? null : null;
  const shown = assets.filter((a) => (isRoot || a.folderId === folder) && (catFilter === "" || a.categoryId === catFilter));

  // Klasör değişince yükleme kategorisi seçimini sıfırla (bir önceki klasörün
  // seçimi yeni klasöre sızmasın) — render sırasında türetilir, effect gerekmez.
  const [prevFolder, setPrevFolder] = useState(folder);
  if (folder !== prevFolder) {
    setPrevFolder(folder);
    setUploadCategoryId("");
  }

  // Küçük görsel yüklenene kadar shimmer placeholder gösterir.
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const markLoaded = (id: string) => setLoaded((s) => (s.has(id) ? s : new Set(s).add(id)));

  const effectiveCategoryId = folderCategoryId ?? uploadCategoryId;

  async function uploadMany(files: File[]) {
    if (!effectiveCategoryId) {
      setUploadError("Yüklemeden önce bir kategori seçiniz.");
      return;
    }
    setBusy(true);
    setUploadError(null);
    setFailures([]);
    // Her dosya AYRI /api/upload POST'u — böylece magic-byte + 5MB/30MB + rate-limit
    // HER dosyaya uygulanır (sadece ilkine değil). Kısmi başarı desteklenir.
    // kind, dosyanın MIME türünden belirlenir (video/* → "video", aksi "photo").
    const outcome = await uploadFiles(
      files,
      async (file) => {
        try {
          const fd = new FormData();
          fd.append("file", file);
          if (isVideoFile(file)) fd.append("kind", "video");
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) return { ok: false as const, reason: data?.error || `Yükleme başarısız (${res.status}).` };
          return { ok: true as const, url: data.url as string };
        } catch {
          return { ok: false as const, reason: "Ağ hatası." };
        }
      },
      async (url, file) => {
        const kind = isVideoFile(file) ? "video" : "photo";
        const created = await createMediaAsset({ url, title: file.name, folderId: isRoot ? "" : folder, categoryId: effectiveCategoryId, kind });
        return created.ok ? { ok: true as const } : { ok: false as const, reason: created.error || "Kaydedilemedi." };
      },
    );
    setFailures(outcome.failed);
    setBusy(false);
    if (outcome.okCount > 0) startTransition(() => router.refresh());
  }
  const removeAsset = (id: string) =>
    startTransition(async () => {
      await deleteMediaAsset(id);
      router.refresh();
    });

  return (
    <div className="media-lib-grid" style={{ display: "grid", gridTemplateColumns: "252px 1fr", gap: 18, alignItems: "start" }}>
      <Panel title="Klasörler" pad={10} action={<IconButton label="Yeni klasör" variant="ghost" size="sm" onClick={() => setNewFolder(true)}><Icon name="folder-plus" size={16} /></IconButton>}>
        <FolderTree folders={folders} counts={counts} active={folder} categories={categories} onPick={setFolder} onEdit={setEditFolder} />
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
        {failures.length > 0 && (
          <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>
            <strong>{failures.length} dosya reddedildi:</strong>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
              {failures.map((f) => (
                <li key={f.name}>
                  <span style={{ fontWeight: 600 }}>{f.name}</span> — {f.reason}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Field
          label="Yükleme Kategorisi"
          required
          hint={folderCategoryId ? `Bu klasörün kategorisinden otomatik alındı: ${folderCategory?.name ?? ""}. Değiştirilemez.` : "Klasör bir kategoriye bağlı değil — her yükleme için kategori seçmelisiniz."}
          style={{ maxWidth: 320 }}
        >
          <Select
            placeholder={folderCategoryId ? undefined : "Kategori seç"}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={effectiveCategoryId}
            onChange={(e) => setUploadCategoryId(e.target.value)}
            disabled={!!folderCategoryId}
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))", gap: 12 }}>
          <UploadDropzone onFiles={uploadMany} busy={busy} disabled={!effectiveCategoryId} />
          {shown.map((a) => (
            <div key={a.id} style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-subtle)", background: "var(--surface-subtle)" }}>
              {!loaded.has(a.id) && <div className="by-shimmer" style={{ position: "absolute", inset: 0 }} />}
              {a.kind === "video" ? (
                <>
                  <video
                    ref={(el) => {
                      // React 'muted' prop'u client'ta güvenilmez → DOM property'sini zorla.
                      if (el) el.muted = true;
                    }}
                    src={a.url}
                    preload="metadata"
                    muted
                    playsInline
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    onLoadedData={() => markLoaded(a.id)}
                  />
                  <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(8, 15, 33, 0.18)", pointerEvents: "none" }}>
                    <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255, 255, 255, 0.92)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-md)" }}>
                      <Icon name="play" size={13} style={{ color: "var(--navy-800)", fill: "var(--navy-800)", marginLeft: 1 }} />
                    </span>
                  </span>
                </>
              ) : (
                <Image src={a.url} alt={a.title} fill style={{ objectFit: "cover" }} sizes="132px" onLoad={() => markLoaded(a.id)} />
              )}
              <button type="button" onClick={() => removeAsset(a.id)} style={{ position: "absolute", top: 6, right: 6, display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: "var(--radius-sm)", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", cursor: "pointer" }}>
                <Icon name="trash-2" size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {newFolder && <FolderModal folders={folders} categories={categories} defaultParent={root?.id ?? null} onClose={() => setNewFolder(false)} />}
      {editFolder && <FolderModal folders={folders} categories={categories} defaultParent={null} folder={editFolder} onClose={() => setEditFolder(null)} />}
    </div>
  );
}

function FolderModal({ folders, categories, defaultParent, folder, onClose }: { folders: FolderNode[]; categories: CategoryItem[]; defaultParent: string | null; folder?: FolderNode | null; onClose: () => void }) {
  const router = useRouter();
  const isEdit = !!folder;
  const [name, setName] = useState(folder?.name ?? "");
  const [parent, setParent] = useState(defaultParent ?? "");
  const [categoryId, setCategoryId] = useState(folder?.categoryId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const save = () =>
    startTransition(async () => {
      const res = isEdit
        ? await updateFolder(folder!.id, { name, categoryId })
        : await createFolder({ name, parentId: parent, categoryId });
      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        setError(res.error ?? "Kaydedilemedi.");
      }
    });
  // Klasörü sil: içindeki medya klasörsüz kalır, alt klasörler üst klasöre taşınır
  // (deleteFolder action'ı bunu yapar) — medya SİLİNMEZ.
  const del = () => {
    if (!folder) return;
    if (!window.confirm(`"${folder.name}" klasörü silinsin mi? İçindeki medya klasörsüz kalır (silinmez), alt klasörler üst klasöre taşınır.`)) return;
    startTransition(async () => {
      await deleteFolder(folder.id);
      onClose();
      router.refresh();
    });
  };
  return (
    <Modal open onClose={onClose} title={isEdit ? "Klasörü Düzenle" : "Yeni Klasör"} width={420} footer={<>{isEdit && <span style={{ marginRight: "auto" }}><Button variant="ghost" size="sm" onClick={del} disabled={pending}>Sil</Button></span>}<Button variant="secondary" size="sm" onClick={onClose}>İptal</Button><Button variant="primary" size="sm" onClick={save} disabled={pending}>{isEdit ? "Kaydet" : "Oluştur"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
        <Field label="Klasör Adı" required><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="örn. U-16 Kamp" /></Field>
        {!isEdit && <Select label="Üst Klasör" options={folders.map((f) => ({ value: f.id, label: f.name }))} value={parent} onChange={(e) => setParent(e.target.value)} />}
        <Select
          label="Kategori"
          hint="Bağlarsanız bu klasöre yüklenen tüm dosyalar otomatik bu kategoriye atanır ve değiştirilemez."
          placeholder="Kategori yok"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />
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
  const [color, setColor] = useState("#26215F");
  const [pending, startTransition] = useTransition();
  const COLORS = ["#26215F", "#C9A227", "#1E7D4F", "#B23A3A", "#3D5790"];
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
  const router = useRouter();
  const [edit, setEdit] = useState<HomeCardItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [, startTransition] = useTransition();
  const remove = (c: HomeCardItem) => {
    if (!window.confirm(`"${c.title}" kartını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    startTransition(async () => {
      await deleteHomeCard(c.id);
      router.refresh();
    });
  };
  const catColor = (id: string | null) => categories.find((c) => c.id === id)?.color ?? "var(--ink-400)";
  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "—";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-500)", maxWidth: 620 }}>Ana sayfadaki “Görseller & Videolar” bölümünü yönet. Kartın adını değiştir, bir kategori ata; ziyaretçi karta tıkladığında yalnızca o kategorideki medya görünür.</p>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="primary" size="sm" onClick={() => setCreating(true)}>Yeni Kart</Button>
      </div>
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
                <div style={{ display: "flex", gap: 2, flex: "none" }}>
                  <IconButton label="Düzenle" variant="ghost" size="sm" onClick={() => setEdit(c)}><Icon name="pencil" size={15} /></IconButton>
                  <IconButton label="Sil" variant="ghost" size="sm" onClick={() => remove(c)}><Icon name="trash-2" size={15} /></IconButton>
                </div>
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
      {(edit || creating) && (
        <CardDrawer card={edit} categories={categories} onClose={() => { setEdit(null); setCreating(false); }} />
      )}
    </div>
  );
}

function CardDrawer({ card, categories, onClose }: { card: HomeCardItem | null; categories: CategoryItem[]; onClose: () => void }) {
  const router = useRouter();
  const isNew = !card;
  const [v, setV] = useState({
    title: card?.title ?? "",
    categoryId: card?.categoryId ?? "",
    kind: card?.kind ?? "photo",
    featured: card?.featured ?? false,
    coverUrl: card?.coverUrl ?? "",
    coverVideoUrl: card?.coverVideoUrl ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));
  const save = () =>
    startTransition(async () => {
      setError(null);
      const payload = { title: v.title, categoryId: v.categoryId, kind: v.kind, featured: v.featured, coverUrl: v.coverUrl || null, coverVideoUrl: v.coverVideoUrl || null };
      const res = isNew ? await createHomeCard(payload) : await updateHomeCard(card!.id, payload);
      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        setError(res.error ?? "Kaydedilemedi.");
      }
    });
  const remove = () => {
    if (!card) return;
    if (!window.confirm(`"${card.title}" kartını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;
    startTransition(async () => {
      await deleteHomeCard(card.id);
      onClose();
      router.refresh();
    });
  };
  return (
    <Drawer
      open
      onClose={onClose}
      title={isNew ? "Yeni Kart" : "Kartı Düzenle"}
      subtitle="Ana sayfa medya kartı"
      width={460}
      footer={
        <>
          {!isNew && (
            <span style={{ marginRight: "auto" }}>
              <Button variant="ghost" size="sm" onClick={remove} disabled={pending}>Sil</Button>
            </span>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>İptal</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>{isNew ? "Oluştur" : "Kaydet"}</Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
        <Field label="Kart Adı" required><TextInput value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>
        <Select label="Tür" options={[{ value: "photo", label: "Fotoğraf" }, { value: "video", label: "Video" }]} value={v.kind} onChange={(e) => set("kind", e.target.value)} />
        <Select label="Kategori" hint="Bu kategorideki medya karta otomatik dolar" placeholder="Seç" options={categories.map((c) => ({ value: c.id, label: c.name }))} value={v.categoryId} onChange={(e) => set("categoryId", e.target.value)} />
        <Field label={v.kind === "video" ? "Kapak Görseli (poster)" : "Kapak Görseli"}><MediaLibraryPicker value={v.coverUrl || null} onChange={(url) => set("coverUrl", url ?? "")} label="Kapak seç" aspect="16 / 10" /></Field>
        {v.kind === "video" && (
          <Field label="Kapak Videosu"><MediaLibraryPicker kind="video" icon="play" value={v.coverVideoUrl || null} onChange={(url) => set("coverVideoUrl", url ?? "")} label="Video seç" aspect="16 / 9" /></Field>
        )}
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
