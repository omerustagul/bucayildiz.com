"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";

/** iOS 26 Safari "Ana Ekrana Ekle" eğitimi — framer-motion ile gerçeğe yakın akış:
 *  ⋯ menüsü → Paylaş → paylaşım sayfası → aşağı-ok ile genişlet → Ana Ekrana
 *  Ekle → ana ekranda ikon → dokun → uygulama açılışı. Telefon içeriği bizim
 *  panel tasarımıdır (navy/gold tokenlar). prefers-reduced-motion desteklenir. */

const SCENES = [
  { title: "1 · Sağ alttaki ⋯ menüsüne dokun", sub: "Safari alt çubuğunda" },
  { title: "2 · En üstten “Paylaş”ı seç", sub: "Menünün ilk satırı" },
  { title: "3 · Paylaşım sayfasında oku genişlet", sub: "Sağdaki aşağı ok" },
  { title: "4 · “Ana Ekrana Ekle”ye dokun", sub: "Açılan listede" },
  { title: "5 · Uygulama ana ekranına eklendi", sub: "Buca Yıldız simgesi" },
  { title: "6 · Dokun — uygulama gibi açılır", sub: "Tam ekran, tarayıcısız" },
] as const;

const SCENE_MS = [2300, 2100, 2300, 2400, 2300, 3400];

const spring = { type: "spring" as const, stiffness: 380, damping: 32 };

/** iOS paylaş simgesi (kare + yukarı ok). */
function ShareGlyph({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v13" />
      <path d="m8 7 4-4 4 4" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  );
}

/** Altın dokunma halkası — framer ripple. */
function Tap({ x, y, delay = 0.55 }: { x: string; y: string; delay?: number }) {
  return (
    <motion.span
      style={{ position: "absolute", left: x, top: y, width: 34, height: 34, marginLeft: -17, marginTop: -17, borderRadius: "50%", border: "3px solid var(--gold-400)", pointerEvents: "none", zIndex: 30 }}
      initial={{ scale: 0.3, opacity: 0 }}
      animate={{ scale: [0.3, 1, 1.45], opacity: [0, 0.95, 0] }}
      transition={{ duration: 1.1, delay, repeat: Infinity, repeatDelay: 0.35, ease: "easeOut" }}
      aria-hidden
    />
  );
}

/** Bizim panelin mini mobil görünümü (Safari içeriği ve app içeriği olarak). */
function MiniPanel({ asApp = false }: { asApp?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#f4f6fa", display: "flex", flexDirection: "column", paddingTop: asApp ? 26 : 22 }}>
      {/* Panel üst çubuğu */}
      <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, background: "#fff", borderBottom: "1px solid #e6e9ef" }}>
        <span style={{ width: 18, height: 18, borderRadius: 5, border: "1px solid #dfe3ea", display: "grid", placeItems: "center", fontSize: 8, color: "var(--navy-700)" }}>≡</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 9.5, letterSpacing: ".04em", color: "var(--navy-900)" }}>GENEL BAKIŞ</div>
          <div style={{ fontSize: 6.5, color: "#8a93a3" }}>Hoş geldin, Arda</div>
        </div>
        <span style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", background: "var(--navy-800)", color: "#fff", display: "grid", placeItems: "center", fontSize: 7, fontWeight: 700 }}>AY</span>
      </div>
      <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 12, height: 2, background: "var(--gold-500)" }} />
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 7.5, letterSpacing: ".06em", color: "#5c6575" }}>PROGRAM TAKVİMİ</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e6e9ef", borderRadius: 8, padding: 7, display: "flex", gap: 4 }}>
          {["PZT", "SAL", "ÇAR", "PER"].map((d, i) => (
            <div key={d} style={{ flex: 1, borderRadius: 5, border: `1px solid ${i === 1 ? "var(--navy-300)" : "#edf0f5"}`, background: i === 1 ? "var(--navy-50)" : "#fff", padding: "4px 3px" }}>
              <div style={{ fontSize: 5.5, fontWeight: 700, color: "#98a1b1", textAlign: "center" }}>{d}</div>
              {i === 1 && <div style={{ marginTop: 3, height: 11, borderRadius: 3, background: "var(--navy-50)", borderLeft: "2px solid var(--navy-600)" }} />}
              {i === 2 && <div style={{ marginTop: 3, height: 11, borderRadius: 3, background: "var(--red-100)", borderLeft: "2px solid var(--red-600)" }} />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["7.6", "PUAN"], ["12", "ANTRENMAN"]].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: "#fff", border: "1px solid #e6e9ef", borderRadius: 8, padding: "6px 8px" }}>
              <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 11, color: "var(--navy-900)" }}>{v}</div>
              <div style={{ fontSize: 5.5, fontWeight: 700, letterSpacing: ".08em", color: "#98a1b1" }}>{l}</div>
            </div>
          ))}
        </div>
        {asApp && (
          <div style={{ marginTop: 2, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 4, background: "var(--gold-100)", border: "1px solid var(--gold-300)", borderRadius: 999, padding: "3px 7px", fontSize: 6, fontWeight: 700, color: "var(--gold-800)" }}>
            ✓ UYGULAMA OLARAK AÇILDI
          </div>
        )}
      </div>
    </div>
  );
}

