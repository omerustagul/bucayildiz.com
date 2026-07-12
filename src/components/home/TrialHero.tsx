"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/lib/icons";
import { heroImageVars } from "@/components/home/heroImage";

/**
 * Buca Yıldız — Anasayfa üst hero: "Ücretsiz Futbolcu Gelişim Analizi".
 * Tam-ekran (edge-to-edge) bant; koyu foto arka plan + sol gradient ile metin
 * okunabilirliği. Test kartı "skaut raporu" temasında: cam zemin, altın
 * gradyan çerçeve, ✓ işaretli 2 sütunlu test listesi. Gerçek antrenman
 * fotoğrafı public/brand/hero-trial.jpg'e konunca otomatik görünür; yoksa
 * koyu lacivert zemin (kırılmaz).
 */

const TESTS: { icon: IconName; label: string }[] = [
  { icon: "heart-pulse", label: "Yo-Yo IR1" },
  { icon: "traffic-cone", label: "T Testi" },
  { icon: "zap", label: "505 Çeviklik" },
  { icon: "user-round", label: "Boy-Kilo Analizi" },
  { icon: "dumbbell", label: "Yağ-Kas Oranı Ölçümü" },
  { icon: "arrow-up-from-line", label: "Dikey Sıçrama" },
  { icon: "gauge", label: "10-20-30 m Sprint" },
];

export function TrialHero({ href = "/ucretsiz-deneme", heroImageUrl, heroMobileImageUrl }: { href?: string; heroImageUrl?: string | null; heroMobileImageUrl?: string | null }) {
  const reduce = useReducedMotion();
  // Masaüstü 16:9 + mobil 1:1; mobil boşsa masaüstüne düşer (fallback).
  const heroImg = heroImageVars(heroImageUrl, heroMobileImageUrl);

  // Zarif giriş: fade + hafif yukarı kayma; testler 70ms arayla belirir.
  const fadeUp = reduce
    ? { hidden: {}, show: {} }
    : {
      hidden: { opacity: 0, y: 16 },
      show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
    };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : 0.15 } },
  };

  return (
    <section
      className="trial-hero"
      style={{
        position: "relative",
        overflow: "hidden",
        color: "#fff",
        // Özel görsel ayarlardan gelir; boşsa varsayılan marka görselleri.
        // Mobil (--hero-img-m) 1:1 mobil görseli; yoksa masaüstüne düşer.
        ["--hero-img" as string]: heroImg.desktop,
        ["--hero-img-m" as string]: heroImg.mobile,
      }}
    >
      {/* Arka plan katmanı — açılışta yumuşak zoom-out (transform, bg'den ayrık) */}
      <div className="trial-hero-bg" aria-hidden="true" />
      <div
        className="trial-hero-inner"
        style={{
          maxWidth: 1540,
          width: "100%",
          margin: "0 auto",
          padding: "38px clamp(16px, 5vw, 32px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* 8-18 yaş rozeti — minik, cam-altın kapsül */}
        <motion.div
          className="trial-hero-badge"
          initial={reduce ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: "clamp(30px, 2vw, 50px)",
            right: "clamp(16px, 5vw, 32px)",
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            padding: "9px 16px 9px 12px",
            borderRadius: "var(--radius-pill)",
            background: "rgba(8, 15, 33, 0.55)",
            border: "1px solid rgba(201, 162, 39, 0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
          }}
        >
          <span aria-hidden="true" style={{ width: 26, height: 26, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--grad-gold)", color: "var(--navy-900)", fontSize: 13, lineHeight: 1 }}>★</span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, color: "#fff", letterSpacing: ".02em" }}>8–18</span>
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 8.5, letterSpacing: ".2em", color: "#DDBB4E" }}>YAŞ ARASI</span>
          </span>
        </motion.div>

        <motion.div
          className="trial-hero-content"
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ maxWidth: 620, display: "flex", flexDirection: "column", gap: "clamp(18px, 3vw, 26px)" }}
        >
          <motion.h1
            className="trial-hero-title"
            variants={fadeUp}
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "clamp(26px, 5.2vw, 36px)",
              lineHeight: 1.08,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.85)",
              margin: 0,
              maxWidth: 540,
            }}
          >
            Çocuğunuzun <span style={{ color: "var(--gold-400)" }}> <br /> Futbol Potansiyelini</span> <br /> Bilimsel Olarak Ölçelim!
          </motion.h1>

          {/* Skaut raporu kartı: 1px altın gradyan çerçeve + cam iç zemin */}
          <motion.div
            variants={fadeUp}
            style={{
              padding: 1,
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, rgba(201,162,39,0.75), rgba(201,162,39,0.15) 40%, rgba(201,162,39,0.55))",
              boxShadow: "0 18px 48px rgba(0,0,0,.35)",
            }}
          >
            <div
              style={{
                borderRadius: "calc(var(--radius-lg) - 1px)",
                background: "linear-gradient(180deg, rgba(10,18,38,0.82), rgba(10,18,38,0.62))",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                padding: "clamp(16px, 2.4vw, 24px) clamp(14px, 2.4vw, 26px)",
              }}
            >
              {/* Rapor başlığı */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "clamp(14px, 2vw, 18px)" }}>
                <span
                  style={{
                    flex: "0 0 auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "var(--grad-gold)",
                    color: "var(--navy-900)",
                    borderRadius: 999,
                    padding: "5px 12px",
                    fontSize: "clamp(9.5px, 1.2vw, 11px)",
                    fontWeight: 800,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                  }}
                >
                  <Icon name="star" size={11} /> Ücretsiz
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "clamp(15px, 2.2vw, 21px)",
                      lineHeight: 1.05,
                      textTransform: "uppercase",
                      color: "var(--gold-300)",
                    }}
                  >
                    Futbolcu Gelişim Analizi
                  </div>
                  <div style={{ fontSize: "clamp(10px, 1.3vw, 12px)", color: "rgba(255,255,255,0.55)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>
                    Performans Test Raporu
                  </div>
                </div>
              </div>

              {/* ✓ işaretli 2 sütunlu test listesi */}
              <motion.ul
                variants={stagger}
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  columnGap: "clamp(10px, 2vw, 22px)",
                  rowGap: "clamp(9px, 1.4vw, 12px)",
                }}
              >
                {TESTS.map((t) => (
                  <motion.li key={t.label} variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span
                      style={{
                        flex: "0 0 auto",
                        width: "clamp(28px, 3.4vw, 34px)",
                        height: "clamp(28px, 3.4vw, 34px)",
                        borderRadius: 10,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(201,162,39,0.12)",
                        border: "1px solid rgba(201,162,39,0.35)",
                        color: "var(--gold-400)",
                      }}
                    >
                      <Icon name={t.icon} size={16} />
                    </span>
                    <span style={{ color: "var(--gold-400)", display: "inline-flex", flex: "0 0 auto" }}>
                      <Icon name="check" size={14} />
                    </span>
                    <span
                      style={{
                        fontSize: "clamp(11px, 1.5vw, 13.5px)",
                        fontWeight: 600,
                        letterSpacing: ".02em",
                        color: "rgba(255,255,255,0.92)",
                        lineHeight: 1.25,
                      }}
                    >
                      {t.label}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Button as="a" href={href} variant="gold-outline" size="md" rightIcon={<Icon name="arrow-right" size={18} />}>
              Hemen Ücretsiz Randevu Al
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
