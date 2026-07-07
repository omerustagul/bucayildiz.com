"use client";

import { useState, useTransition } from "react";
import { Panel } from "@/components/admin/kit";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Icon } from "@/lib/icons";
import { changeAdminPassword } from "@/app/admin/(panel)/profil/actions";

const label: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--text-strong)", marginBottom: 6, display: "block" };
const infoCard: React.CSSProperties = {
  background: "var(--surface-subtle)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-md)",
  padding: "12px 14px",
  minWidth: 0,
};

function Msg({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div
      style={{
        padding: "9px 12px",
        borderRadius: "var(--radius-sm)",
        fontSize: 13,
        background: ok ? "var(--green-100)" : "var(--red-100)",
        border: `1px solid ${ok ? "var(--green-600)" : "var(--red-600)"}`,
        color: ok ? "var(--green-600)" : "var(--red-600)",
      }}
    >
      {text}
    </div>
  );
}

function Info({ label: l, value }: { label: string; value: string }) {
  return (
    <div style={infoCard}>
      <div style={{ fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>{l}</div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
    </div>
  );
}

export function AdminProfileView({ name, email, role }: { name: string; email: string; role: string }) {
  const roleLabel = role === "admin" ? "Yönetici" : "Editör";

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [next2, setNext2] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setMsg(null);
    startTransition(async () => {
      const res = await changeAdminPassword({ currentPassword: current, newPassword: next, newPassword2: next2 });
      if (res.ok) {
        setMsg({ ok: true, text: "Şifreniz güncellendi." });
        setCurrent("");
        setNext("");
        setNext2("");
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
      <Panel title="Hesap Bilgileri" pad={20}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)" }}>{name}</span>
            <Badge tone="gold">{roleLabel}</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            <Info label="Ad Soyad" value={name} />
            <Info label="E-posta" value={email || "—"} />
            <Info label="Rol" value={roleLabel} />
          </div>
        </div>
      </Panel>

      <Panel title="Şifre Değiştir" pad={20}>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420, minWidth: 0 }}>
          <div>
            <label style={label} htmlFor="admin-cur-pw">Mevcut Şifre</label>
            <PasswordInput id="admin-cur-pw" value={current} onChange={setCurrent} autoComplete="current-password" leftIcon={<Icon name="lock" size={16} />} required />
          </div>
          <div>
            <label style={label} htmlFor="admin-new-pw">
              Yeni Şifre <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>· en az 8 karakter</span>
            </label>
            <PasswordInput id="admin-new-pw" value={next} onChange={setNext} autoComplete="new-password" leftIcon={<Icon name="lock" size={16} />} required />
          </div>
          <div>
            <label style={label} htmlFor="admin-new-pw2">Yeni Şifre (Tekrar)</label>
            <PasswordInput id="admin-new-pw2" value={next2} onChange={setNext2} autoComplete="new-password" leftIcon={<Icon name="lock" size={16} />} required />
          </div>
          {msg && <Msg ok={msg.ok} text={msg.text} />}
          <Button type="submit" variant="accent" disabled={pending} style={{ alignSelf: "flex-start" }}>
            {pending ? "Güncelleniyor…" : "Şifreyi Güncelle"}
          </Button>
        </form>
      </Panel>
    </div>
  );
}
