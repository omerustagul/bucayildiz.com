"use client";

/**
 * Sayfa-bazlı SEO yöneticisi (Madde 6). Ayarlar > SEO sekmesinde site-geneli
 * alanların altında görünür. SEO_PAGES listesini gruplu gösterir; her sayfaya
 * tıklayınca özel başlık/açıklama/OG görseli düzenlenir (boş alanlar site-geneli
 * varsayılana düşer). OG görseli MediaLibraryPicker'dan seçilir (Faz 4).
 */

import { useState, useEffect, useTransition } from "react";
import { Drawer, TextInput, TextArea } from "@/components/admin/controls";
import { MediaLibraryPicker } from "@/components/admin/MediaLibraryPicker";
import { Field } from "@/components/admin/kit";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { SEO_PAGES, type SeoPage } from "@/lib/page-seo";
import { getPageSeoOverrides, savePageSeo, type PageSeoOverride } from "@/app/admin/(panel)/ayarlar/actions";

// Grupları SEO_PAGES sırasını koruyarak topla.
const GROUPS: [string, SeoPage[]][] = (() => {
  const out: [string, SeoPage[]][] = [];
  for (const p of SEO_PAGES) {
    let g = out.find(([name]) => name === p.group);
    if (!g) { g = [p.group, []]; out.push(g); }
    g[1].push(p);
  }
  return out;
})();

export function PageSeoManager() {
  const [overrides, setOverrides] = useState<Record<string, PageSeoOverride>>({});
  const [edit, setEdit] = useState<SeoPage | null>(null);
  const [, startLoad] = useTransition();

  const load = () => startLoad(async () => setOverrides(await getPageSeoOverrides()));
  useEffect(() => { load(); }, []);

  const hasOverride = (path: string) => {
    const o = overrides[path];
    return !!o && !!(o.title || o.description || o.ogImageUrl);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <p style={{ fontSize: 13.5, color: "var(--ink-500)", margin: 0, lineHeight: 1.6 }}>
        Her sayfaya özel başlık, açıklama ve paylaşım görseli tanımlayabilirsiniz.
        Boş bıraktığınız alanlar yukarıdaki <b>site-geneli</b> varsayılana düşer.
      </p>
      {GROUPS.map(([groupName, pages]) => (
        <div key={groupName} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--navy-600)" }}>{groupName}</div>
          <div style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            {pages.map((p, i) => (
              <button
                key={p.path}
                type="button"
                onClick={() => setEdit(p)}
                style={{
                  font: "inherit", cursor: "pointer", textAlign: "left", background: "var(--surface-card)",
                  border: "none", borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)",
                  display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 600, fontSize: 14, color: "var(--text-strong)" }}>{p.label}</span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--ink-400)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.path}</span>
                </span>
                {hasOverride(p.path) ? (
                  <span style={{ flex: "none", fontSize: 11, fontWeight: 700, color: "var(--navy-900)", background: "var(--grad-gold)", borderRadius: "var(--radius-pill)", padding: "2px 9px" }}>Özel</span>
                ) : (
                  <span style={{ flex: "none", fontSize: 11.5, color: "var(--ink-400)" }}>Varsayılan</span>
                )}
                <span style={{ flex: "none", display: "inline-flex", color: "var(--ink-300)" }}><Icon name="chevron-right" size={16} /></span>
              </button>
            ))}
          </div>
        </div>
      ))}
      {edit && (
        <PageSeoEditor
          page={edit}
          current={overrides[edit.path]}
          onSaved={() => { load(); setEdit(null); }}
          onClose={() => setEdit(null)}
        />
      )}
    </div>
  );
}

function PageSeoEditor({ page, current, onSaved, onClose }: { page: SeoPage; current?: PageSeoOverride; onSaved: () => void; onClose: () => void }) {
  const [title, setTitle] = useState(current?.title ?? "");
  const [description, setDescription] = useState(current?.description ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(current?.ogImageUrl ?? "");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const save = () => start(async () => {
    setError(null);
    const res = await savePageSeo({ path: page.path, title, description, ogImageUrl });
    if (res.ok) onSaved();
    else setError(res.error);
  });

  return (
    <Drawer
      open
      onClose={onClose}
      title={`SEO — ${page.label}`}
      subtitle={page.path}
      width={520}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>İptal</Button>
          <Button onClick={save} disabled={pending}>{pending ? "Kaydediliyor…" : "Kaydet"}</Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Sayfa Başlığı" hint="Tarayıcı sekmesi + arama sonucu başlığı. Boşsa site-geneli başlık kullanılır.">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: İletişim — Buca Yıldız Futbol Akademisi" maxLength={120} />
        </Field>
        <Field label="Meta Açıklama" hint="Arama sonuçlarında görünen özet (≈160 karakter ideal). Boşsa site-geneli.">
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={300} />
        </Field>
        <Field label="Paylaşım Görseli (OG)" hint="Sosyal medyada paylaşımda görünen görsel (1200×630 ideal). Boşsa site-geneli.">
          <MediaLibraryPicker value={ogImageUrl || null} onChange={(url) => setOgImageUrl(url ?? "")} label="OG görseli seç" aspect="1200 / 630" icon="image" />
        </Field>
        {error && <span style={{ fontSize: 13, color: "var(--red-600)" }}>{error}</span>}
        <p style={{ fontSize: 12, color: "var(--ink-400)", margin: 0 }}>Tüm alanları boş bırakıp kaydederseniz bu sayfa site-geneli SEO&apos;ya döner.</p>
      </div>
    </Drawer>
  );
}
