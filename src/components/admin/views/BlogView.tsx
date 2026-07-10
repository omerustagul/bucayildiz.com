"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { ViewHeader, Toolbar, Panel, Field, Stepper, cardStyle } from "@/components/admin/kit";
import { TextInput, TextArea, SearchBox, FileDrop } from "@/components/admin/controls";
import { Table, type Column } from "@/components/ui/Table";
import { CardList, CardEmpty, DataCard, CardHeader, CardFields } from "@/components/admin/MobileCardList";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/lib/icons";
import { POST_TEMPLATES, POST_CATEGORIES } from "@/lib/enums";
import { toast } from "@/components/ui/Toast";
import { createPost, updatePost, deletePost } from "@/app/admin/(panel)/haberler/actions";
import {
  defaultTemplateData,
  parseTemplateData,
  type MacraporuData,
  type GaleriData,
  type RoportajData,
  type DuyuruData,
  type GoalRow,
  type PhotoRow,
  type QaRow,
} from "@/lib/postTemplates";

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
  templateData: string;
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
const BODY_LABELS: Record<string, string> = {
  macraporu: "Maç Anlatımı",
  galeri: "Kısa Metin",
  roportaj: "Giriş Metni",
  sondakika: "Kısa Metin",
  duyuru: "Bilgilendirme Metni",
};
const bodyLabel = (template: string) => BODY_LABELS[template] ?? "Metin";
const BODY_HINTS: Record<string, string> = {
  roportaj: "Soru-cevap bloklarından önce görünen kısa giriş.",
  duyuru: "Duyurunun ana metni — resmî ve sade tutulması önerilir.",
};
const bodyHint = (template: string) => BODY_HINTS[template];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u").replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// ---------- Ortak dinamik-liste satırı stilleri ----------
const rowCardStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" };
const removeBtnStyle: React.CSSProperties = { flex: "none", width: 34, height: 34, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--red-600)", cursor: "pointer", display: "grid", placeItems: "center" };
const addBtnStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--navy-400)", background: "var(--navy-50)", color: "var(--navy-800)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, cursor: "pointer" };
const emptyHintStyle: React.CSSProperties = { fontSize: 13, color: "var(--text-muted)", padding: "12px 14px", background: "var(--surface-subtle)", border: "1px dashed var(--border-subtle)", borderRadius: "var(--radius-md)" };
const subLabelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--text-strong)", marginBottom: 8 };

// ---------- Şablona özgü içerik editörleri ----------

/** Maç Raporu — skor, gol listesi, maç kareleri. */
function MacraporuFields({ data, onChange }: { data: MacraporuData; onChange: (d: MacraporuData) => void }) {
  const set = <K extends keyof MacraporuData>(k: K, v: MacraporuData[K]) => onChange({ ...data, [k]: v });
  const setGoal = (i: number, patch: Partial<GoalRow>) => set("goals", data.goals.map((g, j) => (j === i ? { ...g, ...patch } : g)));
  const addGoal = () => set("goals", [...data.goals, { minute: "", player: "", team: "us" }]);
  const removeGoal = (i: number) => set("goals", data.goals.filter((_, j) => j !== i));
  const setPhoto = (i: number, url: string) => set("gallery", data.gallery.map((u, j) => (j === i ? url : u)));
  const addPhoto = (url: string) => set("gallery", [...data.gallery, url]);
  const removePhoto = (i: number) => set("gallery", data.gallery.filter((_, j) => j !== i));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Rakip Takım"><TextInput value={data.opponent} onChange={(e) => set("opponent", e.target.value)} placeholder="Rakip adı" /></Field>
        <Field label="Turnuva / Lig"><TextInput value={data.competition} onChange={(e) => set("competition", e.target.value)} placeholder="Örn. U17 Ligi" /></Field>
        <Field label="Bizim Skor"><TextInput type="number" min={0} value={data.ourScore} onChange={(e) => set("ourScore", e.target.value)} placeholder="0" /></Field>
        <Field label="Rakip Skor"><TextInput type="number" min={0} value={data.oppScore} onChange={(e) => set("oppScore", e.target.value)} placeholder="0" /></Field>
        <Field label="Maç Tarihi"><TextInput type="date" value={data.matchDate} onChange={(e) => set("matchDate", e.target.value)} /></Field>
        <Field label="Saha">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "0 2px" }}>
            <span style={{ fontSize: 14, color: "var(--ink-700)" }}>{data.isHome ? "Ev sahibiyiz" : "Deplasmandayız"}</span>
            <Switch checked={data.isHome} onChange={(n) => set("isHome", n)} />
          </div>
        </Field>
      </div>

      <div>
        <div style={subLabelStyle}>Gol Listesi</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.goals.length === 0 && <div style={emptyHintStyle}>Henüz gol eklenmedi.</div>}
          {data.goals.map((g, i) => (
            <div key={i} className="by-row-in" style={rowCardStyle}>
              <TextInput value={g.minute} onChange={(e) => setGoal(i, { minute: e.target.value })} placeholder="45'" aria-label="Dakika" style={{ width: 58, flex: "none" }} />
              <TextInput value={g.player} onChange={(e) => setGoal(i, { player: e.target.value })} placeholder="Oyuncu adı" aria-label="Oyuncu adı" style={{ flex: 1, minWidth: 0 }} />
              <Select value={g.team} onChange={(e) => setGoal(i, { team: e.target.value as "us" | "them" })} options={[{ value: "us", label: "Bizim" }, { value: "them", label: "Rakip" }]} containerStyle={{ width: 116, flex: "none" }} />
              <button type="button" aria-label="Golü kaldır" onClick={() => removeGoal(i)} style={removeBtnStyle}>
                <Icon name="trash-2" size={15} />
              </button>
            </div>
          ))}
          <div><button type="button" onClick={addGoal} style={addBtnStyle}><Icon name="plus" size={15} /> Gol Ekle</button></div>
        </div>
      </div>

      <div>
        <div style={subLabelStyle}>Maç Kareleri</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {data.gallery.map((url, i) => (
            <div key={i} className="by-row-in">
              <FileDrop value={url} onChange={(u) => (u ? setPhoto(i, u) : removePhoto(i))} compact aspect="4 / 3" label="" />
            </div>
          ))}
          <FileDrop value={null} onChange={(u) => u && addPhoto(u)} compact aspect="4 / 3" label="Kare Ekle" icon="camera" />
        </div>
      </div>
    </div>
  );
}

