"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ViewHeader, Toolbar, Panel, Field, Stepper, cardStyle } from "@/components/admin/kit";
import { TextInput, TextArea, SearchBox, FileDrop } from "@/components/admin/controls";
import { Table, type Column } from "@/components/ui/Table";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/lib/icons";
import { POST_TEMPLATES, POST_CATEGORIES } from "@/lib/enums";
import { createPost, updatePost, deletePost } from "@/app/admin/(panel)/haberler/actions";

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  template: string;
  status: string;
  coverUrl: string | null;
  excerpt: string;
  body: string;
  author: string;
  featured: boolean;
  publishedAt: string | null;
};

const STATUS: Record<string, { tone: "success" | "neutral" | "gold"; label: string }> = {
  published: { tone: "success", label: "Yayında" },
  draft: { tone: "neutral", label: "Taslak" },
  scheduled: { tone: "gold", label: "Planlı" },
};
const templateName = (id: string) => POST_TEMPLATES.find((t) => t.id === id)?.name ?? id;
const fmt = (d: string | null) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return day && m && y ? `${day}.${m}.${y}` : d;
};
function slugify(s: string) {
  return s
    .toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u").replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// ---------- Wizard ----------
function Wizard({ post, onExit }: { post: PostRow | null; onExit: () => void }) {
  const router = useRouter();
  const isNew = !post;
  const [step, setStep] = useState(isNew ? 0 : 1);
  const [f, setF] = useState({
    template: post?.template ?? "standart",
    coverUrl: post?.coverUrl ?? "",
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    category: post?.category ?? "",
    author: post?.author ?? "Basın",
    publishedAt: post?.publishedAt ?? "",
    featured: post?.featured ?? false,
  });
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const tpl = POST_TEMPLATES.find((t) => t.id === f.template) ?? POST_TEMPLATES[3];
  const canNext = step === 0 ? !!f.template : true;

  const save = (status: string) => {
    setError(null);
    const payload = { ...f, slug: f.slug || slugify(f.title) || "yeni-haber", status };
    startTransition(async () => {
      const res = isNew ? await createPost(payload) : await updatePost(post!.id, payload);
      if (res?.error) setError(res.error);
    });
  };
  const remove = () => {
    if (!post || !window.confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deletePost(post.id);
    });
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <IconButton label="Çık" variant="outline" onClick={onExit}>
            <Icon name="arrow-left" size={18} />
          </IconButton>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 26, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{isNew ? "Yeni Haber" : "Haberi Düzenle"}</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!isNew && (
            <Button variant="ghost" size="sm" style={{ color: "var(--red-600)" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>
              Sil
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => save("draft")} disabled={pending}>
            Taslak olarak kaydet
          </Button>
        </div>
      </div>

      <Panel>
        <div style={{ maxWidth: 560, margin: "0 auto 4px" }}>
          <Stepper steps={["Şablon", "İçerik", "Yayınla"]} current={step} />
        </div>
      </Panel>

      <Panel pad={26}>
        {/* STEP 0 — template */}
        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 6px" }}>Bir şablon seç</h2>
            <p style={{ fontSize: 14, color: "var(--ink-500)", margin: "0 0 22px" }}>Yazının türüne uygun hazır bir düzen seç — sonraki adımda görselleri ve metinleri dolduracaksın.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {POST_TEMPLATES.map((t) => {
                const on = f.template === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => set("template", t.id)}
                    style={{ textAlign: "left", cursor: "pointer", font: "inherit", padding: 18, borderRadius: "var(--radius-lg)", border: `1.5px solid ${on ? "var(--navy-700)" : "var(--border-subtle)"}`, background: on ? "var(--navy-50)" : "var(--surface-card)", boxShadow: on ? "var(--ring-focus)" : "var(--shadow-xs)", transition: "all var(--dur-fast)", position: "relative" }}
                  >
                    {on && <span style={{ position: "absolute", top: 14, right: 14, color: "var(--navy-700)" }}><Icon name="check" size={20} /></span>}
                    <span style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: on ? "var(--navy-700)" : "var(--navy-50)", color: on ? "var(--gold-400)" : "var(--navy-600)", display: "grid", placeItems: "center", marginBottom: 14 }}>
                      <Icon name={t.icon as IconName} size={21} />
                    </span>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 19, textTransform: "uppercase", color: "var(--text-strong)", marginBottom: 6 }}>{t.name}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ink-500)", margin: "0 0 12px" }}>{t.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {t.blocks.map((b) => (
                        <span key={b} style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-500)", background: "var(--ink-100)", borderRadius: "var(--radius-xs)", padding: "3px 7px" }}>{b}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1 — content + preview */}
        {step === 1 && (
          <div className="post-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold-700)" }}>{tpl.name} · İçerik</div>
              <Field label="Kapak görseli" required>
                <FileDrop value={f.coverUrl || null} onChange={(url) => set("coverUrl", url ?? "")} label="Kapak görseli yükle" hint="1600×900 önerilir" aspect="16 / 9" />
              </Field>
              <Field label="Başlık" required>
                <TextInput value={f.title} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} placeholder="Haber başlığı" />
              </Field>
              <Field label="Özet / Spot">
                <TextArea rows={2} value={f.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Kısa giriş metni (manşet altı)" />
              </Field>
              <Field label="Metin">
                <TextArea rows={7} value={f.body} onChange={(e) => set("body", e.target.value)} placeholder="Haber metni… (paragrafları boş satırla ayırın)" />
              </Field>
            </div>
            {/* Live preview */}
            <div style={{ position: "sticky", top: 16 }}>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-400)", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                <Icon name="eye" size={14} /> Canlı Önizleme
              </div>
              <div style={{ ...cardStyle, overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "16 / 9", background: "var(--grad-navy)", display: "grid", placeItems: "center" }}>
                  {f.coverUrl ? <Image src={f.coverUrl} alt="" fill style={{ objectFit: "cover" }} sizes="480px" /> : <span style={{ color: "rgba(255,255,255,.14)" }}><Icon name="image" size={34} /></span>}
                  <div style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />
                  <span style={{ position: "absolute", left: 16, bottom: 14 }}><Badge tone="gold">{tpl.tag}</Badge></span>
                </div>
                <div style={{ padding: 22 }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 26, lineHeight: 1.02, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{f.title || "Haber Başlığı Buraya Gelecek"}</h3>
                  {f.excerpt && <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-600)", margin: "12px 0 0", fontWeight: 500 }}>{f.excerpt}</p>}
                  <div style={{ width: 48, height: 3, background: "var(--grad-gold)", borderRadius: 999, margin: "16px 0" }} />
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--ink-600)", margin: 0, whiteSpace: "pre-wrap" }}>{f.body || "Metin alanına yazdıkça burada anında görünür."}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — publish */}
        {step === 2 && (
          <div className="post-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 22, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Yayın ayarları</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Select label="Kategori" required placeholder="Seç" options={[...POST_CATEGORIES]} value={f.category} onChange={(e) => set("category", e.target.value)} />
                <Field label="Yazar"><TextInput value={f.author} onChange={(e) => set("author", e.target.value)} /></Field>
                <Field label="Yayın Tarihi"><TextInput type="date" value={f.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} /></Field>
                <Field label="URL Kısaltması" hint="bucayildiz.com/haberler/…"><TextInput value={f.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} /></Field>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, background: "var(--surface-subtle)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>Ana sayfada öne çıkar</span>
                  <Switch checked={f.featured} onChange={(n) => set("featured", n)} />
                </div>
              </div>
              {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
            </div>
            {/* summary card */}
            <div style={{ ...cardStyle, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-400)" }}>Özet</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--navy-50)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}><Icon name={tpl.icon as IconName} size={18} /></span>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{tpl.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-400)" }}>Şablon</div>
                </div>
              </div>
              <div style={{ height: 1, background: "var(--border-subtle)" }} />
              <div style={{ fontSize: 14, color: "var(--text-strong)", fontWeight: 600, lineHeight: 1.3 }}>{f.title || "Başlıksız haber"}</div>
              <div style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.5 }}>{f.excerpt || "Özet girilmedi."}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge tone="outline">{f.category || "Kategori yok"}</Badge>
                {f.featured && <Badge tone="gold">Öne çıkan</Badge>}
              </div>
            </div>
          </div>
        )}
      </Panel>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", bottom: 0, background: "var(--surface-subtle)", padding: "14px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <Button variant="secondary" size="md" leftIcon={<Icon name="arrow-left" size={16} />} onClick={() => (step === 0 ? onExit() : setStep(step - 1))}>
          {step === 0 ? "Vazgeç" : "Geri"}
        </Button>
        <div style={{ fontSize: 13, color: "var(--ink-400)" }}>Adım {step + 1} / 3</div>
        {step < 2 ? (
          <Button variant="primary" size="md" rightIcon={<Icon name="arrow-right" size={16} />} disabled={!canNext} onClick={() => canNext && setStep(step + 1)}>
            Devam Et
          </Button>
        ) : (
          <Button variant="accent" size="md" leftIcon={<Icon name="send" size={16} />} onClick={() => save("published")} disabled={pending}>
            {pending ? "Yayınlanıyor…" : "Yayınla"}
          </Button>
        )}
      </div>
    </>
  );
}