/** Telefon maketi + sahneler. */
function PhoneScene({ scene, reduced }: { scene: number; reduced: boolean }) {
  const t = (over?: object) => (reduced ? { duration: 0 } : { ...spring, ...over });
  const inSafari = scene <= 3;
  const onHome = scene === 4 || scene === 5;

  return (
    <div
      aria-hidden
      style={{ position: "relative", width: "min(240px, 64vw)", aspectRatio: "9 / 18.5", margin: "0 auto", borderRadius: 40, border: "9px solid #0b1530", background: "#0b1530", overflow: "hidden", boxShadow: "var(--shadow-xl)" }}
    >
      {/* Dynamic Island */}
      <div style={{ position: "absolute", top: 7, left: "50%", transform: "translateX(-50%)", width: 64, height: 15, borderRadius: 10, background: "#0b1530", zIndex: 40 }} />
      {/* Durum çubuğu saati */}
      <div style={{ position: "absolute", top: 8, left: 18, fontSize: 7.5, fontWeight: 700, color: inSafari ? "#3a4356" : "#fff", zIndex: 39, fontVariantNumeric: "tabular-nums" }}>09:41</div>

      {/* ================= SAFARI (sahne 0-3) ================= */}
      <AnimatePresence>
        {inSafari && (
          <motion.div key="safari" style={{ position: "absolute", inset: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={t()}>
            <MiniPanel />

            {/* iOS 26 Safari: alttaki yüzen kapsül adres çubuğu */}
            <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(250,250,252,.96)", borderRadius: 999, padding: "7px 11px", boxShadow: "0 6px 22px rgba(10,20,45,.22)", border: "1px solid rgba(0,0,0,.05)" }}>
                <span style={{ width: 13, height: 13, borderRadius: 4, border: "1.4px solid #9aa2b1" }} />
                <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 8.5, fontWeight: 600, color: "#2c3444" }}>
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#8a93a3" strokeWidth="2.4"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                  bucayildiz.com
                </span>
                {/* ⋯ butonu (sağ alt) */}
                <span style={{ position: "relative", width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", background: scene === 0 ? "var(--gold-100)" : "transparent", color: "#2c3444", fontWeight: 800, fontSize: 11, letterSpacing: "1px" }}>
                  ···
                </span>
              </div>
            </div>
            {scene === 0 && <Tap x="calc(100% - 26px)" y="calc(100% - 26px)" />}

            {/* Sahne 1: ⋯ menüsü (sağ alttan açılır; en üstte Paylaş) */}
            <AnimatePresence>
              {scene === 1 && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, scale: 0.6, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={t()}
                  style={{ position: "absolute", right: 10, bottom: 52, width: 132, transformOrigin: "bottom right", background: "rgba(249,249,251,.98)", borderRadius: 13, boxShadow: "0 10px 34px rgba(10,20,45,.3)", overflow: "hidden", zIndex: 12 }}
                >
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "var(--gold-100)", fontSize: 8.5, fontWeight: 700, color: "#1d2534" }}>
                    Paylaş
                    <ShareGlyph size={11} color="#1d2534" />
                    <Tap x="82%" y="50%" delay={0.75} />
                  </div>
                  {["Yer İmi Ekle", "Sayfada Bul", "Masaüstü Sitesi"].map((m) => (
                    <div key={m} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", fontSize: 8, color: "#55607080", borderTop: "1px solid #e8eaef" }}>
                      {m}
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: "#dde1e8" }} />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sahne 2-3: Paylaşım sayfası (kompakt → genişletilmiş) */}
            <AnimatePresence>
              {(scene === 2 || scene === 3) && (
                <motion.div
                  key="share"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "112%" }}
                  transition={t()}
                  style={{ position: "absolute", left: 5, right: 5, bottom: 5, borderRadius: 16, background: "rgba(247,247,249,.99)", boxShadow: "0 -8px 30px rgba(10,20,45,.28)", zIndex: 14, overflow: "hidden" }}
                >
                  <div style={{ width: 30, height: 3.5, borderRadius: 2, background: "#c9cdd6", margin: "6px auto 4px" }} />
                  {/* Başlık: favicon + site + genişletme oku (sağda) */}
                  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 7, padding: "5px 10px 8px" }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: "var(--grad-gold)", display: "grid", placeItems: "center", flex: "none", fontSize: 11 }}>★</span>
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ display: "block", fontSize: 8, fontWeight: 700, color: "#1d2534", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Buca Yıldız Futbol Akademisi</span>
                      <span style={{ display: "block", fontSize: 6.5, color: "#8a93a3" }}>bucayildiz.com</span>
                    </span>
                    <motion.span
                      animate={scene === 3 ? { rotate: 180, background: "var(--gold-100)" } : { rotate: 0 }}
                      transition={t()}
                      style={{ width: 20, height: 20, borderRadius: "50%", display: "grid", placeItems: "center", background: "#e9ebf0", color: "#3c4557", flex: "none" }}
                    >
                      <Icon name="chevron-down" size={11} />
                    </motion.span>
                    {scene === 2 && <Tap x="calc(100% - 20px)" y="55%" />}
                  </div>
                  {/* Hızlı paylaşım satırı (kompakt görünümde) */}
                  <div style={{ display: "flex", gap: 8, padding: "0 10px 9px" }}>
                    {["AirDrop", "Mesajlar", "Mail", "Notlar"].map((a, i) => (
                      <div key={a} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 5.5, color: "#6a7382" }}>
                        <span style={{ width: 26, height: 26, borderRadius: 8, background: ["#3f8ef7", "#57d463", "#3fa2f7", "#f7c94d"][i], opacity: 0.85 }} />
                        {a}
                      </div>
                    ))}
                  </div>
                  {/* Genişleyen aksiyon listesi (sahne 3) */}
                  <motion.div
                    initial={false}
                    animate={{ height: scene === 3 ? "auto" : 0, opacity: scene === 3 ? 1 : 0 }}
                    transition={t({ stiffness: 300 })}
                    style={{ overflow: "hidden", borderTop: "1px solid #e6e8ee" }}
                  >
                    {[
                      { l: "Kopyala", hot: false },
                      { l: "Okuma Listesine Ekle", hot: false },
                      { l: "Ana Ekrana Ekle", hot: true },
                      { l: "Yazdır", hot: false },
                    ].map((r) => (
                      <div key={r.l} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 11px", fontSize: 8.5, fontWeight: r.hot ? 800 : 500, color: r.hot ? "#1d2534" : "#556070", background: r.hot ? "var(--gold-100)" : "transparent", borderTop: "1px solid #eceef2" }}>
                        {r.l}
                        {r.hot ? (
                          <>
                            <span style={{ width: 12, height: 12, borderRadius: 3, border: "1.6px solid #1d2534", display: "grid", placeItems: "center" }}>
                              <Icon name="plus" size={8} />
                            </span>
                            <Tap x="calc(100% - 18px)" y="50%" delay={0.9} />
                          </>
                        ) : (
                          <span style={{ width: 11, height: 11, borderRadius: 3, background: "#dde1e8" }} />
                        )}
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= ANA EKRAN (sahne 4-5) ================= */}
      <AnimatePresence>
        {onHome && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={t()}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, #16294f 0%, #0b1530 70%)", padding: "34px 16px 0" }}
          >
            <span style={{ position: "absolute", right: -24, top: "30%", fontSize: 150, color: "rgba(201,162,39,.06)", lineHeight: 1 }}>★</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 11, position: "relative" }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "1", borderRadius: 12, background: "rgba(255,255,255,.14)" }} />
              ))}
              {/* Buca Yıldız ikonu — spring pop */}
              <div style={{ position: "relative" }}>
                <motion.div
                  initial={{ scale: 0, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 14, delay: 0.35 }}
                  style={{ aspectRatio: "1", borderRadius: 12, background: "var(--grad-gold)", display: "grid", placeItems: "center", boxShadow: "0 6px 16px rgba(201,162,39,.35)" }}
                >
                  <Image src="/brand/logo-emblem.png" alt="" width={26} height={26} style={{ objectFit: "contain" }} />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 0.55 }} style={{ marginTop: 3, textAlign: "center", fontSize: 6.2, color: "#fff" }}>
                  Buca Yıldız
                </motion.div>
                {scene === 5 && <Tap x="50%" y="40%" delay={0.4} />}
              </div>
            </div>
            {/* Dock */}
            <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, borderRadius: 18, background: "rgba(255,255,255,.12)", padding: 8, display: "flex", justifyContent: "space-around" }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,.2)" }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= UYGULAMA AÇILIŞI (sahne 6 → index 5 sonrası: scene===5'te tap, sahne geçişinde app) ================= */}
      <AnimatePresence>
        {scene === 5 && (
          <motion.div
            key="app"
            initial={{ scale: 0.12, opacity: 0, borderRadius: 60 }}
            animate={{ scale: 1, opacity: 1, borderRadius: 0 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 26, delay: 1.15 }}
            style={{ position: "absolute", inset: 0, transformOrigin: "62% 22%", background: "var(--navy-950)", zIndex: 20, overflow: "hidden" }}
          >
            {/* Splash */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: reduced ? 0.1 : 2.1, duration: 0.45 }}
              style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "var(--navy-950)", zIndex: 2 }}
            >
              <div style={{ textAlign: "center" }}>
                <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={t({ stiffness: 220 })}>
                  <Image src="/brand/logo-emblem.png" alt="" width={52} height={52} style={{ objectFit: "contain" }} />
                </motion.div>
                <div style={{ marginTop: 8, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 11, letterSpacing: ".1em", color: "#fff", textTransform: "uppercase" }}>Buca Yıldız</div>
                <div style={{ fontSize: 6.5, letterSpacing: ".22em", color: "var(--gold-400)", textTransform: "uppercase", marginTop: 2 }}>Futbol Akademisi</div>
              </div>
            </motion.div>
            {/* Uygulama içeriği: bizim panel (Safari çromu YOK) */}
            <MiniPanel asApp />
          </motion.div>
        )}
      </AnimatePresence>
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
  const reduced = useReducedMotion() ?? false;

  useOverlayDismiss(true, onClose);

  // Sahne zamanlayıcısı: her sahnenin kendi süresi; sonda başa döner.
  useEffect(() => {
    const id = window.setTimeout(() => setScene((s) => (s + 1) % SCENES.length), SCENE_MS[scene]);
    return () => window.clearTimeout(id);
  }, [scene]);

  return createPortal(
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.58)", zIndex: 220 }} />
      <motion.div
        initial={reduced ? false : { y: "100%" }}
        animate={{ y: 0 }}
        transition={spring}
        role="dialog"
        aria-modal="true"
        aria-label="Ana ekrana ekleme rehberi"
        className="by-overlay-scroll"
        style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 221, maxHeight: "92vh", overflowY: "auto", borderRadius: "22px 22px 0 0", background: "var(--surface-card)", boxShadow: "var(--shadow-xl)", padding: "10px 18px 26px" }}
      >
        <div style={{ width: 44, height: 4, borderRadius: 2, background: "var(--ink-200)", margin: "6px auto 14px" }} />
        <div style={{ maxWidth: 430, margin: "0 auto" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 4px", textAlign: "center" }}>
            Uygulama Gibi Kullan
          </h3>
          <p style={{ fontSize: 13, color: "var(--ink-500)", textAlign: "center", margin: "0 0 16px" }}>
            Mağaza gerekmez — Safari&apos;den iki dokunuşla ana ekranına ekle.
          </p>

          <PhoneScene scene={scene} reduced={reduced} />

          {/* Adım noktaları */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "16px 0 8px" }}>
            {SCENES.map((_, i) => (
              <motion.button
                key={i}
                type="button"
                aria-label={`Adım ${i + 1}`}
                onClick={() => setScene(i)}
                animate={{ width: i === scene ? 22 : 8, background: i === scene ? "var(--gold-500)" : "var(--ink-200)" }}
                transition={reduced ? { duration: 0 } : { ...spring, stiffness: 500 }}
                style={{ height: 8, borderRadius: 4, border: "none", cursor: "pointer", padding: 0 }}
              />
            ))}
          </div>

          <div style={{ textAlign: "center", minHeight: 44, position: "relative" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={scene}
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink-800)" }}>{SCENES[scene].title}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-400)", marginTop: 2 }}>{SCENES[scene].sub}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ display: "block", width: "100%", marginTop: 14, padding: "12px 16px", borderRadius: "var(--radius-md)", border: "none", cursor: "pointer", background: "var(--grad-gold)", color: "var(--navy-900)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase" }}
          >
            Anladım
          </button>
        </div>
      </motion.div>
    </>,
    document.body,
  );
}
