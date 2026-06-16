// Buca Yıldız Admin — shared sample data → window.AdminData
(function () {
  const TEAMS = [
    { id: 'a', name: 'A Takım', short: 'A', coach: 'Serkan Aydın', count: 26, born: 'Üst yapı', color: 'var(--navy-700)' },
    { id: 'u18', name: 'U-18', short: 'U18', coach: 'Tolga Demir', count: 23, born: '2008', color: 'var(--navy-600)' },
    { id: 'u17', name: 'U-17', short: 'U17', coach: 'Emre Kaya', count: 24, born: '2009', color: 'var(--gold-600)' },
    { id: 'u16', name: 'U-16', short: 'U16', coach: 'Barış Şahin', count: 25, born: '2010', color: 'var(--navy-500)' },
    { id: 'u15', name: 'U-15', short: 'U15', coach: 'Onur Çelik', count: 28, born: '2011', color: 'var(--green-600)' },
  ];

  const POS = ['Kaleci', 'Stoper', 'Bek', 'Ön Libero', 'Orta Saha', 'Ofansif O.S.', 'Kanat', 'Forvet'];
  const FIRST = ['Arda', 'Mehmet', 'Kaan', 'Yusuf', 'Emir', 'Berke', 'Doruk', 'Çınar', 'Ali', 'Efe', 'Kerem', 'Mert', 'Deniz', 'Tunahan', 'Bora', 'Ege', 'Poyraz', 'Aras', 'Toprak', 'Demir'];
  const LAST = ['Yılmaz', 'Demir', 'Şahin', 'Kaya', 'Çelik', 'Aydın', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Öztürk', 'Korkmaz', 'Polat', 'Yıldız', 'Erdoğan'];

  function rand(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }
  const ATHLETES = Array.from({ length: 36 }, (_, i) => {
    const team = TEAMS[Math.floor(rand(i + 1) * TEAMS.length)];
    const baseBoy = team.id === 'a' ? 180 : team.id === 'u18' ? 178 : team.id === 'u17' ? 176 : team.id === 'u16' ? 172 : 168;
    return {
      id: 'a' + (100 + i),
      name: FIRST[Math.floor(rand(i + 2) * FIRST.length)] + ' ' + LAST[Math.floor(rand(i + 3) * LAST.length)],
      team: team.id, teamName: team.name,
      pos: POS[Math.floor(rand(i + 4) * POS.length)],
      no: 1 + Math.floor(rand(i + 5) * 35),
      boy: baseBoy + Math.floor(rand(i + 6) * 12) - 4,
      kilo: Math.round((baseBoy - 110) + rand(i + 7) * 10),
      foot: rand(i + 8) > 0.25 ? 'Sağ' : 'Sol',
      status: rand(i + 9) > 0.16 ? 'active' : (rand(i + 10) > 0.5 ? 'injured' : 'rest'),
      vo2: (50 + rand(i + 11) * 9).toFixed(1),
      attend: 78 + Math.floor(rand(i + 12) * 22),
    };
  });

  const OPP = ['Karşıyaka SK', 'Altay', 'Göztepe', 'Bucaspor', 'Menemen FK', 'Bornova 1877', 'Aliağa FK', 'Ödemişspor'];
  const COMPS = ['U-17 Gelişim Ligi', 'U-15 Bölgesel', 'U-18 Gelişim Ligi', 'Hazırlık Maçı', 'A Takım Bölgesel'];
  const FIXTURES = [
    { id: 'f1', comp: 'U-17 Gelişim Ligi', home: 'Buca Yıldız', away: 'Karşıyaka SK', date: '2026-06-14', time: '19:00', venue: 'Buca Yıldız Tesisleri', status: 'upcoming', hs: null, as: null },
    { id: 'f2', comp: 'U-15 Bölgesel', home: 'Buca Yıldız', away: 'Altay', date: '2026-06-08', time: '11:00', venue: 'İskenderun Stadı', status: 'finished', hs: 3, as: 1 },
    { id: 'f3', comp: 'U-18 Gelişim Ligi', home: 'Göztepe', away: 'Buca Yıldız', date: '2026-06-21', time: '17:30', venue: 'Bornova Saha 2', status: 'upcoming', hs: null, as: null },
    { id: 'f4', comp: 'A Takım Bölgesel', home: 'Buca Yıldız', away: 'Menemen FK', date: '2026-06-07', time: '20:00', venue: 'Buca Yıldız Tesisleri', status: 'finished', hs: 2, as: 2 },
    { id: 'f5', comp: 'Hazırlık Maçı', home: 'Buca Yıldız', away: 'Bucaspor', date: '2026-06-28', time: '18:00', venue: 'Buca Yıldız Tesisleri', status: 'upcoming', hs: null, as: null },
  ];

  const CATEGORIES = [
    { id: 'antrenman', name: 'Antrenman', color: 'var(--navy-600)', count: 48 },
    { id: 'mac', name: 'Maç Günü', color: 'var(--red-600)', count: 126 },
    { id: 'odul', name: 'Ödül Töreni', color: 'var(--gold-600)', count: 22 },
    { id: 'tesis', name: 'Tesisler', color: 'var(--green-600)', count: 17 },
    { id: 'roportaj', name: 'Röportaj', color: 'var(--navy-400)', count: 9 },
  ];

  const FOLDERS = [
    { id: 'root', name: 'Tüm Medya', parent: null, count: 222 },
    { id: '2026', name: '2026 Sezonu', parent: 'root', count: 140 },
    { id: 'u17-kamp', name: 'U-17 Kamp', parent: '2026', count: 36 },
    { id: 'final', name: 'Final Maçı', parent: '2026', count: 54 },
    { id: 'odul-2026', name: 'Ödül Gecesi', parent: '2026', count: 22 },
    { id: 'arsiv', name: 'Arşiv', parent: 'root', count: 82 },
  ];

  // homepage "görseller & videolar" cards
  const MEDIA_CARDS = [
    { id: 'c1', title: 'Antrenman', category: 'antrenman', count: 48, kind: 'photo' },
    { id: 'c2', title: 'Maç Günü', category: 'mac', count: 126, kind: 'photo' },
    { id: 'c3', title: 'Ödül Töreni', category: 'odul', count: 22, kind: 'photo' },
    { id: 'c4', title: 'Tesisler', category: 'tesis', count: 17, kind: 'photo' },
    { id: 'feat', title: 'Sezon 2025/26 — Akademi Özeti', category: 'mac', count: 1, kind: 'video', featured: true, duration: '4:12' },
  ];

  const JERSEYS = [
    { id: 'home', name: 'İç Saha', primary: '#15295A', accent: '#DDBA4E', desc: 'Lacivert gövde, altın detaylar', active: true },
    { id: 'away', name: 'Deplasman', primary: '#FFFFFF', accent: '#15295A', desc: 'Beyaz gövde, lacivert detaylar', active: true },
    { id: 'third', name: 'Üçüncü Forma', primary: '#C9A227', accent: '#0E2148', desc: 'Altın gövde, lacivert detaylar', active: true },
    { id: 'gk', name: 'Kaleci', primary: '#1E7D4F', accent: '#F8EFD2', desc: 'Yeşil gövde, krem detaylar', active: true },
  ];

  const POSTS = [
    { id: 'p1', title: 'A Takımımız sezonu kupayla taçlandırdı', template: 'Maç Raporu', category: 'mac', status: 'published', date: '2026-06-11', author: 'Basın' },
    { id: 'p2', title: 'U-17 takımımız grubunu lider tamamladı', template: 'Son Dakika', category: 'mac', status: 'published', date: '2026-06-10', author: 'Basın' },
    { id: 'p3', title: 'Yeni antrenman sahamız hizmete girdi', template: 'Standart Haber', category: 'tesis', status: 'published', date: '2026-06-06', author: 'Kulüp' },
    { id: 'p4', title: 'Yaz okulu kayıtları başladı', template: 'Duyuru', category: 'antrenman', status: 'draft', date: '2026-06-02', author: 'Kulüp' },
    { id: 'p5', title: 'Ödül gecemizden kareler', template: 'Galeri / Ödül Töreni', category: 'odul', status: 'scheduled', date: '2026-06-18', author: 'Basın' },
  ];

  const TEMPLATES = [
    { id: 'sondakika', name: 'Son Dakika', icon: 'zap', desc: 'Tek manşet, büyük kapak görseli ve kısa metin. Hızlı duyurular için.', tag: 'Haber', blocks: ['Kapak görseli', 'Manşet', 'Özet', 'Metin'] },
    { id: 'macraporu', name: 'Maç Raporu', icon: 'trophy', desc: 'Skor başlığı, kadro, maç anlatımı ve foto galeri.', tag: 'Spor', blocks: ['Skor başlığı', 'Kapak', 'Maç anlatımı', 'Galeri'] },
    { id: 'galeri', name: 'Galeri / Ödül Töreni', icon: 'images', desc: 'Görsel ağırlıklı; kapak + foto ızgarası + kısa açıklamalar.', tag: 'Galeri', blocks: ['Kapak', 'Foto ızgarası', 'Açıklama'] },
    { id: 'standart', name: 'Standart Haber', icon: 'newspaper', desc: 'Klasik; görsel + paragraflar + ara başlıklar. Çok amaçlı.', tag: 'Genel', blocks: ['Kapak', 'Giriş', 'Ara başlık + metin', 'Görsel'] },
    { id: 'roportaj', name: 'Röportaj', icon: 'mic', desc: 'Soru–cevap blokları, alıntılar ve portre görseli.', tag: 'Söyleşi', blocks: ['Portre', 'Giriş', 'Soru–Cevap', 'Alıntı'] },
    { id: 'duyuru', name: 'Duyuru', icon: 'megaphone', desc: 'Sade, metin odaklı; logo + başlık + bilgilendirme.', tag: 'Resmî', blocks: ['Başlık', 'Bilgilendirme', 'İletişim'] },
  ];

  window.AdminData = { TEAMS, ATHLETES, POS, FIXTURES, OPP, COMPS, CATEGORIES, FOLDERS, MEDIA_CARDS, JERSEYS, POSTS, TEMPLATES };
})();
