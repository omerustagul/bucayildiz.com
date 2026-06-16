// Buca Yıldız Admin — Antrenman atama
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { Badge, Button, Select, Avatar, Switch, IconButton } = NS;
  const { ViewHeader, Panel, Field, TextInput, TextArea, ic } = window.AdminUI;
  const D = window.AdminData;

  const TYPES = [
    { id: 'saha', label: 'Saha Antrenmanı', color: 'var(--navy-600)' },
    { id: 'kondisyon', label: 'Kondisyon', color: 'var(--gold-600)' },
    { id: 'taktik', label: 'Taktik', color: 'var(--green-600)' },
    { id: 'bireysel', label: 'Bireysel', color: 'var(--navy-400)' },
    { id: 'mac', label: 'Maç', color: 'var(--red-600)' },
  ];
  const DOW = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // sample weekly plan per day -> list of sessions
  const PLAN = {
    Pzt: [{ t: '17:00', type: 'saha', dur: 90 }, { t: '18:30', type: 'kondisyon', dur: 45 }],
    Sal: [{ t: '17:30', type: 'taktik', dur: 75 }],
    Çar: [{ t: '17:00', type: 'saha', dur: 90 }],
    Per: [{ t: '17:30', type: 'kondisyon', dur: 60 }],
    Cum: [{ t: '17:00', type: 'saha', dur: 90 }, { t: '18:30', type: 'taktik', dur: 45 }],
    Cmt: [{ t: '11:00', type: 'mac', dur: 90 }],
    Paz: [],
  };

  function TypePill({ type }) {
    const t = TYPES.find((x) => x.id === type);
    return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--ink-700)' }}><span style={{ width: 9, height: 9, borderRadius: 3, background: t.color }} />{t.label}</span>;
  }

  function TrainingView() {
    const [team, setTeam] = React.useState('u17');
    const [type, setType] = React.useState('saha');
    return (
      <React.Fragment>
        <ViewHeader title="Antrenmanlar" subtitle="Takım ve sporculara antrenman planı ata" />
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 18, alignItems: 'start' }}>
          {/* Assign form */}
          <Panel title="Antrenman Ata">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Takım" required><Select options={D.TEAMS.map((t) => ({ value: t.id, label: t.name }))} defaultValue="u17" onChange={() => {}} /></Field>
              <Field label="Antrenman Türü" required>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TYPES.map((t) => (
                    <button key={t.id} onClick={() => setType(t.id)} style={{ font: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${type === t.id ? t.color : 'var(--ink-200)'}`, background: type === t.id ? 'var(--navy-50)' : '#fff', fontWeight: 600, fontSize: 13, color: 'var(--ink-700)' }}>
                      <span style={{ width: 9, height: 9, borderRadius: 3, background: t.color }} />{t.label}
                    </button>
                  ))}
                </div>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Tarih"><TextInput type="date" defaultValue="2026-06-15" /></Field>
                <Field label="Saat"><TextInput type="time" defaultValue="17:00" /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Süre" hint="dakika"><TextInput type="number" defaultValue="90" /></Field>
                <Field label="Saha"><Select options={['Saha 1', 'Saha 2', 'Kapalı Salon', 'Kondisyon']} /></Field>
              </div>
              <Field label="Not / İçerik"><TextArea rows={3} placeholder="örn. Pas kalıpları + duran top çalışması" /></Field>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-600)' }}>Sporculara bildirim gönder</span>
                <Switch defaultChecked />
              </div>
              <Button variant="accent" fullWidth leftIcon={ic('calendar-plus', 16)}>Antrenmanı Ata</Button>
            </div>
          </Panel>

          {/* Weekly plan preview */}
          <Panel title="Haftalık Plan — U-17" action={<Badge tone="gold">15–21 Haziran</Badge>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
              {DOW.map((d) => (
                <div key={d} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', minHeight: 150, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '8px 10px', background: 'var(--ink-50)', borderBottom: '1px solid var(--border-subtle)', fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-500)', textAlign: 'center' }}>{d}</div>
                  <div style={{ padding: 7, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    {PLAN[d].length === 0 && <div style={{ margin: 'auto', fontSize: 11, color: 'var(--ink-300)' }}>İzin</div>}
                    {PLAN[d].map((s, i) => {
                      const t = TYPES.find((x) => x.id === s.type);
                      return (
                        <div key={i} style={{ padding: '7px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', borderLeft: `3px solid ${t.color}`, boxShadow: 'var(--shadow-xs)' }}>
                          <div style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 12, color: 'var(--ink-700)' }}>{s.t}</div>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-800)', lineHeight: 1.15 }}>{t.label}</div>
                          <div style={{ fontSize: 10.5, color: 'var(--ink-400)' }}>{s.dur} dk</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 14 }}>
              {TYPES.map((t) => <TypePill key={t.id} type={t.id} />)}
            </div>
          </Panel>
        </div>
      </React.Fragment>
    );
  }

  window.TrainingView = TrainingView;
})();
