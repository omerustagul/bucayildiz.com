"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";

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

/** İletişim formu — Faz 2'de gerçek gönderim (e-posta) bağlanacak. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div>
        <label style={labelStyle} htmlFor="cf-name">
          Ad Soyad
        </label>
        <input id="cf-name" required style={fieldStyle} placeholder="Adınız" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle} htmlFor="cf-email">
            E-posta
          </label>
          <input id="cf-email" type="email" required style={fieldStyle} placeholder="ornek@eposta.com" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="cf-phone">
            Telefon
          </label>
          <input id="cf-phone" style={fieldStyle} placeholder="05xx xxx xx xx" />
        </div>
      </div>
      <div>
        <label style={labelStyle} htmlFor="cf-msg">
          Mesajınız
        </label>
        <textarea id="cf-msg" required rows={5} style={{ ...fieldStyle, resize: "vertical" }} placeholder="Bize iletmek istediğiniz mesaj..." />
      </div>
      <Button type="submit" variant="accent" size="lg" fullWidth rightIcon={<Icon name="arrow-right" size={18} />}>
        Gönder
      </Button>
    </form>
  );
}
