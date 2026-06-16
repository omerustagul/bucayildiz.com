// Buca Yıldız Admin — Medya Kütüphanesi (folders + categories + homepage cards)
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { Badge, Button, Select, Tabs, IconButton, Switch } = NS;
  const { ViewHeader, Panel, Modal, Drawer, Field, TextInput, FileDrop, SearchBox, Toolbar, ic } = window.AdminUI;
  const D = window.AdminData;

  const catColor = (id) => (D.CATEGORIES.find((c) => c.id === id) || {}).color || 'var(--ink-400)';
  const catName = (id) => (D.CATEGORIES.find((c) => c.id === id) || {}).name || '—';

  // ---- Asset tile ----
  function Asset({ i, video }) {
    return (
      <div style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--grad-navy)', border: '1px solid var(--navy-700)', cursor: 'pointer' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.12)' }}>{ic(video ? 'play' : 'image', 26)}</div>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-bottom)' }} />
        {video && <span style={{ position: 'absolute', right: 7, top: 7, fontSize: 10, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,.4)', padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>0:{20 + i}</span>}
        <span style={{ position: 'absolute', left: 7, bottom: 7, fontSize: 11, color: '#fff', fontWeight: 500 }}>IMG_{2400 + i}</span>
      </div>
    );
  }

  // ---- Folder tree ----
  function FolderTree({ active, onPick }) {
    const children = (pid) => D.FOLDERS.filter((f) => f.parent === pid);
    const Node = ({ f, depth }) => {
      const kids = children(f.id);
      const [open, setOpen] = React.useState(depth < 2);
      const on = active === f.id;
      return (
        <div>
          <div onClick={() => onPick(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', paddingLeft: 10 + depth * 16, borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: on ? 'var(--navy-50)' : 'transparent', color: on ? 'var(--navy-800)' : 'var(--ink-700)', fontWeight: on ? 600 : 500, fontSize: 13.5 }}>
            {kids.length > 0
              ? <span onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{ display: 'inline-flex', color: 'var(--ink-400)' }}>{ic(open ? 'chevron-down' : 'chevron-right', 14)}</span>
              : <span style={{ width: 14 }} />}
            <span style={{ display: 'inline-flex', color: on ? 'var(--gold-600)' : 'var(--navy-400)' }}>{ic(on ? 'folder-open' : 'folder', 15)}</span>
            <span style={{ flex: 1 }}>{f.name}</span>
            <span style={{ fontSize: 11.5, color: 'var(--ink-400)', fontFamily: 'var(--font-stat)' }}>{f.count}</span>
          </div>
          {open && kids.map((k) => <Node key={k.id} f={k} depth={depth + 1} />)}
        </div>
      );
    };
    const roots = children(null);
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{roots.map((r) => <Node key={r.id} f={r} depth={0} />)}</div>;
  }

  // ---- Library tab ----
  function LibraryTab() {
    const [folder, setFolder] = React.useState('2026');
    const [newFolder, setNewFolder] = React.useState(false);
    const f = D.FOLDERS.find((x) => x.id === folder) || D.FOLDERS[0];
    const assets = Array.from({ length: 12 }, (_, i) => ({ i, video: i % 7 === 3 }));
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '252px 1fr', gap: 18, alignItems: 'start' }}>
        <Panel title="Klasörler" action={<IconButton label="Yeni klasör" variant="ghost" size="sm" onClick={() => setNewFolder(true)}>{ic('folder-plus', 16)}</IconButton>} pad={10}>
          <FolderTree active={folder} onPick={setFolder} />
        </Panel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Toolbar>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: 'var(--text-strong)' }}>
              {ic('folder-open', 18)}{f.name}
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 13, textTransform: 'none', color: 'var(--ink-400)' }}>· {f.count} dosya</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <Select options={['Tüm kategoriler', ...D.CATEGORIES.map((c) => c.name)]} containerStyle={{ minWidth: 160 }} />
              <Button variant="accent" size="sm" leftIcon={ic('upload', 15)}>Yükle</Button>
            </div>
          </Toolbar>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 12 }}>
            <FileDrop label="Sürükle / yükle" hint="JPG, PNG, MP4" aspect="1 / 1" icon="upload" />
            {assets.map((a) => <Asset key={a.i} {...a} />)}
          </div>
        </div>
        <Modal open={newFolder} onClose={() => setNewFolder(false)} title="Yeni Klasör" width={420}
          footer={<React.Fragment><Button variant="secondary" size="sm" onClick={() => setNewFolder(false)}>İptal</Button><Button variant="primary" size="sm" onClick={() => setNewFolder(false)}>Oluştur</Button></React.Fragment>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Klasör Adı" required><TextInput placeholder="örn. U-16 Kamp" /></Field>
            <Field label="Üst Klasör"><Select options={D.FOLDERS.map((f) => ({ value: f.id, label: f.name }))} defaultValue="2026" /></Field>
          </div>
        </Modal>
      </div>
    );
  }

  // ---- Categories tab ----
  function CategoriesTab() {
    const [newCat, setNewCat] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Toolbar>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-500)', maxWidth: 560 }}>Kategoriler, ana sayfadaki “Görseller & Videolar” kartlarını besler. Bir medyayı bir kategoriye atadığında, o kategorinin kartına tıklayınca otomatik görünür.</p>
          <Button variant="accent" size="sm" leftIcon={ic('plus', 15)} style={{ marginLeft: 'auto' }} onClick={() => setNewCat(true)}>Kategori Oluştur</Button>
        </Toolbar>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {D.CATEGORIES.map((c) => (
            <div key={c.id} style={{ ...window.AdminUI.cardStyle, padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
              <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: c.color, display: 'grid', placeItems: 'center', color: '#fff', flex: 'none' }}>{ic('tag', 18)}</span>
              <div style={{ flex: 1, lineHeight: 1.3 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 17, color: 'var(--text-strong)' }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>{c.count} medya</div>
              </div>
              <IconButton label="Düzenle" variant="ghost" size="sm">{ic('pencil', 15)}</IconButton>
            </div>
          ))}
        </div>
        <Modal open={newCat} onClose={() => setNewCat(false)} title="Yeni Kategori" width={420}
          footer={<React.Fragment><Button variant="secondary" size="sm" onClick={() => setNewCat(false)}>İptal</Button><Button variant="primary" size="sm" onClick={() => setNewCat(false)}>Oluştur</Button></React.Fragment>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Kategori Adı" required><TextInput placeholder="örn. Alt Yapı Seçmeleri" /></Field>
            <Field label="Renk"><div style={{ display: 'flex', gap: 8 }}>{['var(--navy-700)', 'var(--gold-600)', 'var(--green-600)', 'var(--red-600)', 'var(--navy-400)'].map((col) => <span key={col} style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: col, cursor: 'pointer', border: '2px solid #fff', boxShadow: '0 0 0 1px var(--ink-200)' }} />)}</div></Field>
          </div>
        </Modal>
      </div>
    );
  }

  // ---- Homepage cards tab ----
  function CardsTab() {
    const [edit, setEdit] = React.useState(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-500)', maxWidth: 620 }}>Ana sayfadaki “Görseller & Videolar” bölümünü yönet. Kartın adını değiştir, bir kategori ata; ziyaretçi karta tıkladığında yalnızca o kategorideki medya klasörlenmiş olarak görünür.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {D.MEDIA_CARDS.map((c) => (
            <div key={c.id} style={{ ...window.AdminUI.cardStyle, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: 120, flex: 'none', background: 'var(--grad-navy)', display: 'grid', placeItems: 'center', position: 'relative' }}>
                <span style={{ color: 'rgba(255,255,255,.16)' }}>{ic(c.kind === 'video' ? 'play' : 'image', 26)}</span>
                {c.featured && <span style={{ position: 'absolute', top: 8, left: 8 }}><Badge tone="gold">Öne çıkan</Badge></span>}
              </div>
              <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 17, color: 'var(--text-strong)', lineHeight: 1.1 }}>{c.title}</div>
                  <IconButton label="Düzenle" variant="ghost" size="sm" onClick={() => setEdit(c)}>{ic('pencil', 15)}</IconButton>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--ink-600)' }}><span style={{ width: 9, height: 9, borderRadius: 3, background: catColor(c.category) }} />{catName(c.category)}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>· {c.count} medya</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Drawer open={!!edit} onClose={() => setEdit(null)} title="Kartı Düzenle" subtitle="Ana sayfa medya kartı" width={460}
          footer={<React.Fragment><Button variant="secondary" size="sm" onClick={() => setEdit(null)}>İptal</Button><Button variant="primary" size="sm" onClick={() => setEdit(null)}>Kaydet</Button></React.Fragment>}>
          {edit && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Field label="Kart Adı" required><TextInput defaultValue={edit.title} /></Field>
              <Field label="Kategori" hint="Bu kategorideki medya karta otomatik dolar"><Select options={D.CATEGORIES.map((c) => ({ value: c.id, label: c.name }))} defaultValue={edit.category} /></Field>
              <Field label="Kapak Görseli"><FileDrop label="Kapak seç" aspect="16 / 10" filled /></Field>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13.5, color: 'var(--ink-600)' }}>Öne çıkan kart (büyük gösterim)</span>
                <Switch defaultChecked={!!edit.featured} />
              </div>
            </div>
          )}
        </Drawer>
      </div>
    );
  }

  function MediaView() {
    const [tab, setTab] = React.useState('library');
    return (
      <React.Fragment>
        <ViewHeader title="Medya Kütüphanesi" subtitle="Görselleri ve videoları klasörle, kategorile ve ana sayfayı yönet"
          tabs={<Tabs value={tab} onChange={setTab} tabs={[
            { id: 'library', label: 'Kütüphane', icon: ic('images', 15) },
            { id: 'categories', label: 'Kategoriler', icon: ic('tags', 15) },
            { id: 'cards', label: 'Ana Sayfa Kartları', icon: ic('layout-grid', 15) },
          ]} />} />
        {tab === 'library' && <LibraryTab />}
        {tab === 'categories' && <CategoriesTab />}
        {tab === 'cards' && <CardsTab />}
      </React.Fragment>
    );
  }

  window.MediaView = MediaView;
})();
