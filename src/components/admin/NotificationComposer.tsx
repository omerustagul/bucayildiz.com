"use client";

import { useState, useTransition } from "react";
import { TextInput, TextArea } from "@/components/admin/controls";
import { Field } from "@/components/admin/kit";
import { Button } from "@/components/ui/Button";
import { sendNotification } from "@/app/admin/(panel)/bildirimler/actions";

type Team = { id: string; name: string; subCount: number };

export function NotificationComposer({ teams, totalSubs }: { teams: Team[]; totalSubs: number }) {
  const [target, setTarget] = useState("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/panel");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const send = () => {
    setMsg(null);
    setErr(null);
    startTransition(async () => {
      const res = await sendNotification({ target, title, body, url });
      if (res.ok) {
        setMsg(`Gönderildi: ${res.sent} cihaz.`);
        setTitle("");
        setBody("");
      } else {
        setErr(res.error);
      }
    });
  };

  const selStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)", fontSize: 14, padding: "10px 12px",
    borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)",
    background: "var(--surface-card)", color: "var(--text-body)", width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560, padding: "22px" }}>
      <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.55 }}>
        Toplam <strong style={{ color: "var(--text-strong)" }}>{totalSubs}</strong> kullanıcı.
        KVKK: bildirim metnine sağlık/performans verisi yazmayın — genel tutun.
      </p>

      <Field label="Hedef">
        <select value={target} onChange={(e) => setTarget(e.target.value)} style={selStyle}>
          <option value="all">Tüm aboneler ({totalSubs})</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name} ({t.subCount})</option>
          ))}
        </select>
      </Field>

      <Field label="Başlık">
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="örn. Yarınki antrenman" />
      </Field>

      <Field label="Mesaj">
        <TextArea value={body} onChange={(e) => setBody(e.target.value)} placeholder="örn. Yarın 18:00'de saha 2'de buluşuyoruz." rows={3} />
      </Field>

      <Field label="Tıklayınca açılacak sayfa" hint="opsiyonel">
        <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/panel" />
      </Field>

      {msg && <div style={{ padding: "10px 13px", background: "var(--green-100)", border: "1px solid var(--green-600)", borderRadius: "var(--radius-sm)", fontSize: 13.5, color: "var(--green-600)" }}>{msg}</div>}
      {err && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13.5, color: "var(--red-600)" }}>{err}</div>}

      <div>
        <Button variant="primary" onClick={send} disabled={pending}>{pending ? "Gönderiliyor…" : "Bildirimi Gönder"}</Button>
      </div>
    </div>
  );
}
