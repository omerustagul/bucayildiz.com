"use client";

/**
 * Ortak medya seçici (Madde 4). Cihazdan dosya seçme yerine MEDYA KÜTÜPHANESİ
 * popup'ı açar: kütüphaneden seç VEYA o pencerede yeni medya yükle (kütüphaneye
 * eklenir + seçilir). API, controls.tsx'teki FileDrop ile uyumludur (value/onChange/
 * label/hint/aspect/compact/kind/style) → mevcut FileDrop'lar basit swap ile geçer.
 * Sporcu/veli kamera çekimleri (profil/öğün fotosu) BUNU kullanmaz — cihazdan kalır.
 */

import { useState, useEffect, useTransition, useRef } from "react";
import Image from "next/image";
import { Modal } from "@/components/admin/controls";
import { Select } from "@/components/ui/Select";
import { Icon, type IconName } from "@/lib/icons";
import {
  getMediaLibrary,
  createMediaAsset,
  type PickerAsset,
  type PickerCategory,
} from "@/app/admin/(panel)/medya/actions";

type Kind = "image" | "video";

const badgeBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 9px", borderRadius: "var(--radius-sm)",
  border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
};
const tabBtn: React.CSSProperties = {
  font: "inherit", cursor: "pointer", border: "none", background: "transparent", padding: "9px 14px",
  fontWeight: 600, fontSize: 13.5, color: "var(--ink-500)", borderBottom: "2px solid transparent", marginBottom: -1,
};
const tabBtnActive: React.CSSProperties = { color: "var(--navy-800)", borderBottom: "2px solid var(--gold-500)" };
const emptyStyle: React.CSSProperties = { padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 };
const checkBadge: React.CSSProperties = { position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "var(--gold-500)", color: "var(--navy-900)", display: "grid", placeItems: "center" };

