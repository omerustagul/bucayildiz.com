"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { subscribeToNewsletter } from "@/app/(site)/bulten/actions";

/**
 * Footer bülten aboneliği (Faz 2.2). KVKK ticari elektronik ileti: açık rıza
 * kutusu ZORUNLU ve önceden İŞARETSİZ (önceden işaretli rıza KVKK'da geçersiz).
 * Gönderim `subscribeToNewsletter` action'ına (rate-limit + honeypot + çift opt-in).
 * Başarıda mesaj gösterilir (çift opt-in'de "e-postanı onayla"). Eski ÖLÜ form
 * (hiçbir şey yapmıyordu) bununla değiştirildi.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot (kullanıcı görmez)
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    if (!consent) {
      setState("error");
      setMsg("Devam etmek için ticari elektronik ileti onayını işaretleyin.");
      return;
    }
    setState("sending");
    const res = await subscribeToNewsletter({ email, consent, website });
    if (res.ok) {
      setState("ok");
      setMsg(res.message);
      setEmail("");
      setConsent(false);
    } else {
      setState("error");
      setMsg(res.error);
    }
  };

  if (state === "ok") {
    return (
      <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--gold-400)", margin: 0 }}>
        {msg}
      </p>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresiniz"
          aria-label="E-posta adresiniz"
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: "var(--font-body)",
            fontSize: 13.5,
            padding: "9px 12px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            background: "rgba(255, 255, 255, 0.06)",
            color: "#fff",
          }}
        />
        {/* Honeypot: gerçek kullanıcı görmez/doldurmaz; bot doldurursa sessizce elenir */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
        <Button variant="accent" size="sm" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "…" : "Katıl"}
        </Button>
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, lineHeight: 1.5, color: "rgba(255, 255, 255, 0.6)", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          style={{ marginTop: 1.5, flex: "none", accentColor: "var(--gold-500)" }}
        />
        <span>
          Kulüpten haber ve duyurular için ticari elektronik ileti almayı kabul ediyorum.{" "}
          <Link href="/kvkk" className="footer-link" style={{ color: "var(--gold-400)", textDecoration: "underline" }}>
            Aydınlatma metni
          </Link>
        </span>
      </label>

      {state === "error" && (
        <span style={{ fontSize: 12, color: "#f87171" }}>{msg}</span>
      )}
    </form>
  );
}
