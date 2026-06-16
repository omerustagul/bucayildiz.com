// Buca Yıldız Admin — Formalar yönetimi
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { Badge, Button, Switch, IconButton } = NS;
  const { ViewHeader, Modal, Field, TextInput, FileDrop, ic } = window.AdminUI;
  const D = window.AdminData;

  const JERSEY_CLIP = 'polygon(30% 0,42% 8%,58% 8%,70% 0,100% 14%,87% 39%,78% 30%,78% 100%,22% 100%,22% 30%,13% 39%,0 14%)';

  function JerseyShape({ primary, accent }) {
    return (
      <div style={{ position: 'relative', width: 120, height: 140, filter: 'drop-shadow(0 12px 18px rgba(14,33,72,.22))' }}>
        <div style={{ position: 'absolute', inset: 0, clipPath: JERSEY_CLIP, background: primary, border: primary === '#FFFFFF' ? '1px solid var(--ink-200)' : 'none' }} />
        <div style={{ position: 'absolute', top: '7%', left: '42%', width: '16%', height: '6%', background: accent, borderRadius: '0 0 40% 40%' }} />
        <span style={{ position: 'absolute', top: '34%', left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 42, color: accent, lineHeight: 1 }}>10</span>
      </div>
    );
  }

  function JerseyCard({ j, onEdit }) {
    return (
      <div style={{ ...window.AdminUI.cardStyle, overflow: 'hidden' }}>
        <div style={{ position: 'relative', padding: '26px 18px 18px', display: 'grid', placeItems: 'center', background: 'var(--ink-50)', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ position: 'absolute', top: 12, left: 12 }}>{j.active ? <Badge tone="success">Yayında</Badge> : <Badge tone="neutral">Pasif</Badge>}</span>
          <span style={{ position: 'absolute', top: 12, right: 12 }}><IconButton label="Düzenle" variant="outline" size="sm" onClick={() => onEdit(j)}>{ic('pencil', 15)}</IconButton></span>
          <JerseyShape primary={j.primary} accent={j.accent} />
        </div>
        <div style={{ padding: '14px 18px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 19, textTransform: 'uppercase', color: 'var(--text-strong)' }}>{j.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-500)', marginTop: 3 }}>{j.desc}</div>
        </div>
      </div>
    );
  }

  function JerseyDrawerModal({ j, isNew, onClose }) {
    return (
      <Modal open={!!j || isNew} onClose={onClose} title={isNew ? 'Yeni Forma' : (j ? j.name : '')} width={460}
        footer={<React.Fragment>
          {!isNew && <Button variant="ghost" size="sm" style={{ color: 'var(--red-600)', marginRight: 'auto' }} leftIcon={ic('trash-2', 15)}>Sil</Button>}
          <Button variant="secondary" size="sm" onClick={onClose}>İptal</Button>
          <Button variant="primary" size="sm" onClick={onClose}>Kaydet</Button>
        </React.Fragment>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Forma Görseli" hint="Şeffaf PNG önerilir (ana sayfada kayan vitrin)"><FileDrop label="Forma görseli yükle" aspect="4 / 3" icon="shirt" /></Field>
          <Field label="Forma Adı" required><TextInput defaultValue={j && !isNew ? j.name : ''} placeholder="örn. Özel Seri" /></Field>
          {isNew && <Field label="Forma Tipi"><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{['İç Saha', 'Deplasman', 'Üçüncü', 'Kaleci', 'Alternatif'].map((t) => <span key={t} style={{ padding: '7px 12px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--ink-200)', fontSize: 13, fontWeight: 600, color: 'var(--ink-600)', cursor: 'pointer' }}>{t}</span>)}</div></Field>}
          <Field label="Açıklama"><TextInput defaultValue={j && !isNew ? j.desc : ''} placeholder="Kısa açıklama" /></Field>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink-600)' }}>Ana sayfada yayınla</span>
            <Switch defaultChecked={!j || j.active} />
          </div>
        </div>
      </Modal>
    );
  }

  function JerseysView() {
    const [edit, setEdit] = React.useState(null);
    const [isNew, setIsNew] = React.useState(false);
    return (
      <React.Fragment>
        <ViewHeader title="Formalar" subtitle="İç saha, deplasman, üçüncü, kaleci ve alternatif formaları yönet"
          actions={<Button variant="accent" size="sm" leftIcon={ic('plus', 16)} onClick={() => { setIsNew(true); setEdit(null); }}>Forma Ekle</Button>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {D.JERSEYS.map((j) => <JerseyCard key={j.id} j={j} onEdit={(jj) => { setEdit(jj); setIsNew(false); }} />)}
          <button onClick={() => { setIsNew(true); setEdit(null); }} style={{ cursor: 'pointer', font: 'inherit', minHeight: 240, border: '1.5px dashed var(--ink-300)', borderRadius: 'var(--radius-lg)', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--ink-500)' }}>
            <span style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--navy-50)', color: 'var(--navy-600)', display: 'grid', placeItems: 'center' }}>{ic('plus', 22)}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>Alternatif Forma</span>
          </button>
        </div>
        <JerseyDrawerModal j={edit} isNew={isNew} onClose={() => { setEdit(null); setIsNew(false); }} />
      </React.Fragment>
    );
  }

  window.JerseysView = JerseysView;
})();