/** Galeri / Ödül Töreni — foto ızgarası, opsiyonel kısa açıklamalar. */
function GaleriFields({ data, onChange }: { data: GaleriData; onChange: (d: GaleriData) => void }) {
  const setPhoto = (i: number, patch: Partial<PhotoRow>) => onChange({ photos: data.photos.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  const addPhoto = (url: string) => onChange({ photos: [...data.photos, { url, caption: "" }] });
  const removePhoto = (i: number) => onChange({ photos: data.photos.filter((_, j) => j !== i) });
  return (
    <div>
      <div style={subLabelStyle}>Foto Izgarası</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {data.photos.map((p, i) => (
          <div key={i} className="by-row-in" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <FileDrop value={p.url} onChange={(u) => (u ? setPhoto(i, { url: u }) : removePhoto(i))} compact aspect="4 / 3" label="" />
            <TextInput value={p.caption} onChange={(e) => setPhoto(i, { caption: e.target.value })} placeholder="Kısa açıklama (opsiyonel)" style={{ fontSize: 12.5, padding: "8px 10px" }} />
          </div>
        ))}
        <FileDrop value={null} onChange={(u) => u && addPhoto(u)} compact aspect="4 / 3" label="Fotoğraf Ekle" icon="images" />
      </div>
    </div>
  );
}

/** Röportaj — portre, öne çıkan alıntı, soru-cevap blokları. */
function RoportajFields({ data, onChange }: { data: RoportajData; onChange: (d: RoportajData) => void }) {
  const set = <K extends keyof RoportajData>(k: K, v: RoportajData[K]) => onChange({ ...data, [k]: v });
  const setQa = (i: number, patch: Partial<QaRow>) => set("qa", data.qa.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  const addQa = () => set("qa", [...data.qa, { q: "", a: "" }]);
  const removeQa = (i: number) => set("qa", data.qa.filter((_, j) => j !== i));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Field label="Portre Görseli"><FileDrop value={data.portraitUrl || null} onChange={(url) => set("portraitUrl", url ?? "")} label="Portre yükle" hint="3:4 önerilir" aspect="3 / 4" /></Field>
      <Field label="Öne Çıkan Alıntı"><TextInput value={data.quote} onChange={(e) => set("quote", e.target.value)} placeholder="Röportajdan öne çıkan tek cümle" /></Field>
      <div>
        <div style={subLabelStyle}>Soru – Cevap</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.qa.length === 0 && <div style={emptyHintStyle}>Henüz soru eklenmedi.</div>}
          {data.qa.map((row, i) => (
            <div key={i} className="by-row-in" style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: "none", fontFamily: "var(--font-stat)", fontSize: 12, fontWeight: 700, color: "var(--gold-700)" }}>S{i + 1}</span>
                <TextInput value={row.q} onChange={(e) => setQa(i, { q: e.target.value })} placeholder="Soru" aria-label="Soru" style={{ flex: 1, minWidth: 0 }} />
                <button type="button" aria-label="Soruyu kaldır" onClick={() => removeQa(i)} style={removeBtnStyle}>
                  <Icon name="trash-2" size={15} />
                </button>
              </div>
              <TextArea rows={2} value={row.a} onChange={(e) => setQa(i, { a: e.target.value })} placeholder="Cevap" aria-label="Cevap" />
            </div>
          ))}
          <div><button type="button" onClick={addQa} style={addBtnStyle}><Icon name="plus" size={15} /> Soru Ekle</button></div>
        </div>
      </div>
    </div>
  );
}

