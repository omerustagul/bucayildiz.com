// Buca Yıldız Admin — Haberler / Blog (list + step-by-step template wizard)
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { Table, Badge, Button, Select, Tabs, Switch, IconButton } = NS;
  const { ViewHeader, Panel, Stepper, Field, TextInput, TextArea, FileDrop, SearchBox, Toolbar, ic } = window.AdminUI;
  const D = window.AdminData;

  const postStatus = {
    published: { tone: 'success', label: 'Yayında' },
    draft: { tone: 'neutral', label: 'Taslak' },
    scheduled: { tone: 'gold', label: 'Planlı' },
  };
  const fmt = (d) => { const [y, m, day] = d.split('-'); return `${day}.${m}.${y}`; };

  // ---------- Wizard ----------
  // STEP 1 — template picker
  function TemplatePicker({ value, onPick }) {
    return (
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase', color: 'var(--text-strong)', margin: '0 0 6px' }}>Bir şablon seç</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: '0 0 22px' }}>Yazının türüne uygun hazır bir düzen seç — sonraki adımda yalnızca görselleri ve metinleri dolduracaksın.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {D.TEMPLATES.map((t) => {
            const on = value === t.id;
            return (
              <button key={t.id} onClick={() => onPick(t.id)} style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', padding: 18, borderRadius: 'var(--radius-lg)', border: `1.5px solid ${on ? 'var(--navy-700)' : 'var(--border-subtle)'}`, background: on ? 'var(--navy-50)' : 'var(--surface-card)', boxShadow: on ? 'var(--ring-focus)' : 'var(--shadow-xs)', transition: 'all var(--dur-fast)', position: 'relative' }}>
                {on && <span style={{ position: 'absolute', top: 14, right: 14, color: 'var(--navy-700)' }}>{ic('check-circle-2', 20)}</span>}
                <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: on ? 'var(--navy-700)' : 'var(--navy-50)', color: on ? 'var(--gold-400)' : 'var(--navy-600)', display: 'grid', placeItems: 'center', marginBottom: 14 }}>{ic(t.icon, 21)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 19, textTransform: 'uppercase', color: 'var(--text-strong)' }}>{t.name}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-500)', margin: '0 0 12px' }}>{t.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {t.blocks.map((b) => <span key={b} style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', background: 'var(--ink-100)', borderRadius: 'var(--radius-xs)', padding: '3px 7px' }}>{b}</span>)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // STEP 2 — fill content (adaptive) + live preview
  function ContentEditor({ tpl, form, set }) {
    const isMatch = tpl.id === 'macraporu';
    const isGallery = tpl.id === 'galeri';
    const isInterview = tpl.id === 'roportaj';
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'start' }}>
        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold-700)' }}>{tpl.name} · İçerik</div>

          {isMatch && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end', padding: 14, background: 'var(--navy-50)', borderRadius: 'var(--radius-md)' }}>
              <Field label="Ev sahibi"><TextInput defaultValue="Buca Yıldız" /></Field>
              <Field label="Skor"><TextInput placeholder="2-0" style={{ textAlign: 'center', width: 70 }} /></Field>
              <Field label="Deplasman"><TextInput placeholder="Rakip" /></Field>
            </div>
          )}

          <Field label={isInterview ? 'Portre görseli' : 'Kapak görseli'} required>
            <FileDrop label="Kapak görseli yükle" hint="1600×900 önerilir" aspect="16 / 9" icon="image-up" />
          </Field>

          <Field label="Başlık" required><TextInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Haber başlığı" /></Field>
          <Field label="Özet / Spot"><TextArea rows={2} value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Kısa giriş metni (manşet altı)" /></Field>

          {isInterview ? (
            <React.Fragment>
              <Field label="Soru 1"><TextInput placeholder="Soru…" /></Field>
              <Field label="Cevap 1"><TextArea rows={3} value={form.body} onChange={(e) => set('body', e.target.value)} placeholder="Cevap metni…" /></Field>
              <Button variant="ghost" size="sm" leftIcon={ic('plus', 15)} style={{ alignSelf: 'flex-start' }}>Soru–Cevap Ekle</Button>
            </React.Fragment>
          ) : (
            <Field label="Metin"><TextArea rows={6} value={form.body} onChange={(e) => set('body', e.target.value)} placeholder="Haber metni…" /></Field>
          )}

          {(isGallery || isMatch) && (
            <Field label="Foto Galeri">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <FileDrop compact label="Ekle" aspect="1 / 1" icon="plus" />
                {[0, 1, 2].map((i) => <FileDrop key={i} compact label="" aspect="1 / 1" filled icon="image" />)}
              </div>
            </Field>
          )}

          <Button variant="ghost" size="sm" leftIcon={ic('plus', 15)} style={{ alignSelf: 'flex-start' }}>Blok Ekle (metin, görsel, alıntı…)</Button>
        </div>

        {/* Live preview */}
        <div style={{ position: 'sticky', top: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}>{ic('eye', 14)} Canlı Önizleme</div>
          <div style={{ ...window.AdminUI.cardStyle, overflow: 'hidden' }}>
            <div style={{ position: 'relative', aspectRatio: '16 / 9', background: 'var(--grad-navy)', display: 'grid', placeItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,.14)' }}>{ic('image', 34)}</span>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim-bottom)' }} />
              <span style={{ position: 'absolute', left: 16, bottom: 14 }}><Badge tone="gold">{tpl.tag}</Badge></span>
            </div>
            <div style={{ padding: 22 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, lineHeight: 1.02, textTransform: 'uppercase', color: 'var(--text-strong)', margin: 0 }}>{form.title || 'Haber Başlığı Buraya Gelecek'}</h3>
              {form.summary && <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-600)', margin: '12px 0 0', fontWeight: 500 }}>{form.summary}</p>}
              <div style={{ width: 48, height: 3, background: 'var(--grad-gold)', borderRadius: 999, margin: '16px 0' }} />
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-600)', margin: 0, whiteSpace: 'pre-wrap' }}>{form.body || 'Metin alanına yazdıkça burada anında görünür. Bu sayede teknik bilgiye ihtiyaç duymadan, şablonun düzenini koruyarak profesyonel bir haber sayfası oluşturabilirsin.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3 — publish settings
  function PublishStep({ tpl, form, set }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, textTransform: 'uppercase', color: 'var(--text-strong)', margin: 0 }}>Yayın ayarları</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Kategori" required><Select options={D.CATEGORIES.map((c) => ({ value: c.id, label: c.name }))} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Seç" /></Field>
            <Field label="Yazar"><TextInput defaultValue="Basın" /></Field>
            <Field label="Yayın Tarihi"><TextInput type="date" defaultValue="2026-06-14" /></Field>
            <Field label="Görünürlük"><Select options={['Herkese açık', 'Sadece üyeler']} /></Field>
          </div>
          <Field label="URL Kısaltması" hint="bucayildiz.com/haber/…"><TextInput defaultValue={(form.title || 'yeni-haber').toLowerCase().replace(/[^a-z0-9ğüşiöç ]/g, '').replace(/\s+/g, '-').slice(0, 40)} /></Field>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: 'var(--surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>Ana sayfada öne çıkar</span><Switch /></div>
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>Sosyal medyada paylaş</span><Switch defaultChecked /></div>
          </div>
        </div>
        {/* summary card */}
        <div style={{ ...window.AdminUI.cardStyle, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>Özet</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--navy-50)', color: 'var(--navy-600)', display: 'grid', placeItems: 'center' }}>{ic(tpl.icon, 18)}</span>
            <div><div style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{tpl.name}</div><div style={{ fontSize: 12, color: 'var(--ink-400)' }}>Şablon</div></div>
          </div>
          <div style={{ height: 1, background: 'var(--border-subtle)' }} />
          <div style={{ fontSize: 14, color: 'var(--text-strong)', fontWeight: 600, lineHeight: 1.3 }}>{form.title || 'Başlıksız haber'}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.5 }}>{form.summary || 'Özet girilmedi.'}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone="outline">{form.category ? (D.CATEGORIES.find((c) => c.id === form.category) || {}).name : 'Kategori yok'}</Badge>
          </div>
        </div>
      </div>
    );
  }

  function Wizard({ initialTpl, onExit }) {
    const [step, setStep] = React.useState(initialTpl ? 1 : 0);
    const [tplId, setTplId] = React.useState(initialTpl || null);
    const [form, setForm] = React.useState({ title: '', summary: '', body: '', category: '', status: 'draft' });
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const tpl = D.TEMPLATES.find((t) => t.id === tplId);
    const canNext = step === 0 ? !!tplId : true;

    return (
      <React.Fragment>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IconButton label="Çık" variant="outline" onClick={onExit}>{ic('arrow-left', 18)}</IconButton>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 26, textTransform: 'uppercase', color: 'var(--text-strong)', margin: 0 }}>Yeni Haber</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onExit}>Taslak olarak kaydet</Button>
        </div>

        <Panel>
          <div style={{ maxWidth: 560, margin: '0 auto 4px' }}><Stepper steps={['Şablon', 'İçerik', 'Yayınla']} current={step} /></div>
        </Panel>

        <Panel pad={26}>
          {step === 0 && <TemplatePicker value={tplId} onPick={setTplId} />}
          {step === 1 && tpl && <ContentEditor tpl={tpl} form={form} set={set} />}
          {step === 2 && tpl && <PublishStep tpl={tpl} form={form} set={set} />}
        </Panel>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', bottom: 0, background: 'var(--surface-subtle)', padding: '14px 0', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="secondary" size="md" leftIcon={ic('arrow-left', 16)} onClick={() => step === 0 ? onExit() : setStep(step - 1)} disabled={false}>{step === 0 ? 'Vazgeç' : 'Geri'}</Button>
          <div style={{ fontSize: 13, color: 'var(--ink-400)' }}>Adım {step + 1} / 3</div>
          {step < 2
            ? <Button variant="primary" size="md" rightIcon={ic('arrow-right', 16)} disabled={!canNext} onClick={() => canNext && setStep(step + 1)}>Devam Et</Button>
            : <Button variant="accent" size="md" leftIcon={ic('send', 16)} onClick={onExit}>Yayınla</Button>}
        </div>
      </React.Fragment>
    );
  }

  // ---------- List ----------
  function BlogView() {
    const [mode, setMode] = React.useState('list');
    const [tab, setTab] = React.useState('all');
    const rows = D.POSTS.filter((p) => tab === 'all' || p.status === tab);
    const tabs = [
      { id: 'all', label: 'Tümü', count: D.POSTS.length },
      { id: 'published', label: 'Yayında', count: D.POSTS.filter((p) => p.status === 'published').length },
      { id: 'draft', label: 'Taslak', count: D.POSTS.filter((p) => p.status === 'draft').length },
      { id: 'scheduled', label: 'Planlı', count: D.POSTS.filter((p) => p.status === 'scheduled').length },
    ];
    const cols = [
      { key: 'title', label: 'Başlık', render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 46, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--grad-navy)', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.2)', flex: 'none' }}>{ic('image', 15)}</div>
          <div style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{r.title}</div>
        </div>
      ) },
      { key: 'template', label: 'Şablon', render: (r) => <Badge tone="outline">{r.template}</Badge> },
      { key: 'author', label: 'Yazar', render: (r) => <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>{r.author}</span> },
      { key: 'date', label: 'Tarih', render: (r) => <span style={{ fontFamily: 'var(--font-stat)', fontSize: 13 }}>{fmt(r.date)}</span> },
      { key: 'status', label: 'Durum', align: 'center', render: (r) => <Badge tone={postStatus[r.status].tone} dot={r.status === 'scheduled'}>{postStatus[r.status].label}</Badge> },
      { key: 'go', label: '', width: 44, align: 'right', render: () => <span style={{ color: 'var(--ink-300)', display: 'inline-flex' }}>{ic('pencil', 15)}</span> },
    ];

    if (mode === 'wizard') return <Wizard onExit={() => setMode('list')} />;

    return (
      <React.Fragment>
        <ViewHeader title="Haberler / Blog" subtitle="Şablonlarla adım adım profesyonel haber sayfaları oluştur"
          actions={<Button variant="accent" size="sm" leftIcon={ic('plus', 16)} onClick={() => setMode('wizard')}>Yeni Yazı</Button>}
          tabs={<Tabs tabs={tabs} value={tab} onChange={setTab} />} />
        <Toolbar>
          <SearchBox placeholder="Başlık ara…" />
          <Select options={['Tüm şablonlar', ...D.TEMPLATES.map((t) => t.name)]} containerStyle={{ minWidth: 170 }} />
          <Select options={['Tüm kategoriler', ...D.CATEGORIES.map((c) => c.name)]} containerStyle={{ minWidth: 160 }} />
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--ink-400)' }}>{rows.length} yazı</span>
        </Toolbar>
        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={() => setMode('wizard')} />
      </React.Fragment>
    );
  }

  window.BlogView = BlogView;
})();
