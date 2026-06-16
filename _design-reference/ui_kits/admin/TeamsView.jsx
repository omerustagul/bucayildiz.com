// Buca Yıldız Admin — Takımlar (manage teams + roster)
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { Badge, Avatar, Button, Select, IconButton } = NS;
  const { ViewHeader, Panel, Drawer, Modal, Field, TextInput, ic } = window.AdminUI;
  const D = window.AdminData;

  function TeamCard({ team, onOpen }) {
    return (
      <button onClick={() => onOpen(team)} style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', padding: 0 }}>
        <div style={{ background: 'var(--grad-navy)', padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <span style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: team.id === 'u17' ? 'var(--grad-gold)' : 'transparent' }} />
          <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.16)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, color: 'var(--gold-400)' }}>{team.short}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: '#fff', lineHeight: 1 }}>{team.name}</div>
            <div style={{ fontSize: 12, color: 'var(--navy-200)', marginTop: 4 }}>{team.born === 'Üst yapı' ? 'Üst yapı' : team.born + ' doğumlular'}</div>
          </div>
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-600)' }}>
            <span style={{ display: 'inline-flex', color: 'var(--navy-400)' }}>{ic('clipboard-list', 15)}</span>{team.coach}
          </div>
          <Badge tone="neutral">{team.count} sporcu</Badge>
        </div>
      </button>
    );
  }

  function TeamDrawer({ team, onClose }) {
    const roster = D.ATHLETES.filter((a) => a.team === team.id).slice(0, 9);
    const [addOpen, setAddOpen] = React.useState(false);
    const others = D.ATHLETES.filter((a) => a.team !== team.id).slice(0, 8);
    return (
      <Drawer open={!!team} onClose={onClose} title={team.name} subtitle="Takım yapılandırması ve kadro" width={560}
        footer={<React.Fragment>
          <Button variant="ghost" size="sm" style={{ color: 'var(--red-600)', marginRight: 'auto' }} leftIcon={ic('trash-2', 15)}>Takımı Sil</Button>
          <Button variant="secondary" size="sm" onClick={onClose}>Kapat</Button>
          <Button variant="primary" size="sm" onClick={onClose}>Kaydet</Button>
        </React.Fragment>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Takım Adı" required><TextInput defaultValue={team.name} /></Field>
            <Field label="Kısa Kod"><TextInput defaultValue={team.short} /></Field>
            <Field label="Antrenör"><TextInput defaultValue={team.coach} /></Field>
            <Field label="Yaş Kategorisi"><Select options={['Üst yapı', '2008', '2009', '2010', '2011', '2012']} defaultValue={team.born} /></Field>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold-700)' }}>Kadro · {roster.length} sporcu</div>
            <Button variant="secondary" size="sm" leftIcon={ic('user-plus', 15)} onClick={() => setAddOpen(true)}>Sporcu Ata</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roster.map((a) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <Avatar name={a.name} size="sm" />
                <div style={{ flex: 1, lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-strong)' }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>#{a.no} · {a.pos}</div>
                </div>
                <IconButton label="Kadrodan çıkar" variant="ghost" size="sm">{ic('x', 15)}</IconButton>
              </div>
            ))}
          </div>
        </div>

        <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Sporcu Ata" width={460}
          footer={<React.Fragment>
            <Button variant="secondary" size="sm" onClick={() => setAddOpen(false)}>İptal</Button>
            <Button variant="primary" size="sm" onClick={() => setAddOpen(false)}>Seçilenleri Ata</Button>
          </React.Fragment>}>
          <p style={{ fontSize: 13.5, color: 'var(--ink-500)', margin: '0 0 14px' }}>Başka takımlardan veya boştaki sporculardan {team.name} kadrosuna ekleyin.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
            {others.map((a) => (
              <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--navy-700)' }} />
                <Avatar name={a.name} size="sm" />
                <div style={{ flex: 1, lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-strong)' }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>{a.teamName} · {a.pos}</div>
                </div>
              </label>
            ))}
          </div>
        </Modal>
      </Drawer>
    );
  }

  function NewTeamModal({ open, onClose }) {
    return (
      <Modal open={open} onClose={onClose} title="Yeni Takım Oluştur" width={480}
        footer={<React.Fragment>
          <Button variant="secondary" size="sm" onClick={onClose}>İptal</Button>
          <Button variant="accent" size="sm" onClick={onClose}>Takımı Oluştur</Button>
        </React.Fragment>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Takım Adı" required><TextInput placeholder="örn. U-14" /></Field>
            <Field label="Kısa Kod"><TextInput placeholder="U14" /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Antrenör"><TextInput placeholder="Antrenör adı" /></Field>
            <Field label="Yaş Kategorisi"><Select placeholder="Seç" options={['Üst yapı', '2008', '2009', '2010', '2011', '2012', '2013']} /></Field>
          </div>
        </div>
      </Modal>
    );
  }

  function TeamsView() {
    const [open, setOpen] = React.useState(null);
    const [newOpen, setNewOpen] = React.useState(false);
    return (
      <React.Fragment>
        <ViewHeader title="Takımlar" subtitle={`${D.TEAMS.length} aktif takım`}
          actions={<Button variant="accent" size="sm" leftIcon={ic('plus', 16)} onClick={() => setNewOpen(true)}>Takım Oluştur</Button>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {D.TEAMS.map((t) => <TeamCard key={t.id} team={t} onOpen={setOpen} />)}
          <button onClick={() => setNewOpen(true)} style={{ cursor: 'pointer', font: 'inherit', minHeight: 150, border: '1.5px dashed var(--ink-300)', borderRadius: 'var(--radius-lg)', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--ink-500)' }}>
            <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--navy-50)', color: 'var(--navy-600)', display: 'grid', placeItems: 'center' }}>{ic('plus', 22)}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>Yeni Takım</span>
          </button>
        </div>
        {open && <TeamDrawer team={open} onClose={() => setOpen(null)} />}
        <NewTeamModal open={newOpen} onClose={() => setNewOpen(false)} />
      </React.Fragment>
    );
  }

  window.TeamsView = TeamsView;
})();
