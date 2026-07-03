"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Field } from "@/components/admin/kit";
import { TextInput, Drawer, Modal, FileDrop } from "@/components/admin/controls";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { createTeam, updateTeam, deleteTeam, assignAthletesToTeam } from "@/app/admin/(panel)/takimlar/actions";

export type TeamRow = { id: string; name: string; short: string; coach: string; born: string; coverImage: string | null; sort: number; athleteCount: number };
export type AthleteLite = { id: string; name: string; teamId: string; teamName: string; number: number | null; position: string };

const BORN_OPTIONS = ["Üst yapı", "2008", "2009", "2010", "2011", "2012", "2013"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u").replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function NewTeamModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [v, setV] = useState({ name: "", short: "", coach: "", born: "" });
  const [cover, setCover] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: string) => setV((s) => ({ ...s, [k]: val }));

  const save = () => {
    setError(null);
    startTransition(async () => {
      const res = await createTeam({ name: v.name, short: v.short, coach: v.coach, born: v.born, coverImage: cover, slug: slugify(v.name), sort: 99 });
      if (res?.error) setError(res.error);
      else {
        onClose();
        router.refresh();
      }
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Yeni Takım Oluştur"
      width={480}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>İptal</Button>
          <Button variant="accent" size="sm" onClick={save} disabled={pending}>{pending ? "Oluşturuluyor…" : "Takımı Oluştur"}</Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Takım Adı" required><TextInput value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="örn. U-14" /></Field>
          <Field label="Kısa Kod"><TextInput value={v.short} onChange={(e) => set("short", e.target.value)} placeholder="U14" /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Antrenör"><TextInput value={v.coach} onChange={(e) => set("coach", e.target.value)} placeholder="Antrenör adı" /></Field>
          <Select label="Yaş Kategorisi" placeholder="Seç" options={BORN_OPTIONS} value={v.born} onChange={(e) => set("born", e.target.value)} />
        </div>
        <Field label="Kapak Görseli">
          <FileDrop value={cover} onChange={setCover} label="Kapak görseli yükle" hint="Ana sayfa kartında görünür · 3:4 dikey önerilir" aspect="3 / 4" style={{ maxWidth: 200 }} />
        </Field>
        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Modal>
  );
}

function TeamDrawer({ team, athletes, onClose }: { team: TeamRow; athletes: AthleteLite[]; onClose: () => void }) {
  const router = useRouter();
  const [v, setV] = useState({ name: team.name, short: team.short, coach: team.coach, born: team.born });
  const [cover, setCover] = useState<string | null>(team.coverImage);
  const [addOpen, setAddOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof typeof v>(k: K, val: string) => setV((s) => ({ ...s, [k]: val }));

  const roster = athletes.filter((a) => a.teamId === team.id);
  const others = athletes.filter((a) => a.teamId !== team.id);

  const save = () => {
    setError(null);
    startTransition(async () => {
      const res = await updateTeam(team.id, { name: v.name, short: v.short, coach: v.coach, born: v.born, coverImage: cover, slug: slugify(v.name), sort: team.sort });
      if (res?.error) setError(res.error);
      else { onClose(); router.refresh(); }
    });
  };
  const remove = () => {
    if (!window.confirm("Bu takımı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      const res = await deleteTeam(team.id);
      if (!res.ok) setError(res.error ?? "Silinemedi.");
      else { onClose(); router.refresh(); }
    });
  };
  const assign = () => {
    startTransition(async () => {
      await assignAthletesToTeam(team.id, picked);
      setAddOpen(false);
      setPicked([]);
      router.refresh();
    });
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={team.name}
      subtitle="Takım yapılandırması ve kadro"
      width={560}
      footer={
        <>
          <Button variant="ghost" size="sm" style={{ color: "var(--red-600)", marginRight: "auto" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>Takımı Sil</Button>
          <Button variant="secondary" size="sm" onClick={onClose}>Kapat</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={pending}>{pending ? "Kaydediliyor…" : "Kaydet"}</Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Takım Adı" required><TextInput value={v.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Kısa Kod"><TextInput value={v.short} onChange={(e) => set("short", e.target.value)} /></Field>
          <Field label="Antrenör"><TextInput value={v.coach} onChange={(e) => set("coach", e.target.value)} /></Field>
          <Select label="Yaş Kategorisi" options={BORN_OPTIONS} value={v.born} onChange={(e) => set("born", e.target.value)} />
        </div>

        <Field label="Kapak Görseli">
          <FileDrop value={cover} onChange={setCover} label="Kapak görseli yükle" hint="Ana sayfa ve takımlar kartında görünür · 3:4 dikey önerilir" aspect="3 / 4" style={{ maxWidth: 220 }} />
        </Field>

        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gold-700)" }}>Kadro · {roster.length} sporcu</div>
          <Button variant="secondary" size="sm" leftIcon={<Icon name="users" size={15} />} onClick={() => setAddOpen(true)}>Sporcu Ata</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {roster.length === 0 && <div style={{ fontSize: 13, color: "var(--ink-400)", padding: "8px 2px" }}>Bu takımda henüz sporcu yok.</div>}
          {roster.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 10px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <Avatar name={a.name} size="sm" />
              <div style={{ flex: 1, lineHeight: 1.3 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text-strong)" }}>{a.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{a.number != null ? `#${a.number}` : ""} {a.position ? `· ${a.position}` : ""}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {addOpen && (
        <Modal
          open
          onClose={() => setAddOpen(false)}
          title="Sporcu Ata"
          width={460}
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setAddOpen(false)}>İptal</Button>
              <Button variant="primary" size="sm" onClick={assign} disabled={pending || picked.length === 0}>Seçilenleri Ata ({picked.length})</Button>
            </>
          }
        >
          <p style={{ fontSize: 13.5, color: "var(--ink-500)", margin: "0 0 14px" }}>Başka takımlardaki sporculardan {team.name} kadrosuna ekleyin.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }}>
            {others.map((a) => {
              const on = picked.includes(a.id);
              return (
                <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 10px", border: `1px solid ${on ? "var(--navy-300)" : "var(--border-subtle)"}`, background: on ? "var(--navy-50)" : "transparent", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
                  <input type="checkbox" checked={on} onChange={(e) => setPicked((p) => (e.target.checked ? [...p, a.id] : p.filter((x) => x !== a.id)))} style={{ width: 16, height: 16, accentColor: "var(--navy-700)" }} />
                  <Avatar name={a.name} size="sm" />
                  <div style={{ flex: 1, lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text-strong)" }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{a.teamName} {a.position ? `· ${a.position}` : ""}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </Modal>
      )}
    </Drawer>
  );
}

export function TakimlarView({ teams, athletes }: { teams: TeamRow[]; athletes: AthleteLite[] }) {
  const [open, setOpen] = useState<TeamRow | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  return (
    <>
      <ViewHeader
        title="Takımlar"
        subtitle={`${teams.length} aktif takım`}
        actions={
          <Button variant="accent" size="sm" leftIcon={<Icon name="plus" size={16} />} onClick={() => setNewOpen(true)}>Takım Oluştur</Button>
        }
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setOpen(t)}
            style={{ textAlign: "left", cursor: "pointer", font: "inherit", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden", padding: 0 }}
          >
            <div style={{ background: t.coverImage ? `linear-gradient(rgba(8,18,38,.5), rgba(8,18,38,.8)), center/cover no-repeat url("${t.coverImage}")` : "var(--grad-navy)", padding: "18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "var(--radius-md)", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.16)", display: "grid", placeItems: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "var(--gold-400)" }}>{t.short}</div>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 24, textTransform: "uppercase", color: "#fff", lineHeight: 1 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "var(--navy-200)", marginTop: 4 }}>{t.born === "Üst yapı" ? "Üst yapı" : t.born ? `${t.born} doğumlular` : "—"}</div>
              </div>
            </div>
            <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-600)" }}>
                <span style={{ display: "inline-flex", color: "var(--navy-400)" }}><Icon name="clipboard-list" size={15} /></span>
                {t.coach || "—"}
              </div>
              <Badge tone="neutral">{t.athleteCount} sporcu</Badge>
            </div>
          </button>
        ))}
        <button
          onClick={() => setNewOpen(true)}
          style={{ cursor: "pointer", font: "inherit", minHeight: 150, border: "1.5px dashed var(--ink-300)", borderRadius: "var(--radius-lg)", background: "var(--ink-50)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--ink-500)" }}
        >
          <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--navy-50)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}><Icon name="plus" size={22} /></span>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14 }}>Yeni Takım</span>
        </button>
      </div>

      {open && <TeamDrawer team={open} athletes={athletes} onClose={() => setOpen(null)} />}
      {newOpen && <NewTeamModal onClose={() => setNewOpen(false)} />}
    </>
  );
}
