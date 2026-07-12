"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { submitContactMessage } from "@/app/(site)/iletisim/actions";

const fieldStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14.5,
  padding: "11px 13px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-card)",
  color: "var(--text-body)",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-strong)",
  marginBottom: 6,
  display: "block",
};

/** İletişim formu — mesajı server action ile yöneticiye e-postalar. */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const honeypotRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: honeypotRef.current?.value ?? "",
    };
    startTransition(async () => {
      const res = await submitContactMessage(payload);
      if (res.ok) setSent(true);
      else setError(res.error);
    });
  };

  if (sent) {
    return (
      <div style={{ display: "grid", placeItems: "center", textAlign: "center", padding: "48px 24px", gap: 14 }}>
        <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green-100)", color: "var(--green-600)", display: "grid", placeItems: "center" }}>
          <Icon name="check" size={30} />
        </span>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 24, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Mesajınız Alındı</h3>
        <p style={{ fontSize: 14.5, color: "var(--text-muted)", margin: 0, maxWidth: 340 }}>En kısa sürede sizinle iletişime geçeceğiz. Teşekkürler.</p>
        <Button variant="secondary" onClick={() => setSent(false)}>
          Yeni Mesaj
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Honeypot — ekran dışı, yalnız botlar doldurur. */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div>
        <label style={labelStyle} htmlFor="cf-name">
          Ad Soyad
        </label>
        <input id="cf-name" name="name" required style={fieldStyle} placeholder="Adınız" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle} htmlFor="cf-email">
            E-posta
          </label>
          <input id="cf-email" name="email" type="email" required style={fieldStyle} placeholder="ornek@eposta.com" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="cf-phone">
            Telefon
          </label>
          <input id="cf-phone" name="phone" style={fieldStyle} placeholder="05xx xxx xx xx" />
        </div>
      </div>
      <div>
        <label style={labelStyle} htmlFor="cf-msg">
          Mesajınız
        </label>
        <textarea id="cf-msg" name="message" required rows={5} style={{ ...fieldStyle, resize: "vertical" }} placeholder="Bize iletmek istediğiniz mesaj..." />
      </div>
      {error && <p style={{ color: "var(--red-600)", fontSize: 13.5, margin: 0 }}>{error}</p>}
      <Button type="submit" variant="accent" size="lg" fullWidth disabled={pending} rightIcon={<Icon name="arrow-right" size={18} />}>
        {pending ? "Gönderiliyor…" : "Gönder"}
      </Button>
    </form>
  );
}
