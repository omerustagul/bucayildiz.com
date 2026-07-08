import { AppointmentForm } from "./AppointmentForm";

/**
 * Buca Yıldız — "Nasıl Çalışıyoruz?" section. Hero'nun hemen altında.
 * 3 sütun: süreç adımları (zaman çizgisi) · örnek rapor kartı · hızlı randevu formu.
 * Marka mimarisi: açık zemin + lacivert metin + altın vurgular.
 */

const STEPS = [
  { n: 1, title: "Randevu Alın", text: "Ücretsiz analiz için bize ulaşın ve randevunuzu alın." },
  { n: 2, title: "Performans Testleri", text: "Çocuğunuzun fiziksel ve teknik performansını ölçüyoruz." },
  { n: 3, title: "Raporlama", text: "Sonuçları detaylı analiz ediyor, kişisel gelişim raporunu hazırlıyoruz." },
  { n: 4, title: "Gelişim Planı", text: "Çocuğunuz için özel antrenman planı oluşturuyoruz." },
];

const RADAR = [
  { label: "Hız", value: 84 },
  { label: "Çeviklik", value: 72 },
  { label: "Teknik", value: 78 },
  { label: "Koordinasyon", value: 68 },
  { label: "Dayanıklılık", value: 62 },
  { label: "Güç", value: 74 },
];

const TESTS = [
  { label: "20 m Sprint", value: "3.45 sn" },
  { label: "Çeviklik Testi", value: "11.20 sn" },
  { label: "Dikey Sıçrama", value: "38 cm" },
  { label: "Yo-Yo Dayanıklılık", value: "1200 m" },
];

function StepsColumn() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.05, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 28px" }}>
        Nasıl Çalışıyoruz?
      </h2>
      {/* flex:1 + ara adımlar flex:1 → zaman çizgisi rapor yüksekliğine yayılır */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {STEPS.map((s, i) => (
          <div key={s.n} style={{ display: "flex", gap: 10, alignItems: "stretch", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            {/* numara + dikey çizgi */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
              <span style={{ width: 34, height: 34, flex: "none", borderRadius: "50%", background: "var(--grad-gold)", color: "var(--navy-900)", display: "grid", placeItems: "center", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 14, boxShadow: "0 3px 12px rgba(201,162,39,.28)" }}>
                {s.n}
              </span>
              {i < STEPS.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 24, background: "linear-gradient(var(--gold-500), rgba(201,162,39,0.2))", margin: "2px 0" }} />}
            </div>
            <div style={{ paddingBottom: i < STEPS.length - 1 ? 16 : 0 }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, letterSpacing: ".02em", textTransform: "uppercase", color: "var(--gold-700)", margin: "6px 0 6px" }}>{s.title}</h3>
              <p style={{ fontSize: 12, lineHeight: 1.55, color: "var(--ink-600)", margin: 0, maxWidth: 320 }}>{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Radar({ size = 168 }: { size?: number }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 26, n = RADAR.length;
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const ring = (f: number) => RADAR.map((_, i) => pt(i, R * f).join(",")).join(" ");
  const shape = RADAR.map((ax, i) => pt(i, R * (ax.value / 100)).join(",")).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {[0.5, 1].map((f) => <polygon key={f} points={ring(f)} fill="none" stroke="rgba(21,41,90,0.16)" strokeWidth="1" />)}
      {RADAR.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(21,41,90,0.12)" strokeWidth="1" />; })}
      <polygon points={shape} fill="rgba(201,162,39,0.45)" stroke="var(--gold-600)" strokeWidth="2" strokeLinejoin="round" />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 17, fill: "var(--gold-700)" }}>★</text>
      {RADAR.map((ax, i) => { const [x, y] = pt(i, R + 12); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "var(--font-body)", fontSize: 8.5, fontWeight: 700, letterSpacing: ".02em", textTransform: "uppercase", fill: "var(--ink-500)" }}>{ax.label}</text>; })}
    </svg>
  );
}

function SampleReportCard() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: "var(--radius-xl)", border: "1.5px solid var(--gold-500)", background: "var(--surface-card)", padding: 6, boxShadow: "var(--shadow-lg)" }}>
      <div style={{ textAlign: "center", padding: "6px 10px 7px", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold-700)" }}>
        Örnek Rapor
      </div>
      <div style={{ flex: 1, background: "#f7f4ea", borderRadius: "var(--radius-lg)", padding: "12px 16px 11px", color: "var(--navy-900)" }}>
        {/* üst: oyuncu + radar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ width: 46, height: 46, flex: "none", borderRadius: "50%", background: "var(--grad-navy)", border: "2px solid var(--gold-500)", color: "var(--gold-400)", display: "grid", placeItems: "center", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 17 }}>AY</span>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-500)" }}>Oyuncu Adı</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, color: "var(--navy-900)" }}>Arda Y.</div>
              <div style={{ fontSize: 11, color: "var(--ink-500)" }}>Yaş 11</div>
            </div>
          </div>
          <Radar size={116} />
        </div>

        {/* genel performans */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0", paddingTop: 8, borderTop: "1px solid rgba(21,41,90,0.1)" }}>
          <span style={{ width: 52, height: 52, flex: "none", borderRadius: "50%", background: "var(--grad-gold)", color: "var(--navy-900)", display: "grid", placeItems: "center", boxShadow: "0 5px 14px rgba(201,162,39,.3)", lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--font-stat)", fontWeight: 800, fontSize: 20 }}>7.6</span>
          </span>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-500)" }}>Genel Performans</div>
            <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 14, color: "var(--navy-700)" }}>7.6 <span style={{ fontSize: 11.5, color: "var(--ink-400)" }}>/ 10</span></div>
          </div>
        </div>

        {/* test sonuçları */}
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-500)", margin: "0 0 4px" }}>Test Sonuçları</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, gridTemplateColumns: "2fr 2fr", gridTemplateRows: "2fr 2fr", gridAutoFlow: "column" }}>
          {TESTS.map((t, i) => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderTop: i === 0 ? "none" : "1px solid rgba(21,41,90,0.08)" }}>
              <span style={{ fontSize: 13, color: "var(--ink-700)" }}>{t.label}</span>
              <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 13.5, color: "var(--navy-900)" }}>{t.value}</span>
            </div>
          ))}
        </div>

        {/* antrenör yorumu */}
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(21,41,90,0.1)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-500)" }}>Antrenör Yorumu</span>
            <span style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: 13, color: "var(--navy-700)" }}>R. Yılmaz · Baş Antrenör</span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--ink-700)", margin: "5px 0 0" }}>
            Hız ve teknik becerileri yaş grubuna göre iyi seviyede; çeviklik ve dayanıklılıktaki gelişimle üst seviyeye çıkacaktır.
          </p>
        </div>
      </div>
    </div>
  );
}

