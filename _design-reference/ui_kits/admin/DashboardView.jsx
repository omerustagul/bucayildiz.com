// Buca Yıldız Admin — Genel Bakış / Raporlama
(function () {
  const NS = window.BucaYLdZTasarMSistemi_45a34f;
  const { StatTile, Badge, Avatar, Table, Button } = NS;
  const { ViewHeader, Panel, cardStyle, ic } = window.AdminUI;
  const D = window.AdminData;

  const dashStatus = {
    active: { tone: 'success', label: 'Aktif' },
    injured: { tone: 'live', label: 'Sakat' },
    rest: { tone: 'neutral', label: 'İzinli' },
  };

  // squad distribution bar chart
  function SquadChart() {
    const max = Math.max(...D.TEAMS.map((t) => t.count));
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 180, padding: '8px 4px 0' }}>
        {D.TEAMS.map((t) => (
          <div key={t.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 15, color: 'var(--text-strong)' }}>{t.count}</span>
            <div style={{ width: '100%', maxWidth: 54, height: `${(t.count / max) * 130}px`, background: t.id === 'u17' ? 'var(--grad-gold)' : 'var(--grad-navy)', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', color: 'var(--ink-600)' }}>{t.name}</span>
          </div>
        ))}
      </div>
    );
  }

  function DashboardView({ onNav }) {
    const recent = D.ATHLETES.slice(0, 6);
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
      { key: 'vo2', label: 'VO2', align: 'right', render: (r) => <span style={{ fontFamily: 'var(--font-stat)', fontWeight: 700 }}>{r.vo2}</span> },
      { key: 'attend', label: 'Katılım', align: 'right', render: (r) => `%${r.attend}` },
      { key: 'status', label: 'Durum', align: 'right', render: (r) => <Badge tone={dashStatus[r.status].tone} dot={r.status === 'injured'}>{dashStatus[r.status].label}</Badge> },
    ];

    return (
      <React.Fragment>
        <ViewHeader title="Genel Bakış" subtitle="Kulüp geneli özet rapor — 14 Haziran 2026"
          actions={<Button variant="secondary" size="sm" leftIcon={ic('download', 15)}>Rapor İndir</Button>} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <StatTile label="Toplam Sporcu" value="126" delta="6" deltaTone="up" sub="bu ay" icon={ic('users', 18)} accent />
          <StatTile label="Aktif Takım" value="5" deltaTone="neutral" sub="A → U-15" icon={ic('shield', 18)} />
          <StatTile label="Bu Hafta Antrenman" value="34" unit="seans" delta="4%" deltaTone="up" icon={ic('dumbbell', 18)} />
          <StatTile label="Sakatlık" value="4" delta="1" deltaTone="down" sub="takipte" icon={ic('heart-pulse', 18)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
          <Panel title="Takım Mevcutları" action={<Button variant="ghost" size="sm" onClick={() => onNav('teams')} rightIcon={ic('arrow-right', 15)}>Takımlar</Button>}>
            <SquadChart />
          </Panel>
          <Panel title="Yaklaşan Maçlar" action={<Button variant="ghost" size="sm" onClick={() => onNav('fixtures')} rightIcon={ic('arrow-right', 15)}>Fikstür</Button>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {D.FIXTURES.filter((f) => f.status === 'upcoming').slice(0, 3).map((f) => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: 44, textAlign: 'center', flex: 'none' }}>
                    <div style={{ fontFamily: 'var(--font-stat)', fontWeight: 700, fontSize: 18, color: 'var(--navy-700)', lineHeight: 1 }}>{f.date.slice(8)}</div>
                    <div style={{ fontSize: 10.5, textTransform: 'uppercase', color: 'var(--ink-400)', letterSpacing: '.06em' }}>Haz</div>
                  </div>
                  <span style={{ width: 1, height: 30, background: 'var(--ink-200)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.home} <span style={{ color: 'var(--ink-400)' }}>vs</span> {f.away}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>{f.comp} · {f.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Öne Çıkan Sporcular" action={<Button variant="ghost" size="sm" onClick={() => onNav('athletes')} rightIcon={ic('arrow-right', 15)}>Tüm Sporcular</Button>} pad={0}>
          <Table columns={cols} rows={recent} onRowClick={() => onNav('athletes')} getRowKey={(r) => r.id} style={{ border: 'none', borderRadius: 0 }} />
        </Panel>
      </React.Fragment>
    );
  }

  window.DashboardView = DashboardView;
})();