// ---------- List ----------
export function BlogView({ posts }: { posts: PostRow[] }) {
  const [mode, setMode] = useState<{ post: PostRow | null } | null>(null);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () => posts.filter((p) => (tab === "all" || p.status === tab) && (q.trim() === "" || p.title.toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")))),
    [posts, tab, q],
  );
  const tabs = [
    { id: "all", label: "Tümü", count: posts.length },
    { id: "published", label: "Yayında", count: posts.filter((p) => p.status === "published").length },
    { id: "draft", label: "Taslak", count: posts.filter((p) => p.status === "draft").length },
    { id: "scheduled", label: "Planlı", count: posts.filter((p) => p.status === "scheduled").length },
  ];

  const cols: Column<PostRow>[] = [
    {
      key: "title",
      label: "Başlık",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 46, height: 34, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--grad-navy)", display: "grid", placeItems: "center", color: "rgba(255,255,255,.2)", flex: "none" }}>
            {r.coverUrl ? <Image src={r.coverUrl} alt="" fill style={{ objectFit: "cover" }} sizes="46px" /> : <Icon name="image" size={15} />}
          </div>
          <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>
            {r.featured && <span style={{ color: "var(--gold-500)", marginRight: 5 }}>★</span>}
            {r.title}
          </div>
        </div>
      ),
    },
    { key: "template", label: "Şablon", render: (r) => <Badge tone="outline">{templateName(r.template)}</Badge> },
    { key: "author", label: "Yazar", render: (r) => <span style={{ fontSize: 13, color: "var(--ink-500)" }}>{r.author || "—"}</span> },
    { key: "publishedAt", label: "Tarih", render: (r) => <span style={{ fontFamily: "var(--font-stat)", fontSize: 13 }}>{fmt(r.publishedAt)}</span> },
    { key: "status", label: "Durum", align: "center", render: (r) => <Badge tone={STATUS[r.status]?.tone ?? "neutral"} dot={r.status === "scheduled"}>{STATUS[r.status]?.label ?? r.status}</Badge> },
    { key: "go", label: "", width: 44, align: "right", render: () => <span style={{ color: "var(--ink-300)", display: "inline-flex" }}><Icon name="pencil" size={15} /></span> },
  ];

  if (mode) return <Wizard post={mode.post} onExit={() => setMode(null)} />;

  return (
    <>
      <ViewHeader
        title="Haberler / Blog"
        subtitle="Şablonlarla adım adım profesyonel haber sayfaları oluştur"
        actions={
          <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setMode({ post: null })}>
            Yeni Yazı
          </Button>
        }
        tabs={<Tabs tabs={tabs} value={tab} onChange={setTab} />}
      />
      <Toolbar>
        <SearchBox placeholder="Başlık ara…" value={q} onChange={setQ} />
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--ink-400)" }}>{rows.length} yazı</span>
      </Toolbar>
      <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setMode({ post: r })} empty="İçerik bulunamadı." />
    </>
  );
}
