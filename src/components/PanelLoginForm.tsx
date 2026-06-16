"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { panelLoginAction } from "@/app/giris/actions";

const fieldBase: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14.5,
  padding: "11px 13px 11px 40px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-card)",
  color: "var(--text-body)",
  width: "100%",
};

export function PanelLoginForm({ next }: { next?: string }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await panelLoginAction({ identifier, password, next });
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>Kullanıcı Adı / E-posta</label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--ink-400)" }}>
            <Icon name="user-round" size={16} />
          </span>
          <input autoComplete="username" style={fieldBase} placeholder="arda.yilmaz · ornek@eposta.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>Şifre</label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--ink-400)" }}>
            <Icon name="lock" size={16} />
          </span>
          <input type="password" autoComplete="current-password" style={fieldBase} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
      </div>

      {error && (
        <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </Button>
    </form>
  );
}
