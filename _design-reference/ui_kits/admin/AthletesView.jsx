// Buca Yıldız Admin — Sporcular (list + create/edit)
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { Table, Badge, Avatar, Button, Select, Switch, Tabs } = NS;
  const { ViewHeader, Panel, Drawer, Field, TextInput, FileDrop, SearchBox, Toolbar, ic } = window.AdminUI;
  const D = window.AdminData;

  const aStatus = {
    active: { tone: 'success', label: 'Aktif' },
    injured: { tone: 'live', label: 'Sakat' },
    rest: { tone: 'neutral', label: 'İzinli' },
  };

  // Turkish-safe slug → default panel username, e.g. "Arda Yılmaz" → "arda.yilmaz"
  const trSlug = (s) => (s || '').toLocaleLowerCase('tr')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9 ]/g, '').trim().replace(/\s+/g, '.');
  const genPassword = () => {
    const cs = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let p = ''; for (let i = 0; i < 9; i++) p += cs[Math.floor(Math.random() * cs.length)];
    return p;
  };

  // Panel login credentials — athlete signs in with username, e-posta OR telefon
  function CredFields({ athlete }) {
    const [pw, setPw] = React.useState('');
    const [show, setShow] = React.useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold-700)' }}>Panel Giriş Bilgileri</div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-400)', margin: '6px 0 0' }}>Sporcu panele <strong style={{ color: 'var(--ink-600)' }}>kullanıcı adı, e-posta veya telefon</strong> ile giriş yapabilir.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Kullanıcı Adı" required><TextInput defaultValue={athlete ? trSlug(athlete.name) : ''} placeholder="arda.yilmaz" /></Field>
          <Field label="Telefon (giriş için)"><TextInput type="tel" placeholder="05xx xxx xx xx" /></Field>
        </div>
        <Field label="E-posta (giriş için)"><TextInput type="email" placeholder="sporcu@eposta.com" /></Field>
        <Field label={athlete ? 'Şifre Sıfırla' : 'Geçici Şifre'} required={!athlete} hint="Sporcu ilk girişte değiştirebilir.">
          <div style={{ display: 'flex', gap: 8 }}>
            <TextInput type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Şifre oluştur veya gir" style={{ flex: 1, fontFamily: pw ? 'var(--font-stat)' : 'inherit', letterSpacing: pw && show ? '.04em' : 0 }} />
            <Button variant="secondary" size="sm" type="button" onClick={() => setShow((s) => !s)} title={show ? 'Gizle' : 'Göster'}>{ic(show ? 'eye-off' : 'eye', 15)}</Button>
            <Button variant="primary" size="sm" type="button" leftIcon={ic('refresh-cw', 15)} onClick={() => { setPw(genPassword()); setShow(true); }}>Oluştur</Button>
          </div>
        </Field>
      </div>
    );
  }

  function AthleteForm({ athlete }) {
    const isNew = !athlete;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Photo + identity */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <FileDrop label="Fotoğraf" compact icon="user-round" aspect="1 / 1" style={{ width: 96, height: 96, flex: 'none' }} filled={!isNew} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Ad Soyad" required><TextInput defaultValue={athlete ? athlete.name : ''} placeholder="Sporcunun adı soyadı" /></Field>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold-700)' }}>Takım & Mevki</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Takım" required><Select placeholder="Takım seç" options={D.TEAMS.map((t) => ({ value: t.id, label: t.name }))} defaultValue={athlete ? athlete.team : ''} /></Field>
          <Field label="Mevki" required><Select placeholder="Mevki seç" options={D.POS} defaultValue={athlete ? athlete.pos : ''} /></Field>
          <Field label="Forma No"><TextInput type="number" defaultValue={athlete ? athlete.no : ''} placeholder="10" /></Field>
          <Field label="Ayak"><Select options={['Sağ', 'Sol', 'Çift']} defaultValue={athlete ? athlete.foot : 'Sağ'} /></Field>
        </div>

        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold-700)' }}>Fiziksel Veriler</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <Field label="Boy" hint="cm"><TextInput type="number" defaultValue={athlete ? athlete.boy : ''} placeholder="178" /></Field>
          <Field label="Kilo" hint="kg"><TextInput type="number" defaultValue={athlete ? athlete.kilo : ''} placeholder="68" /></Field>
          <Field label="Doğum Yılı"><TextInput type="number" placeholder="2009" /></Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Lisans No"><TextInput placeholder="34721" /></Field>
          <Field label="Veli Telefon"><TextInput placeholder="05xx xxx xx xx" /></Field>
        </div>

        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        <CredFields athlete={athlete} />

        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--text-strong)' }}>Aktif sporcu</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>Pasif sporcular kadro listelerinde görünmez.</div>
          </div>
          <Switch defaultChecked={!athlete || athlete.status === 'active'} />
        </div>
      </div>
    );
  }

  function AthletesView() {
    const [team, setTeam] = React.useState('all');
    const [q, setQ] = React.useState('');
    const [drawer, setDrawer] = React.useState(null); // {athlete} | {athlete:null} for new

    const rows = D.ATHLETES.filter((a) => (team === 'all' || a.team === team) && a.name.toLowerCase().includes(q.toLowerCase()));
    const tabs = [{ id: 'all', label: 'Tümü', count: D.ATHLETES.length }, ...D.TEAMS.map((t) => ({ id: t.id, label: t.name, count: D.ATHLETES.filter((a) => a.team === t.id).length }))];

    const cols = [
      { key: 'name', label: 'Sporcu', render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Avatar name={r.name} size="sm" />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{r.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-400)', whiteSpace: 'nowrap' }}>#{r.no} · {r.pos}</div>
          </div>
        </div>
      ) },
      { key: 'teamName', label: 'Takım', render: (r) => <Badge tone="navy">{r.teamName}</Badge> },
      { key: 'boy', label: 'Boy', align: 'right', render: (r) => <span style={{ fontFamily: 'var(--font-stat)' }}>{r.boy}<span style={{ color: 'var(--ink-400)', fontSize: 12 }}> cm</span></span> },
      { key: 'kilo', label: 'Kilo', align: 'right', render: (r) => <span style={{ fontFamily: 'var(--font-stat)' }}>{r.kilo}<span style={{ color: 'var(--ink-400)', fontSize: 12 }}> kg</span></span> },
      { key: 'foot', label: 'Ayak', align: 'center' },
      { key: 'status', label: 'Durum', align: 'right', render: (r) => <Badge tone={aStatus[r.status].tone} dot={r.status === 'injured'}>{aStatus[r.status].label}</Badge> },
      { key: 'go', label: '', width: 44, align: 'right', render: () => <span style={{ color: 'var(--ink-300)', display: 'inline-flex' }}>{ic('chevron-right', 16)}</span> },
    ];

    return (
      <React.Fragment>
        <ViewHeader title="Sporcular" subtitle={`${D.ATHLETES.length} kayıtlı sporcu`}
          actions={<Button variant="accent" size="sm" leftIcon={ic('plus', 16)} onClick={() => setDrawer({ athlete: null })}>Sporcu Ekle</Button>}
          tabs={<Tabs tabs={tabs} value={team} onChange={setTeam} />} />

        <Toolbar>
          <SearchBox placeholder="İsimle ara…" value={q} onChange={setQ} />
          <Select options={['Tüm mevkiler', ...D.POS]} containerStyle={{ minWidth: 160 }} />
          <Select options={['Tüm durumlar', 'Aktif', 'Sakat', 'İzinli']} containerStyle={{ minWidth: 150 }} />
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--ink-400)' }}>{rows.length} sonuç</span>
        </Toolbar>

        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setDrawer({ athlete: r })} empty="Bu filtreye uygun sporcu yok." />

        <Drawer open={!!drawer} onClose={() => setDrawer(null)}
          title={drawer && drawer.athlete ? drawer.athlete.name : 'Yeni Sporcu'}
          subtitle={drawer && drawer.athlete ? 'Sporcu bilgilerini düzenle' : 'Yeni sporcu kaydı oluştur'}
          width={520}
          footer={<React.Fragment>
            {drawer && drawer.athlete && <Button variant="ghost" size="sm" style={{ color: 'var(--red-600)', marginRight: 'auto' }} leftIcon={ic('trash-2', 15)}>Sil</Button>}
            <Button variant="secondary" size="sm" onClick={() => setDrawer(null)}>İptal</Button>
            <Button variant="primary" size="sm" onClick={() => setDrawer(null)}>{drawer && drawer.athlete ? 'Kaydet' : 'Sporcu Oluştur'}</Button>
          </React.Fragment>}>
          {drawer && <AthleteForm athlete={drawer.athlete} />}
        </Drawer>
      </React.Fragment>
    );
  }

  window.AthletesView = AthletesView;
})();
