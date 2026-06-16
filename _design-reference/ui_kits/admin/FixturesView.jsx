// Buca Yıldız Admin — Fikstür yönetimi
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { Table, Badge, Button, Select, Tabs, IconButton } = NS;
  const { ViewHeader, Drawer, Field, TextInput, FileDrop, Toolbar, SearchBox, ic } = window.AdminUI;
  const D = window.AdminData;
  const CREST = '../../assets/logo-emblem.png';

  const fxStatus = { upcoming: { tone: 'navy', label: 'Yaklaşan' }, live: { tone: 'live', label: 'Canlı' }, finished: { tone: 'neutral', label: 'Bitti' } };
  const fmtDate = (d) => { const [y, m, day] = d.split('-'); return `${day}.${m}.${y}`; };

  function FixtureForm({ fx }) {
    const homeIsUs = !fx || fx.home === 'Buca Yıldız';
    const [side, setSide] = React.useState(homeIsUs ? 'home' : 'away');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Field label="Müsabaka / Lig" required>
          <Select placeholder="Lig seç" options={D.COMPS} defaultValue={fx ? fx.comp : ''} />
        </Field>

        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-600)', marginBottom: 8 }}>Ev Sahibi / Deplasman</div>
          <Tabs tabs={[{ id: 'home', label: 'Biz Ev Sahibiyiz' }, { id: 'away', label: 'Biz Deplasmandayız' }]} variant="pill" value={side} onChange={setSide} />
        </div>

        {/* Matchup */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 14, alignItems: 'flex-start' }}>
          {/* our side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', padding: 14, border: '1.5px solid var(--navy-300)', borderRadius: 'var(--radius-md)', background: 'var(--navy-50)' }}>
            <img src={CREST} alt="" style={{ width: 52, height: 52, objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', color: 'var(--navy-800)' }}>Buca Yıldız</span>
            <Badge tone="gold">{side === 'home' ? 'Ev Sahibi' : 'Deplasman'}</Badge>
          </div>
          <div style={{ alignSelf: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, color: 'var(--ink-400)' }}>VS</div>
          {/* opponent side — manual */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <FileDrop label="Rakip logosu" hint="PNG / SVG" icon="upload" aspect="1 / 1" style={{ width: 72, height: 72, alignSelf: 'center' }} />
            <Field label="Rakip Takım" required><TextInput defaultValue={fx ? (homeIsUs ? fx.away : fx.home) : ''} placeholder="Rakip takım adı" /></Field>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Tarih" required><TextInput type="date" defaultValue={fx ? fx.date : ''} /></Field>
          <Field label="Saat" required><TextInput type="time" defaultValue={fx ? fx.time : ''} /></Field>
        </div>
        <Field label="Saha / Stadyum"><TextInput defaultValue={fx ? fx.venue : ''} placeholder="örn. Buca Yıldız Tesisleri" /></Field>

        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        <Field label="Durum"><Select options={[{ value: 'upcoming', label: 'Yaklaşan' }, { value: 'live', label: 'Canlı' }, { value: 'finished', label: 'Tamamlandı' }]} defaultValue={fx ? fx.status : 'upcoming'} /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'end' }}>
          <Field label="Skor (biz)"><TextInput type="number" placeholder="0" defaultValue={fx && fx.hs != null ? fx.hs : ''} /></Field>
          <div style={{ paddingBottom: 12, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--ink-400)' }}>–</div>
          <Field label="Skor (rakip)"><TextInput type="number" placeholder="0" defaultValue={fx && fx.as != null ? fx.as : ''} /></Field>
        </div>
      </div>
    );
  }

  function FixturesView() {
    const [tab, setTab] = React.useState('all');
    const [drawer, setDrawer] = React.useState(null);
    const rows = D.FIXTURES.filter((f) => tab === 'all' || f.status === tab);
    const tabs = [
      { id: 'all', label: 'Tümü', count: D.FIXTURES.length },
      { id: 'upcoming', label: 'Yaklaşan', count: D.FIXTURES.filter((f) => f.status === 'upcoming').length },
      { id: 'finished', label: 'Tamamlanan', count: D.FIXTURES.filter((f) => f.status === 'finished').length },
    ];
    const cols = [
      { key: 'date', label: 'Tarih', render: (r) => (
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, color: 'var(--text-strong)' }}>{fmtDate(r.date)}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>{r.time}</div>
        </div>
      ) },
      { key: 'match', label: 'Maç', render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 600, color: r.home === 'Buca Yıldız' ? 'var(--navy-700)' : 'var(--ink-700)' }}>{r.home}</span>
          {r.status === 'finished'
            ? <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, background: 'var(--ink-100)', borderRadius: 'var(--radius-sm)', padding: '2px 9px', color: 'var(--text-strong)' }}>{r.hs}–{r.as}</span>
            : <span style={{ color: 'var(--ink-400)', fontSize: 12, fontWeight: 600 }}>vs</span>}
          <span style={{ fontWeight: 600, color: r.away === 'Buca Yıldız' ? 'var(--navy-700)' : 'var(--ink-700)' }}>{r.away}</span>
        </div>
      ) },
      { key: 'comp', label: 'Lig', render: (r) => <Badge tone="outline">{r.comp}</Badge> },
      { key: 'venue', label: 'Saha', render: (r) => <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>{r.venue}</span> },
      { key: 'status', label: 'Durum', align: 'center', render: (r) => <Badge tone={fxStatus[r.status].tone} dot={r.status === 'live'}>{fxStatus[r.status].label}</Badge> },
      { key: 'go', label: '', width: 44, align: 'right', render: () => <span style={{ color: 'var(--ink-300)', display: 'inline-flex' }}>{ic('pencil', 15)}</span> },
    ];
    return (
      <React.Fragment>
        <ViewHeader title="Fikstür" subtitle="Maç programını görüntüle ve manuel yönet"
          actions={<Button variant="accent" size="sm" leftIcon={ic('plus', 16)} onClick={() => setDrawer({ fx: null })}>Maç Ekle</Button>}
          tabs={<Tabs tabs={tabs} value={tab} onChange={setTab} />} />
        <Toolbar>
          <SearchBox placeholder="Rakip / lig ara…" />
          <Select options={['Tüm ligler', ...D.COMPS]} containerStyle={{ minWidth: 180 }} />
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--ink-400)' }}>{rows.length} maç</span>
        </Toolbar>
        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setDrawer({ fx: r })} />
        <Drawer open={!!drawer} onClose={() => setDrawer(null)}
          title={drawer && drawer.fx ? 'Maçı Düzenle' : 'Yeni Maç'}
          subtitle="Rakip bilgilerini ve logosunu manuel girebilirsin" width={540}
          footer={<React.Fragment>
            {drawer && drawer.fx && <Button variant="ghost" size="sm" style={{ color: 'var(--red-600)', marginRight: 'auto' }} leftIcon={ic('trash-2', 15)}>Sil</Button>}
            <Button variant="secondary" size="sm" onClick={() => setDrawer(null)}>İptal</Button>
            <Button variant="primary" size="sm" onClick={() => setDrawer(null)}>Kaydet</Button>
          </React.Fragment>}>
          {drawer && <FixtureForm fx={drawer.fx} />}
        </Drawer>
      </React.Fragment>
    );
  }

  window.FixturesView = FixturesView;
})();
