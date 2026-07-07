"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Icon } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";

/** iOS "Ana Ekrana Ekle" eğitimi — telefon maketi içinde 4 sahnelik,
 *  kendiliğinden ilerleyen animasyonlu anlatım. Bağımlılıksız (CSS + React
 *  sahne makinesi); prefers-reduced-motion'a saygılıdır. */

const SCENES = [
  { title: "1 · Safari'de Paylaş'a dokun", sub: "Alt çubuktaki paylaş simgesi" },
  { title: "2 · “Ana Ekrana Ekle”yi seç", sub: "Paylaş menüsünde aşağıda" },
  { title: "3 · Uygulama ana ekranına eklendi", sub: "Buca Yıldız simgesi oluşur" },
  { title: "4 · Dokun, uygulama gibi açılır", sub: "Tam ekran — tarayıcısız" },
] as const;

const SCENE_MS = 2600;

function ShareGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v13" />
      <path d="m8 7 4-4 4 4" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  );
}

/** Ana ekran ızgarasındaki soluk yer tutucu ikon. */
function GhostIcon() {
  return <div style={{ aspectRatio: "1", borderRadius: 12, background: "rgba(255,255,255,.16)" }} />;
}

function PhoneScene({ scene }: { scene: number }) {
  const ease = "all .45s var(--ease-out)";
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "min(230px, 62vw)",
        aspectRatio: "9 / 17",
        margin: "0 auto",
        borderRadius: 34,
        border: "10px solid var(--navy-950)",
        background: "linear-gradient(160deg, #1c3568 0%, var(--navy-950) 100%)",
        overflow: "hidden",
        boxShadow: "var(--shadow-xl)",
      }}
    >
      {/* Çentik */}
      <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 74, height: 16, borderRadius: 9, background: "var(--navy-950)", zIndex: 6 }} />

      {/* SAHNE 0-1: Safari görünümü */}
      <div style={{ position: "absolute", inset: 0, transition: ease, opacity: scene <= 1 ? 1 : 0 }}>
        {/* Site içeriği taklidi */}
        <div style={{ padding: "34px 14px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ height: 26, borderRadius: 8, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", gap: 6, padding: "0 8px" }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--gold-500)" }} />
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".08em", color: "#fff", fontFamily: "var(--font-heading)" }}>BUCA YILDIZ</span>
          </div>
          {[64, 40, 40].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 8, background: `rgba(255,255,255,${i === 0 ? ".10" : ".07"})` }} />
          ))}
        </div>
        {/* Safari alt çubuğu */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 44, background: "rgba(12,24,52,.92)", borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "space-around", color: "var(--navy-200)" }}>
          <Icon name="chevron-right" size={13} style={{ transform: "rotate(180deg)" }} />
          <Icon name="chevron-right" size={13} />
          <span style={{ position: "relative", display: "grid", placeItems: "center", width: 30, height: 30, color: scene === 0 ? "var(--gold-400)" : "var(--navy-200)", transition: ease }}>
            {scene === 0 && <span className="by-tap-ring" />}
            <ShareGlyph size={17} />
          </span>
          <Icon name="newspaper" size={13} />
          <Icon name="images" size={13} />
        </div>
        {/* SAHNE 1: paylaş menüsü alttan kayar */}
        <div
          style={{
            position: "absolute", left: 6, right: 6, bottom: 6, borderRadius: 16,
            background: "#f4f5f7", padding: "10px 10px 12px",
            transform: scene === 1 ? "translateY(0)" : "translateY(110%)",
            transition: "transform .5s var(--ease-out)",
            zIndex: 5,
          }}
        >
          <div style={{ width: 34, height: 4, borderRadius: 2, background: "#c9cdd4", margin: "0 auto 10px" }} />
          {["Kopyala", "Yer İmi Ekle"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 9px", fontSize: 9.5, color: "#4a5261", borderBottom: "1px solid #e3e6ea" }}>
              {t}
              <span style={{ width: 12, height: 12, borderRadius: 3, background: "#d4d8de" }} />
            </div>
          ))}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 9px", fontSize: 10, fontWeight: 700, color: "var(--navy-800)", background: scene === 1 ? "var(--gold-100)" : "transparent", borderRadius: 8, transition: ease }}>
            Ana Ekrana Ekle
            <span style={{ position: "relative", width: 14, height: 14, display: "grid", placeItems: "center" }}>
              {scene === 1 && <span className="by-tap-ring" style={{ inset: -8 }} />}
              <Icon name="plus" size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* SAHNE 2-3: Ana ekran */}
      <div style={{ position: "absolute", inset: 0, transition: ease, opacity: scene >= 2 ? 1 : 0, padding: "36px 16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {Array.from({ length: 7 }).map((_, i) => <GhostIcon key={i} />)}
          {/* Buca Yıldız ikonu */}
          <div style={{ position: "relative" }}>
            {scene >= 2 && (
              <div key={scene >= 2 ? "on" : "off"} className="by-icon-pop" style={{ aspectRatio: "1", borderRadius: 12, background: "var(--grad-gold)", display: "grid", placeItems: "center", overflow: "hidden" }}>
                <Image src="/brand/logo-emblem.png" alt="" width={26} height={26} style={{ objectFit: "contain" }} />
              </div>
            )}
            {scene === 3 && <span className="by-tap-ring" style={{ inset: -6, borderRadius: 16 }} />}
            <div style={{ marginTop: 3, textAlign: "center", fontSize: 6.5, color: "#fff", opacity: scene >= 2 ? 1 : 0, transition: ease }}>Buca Yıldız</div>
          </div>
        </div>
        {/* SAHNE 3: uygulama açılışı (splash) */}
        <div style={{ position: "absolute", inset: 0, background: "var(--navy-950)", display: "grid", placeItems: "center", opacity: scene === 3 ? 1 : 0, transition: "opacity .5s var(--ease-out) .55s", zIndex: 7, pointerEvents: "none" }}>
          <div style={{ textAlign: "center" }}>
            <Image src="/brand/logo-emblem.png" alt="" width={54} height={54} style={{ objectFit: "contain" }} />
            <div style={{ marginTop: 8, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 11, letterSpacing: ".1em", color: "#fff", textTransform: "uppercase" }}>Buca Yıldız</div>
            <div style={{ fontSize: 7, letterSpacing: ".2em", color: "var(--gold-400)", textTransform: "uppercase", marginTop: 2 }}>Futbol Akademisi</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Kapalıyken hiç mount edilmez → her açılış 1. sahneden, taze state ile başlar. */
export function InstallTutorial({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open || typeof document === "undefined") return null;
  return <InstallTutorialBody onClose={onClose} />;
}

function InstallTutorialBody({ onClose }: { onClose: () => void }) {
  const [scene, setScene] = useState(0);

  useOverlayDismiss(true, onClose);

  // Sahne makinesi: kendiliğinden döngü (interval callback'te setState — meşru).
  useEffect(() => {
    const t = window.setInterval(() => setScene((s) => (s + 1) % SCENES.length), SCENE_MS);
    return () => window.clearInterval(t);
  }, []);

  return createPortal(
    <>
      <div className="by-anim-fade" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.55)", zIndex: 220 }} />
      <div
        className="by-anim-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Ana ekrana ekleme rehberi"
        style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 221, maxHeight: "88vh", overflowY: "auto", borderRadius: "20px 20px 0 0", background: "var(--surface-card)", boxShadow: "var(--shadow-xl)", padding: "10px 18px 26px" }}
      >
        <div style={{ width: 44, height: 4, borderRadius: 2, background: "var(--ink-200)", margin: "6px auto 14px" }} />
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 4px", textAlign: "center" }}>
            Uygulama Gibi Kullan
          </h3>
          <p style={{ fontSize: 13, color: "var(--ink-500)", textAlign: "center", margin: "0 0 16px" }}>
            Mağaza gerekmez — 2 dokunuşla ana ekranına ekle.
          </p>

          <PhoneScene scene={scene} />

          {/* Adım noktaları + başlık */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "16px 0 8px" }}>
            {SCENES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Adım ${i + 1}`}
                onClick={() => setScene(i)}
                style={{ width: i === scene ? 22 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === scene ? "var(--gold-500)" : "var(--ink-200)", transition: "all .3s var(--ease-out)", padding: 0 }}
              />
            ))}
          </div>
          <div style={{ textAlign: "center", minHeight: 42 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink-800)" }}>{SCENES[scene].title}</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-400)", marginTop: 2 }}>{SCENES[scene].sub}</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ display: "block", width: "100%", marginTop: 14, padding: "12px 16px", borderRadius: "var(--radius-md)", border: "none", cursor: "pointer", background: "var(--grad-gold)", color: "var(--navy-900)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase" }}
          >
            Anladım
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