export function MediaLibraryPicker({
  value,
  onChange,
  label = "Medyadan seç",
  hint,
  aspect = "16 / 10",
  compact = false,
  kind = "image",
  icon = "image",
  style = {},
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  aspect?: string;
  compact?: boolean;
  kind?: Kind;
  icon?: IconName;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        onClick={() => setOpen(true)}
        style={{
          position: "relative",
          aspectRatio: aspect,
          borderRadius: "var(--radius-md)",
          border: "1.5px dashed var(--ink-300)",
          background: value ? "var(--surface-subtle)" : "var(--ink-50)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          cursor: "pointer",
          ...style,
        }}
      >
        {value ? (
          <>
            {kind === "video" ? (
              <video ref={(el) => { if (el) el.muted = true; }} src={value} muted loop playsInline autoPlay style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Image src={value} alt="" fill style={{ objectFit: "contain" }} sizes="480px" />
            )}
            <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6, zIndex: 2 }}>
              <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(true); }} style={badgeBtn}>
                <Icon name="image" size={13} /> Değiştir
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); onChange(null); }} style={badgeBtn}>
                <Icon name="trash-2" size={13} /> Kaldır
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: compact ? 4 : 8 }}>
            <span style={{ width: compact ? 34 : 44, height: compact ? 34 : 44, borderRadius: "50%", background: "var(--navy-50)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}>
              <Icon name={icon} size={compact ? 17 : 20} />
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: compact ? 12.5 : 14, color: "var(--ink-700)" }}>{label}</span>
            {hint && !compact && <span style={{ fontSize: 12, color: "var(--ink-400)" }}>{hint}</span>}
          </div>
        )}
      </div>
      {open && (
        <PickerModal
          value={value ?? null}
          kind={kind}
          onPick={(url) => { onChange(url); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function PickerModal({ value, kind, onPick, onClose }: { value: string | null; kind: Kind; onPick: (url: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [assets, setAssets] = useState<PickerAsset[] | null>(null);
  const [categories, setCategories] = useState<PickerCategory[]>([]);
  const [catFilter, setCatFilter] = useState<string>("");
  const [loading, startLoad] = useTransition();

  const load = () => startLoad(async () => {
    const data = await getMediaLibrary();
    setAssets(data.assets);
    setCategories(data.categories);
  });
  // Açılışta bir kez çek.
  useEffect(() => { load(); }, []);

  const kindFilter = kind === "video" ? "video" : "photo";
  const shown = (assets ?? []).filter((a) => a.kind === kindFilter && (!catFilter || a.categoryId === catFilter));

  return (
    <Modal open onClose={onClose} title="Medya Seç" width={820}>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, borderBottom: "1px solid var(--border-subtle)" }}>
        <button type="button" onClick={() => setTab("library")} style={{ ...tabBtn, ...(tab === "library" ? tabBtnActive : {}) }}>Kütüphane</button>
        <button type="button" onClick={() => setTab("upload")} style={{ ...tabBtn, ...(tab === "upload" ? tabBtnActive : {}) }}>Yeni Yükle</button>
      </div>

      {tab === "library" ? (
        <>
          {categories.length > 0 && (
            <div style={{ marginBottom: 12, maxWidth: 260 }}>
              <Select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                options={[{ value: "", label: "Tüm kategoriler" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
              />
            </div>
          )}
          {loading && assets === null ? (
            <div style={emptyStyle}>Yükleniyor…</div>
          ) : shown.length === 0 ? (
            <div style={emptyStyle}>
              {kind === "video" ? "Kütüphanede video yok." : "Kütüphanede görsel yok."} “Yeni Yükle” sekmesinden ekleyebilirsiniz.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, maxHeight: 460, overflowY: "auto", padding: 2 }}>
              {shown.map((a) => {
                const active = value === a.url;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onPick(a.url)}
                    title={a.title}
                    style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: "var(--radius-md)", overflow: "hidden", border: active ? "2px solid var(--gold-500)" : "1px solid var(--border-subtle)", padding: 0, cursor: "pointer", background: "var(--surface-subtle)" }}
                  >
                    {a.kind === "video" ? (
                      <video ref={(el) => { if (el) el.muted = true; }} src={a.url} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Image src={a.url} alt={a.title} fill style={{ objectFit: "cover" }} sizes="130px" />
                    )}
                    {active && <span style={checkBadge}><Icon name="check" size={13} /></span>}
                  </button>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <UploadTab kind={kind} categories={categories} onUploaded={(url) => { load(); onPick(url); }} />
      )}
    </Modal>
  );
}

function UploadTab({ kind, categories, onUploaded }: { kind: Kind; categories: PickerCategory[]; onUploaded: (url: string) => void }) {
  const [catId, setCatId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!catId) { setError("Önce bir kategori seçin."); return; }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız.");
      const created = await createMediaAsset({ url: data.url, kind: kind === "video" ? "video" : "photo", categoryId: catId, title: file.name });
      if (!created.ok) throw new Error(created.error ?? "Kütüphaneye eklenemedi.");
      onUploaded(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {categories.length === 0 ? (
        <div style={emptyStyle}>Önce medya kütüphanesinde bir kategori oluşturun.</div>
      ) : (
        <>
          <Select
            label="Kategori"
            value={catId}
            onChange={(e) => setCatId(e.target.value)}
            placeholder="Kategori seçin"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
          <div
            onClick={() => catId && inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            style={{ borderRadius: "var(--radius-md)", border: "1.5px dashed var(--ink-300)", background: "var(--ink-50)", padding: "40px 16px", textAlign: "center", cursor: catId ? "pointer" : "not-allowed", opacity: catId ? 1 : 0.55 }}
          >
            <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--navy-50)", color: "var(--navy-600)", display: "inline-grid", placeItems: "center", marginBottom: 8 }}>
              <Icon name="image" size={20} />
            </span>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink-700)" }}>{busy ? "Yükleniyor…" : "Sürükle bırak / seç"}</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 4 }}>{kind === "video" ? "MP4, WEBM · en fazla 30 MB" : "JPG, PNG · otomatik sıkıştırılır"}</div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={kind === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/gif"}
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
          />
          {error && <span style={{ fontSize: 12.5, color: "var(--red-600)" }}>{error}</span>}
        </>
      )}
    </div>
  );
}
