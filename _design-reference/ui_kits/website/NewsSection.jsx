// Buca Yıldız — Haberler (news) section
const { SectionHeading, NewsCard, Button, Badge } = window.BucaYLdZTasarMSistemi_45a34f;

const FEATURE = {
  category: 'Manşet', date: '11 Haziran 2026',
  title: 'A Takımımız sezonu kupayla taçlandırdı',
  excerpt: 'Final karşılaşmasında sahadan 2-0 galip ayrılan A Takımımız, bölgesel ligi namağlup şampiyon olarak tamamladı. Teknik ekibimiz ve sporcularımızı tebrik ederiz.',
};
const ITEMS = [
  { category: 'Altyapı', date: '10 Haziran 2026', title: 'U-17 takımımız grubunu lider tamamladı', excerpt: 'Sezonun son maçında alınan galibiyetle play-off biletini erken aldık.' },
  { category: 'Tesis', date: '6 Haziran 2026', title: 'Yeni antrenman sahamız hizmete girdi', excerpt: 'Hibrit çim yüzeyli yeni sahamız tüm yaş gruplarımızın hizmetinde.' },
  { category: 'Etkinlik', date: '2 Haziran 2026', title: 'Yaz okulu kayıtları başladı', excerpt: '7-14 yaş arası tüm çocuklarımızı ücretsiz tanışma antrenmanına bekliyoruz.' },
];

function NewsSection() {
  return (
    <section style={{ background: 'var(--surface-page)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 32px' }}>
        <SectionHeading kicker="Kulüpten" title="Son Haberler"
          action={<Button variant="secondary" size="sm">Tüm Haberler</Button>}
          style={{ marginBottom: 32 }} />
        <div className="hp-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          {/* Featured */}
          <a href="#" style={{ position: 'relative', display: 'block', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: 420, background: 'var(--grad-navy)', border: '1px solid var(--navy-700)', textDecoration: 'none' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'rgba(201,162,39,0.08)', fontFamily: 'var(--font-heading)', fontSize: 200 }}>★</div>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-navy)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Badge tone="gold">{FEATURE.category}</Badge>
                <Badge tone="on-navy">{FEATURE.date}</Badge>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 36, lineHeight: 1, textTransform: 'uppercase', color: '#fff', margin: 0, maxWidth: 540 }}>{FEATURE.title}</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--navy-100)', margin: 0, maxWidth: 520 }}>{FEATURE.excerpt}</p>
            </div>
          </a>
          {/* Side list */}
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 16 }}>
            {ITEMS.map((it, i) => (
              <a key={i} href="#" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 14, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', textDecoration: 'none' }}>
                <div style={{ background: 'var(--grad-navy)', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.10)', fontFamily: 'var(--font-heading)', fontSize: 44 }}>BY</div>
                <div style={{ padding: '14px 14px 14px 0', display: 'flex', flexDirection: 'column', gap: 5, justifyContent: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold-700)' }}>{it.category} · {it.date}</span>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, lineHeight: 1.1, color: 'var(--text-strong)', margin: 0 }}>{it.title}</h4>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
window.NewsSection = NewsSection;
