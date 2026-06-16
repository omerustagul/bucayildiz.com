// Buca Yıldız — Yaş grupları section
const { SectionHeading, AgeGroupCard, Button } = window.BucaYLdZTasarMSistemi_45a34f;

const GROUPS = [
  { label: 'A Takım', title: 'Üst yapı kadrosu', count: 26 },
  { label: 'U-18', title: '2008 doğumlular', count: 23 },
  { label: 'U-17', title: '2009 doğumlular', count: 24 },
  { label: 'U-16', title: '2010 doğumlular', count: 25 },
  { label: 'U-15', title: '2011 doğumlular', count: 28 },
];

function AgeGroupsSection() {
  return (
    <section style={{ background: 'var(--surface-page)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 32px' }}>
        <SectionHeading kicker="Akademi" title="Yaş Grupları"
          action={<Button variant="secondary" size="sm">Tüm Takımlar</Button>}
          style={{ marginBottom: 32 }} />
        <div className="hp-grid-ages" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
          {GROUPS.map((g) => <AgeGroupCard key={g.label} {...g} />)}
        </div>
      </div>
    </section>
  );
}
window.AgeGroupsSection = AgeGroupsSection;
