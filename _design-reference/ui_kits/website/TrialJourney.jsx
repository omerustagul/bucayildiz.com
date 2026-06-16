// Buca Yıldız — Ücretsiz Deneme "Yolculuk" ekranı (veli gözünden)
const { Button, IconButton } = window.BucaYLdZTasarMSistemi_45a34f;
const TJLOGO = '../../assets/logo-emblem.png';
const TJI = (n, sz = 16) => React.createElement('i', { 'data-lucide': n, style: { width: sz, height: sz } });

// ---- Reusable running silhouette ----
function Runner({ run = false, fast = false, stand = false }) {
  const cls = ['tj-fig', run && 'run', fast && 'fast', stand && 'stand'].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="face"><div className="body">
        <i className="head" /><i className="neck" /><i className="torso" />
        <i className="arm back" /><i className="arm front" />
        <i className="leg back" /><i className="leg front" />
      </div></div>
    </div>
  );
}

// ---- Scenes ----
function SceneBody() {
  return (
    <div className="tj-scene s-body">
      <div className="tj-flood" />
      <div className="bracket"><span className="tl" /><span className="tr" /><span className="bl" /><span className="br" /></div>
      <Runner stand />
      <div className="tj-scan" />
      <div className="s-chip c1"><b>%12,4</b><span>Yağ</span></div>
      <div className="s-chip c2"><b>%41</b><span>Kas</span></div>
      <div className="s-chip c3"><b>19,8</b><span>VKİ</span></div>
      <div className="pitch-lines" /><div className="tj-grass" />
    </div>
  );
}
function SceneSprint() {
  return (
    <div className="tj-scene s-sprint">
      <div className="tj-flood" />
      <div className="cone l" /><div className="cone r" />
      <div className="streak a" /><div className="streak b" />
      <Runner run fast />
      <div className="hr"><span className="dot" /><b>168</b></div>
      <div className="pitch-lines" /><div className="tj-grass" />
    </div>
  );
}
function SceneLadder() {
  const rungs = [10, 22, 34, 46, 58, 70, 82, 94];
  return (
    <div className="tj-scene s-ladder">
      <div className="tj-flood" />
      <div className="ladder">
        <span className="side l" /><span className="side r" />
        {rungs.map((p) => <span key={p} className="rung" style={{ left: p + '%' }} />)}
      </div>
      <Runner run fast />
      <div className="pitch-lines" /><div className="tj-grass" />
    </div>
  );
}
function SceneDribble() {
  return (
    <div className="tj-scene s-dribble">
      <div className="tj-flood" />
      <div className="goal" /><div className="net-flash" />
      <div className="cone c1" /><div className="cone c2" /><div className="cone c3" />
      <Runner run />
      <div className="tj-ball" />
      <div className="gol">GOL!</div>
      <div className="pitch-lines" /><div className="tj-grass" />
    </div>
  );
}
function SceneRoad() {
  return (
    <div className="tj-scene s-road">
      <div className="tj-flood" />
      <div className="plan"><div className="ph" /><div className="pl m" /><div className="pl s" /><div className="pl m" /><div className="pg" /></div>
      <svg viewBox="0 0 520 300" preserveAspectRatio="xMidYMid meet">
        <path className="draw" d="M60,252 C140,252 150,188 220,188 C290,188 300,120 360,140 C405,155 412,150 432,150" />
        <circle className="pin p1" cx="60" cy="252" r="7" fill="#fff" stroke="var(--gold-600)" strokeWidth="3" />
        <circle className="pin p2" cx="220" cy="188" r="7" fill="#fff" stroke="var(--gold-600)" strokeWidth="3" />
        <circle className="pin p3" cx="360" cy="140" r="7" fill="#fff" stroke="var(--gold-600)" strokeWidth="3" />
        <text className="goalstar" x="432" y="162" textAnchor="middle" fontSize="40" fill="var(--gold-400)">★</text>
      </svg>
      <div className="pitch-lines" />
    </div>
  );
}
function SceneStar() {
  return (
    <div className="tj-scene s-star">
      <div className="tj-flood" />
      <span className="ray r1" /><span className="ray r2" /><span className="ray r3" /><span className="ray r4" /><span className="ray r5" /><span className="ray r6" />
      <div className="star"><svg viewBox="0 0 24 24"><path d="M12 2l2.92 6.26 6.86.62-5.18 4.55 1.54 6.71L12 17.8l-6.14 3.34 1.54-6.71L2.22 8.88l6.86-.62z" fill="currentColor" /></svg></div>
      <span className="spark s1" /><span className="spark s2" /><span className="spark s3" /><span className="spark s4" /><span className="spark s5" />
      <Runner run />
      <div className="pitch-lines" /><div className="tj-grass" />
    </div>
  );
}

