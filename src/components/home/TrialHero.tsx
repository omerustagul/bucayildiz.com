import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/lib/icons";

/**
 * Buca Yıldız — Anasayfa üst hero: "Ücretsiz Futbolcu Gelişim Analizi".
 * Tam-ekran (edge-to-edge) bant; koyu foto arka plan + sol gradient ile metin
 * okunabilirliği. Gerçek antrenman fotoğrafı public/brand/hero-trial.jpg'e
 * konunca otomatik görünür; yoksa koyu lacivert zemin (kırılmaz).
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

export function TrialHero({ href = "/ucretsiz-deneme" }: { href?: string }) {
  return (
    <section className="trial-hero" style={{ position: "relative", overflow: "hidden", color: "#fff" }}>
      {/* 8-18 yaş rozeti */}
      <div
        style={{
          position: "absolute",
          top: "clamp(16px, 4vw, 40px)",
          right: "clamp(16px, 4vw, 56px)",
          width: "clamp(70px, 13vw, 104px)",
          height: "clamp(70px, 13vw, 104px)",
          borderRadius: "50%",
          background: "var(--grad-gold)",
          color: "var(--navy-900)",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          boxShadow: "0 8px 28px rgba(0,0,0,.45)",
          zIndex: 2,
        }}
      >
        <span style={{ lineHeight: 1 }}>
          <span style={{ display: "block", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(17px, 3vw, 26px)" }}>8-18</span>
          <span style={{ display: "block", fontWeight: 700, fontSize: "clamp(8px, 1.4vw, 11px)", letterSpacing: ".1em", marginTop: 3 }}>YAŞ ARASI</span>
        </span>
      </div>

      <div
        style={{
          maxWidth: 1540,
          margin: "0 auto",
          padding: "clamp(36px, 2vw, 56px) clamp(16px, 5vw, 32px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: 600, height: "100%", display: "flex", flexDirection: "column", gap: "clamp(16px, 3vw, 24px)", justifyContent: "space-between" }}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "clamp(26px, 5.2vw, 46px)",
              lineHeight: 0.98,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.82)",
              margin: 0,
              maxWidth: 540,
            }}
          >
            Çocuğunuzun <span style={{ color: "var(--gold-400)" }}> <br /> Futbol Potansiyelini</span> <br /> Bilimsel Olarak Ölçelim!
          </h1>
          {/* Analiz kartı */}
          <div
            style={{
              background: "linear-gradient(180deg, rgba(201,162,39,0.18), rgba(201,162,39,0.06))",
              border: "1px solid rgba(201,162,39,0.45)",
              borderRadius: "var(--radius-lg)",
              padding: "1vw",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "2vw",
                textTransform: "uppercase",
                color: "var(--gold-300)",
                marginBottom: 14,
                textAlign: "center",
              }}
            >
              Ücretsiz Futbolcu Gelişim Analizi
            </div>
            {/* 7 test: 4+3 dizilim — son satırın ortalanması için flex (grid'de mümkün değil) */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: 12 }}>
              {TESTS.map((t) => (
                <div key={t.label} style={{ flex: "0 0 25%", minWidth: 0, boxSizing: "border-box", padding: "0 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
                  <span style={{ color: "var(--gold-400)", display: "inline-flex" }}>
                    <Icon name={t.icon} size={24} />
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(8.5px, 1.3vw, 11px)",
                      fontWeight: 600,
                      letterSpacing: ".03em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.88)",
                      lineHeight: 1.2,
                    }}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Button as="a" href={href} variant="gold-outline" size="md" rightIcon={<Icon name="arrow-right" size={18} />}>
              Hemen Ücretsiz Randevu Al
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
