"use client";
/* eslint-disable react-hooks/set-state-in-effect -- mount sonrası istemci-only
   tespiti (iOS-Android/PWA/localStorage); SSR-güvenli tek seferlik senkronizasyon. */

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/lib/icons";
import { InstallTutorial } from "@/components/panel/InstallTutorial";

const DISMISS_KEY = "by_install_hint_dismissed";

/** Chrome/Android'in yerel kurulum diyaloğunu tetikleyen olay (lib.dom'da yok). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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

/** Kurulum simgesi (aşağı ok + tepsi). */
function InstallGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12" />
      <path d="m8 11 4 4 4-4" />
      <path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

/**
 * Sporcu panelinde, site henüz uygulama olarak kurulmamışken görünen ipucu kartı.
 * iOS: Paylaş → Ana Ekrana Ekle yönergesi + animasyonlu rehber (InstallTutorial).
 * Android: beforeinstallprompt yakalanırsa TEK DOKUNUŞLA yerel kurulum diyaloğu;
 * yakalanamazsa (örn. bazı tarayıcılar) ⋮ menü yönergesi. Kapatılınca localStorage
 * ile bir daha gösterilmez; kurulum tamamlanınca da kendini gizler.
 */
export function InstallHint() {
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true);
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
    if (isStandalone || dismissed) return;
    if (isIOS) setPlatform("ios");
    else if (isAndroid) setPlatform("android");

    // Android/Chromium: yerel kurulum olayını yakala (mini-infobar'ı bastır,
    // kendi butonumuzla tek dokunuşta tetikle).
    const onBip = (e: Event) => {
      e.preventDefault();
      deferredRef.current = e as BeforeInstallPromptEvent;
      setCanPrompt(true);
    };
    const onInstalled = () => {
      window.localStorage.setItem(DISMISS_KEY, "1");
      setPlatform(null);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!platform) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setPlatform(null);
  };

  const install = async () => {
    const ev = deferredRef.current;
    if (!ev) return;
    deferredRef.current = null;
    setCanPrompt(false);
    await ev.prompt();
    const choice = await ev.userChoice.catch(() => null);
    if (choice?.outcome === "accepted") dismiss();
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
        {platform === "ios" ? <ShareGlyph size={20} /> : <InstallGlyph size={20} />}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "#fff", letterSpacing: ".01em" }}>
          Paneli uygulama gibi kullan
        </div>

        {platform === "ios" ? (
          <>
            <div style={{ fontSize: 13, color: "var(--navy-200)", marginTop: 3, lineHeight: 1.5 }}>
              Safari&apos;de <span style={{ display: "inline-flex", verticalAlign: "-2px" }}><ShareGlyph size={13} /></span> <strong style={{ color: "#fff" }}>Paylaş</strong> simgesine dokun,{" "}
              <strong style={{ color: "#fff" }}>“Ana Ekrana Ekle”</strong>yi seç. Buca Yıldız artık bir uygulama gibi açılır.
            </div>
            <button
              type="button"
              onClick={() => setTutorialOpen(true)}
              style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(201,162,39,.5)", background: "rgba(201,162,39,.12)", color: "var(--gold-400)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
            >
              Nasıl yapılır? İzle
              <Icon name="chevron-right" size={13} />
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: "var(--navy-200)", marginTop: 3, lineHeight: 1.5 }}>
              {canPrompt ? (
                <>Tek dokunuşla telefonuna kur — Buca Yıldız kendi simgesiyle, tam ekran bir uygulama gibi açılır.</>
              ) : (
                <>Tarayıcı menüsünden (<strong style={{ color: "#fff" }}>⋮</strong>) <strong style={{ color: "#fff" }}>“Ana ekrana ekle”</strong> ya da <strong style={{ color: "#fff" }}>“Uygulamayı yükle”</strong>yi seç. Buca Yıldız artık bir uygulama gibi açılır.</>
              )}
            </div>
            {canPrompt && (
              <button
                type="button"
                onClick={install}
                style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--grad-gold)", color: "var(--navy-900)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
              >
                <InstallGlyph size={14} />
                Uygulamayı Yükle
              </button>
            )}
          </>
        )}
      </div>
      <button
        onClick={dismiss}
        aria-label="Kapat"
        style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, display: "grid", placeItems: "center", borderRadius: 8, border: "none", background: "transparent", color: "var(--navy-300)", cursor: "pointer" }}
      >
        <Icon name="x" size={16} />
      </button>
      <InstallTutorial open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </div>
  );
}
