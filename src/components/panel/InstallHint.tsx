"use client";
/* eslint-disable react-hooks/set-state-in-effect -- mount sonrası istemci-only
   tespiti (iOS/PWA/localStorage); SSR-güvenli tek seferlik senkronizasyon. */

import { useEffect, useState } from "react";
import { Icon } from "@/lib/icons";
import { InstallTutorial } from "@/components/panel/InstallTutorial";

const DISMISS_KEY = "by_install_hint_dismissed";

/** iOS Safari paylaş simgesi (lucide'da marka uyumlu karşılığı yok). */
function ShareGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v13" />
      <path d="m8 7 4-4 4 4" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  );
}

/**
 * Sporcu panelinde yalnızca iOS'ta ve site henüz "Ana Ekrana Ekle" ile
 * uygulama olarak eklenmemişken görünen ipucu kartı. Kapatılınca localStorage
 * ile bir daha gösterilmez.
 */
export function InstallHint() {
  const [show, setShow] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true);
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    if (isIOS && !isStandalone && !dismissed) setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 46px 16px 16px",
        borderRadius: "var(--radius-md)",
        background: "var(--navy-950)",
        border: "1px solid rgba(201,162,39,.35)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: "var(--grad-gold)", display: "grid", placeItems: "center", color: "var(--navy-900)" }}>
        <ShareGlyph size={20} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "#fff", letterSpacing: ".01em" }}>
          Paneli uygulama gibi kullan
        </div>
        <div style={{ fontSize: 13, color: "var(--navy-200)", marginTop: 3, lineHeight: 1.5 }}>
          Safari&apos;de alttaki <span style={{ display: "inline-flex", verticalAlign: "-2px" }}><ShareGlyph size={13} /></span> <strong style={{ color: "#fff" }}>Paylaş</strong> simgesine dokun,{" "}
          <strong style={{ color: "#fff" }}>“Ana Ekrana Ekle”</strong>yi seç. Buca Yıldız ana ekranında bir uygulama gibi açılır.
        </div>
        <button
          type="button"
          onClick={() => setTutorialOpen(true)}
          style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(201,162,39,.5)", background: "rgba(201,162,39,.12)", color: "var(--gold-400)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
        >
          Nasıl yapılır? İzle
          <Icon name="chevron-right" size={13} />
        </button>
      </div>
      <InstallTutorial open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      <button
        onClick={dismiss}
        aria-label="Kapat"
        style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, display: "grid", placeItems: "center", borderRadius: 8, border: "none", background: "transparent", color: "var(--navy-300)", cursor: "pointer" }}
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
