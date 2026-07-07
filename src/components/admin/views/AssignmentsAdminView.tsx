"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Panel, Field } from "@/components/admin/kit";
import { TextInput, TextArea, FileDrop } from "@/components/admin/controls";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import { createAssignments, deleteAssignment } from "@/app/admin/(panel)/mesajlar/actions";

export type MTeam = { id: string; name: string };
export type MAthlete = { id: string; name: string; teamId: string };
export type MAssignment = {
  id: string;
  kind: string;
  title: string;
  body: string;
  fileUrl: string | null;
  readAt: string | null;
  createdAt: string;
  athleteName: string;
};

type AssignmentKind = "message" | "document";

const KINDS: { id: AssignmentKind; label: string; color: string }[] = [
  { id: "message", label: "Mesaj", color: "var(--navy-600)" },
  { id: "document", label: "Doküman", color: "var(--gold-600)" },
];

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hh}:${mm}`;
}

export function AssignmentsAdminView({
  teams,
  athletes,
  assignments,
}: {
  teams: MTeam[];
  athletes: MAthlete[];
  assignments: MAssignment[];
}) {
  return (
    <>
      <ViewHeader title="Mesaj & Doküman" subtitle="Sporculara mesaj, direktif ve doküman gönder" />

      <div className="hp-grid-2" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 18, alignItems: "start" }}>
        <SendPanel teams={teams} athletes={athletes} />
        <ListPanel assignments={assignments} />
      </div>
    </>
  );
}

function SendPanel({ teams, athletes }: { teams: MTeam[]; athletes: MAthlete[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<AssignmentKind>("message");
  const [team, setTeam] = useState(teams[0]?.id ?? "");
  const [selAthletes, setSelAthletes] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const teamAthletes = useMemo(() => athletes.filter((a) => a.teamId === team), [athletes, team]);

  const toggleAthlete = (id: string) =>
    setSelAthletes((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const send = () => {
    setError(null);
    if (selAthletes.size === 0) {
      setError("En az bir sporcu seçiniz.");
      return;
    }
    if (!title.trim()) {
      setError("Başlık zorunlu.");
      return;
    }
    if (kind === "document" && !fileUrl) {
      setError("Doküman için dosya yükleyiniz.");
      return;
    }
    startTransition(async () => {
      const res = await createAssignments({
        athleteIds: [...selAthletes],
        kind,
        title,
        body,
        fileUrl,
      });
      if (res?.error) setError(res.error);
      else {
        setTitle("");
        setBody("");
        setFileUrl(null);
        setSelAthletes(new Set());
        router.refresh();
      }
    });
  };

  return (
    <Panel title="Gönder">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Tür" required>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => {
                  setKind(k.id);
                  setError(null);
                }}
                style={{
                  font: "inherit",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: `1.5px solid ${kind === k.id ? k.color : "var(--ink-200)"}`,
                  background: kind === k.id ? "var(--navy-50)" : "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--ink-700)",
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: 3, background: k.color }} />
                {k.label}
              </button>
            ))}
          </div>
        </Field>

        <Select
          label="Takım"
          required
          options={teams.map((t) => ({ value: t.id, label: t.name }))}
          value={team}
          onChange={(e) => {
            setTeam(e.target.value);
            setSelAthletes(new Set());
          }}
        />

        <Field label="Sporcular" required>
          <div style={{ maxHeight: 190, overflowY: "auto", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: 6, display: "flex", flexDirection: "column", gap: 2 }}>
            {teamAthletes.length === 0 && <span style={{ padding: 8, fontSize: 13, color: "var(--ink-400)" }}>Bu takımda sporcu bulunmuyor.</span>}
            {teamAthletes.map((a) => (
              <label
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  fontSize: 13.5,
                  padding: "7px 9px",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  background: selAthletes.has(a.id) ? "var(--navy-50)" : "transparent",
                  color: "var(--ink-700)",
                }}
              >
                <input type="checkbox" checked={selAthletes.has(a.id)} onChange={() => toggleAthlete(a.id)} />
                {a.name}
              </label>
            ))}
          </div>
          {/* Sayaç + kısayollar: listenin altında tek satır, kısayollar sağa yaslı */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontSize: 12.5, color: "var(--ink-400)" }}>{selAthletes.size} sporcu seçili</span>
            {teamAthletes.length > 0 && (
              <div style={{ display: "flex", gap: 14 }}>
                <button
                  type="button"
                  onClick={() => setSelAthletes(new Set(teamAthletes.map((a) => a.id)))}
                  style={{ font: "inherit", cursor: "pointer", border: "none", background: "none", padding: 0, fontSize: 12.5, fontWeight: 600, color: "var(--navy-700)" }}
                >
                  Tümünü Seç
                </button>
                <button
                  type="button"
                  disabled={selAthletes.size === 0}
                  onClick={() => setSelAthletes(new Set())}
                  style={{ font: "inherit", cursor: selAthletes.size ? "pointer" : "default", border: "none", background: "none", padding: 0, fontSize: 12.5, fontWeight: 600, color: selAthletes.size ? "var(--ink-500)" : "var(--ink-300)" }}
                >
                  Seçimi Temizle
                </button>
              </div>
            )}
          </div>
        </Field>

        <Field label="Başlık" required>
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="örn. Yarın antrenman saati değişti" />
        </Field>

        <Field label={kind === "message" ? "Mesaj" : "Açıklama"}>
          <TextArea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder={kind === "message" ? "Mesaj içeriği" : "Doküman açıklaması"} />
        </Field>

        {kind === "document" && (
          <Field label="Doküman (görsel)" required hint="Şimdilik yalnız görsel dosyalar (JPG/PNG)">
            <FileDrop value={fileUrl} onChange={setFileUrl} label="Doküman yükle" icon="folder" compact />
          </Field>
        )}

        {error && (
          <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>
            {error}
          </div>
        )}

        <Button variant="accent" fullWidth leftIcon={<Icon name="send" size={16} />} onClick={send} disabled={pending}>
          {pending ? "Gönderiliyor…" : "Gönder"}
        </Button>
      </div>
    </Panel>
  );
}

function ListPanel({ assignments }: { assignments: MAssignment[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const remove = (id: string) => {
    if (!window.confirm("Bu gönderimi silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteAssignment(id);
      router.refresh();
    });
  };

  return (
    <Panel title="Gönderilenler">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {assignments.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Henüz gönderim yok.</span>}
        {assignments.map((a) => (
          <div
            key={a.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Badge tone={a.kind === "document" ? "gold" : "navy"} style={{ flex: "none" }}>
              {a.kind === "document" ? "Doküman" : "Mesaj"}
            </Badge>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-800)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {a.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-400)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {a.athleteName} · {fmtDate(a.createdAt)}
              </div>
            </div>
            <Badge tone={a.readAt ? "success" : "neutral"} style={{ flex: "none" }}>
              {a.readAt ? "Okundu" : "Okunmadı"}
            </Badge>
            <IconButton label="Gönderimi sil" variant="ghost" size="sm" disabled={pending} onClick={() => remove(a.id)}>
              <Icon name="trash-2" size={14} />
            </IconButton>
          </div>
        ))}
      </div>
    </Panel>
  );
}