/** Duyuru — opsiyonel iletişim satırı. */
function DuyuruFields({ data, onChange }: { data: DuyuruData; onChange: (d: DuyuruData) => void }) {
  return (
    <Field label="İletişim Satırı" hint="Opsiyonel — telefon veya e-posta. Bilgilendirme metninin altında gösterilir.">
      <TextInput value={data.contact} onChange={(e) => onChange({ contact: e.target.value })} placeholder="0232 000 00 00 veya iletisim@bucayildiz.com" />
    </Field>
  );
}

// ---------- Wizard ----------
function Wizard({ post, onExit }: { post: PostRow | null; onExit: () => void }) {
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
  // Şablona özgü yapılandırılmış veri — templateData JSON'unun (client-tarafı) hâli
  const [td, setTd] = useState<Record<string, unknown>>(() => parseTemplateData(post?.template ?? "standart", post?.templateData));

  const tpl = POST_TEMPLATES.find((t) => t.id === f.template) ?? POST_TEMPLATES[3];
  const canNext = step === 0 ? !!f.template : true;

  const save = (status: string) => {
    setError(null);
    const payload = { ...f, slug: f.slug || slugify(f.title) || "yeni-haber", status, templateData: JSON.stringify(td) };
    startTransition(async () => {
      const res = isNew ? await createPost(payload) : await updatePost(post!.id, payload);
      if (res?.error) setError(res.error);
      else toast.success(status === "published" ? "Haber yayınlandı." : "Taslak kaydedildi.");
    });
  };
  const remove = () => {
    if (!post || !window.confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deletePost(post.id);
      toast.success("Haber silindi.");
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
                    onClick={() => {
                      set("template", t.id);
                      if (t.id !== f.template) setTd(defaultTemplateData(t.id));
                    }}
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
              <Field
                label="Kapak görseli"
                required={f.template !== "sondakika"}
                hint={f.template === "sondakika" ? "Son dakika haberlerinde kapak görseli şiddetle önerilir." : undefined}
              >
                <FileDrop value={f.coverUrl || null} onChange={(url) => set("coverUrl", url ?? "")} label="Kapak görseli yükle" hint="1600×900 önerilir" aspect="16 / 9" />
              </Field>
              <Field label="Başlık" required>
                <TextInput value={f.title} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} placeholder="Haber başlığı" />
              </Field>
              <Field label="Özet / Spot">
                <TextArea rows={2} value={f.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Kısa giriş metni (manşet altı)" />
              </Field>

              {f.template === "sondakika" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)" }}>
                  <Icon name="zap" size={16} style={{ color: "var(--red-600)", flex: "none" }} />
                  <span style={{ fontSize: 12.5, color: "var(--red-600)" }}>Bu haber sitede kırmızı “SON DAKİKA” rozetiyle gösterilir — ek alan gerekmez.</span>
                </div>
              )}
              {f.template === "duyuru" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: "var(--navy-50)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
                  <Icon name="megaphone" size={16} style={{ color: "var(--navy-700)", flex: "none" }} />
                  <span style={{ fontSize: 12.5, color: "var(--ink-600)" }}>Duyurular sitede kulüp logosuyla resmî, sade bir blok olarak gösterilir.</span>
                </div>
              )}

              {f.template === "macraporu" && <MacraporuFields data={td as MacraporuData} onChange={(d) => setTd(d as Record<string, unknown>)} />}
              {f.template === "galeri" && <GaleriFields data={td as GaleriData} onChange={(d) => setTd(d as Record<string, unknown>)} />}
              {f.template === "roportaj" && <RoportajFields data={td as RoportajData} onChange={(d) => setTd(d as Record<string, unknown>)} />}
              {f.template === "duyuru" && <DuyuruFields data={td as DuyuruData} onChange={(d) => setTd(d as Record<string, unknown>)} />}

              <Field label={bodyLabel(f.template)} hint={bodyHint(f.template)}>
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
      <div className="adm-table-wrap">
        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setMode({ post: r })} empty="İçerik bulunamadı." />
      </div>
      <CardList>
        {rows.length === 0 ? (
          <CardEmpty>İçerik bulunamadı.</CardEmpty>
        ) : (
          rows.map((r) => (
            <DataCard key={r.id} onClick={() => setMode({ post: r })}>
              <CardHeader
                avatar={
                  <div style={{ position: "relative", width: 46, height: 34, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--grad-navy)", display: "grid", placeItems: "center", color: "rgba(255,255,255,.2)", flex: "none" }}>
                    {r.coverUrl ? <Image src={r.coverUrl} alt="" fill style={{ objectFit: "cover" }} sizes="46px" /> : <Icon name="image" size={15} />}
                  </div>
                }
                title={
                  <>
                    {r.featured && <span style={{ color: "var(--gold-500)", marginRight: 5 }}>★</span>}
                    {r.title}
                  </>
                }
                subtitle={templateName(r.template)}
                badge={<Badge tone={STATUS[r.status]?.tone ?? "neutral"} dot={r.status === "scheduled"}>{STATUS[r.status]?.label ?? r.status}</Badge>}
              />
              <CardFields
                items={[
                  { label: "Yazar", value: r.author || "—" },
                  { label: "Tarih", value: fmt(r.publishedAt) },
                ]}
              />
            </DataCard>
          ))
        )}
      </CardList>
    </>
  );
}
