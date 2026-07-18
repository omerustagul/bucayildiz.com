"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/lib/icons";
import { SceneBody, SceneFlex, SceneVertical, SceneLongJump, SceneLadder, SceneSprint, SceneAgility505, SceneTTest, SceneYoyo, SceneRoad, SceneViewport } from "./TrialScenes";
import { perfTest } from "@/lib/performanceTests";
import "@/styles/trial-journey.css";

/** Buca Yıldız — Ücretsiz Deneme "Yolculuk" ekranı (veli gözünden).
 *  Sahne animasyonları framer-motion + eklemli SVG figür ile TrialScenes.tsx'te. */

/* Test BAŞLIKLARI tek kaynaktan (`@/lib/performanceTests`) gelir — anasayfadaki örnek
   raporla aynı 9 test. Sahne (animasyon) ve açıklama metni burada kalır. */
const TJ_STEPS: { kicker: string; title: string; scene: React.ComponentType; text: string; final?: boolean }[] = [
  { kicker: "Test 01", title: perfTest("vucut").title, scene: SceneBody, text: "Çocuğunuzun boyu, kilosu, vücut yağ ve kas oranı ölçülür; sağlıklı gelişim için başlangıç noktasını birlikte görürüz." },
  { kicker: "Test 02", title: perfTest("esneklik").title, scene: SceneFlex, text: "Otur-uzan ve eklem hareket açıklığı ölçülür; esneklik profili çıkarılarak sakatlık riski azaltılır." },
  { kicker: "Test 03", title: perfTest("dikey").title, scene: SceneVertical, text: "Dikey sıçrama yüksekliği ölçülür — patlayıcı bacak gücünün, ivmelenme ve şutun temeli." },
  { kicker: "Test 04", title: perfTest("uzun").title, scene: SceneLongJump, text: "Durarak uzun atlama ile alt vücut patlayıcılığı ve denge değerlendirilir." },
  { kicker: "Test 05", title: perfTest("koordinasyon").title, scene: SceneLadder, text: "Çeviklik merdiveni ve ayak çalışmalarıyla denge, ritim ve koordinasyon becerileri ölçülür — futbolun temel taşı." },
  { kicker: "Test 06", title: perfTest("sprint").title, scene: SceneSprint, text: "10-20-30 m sprintlerle ivmelenme ve maksimum hız ölçülür; nabız takibiyle bilimsel bir değerlendirme yapılır." },
  { kicker: "Test 07", title: perfTest("cev505").title, scene: SceneAgility505, text: "Sprint ve keskin 180° dönüşle yön değiştirme hızı — futbolda çevikliğin ölçütü — değerlendirilir." },
  { kicker: "Test 08", title: perfTest("ttest").title, scene: SceneTTest, text: "İleri, yana ve geri hareketle çok yönlü çeviklik, denge ve ayak hızı ölçülür." },
  { kicker: "Test 09", title: perfTest("yoyo").title, scene: SceneYoyo, text: "Aralıklı mekik koşusuyla dayanıklılık ve toparlanma kapasitesi bilimsel olarak ölçülür." },
  { kicker: "Sonuç", title: "Sporcuya Özel Yol Haritası", scene: SceneRoad, final: true, text: "Tüm test sonuçları birleştirilir ve çocuğunuza özel, adım adım bir gelişim planı hazırlanır. Her sporcu farklıdır." },
];

const VALUES: [IconName, string][] = [
  ["dumbbell", "Fiziksel Gelişim"],
  ["brain", "Psikolojik Gelişim"],
  ["users", "Sosyalleşme"],
];