function FormColumn() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(24px, 2.6vw, 34px)", lineHeight: 1.05, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 8px" }}>
        Hemen Randevu Alın
      </h2>
      <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, letterSpacing: ".02em", textTransform: "uppercase", color: "var(--gold-700)", margin: "0 0 20px", lineHeight: 1.3 }}>
        Çocuğunuzun Potansiyelini Birlikte Keşfedelim!
      </p>
      {/* flex:1 → form kalan yüksekliğe yayılır, alanlar eşit aralıklarla dağılır */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppointmentForm fill />
      </div>
    </div>
  );
}

/** Sütun ayırıcı: ortası belirgin, uçlara doğru saydamlaşan dikey çizgi (≤900px'te gizlenir). */
function HowDivider() {
  return (
    <span
      aria-hidden
      className="how-divider"
      style={{
        width: 2,
        alignSelf: "stretch",
        borderRadius: 2,
        background: "linear-gradient(to bottom, transparent, rgba(176,138,26,0.9) 50%, transparent)",
      }}
    />
  );
}

export function HowItWorksSection() {
  return (
    <section style={{ background: "var(--surface-page)", position: "relative", overflow: "hidden" }}>
      <span aria-hidden style={{ position: "absolute", left: -60, top: -40, fontSize: 320, lineHeight: 1, color: "rgba(21,41,90,0.03)", pointerEvents: "none" }}>★</span>
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "clamp(36px, 2vw, 56px) clamp(16px, 5vw, 32px)", position: "relative" }}>
        <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2px 1.12fr 2px 1fr", gap: "clamp(24px, 3vw, 36px)", alignItems: "stretch" }}>
          <StepsColumn />
          <HowDivider />
          <SampleReportCard />
          <HowDivider />
          <FormColumn />
        </div>
      </div>
    </section>
  );
}