const TJ_STEPS = [
  { kicker: 'Adım 01', title: 'Vücut Profili Çıkarılır', scene: SceneBody,
    text: 'Çocuğunuzun boyu, kilosu, vücut yağ ve kas oranı ölçülür; sağlıklı gelişim için başlangıç noktasını birlikte görürüz.' },
  { kicker: 'Adım 02', title: 'Kondisyon & Çabukluk Testi', scene: SceneSprint,
    text: 'Kısa mesafe sürat ve mekik koşularıyla dayanıklılık ve hız ölçülür. Nabız takibiyle bilimsel bir değerlendirme yapılır.' },
  { kicker: 'Adım 03', title: 'Koordinasyon Testi', scene: SceneLadder,
    text: 'Çeviklik merdiveni ve ayak çalışmalarıyla denge, ritim ve koordinasyon becerileri ölçülür — futbolun temel taşı.' },
  { kicker: 'Adım 04', title: 'Top Becerisi Belirleme', scene: SceneDribble,
    text: 'Top sürme, çalım ve şut; engeller arasında top hakimiyeti gözlemlenir. Çocuğunuzun topla ilişkisini keşfederiz.' },
  { kicker: 'Adım 05', title: 'Kişiye Özel Yol Haritası', scene: SceneRoad,
    text: 'Tüm test sonuçları birleştirilir ve çocuğunuza özel, adım adım bir gelişim planı hazırlanır. Her sporcu farklıdır.' },
  { kicker: 'Sonuç', title: 'Geleceğin Yıldızı', scene: SceneStar, final: true,
    text: 'Disiplin, özgüven ve takım ruhuyla; önce iyi bir insan, sonra iyi bir sporcu. Yolculuğun sonunda çocuğunuz sahada parlar.' },
];

function TrialJourney() {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
    const steps = document.querySelectorAll('.tj-step');
    steps.forEach((s) => s.classList.add('reveal'));
    if (!('IntersectionObserver' in window)) { steps.forEach((s) => s.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="tj-page">
      {window.SiteHeader && React.createElement(window.SiteHeader, { backHref: 'index.html', onApply: () => { window.location.href = 'basvuru.html'; }, onLogin: () => { window.location.href = 'panel-giris.html'; } })}

      {/* hero */}
      <header className="tj-hero">
        <span className="tj-star-bg">★</span>
        <div className="tj-hero-inner">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold-400)' }}>
            <span style={{ width: 22, height: 2, background: 'var(--gold-500)' }} />Ücretsiz Deneme Programı
          </span>
          <h1>Önce iyi bir <span className="gold">insan</span>,<br />sonra iyi bir <span className="gold">sporcu</span> yetiştiriyoruz</h1>
          <p style={{ fontSize: 'clamp(16px,2vw,19px)', lineHeight: 1.6, color: 'var(--navy-100)', maxWidth: 640, margin: '20px auto 0' }}>
            Çocuğunuzu sahaya bekliyoruz. Antrenörlerimiz eşliğinde uygulanan <strong style={{ color: '#fff' }}>tamamen ücretsiz</strong> 5 adımlık değerlendirmeyle yeteneğini keşfediyor, ona özel bir yol haritası çiziyoruz.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30 }}>
            <Button as="a" href="basvuru.html" variant="accent" size="lg" leftIcon={TJI('star', 18)}>Hemen Ücretsiz Kayıt Ol</Button>
            <Button as="a" href="#yolculuk" variant="on-navy" size="lg" rightIcon={TJI('arrow-down', 16)}>Nasıl İşliyor?</Button>
          </div>
        </div>
      </header>

      {/* değerler bandı */}
      <section style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: 'clamp(32px,5vw,52px) 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(20px,2.6vw,30px)', lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: '-.005em', color: 'var(--text-strong)', margin: 0 }}>
            Fiziksel ve psikolojik gelişimin yanında <span style={{ color: 'var(--gold-700)' }}>sosyalleşme</span> becerisini önemsiyoruz
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(10px,2vw,16px)', flexWrap: 'wrap', marginTop: 22 }}>
            {[['dumbbell', 'Fiziksel Gelişim'], ['brain', 'Psikolojik Gelişim'], ['users', 'Sosyalleşme']].map(([icon, label]) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '10px 18px', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ display: 'inline-flex', color: 'var(--navy-600)' }}>{TJI(icon, 18)}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, color: 'var(--text-strong)' }}>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* roadmap */}
      <section className="tj-road" id="yolculuk">
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto clamp(36px,5vw,64px)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-700)' }}>
            <span style={{ width: 20, height: 2, background: 'var(--gold-500)' }} />Yolculuk
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(28px,4vw,44px)', textTransform: 'uppercase', color: 'var(--text-strong)', margin: '12px 0 0', lineHeight: 1.02 }}>5 Adımda Yeteneği Keşfediyoruz</h2>
        </div>

        <div className="tj-steps">
        {TJ_STEPS.map((s, i) => {
          const Scene = s.scene;
          return (
            <div className={'tj-step' + (s.final ? ' is-final' : '')} key={i}>
              <div className="tj-pane scene-col"><Scene /></div>
              <div className="tj-spine"><div className="tj-node">{s.final ? TJI('star', 22) : i + 1}</div></div>
              <div className="tj-pane text-col">
                <span className="tj-kicker">{s.kicker}</span>
                <h3 className="tj-h">{s.title}</h3>
                <p className="tj-p">{s.text}</p>
                <span className="tj-free">{TJI('gift', 14)} Tamamen ücretsiz</span>
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
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(28px,4vw,46px)', textTransform: 'uppercase', color: '#fff', margin: 0, lineHeight: 1.02 }}>Yıldız adayınızı sahaya bekliyoruz</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--navy-100)', maxWidth: 520, margin: '16px auto 28px' }}>Başvuru formunu doldurun, antrenörlerimiz ücretsiz deneme antrenmanı için sizinle iletişime geçsin.</p>
          <Button as="a" href="basvuru.html" variant="accent" size="lg" leftIcon={TJI('clipboard-list', 18)}>Ücretsiz Başvuru Formu</Button>
        </div>
      </section>
      {window.SiteFooter && React.createElement(window.SiteFooter)}
    </div>
  );
}

window.TrialJourney = TrialJourney;