export function TrialJourney() {
  useEffect(() => {
    const steps = document.querySelectorAll(".tj-step");
    steps.forEach((s) => s.classList.add("reveal"));
    if (!("IntersectionObserver" in window)) {
      steps.forEach((s) => s.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="tj-page">
      <header className="tj-hero by-navy-sec">
        <span className="tj-star-bg">★</span>
        <div className="tj-hero-inner">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold-400)" }}>
            <span style={{ width: 22, height: 2, background: "var(--gold-500)" }} />Ücretsiz Deneme Programı
          </span>
          {/* satır aralığı orana bağlı — sabit px font büyüyünce bindirir */}
          <h1 style={{ lineHeight: 1.15 }}>
            Önce iyi bir <span className="gold">insan</span>,<br />sonra iyi bir <span className="gold">sporcu</span> yetiştiriyoruz
          </h1>
          <p style={{ fontSize: "clamp(16px,2vw,19px)", lineHeight: 1.6, color: "var(--navy-100)", maxWidth: 640, margin: "20px auto 0" }}>
            Çocuğunuzu sahaya bekliyoruz. Antrenörlerimiz eşliğinde uygulanan <strong style={{ color: "#fff" }}>tamamen ücretsiz</strong> 9 testlik bilimsel değerlendirmeyle yeteneğini keşfediyor, ona özel bir yol haritası çiziyoruz.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 30 }}>
            <Button as="a" href="/basvuru" variant="accent" size="lg" leftIcon={<Icon name="star" size={18} />}>Hemen Ücretsiz Kayıt Ol</Button>
            <Button as="a" href="#yolculuk" variant="on-navy" size="lg" rightIcon={<Icon name="arrow-down" size={16} />}>Nasıl İşliyor?</Button>
          </div>
        </div>
      </header>

      {/* değerler bandı */}
      <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "clamp(32px,5vw,52px) 32px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(20px,2.6vw,30px)", lineHeight: 1.15, textTransform: "uppercase", letterSpacing: "-.005em", color: "var(--text-strong)", margin: 0 }}>
            Fiziksel ve psikolojik gelişimin yanında <span style={{ color: "var(--gold-700)" }}>sosyalleşme</span> becerisini önemsiyoruz
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(10px,2vw,16px)", flexWrap: "wrap", marginTop: 22 }}>
            {VALUES.map(([icon, label]) => (
              <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "10px 18px", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-pill)", boxShadow: "var(--shadow-xs)" }}>
                <span style={{ display: "inline-flex", color: "var(--navy-600)" }}><Icon name={icon} size={18} /></span>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14.5, color: "var(--text-strong)" }}>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* roadmap */}
      <section className="tj-road" id="yolculuk">
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto clamp(36px,5vw,64px)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-700)" }}>
            <span style={{ width: 20, height: 2, background: "var(--gold-500)" }} />Yolculuk
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", textTransform: "uppercase", color: "var(--text-strong)", margin: "12px 0 0", lineHeight: 1.02 }}>9 Testte Yeteneği Keşfediyoruz</h2>
        </div>

        <div className="tj-steps">
          {TJ_STEPS.map((s, i) => {
            const Scene = s.scene;
            return (
              <div className={"tj-step" + (s.final ? " is-final" : "")} key={i}>
                <SceneViewport className="tj-pane scene-col"><Scene /></SceneViewport>
                <div className="tj-spine"><div className="tj-node">{s.final ? <Icon name="star" size={22} /> : i + 1}</div></div>
                <div className="tj-pane text-col">
                  <span className="tj-kicker">{s.kicker}</span>
                  <h3 className="tj-h">{s.title}</h3>
                  <p className="tj-p">{s.text}</p>
                  <span className="tj-free"><Icon name="gift" size={14} /> Tamamen ücretsiz</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="tj-cta">
        <span className="tj-star-bg">★</span>
        <div className="tj-cta-inner">
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(28px,4vw,46px)", textTransform: "uppercase", color: "var(--navy-800)", margin: 0, lineHeight: 1.02 }}>Yıldız adayınızı sahaya bekliyoruz</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--navy-600)", maxWidth: 520, margin: "16px auto 28px" }}>Başvuru formunu doldurun, antrenörlerimiz ücretsiz deneme antrenmanı için sizinle iletişime geçsin.</p>
          <Button as="a" href="/basvuru" variant="accent" size="lg" leftIcon={<Icon name="clipboard-list" size={18} />}>Ücretsiz Başvuru Formu</Button>
        </div>
      </section>
    </div>
  );
}
