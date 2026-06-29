"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ViewHeader, Field, cardStyle } from "@/components/admin/kit";
import { TextInput, Modal, FileDrop } from "@/components/admin/controls";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { createJersey, updateJersey, deleteJersey } from "@/app/admin/(panel)/formalar/actions";

export type JerseyRow = {
  id: string;
  name: string;
  kind: string;
  primary: string;
  accent: string;
  description: string;
  imageUrl: string | null;
  active: boolean;
  sort: number;
};

const KINDS = [
  { id: "home", name: "İç Saha" },
  { id: "away", name: "Deplasman" },
  { id: "third", name: "Üçüncü" },
  { id: "gk", name: "Kaleci" },
  { id: "other", name: "Alternatif" },
];
const kindName = (k: string) => KINDS.find((x) => x.id === k)?.name ?? k;

const JERSEY_CLIP = "polygon(30% 0,42% 8%,58% 8%,70% 0,100% 14%,87% 39%,78% 30%,78% 100%,22% 100%,22% 30%,13% 39%,0 14%)";

function JerseyShape({ primary, accent }: { primary: string; accent: string }) {
  return (
    <div style={{ position: "relative", width: 120, height: 140, filter: "drop-shadow(0 12px 18px rgba(14,33,72,.22))" }}>
      <div style={{ position: "absolute", inset: 0, clipPath: JERSEY_CLIP, background: primary, border: primary.toUpperCase() === "#FFFFFF" ? "1px solid var(--ink-200)" : "none" }} />
      <div style={{ position: "absolute", top: "7%", left: "42%", width: "16%", height: "6%", background: accent, borderRadius: "0 0 40% 40%" }} />
      <span style={{ position: "absolute", top: "34%", left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 42, color: accent, lineHeight: 1 }}>10</span>
    </div>
  );
}

function JerseyModal({ jersey, onClose }: { jersey: JerseyRow | null; onClose: () => void }) {
  const router = useRouter();
  const isNew = !jersey;
  const [v, setV] = useState({
    name: jersey?.name ?? "",
    kind: jersey?.kind ?? "home",
    primary: jersey?.primary ?? "#15295A",
    accent: jersey?.accent ?? "#C9A227",
    description: jersey?.description ?? "",
    imageUrl: jersey?.imageUrl ?? "",
    active: jersey?.active ?? true,
    sort: jersey?.sort?.toString() ?? "0",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));

  const save = () => {
    setError(null);
    const payload = { ...v, sort: Number(v.sort) || 0, imageUrl: v.imageUrl || null };
    startTransition(async () => {
      const res = isNew ? await createJersey(payload) : await updateJersey(jersey!.id, payload);
      if (res?.error) setError(res.error);
      else {
        onClose();
        router.refresh();
      }
    });
  };
  const remove = () => {
    if (!jersey || !window.confirm("Bu formayı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteJersey(jersey.id);
      onClose();
      router.refresh();
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Yeni Forma" : v.name || "Forma"}
      width={860}
      footer={
        <>
          {!isNew && (
            <Button variant="ghost" size="sm" style={{ color: "var(--red-600)", marginRight: "auto" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>
              Sil
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>
            İptal
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="jersey-form-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: 22, alignItems: "start" }}>
          {/* Sol: forma görseli */}
          <Field label="Forma Görseli" hint="Şeffaf PNG önerilir (ana sayfada kayan vitrin)">
            <FileDrop value={v.imageUrl || null} onChange={(url) => set("imageUrl", url ?? "")} label="Forma görseli yükle" aspect="4 / 3" icon="shirt" />
          </Field>

          {/* Sağ: bilgi alanları */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Forma Adı" required>
              <TextInput value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="örn. İç Saha" />
            </Field>
            <Field label="Forma Tipi">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {KINDS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => set("kind", t.id)}
                    style={{ padding: "6px 10px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${v.kind === t.id ? "var(--navy-700)" : "var(--ink-200)"}`, background: v.kind === t.id ? "var(--navy-50)" : "#fff", fontSize: 12.5, fontWeight: 600, color: "var(--ink-700)", cursor: "pointer" }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Ana Renk">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="color" value={v.primary} onChange={(e) => set("primary", e.target.value)} style={{ width: 44, height: 38, border: "1px solid var(--ink-200)", borderRadius: "var(--radius-sm)", background: "none", cursor: "pointer" }} />
                  <TextInput value={v.primary} onChange={(e) => set("primary", e.target.value)} style={{ fontFamily: "monospace" }} />
                </div>
              </Field>
              <Field label="Vurgu Renk">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="color" value={v.accent} onChange={(e) => set("accent", e.target.value)} style={{ width: 44, height: 38, border: "1px solid var(--ink-200)", borderRadius: "var(--radius-sm)", background: "none", cursor: "pointer" }} />
                  <TextInput value={v.accent} onChange={(e) => set("accent", e.target.value)} style={{ fontFamily: "monospace" }} />
                </div>
              </Field>
            </div>
            <Field label="Açıklama">
              <TextInput value={v.description} onChange={(e) => set("description", e.target.value)} placeholder="Kısa açıklama" />
            </Field>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13.5, color: "var(--ink-600)" }}>Ana sayfada yayınla</span>
              <Switch checked={v.active} onChange={(n) => set("active", n)} />
            </div>
          </div>
        </div>
        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Modal>
  );
}

export function FormalarView({ jerseys }: { jerseys: JerseyRow[] }) {
  const [modal, setModal] = useState<{ jersey: JerseyRow | null } | null>(null);

  return (
    <>
      <ViewHeader
        title="Formalar"
        subtitle="İç saha, deplasman, üçüncü, kaleci ve alternatif formaları yönet"
        actions={
          <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setModal({ jersey: null })}>
            Forma Ekle
          </Button>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
        {jerseys.map((j) => (
          <div key={j.id} style={{ ...cardStyle, overflow: "hidden" }}>
            <div style={{ position: "relative", padding: "26px 18px 18px", display: "grid", placeItems: "center", background: "var(--ink-50)", borderBottom: "1px solid var(--border-subtle)" }}>
              <span style={{ position: "absolute", top: 12, left: 12 }}>{j.active ? <Badge tone="success">Yayında</Badge> : <Badge tone="neutral">Pasif</Badge>}</span>
              <span style={{ position: "absolute", top: 12, right: 12 }}>
                <IconButton label="Düzenle" variant="outline" size="sm" onClick={() => setModal({ jersey: j })}>
                  <Icon name="pencil" size={15} />
                </IconButton>
              </span>
              {j.imageUrl ? (
                <div style={{ position: "relative", width: 120, height: 140 }}>
                  <Image src={j.imageUrl} alt={j.name} fill style={{ objectFit: "contain" }} sizes="160px" />
                </div>
              ) : (
                <JerseyShape primary={j.primary} accent={j.accent} />
              )}
            </div>
            <div style={{ padding: "14px 18px" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 19, textTransform: "uppercase", color: "var(--text-strong)" }}>{j.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 3 }}>{j.description || kindName(j.kind)}</div>
            </div>
          </div>
        ))}
        <button
          onClick={() => setModal({ jersey: null })}
          style={{ cursor: "pointer", font: "inherit", minHeight: 240, border: "1.5px dashed var(--ink-300)", borderRadius: "var(--radius-lg)", background: "var(--ink-50)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--ink-500)" }}
        >
          <span style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--navy-50)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}>
            <Icon name="plus" size={22} />
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14 }}>Alternatif Forma</span>
        </button>
      </div>

      {modal && <JerseyModal jersey={modal.jersey} onClose={() => setModal(null)} />}
    </>
  );
}
