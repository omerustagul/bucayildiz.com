/* Buca Yıldız — placeholder content data.
   Faz 2'de admin paneli + veritabanı bu statik veriyi devralacak. */

export type Team = {
  slug: string;
  name: string;
  short: string;
  coach: string;
  born: string;
  count: number;
  desc: string;
};

export const TEAMS: Team[] = [
  { slug: "a-takim", name: "A Takım", short: "A", coach: "Serkan Aydın", born: "Üst yapı", count: 26, desc: "Akademinin en üst basamağı; bölgesel ligde mücadele eden temsil takımımız." },
  { slug: "u18", name: "U-18", short: "U18", coach: "Tolga Demir", born: "2008", count: 23, desc: "Profesyonelliğe en yakın yaş grubumuz; gelişim liginde aktif." },
  { slug: "u17", name: "U-17", short: "U17", coach: "Emre Kaya", born: "2009", count: 24, desc: "Gelişim liginde grup liderliği hedefleyen iddialı kadromuz." },
  { slug: "u16", name: "U-16", short: "U16", coach: "Barış Şahin", born: "2010", count: 25, desc: "Teknik ve taktik temellerin pekiştirildiği gelişim grubu." },
  { slug: "u15", name: "U-15", short: "U15", coach: "Onur Çelik", born: "2011", count: 28, desc: "Akademiye ilk adım; oyun zekâsı ve temel becerilerin geliştiği yaş grubu." },
];

export function getTeam(slug: string) {
  return TEAMS.find((t) => t.slug === slug);
}

export type Coach = { name: string; role: string; license: string };

export const COACHES: Coach[] = [
  { name: "Serkan Aydın", role: "A Takım — Baş Antrenör", license: "UEFA A" },
  { name: "Tolga Demir", role: "U-18 — Antrenör", license: "UEFA B" },
  { name: "Emre Kaya", role: "U-17 — Antrenör", license: "UEFA B" },
  { name: "Barış Şahin", role: "U-16 — Antrenör", license: "UEFA C" },
  { name: "Onur Çelik", role: "U-15 — Antrenör", license: "UEFA C" },
  { name: "Kerem Aslan", role: "Kaleci Antrenörü", license: "TFF Kaleci" },
  { name: "Mert Polat", role: "Atletik Performans", license: "BESYO" },
  { name: "Deniz Korkmaz", role: "Fizyoterapist", license: "Lisanslı" },
];

export type Post = {
  slug: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "a-takim-sezonu-kupayla-tacladi",
    category: "Manşet",
    date: "11 Haziran 2026",
    title: "A Takımımız sezonu kupayla taçlandırdı",
    excerpt: "Final karşılaşmasında sahadan 2-0 galip ayrılan A Takımımız, bölgesel ligi namağlup şampiyon olarak tamamladı.",
    body: [
      "Sezon boyunca gösterdiği istikrarlı performansla zirveyi bırakmayan A Takımımız, final karşılaşmasını da 2-0 kazanarak bölgesel ligi namağlup şampiyon tamamladı.",
      "Teknik ekibimiz ve sporcularımızı yürekten kutluyor; bu başarının akademimizin gelişim felsefesinin bir meyvesi olduğunu gururla paylaşıyoruz.",
    ],
  },
  {
    slug: "u17-grubunu-lider-tamamladi",
    category: "Altyapı",
    date: "10 Haziran 2026",
    title: "U-17 takımımız grubunu lider tamamladı",
    excerpt: "Sezonun son maçında alınan galibiyetle play-off biletini erken aldık.",
    body: [
      "U-17 takımımız, gelişim liginde grubunu lider tamamlayarak play-off biletini bir hafta önceden garantiledi.",
      "Genç sporcularımızın sahadaki disiplini ve mücadelesi, akademimizin bireysel gelişim takibinin sonucudur.",
    ],
  },
  {
    slug: "yeni-antrenman-sahamiz-hizmete-girdi",
    category: "Tesis",
    date: "6 Haziran 2026",
    title: "Yeni antrenman sahamız hizmete girdi",
    excerpt: "Hibrit çim yüzeyli yeni sahamız tüm yaş gruplarımızın hizmetinde.",
    body: [
      "Hibrit çim yüzeyli yeni antrenman sahamız, her hava koşulunda kesintisiz çalışma imkânı sunacak şekilde tüm yaş gruplarımızın hizmetine açıldı.",
      "Yatırımlarımız, sporcularımıza en iyi gelişim ortamını sağlama hedefimiz doğrultusunda sürüyor.",
    ],
  },
  {
    slug: "yaz-okulu-kayitlari-basladi",
    category: "Etkinlik",
    date: "2 Haziran 2026",
    title: "Yaz okulu kayıtları başladı",
    excerpt: "7-14 yaş arası tüm çocuklarımızı ücretsiz tanışma antrenmanına bekliyoruz.",
    body: [
      "Yaz okulu kayıtlarımız başladı. 7-14 yaş arası tüm çocukları, alanında uzman antrenörlerimiz eşliğinde futbolla tanışmaya davet ediyoruz.",
      "Kontenjanlarımız sınırlıdır; başvuru formunu doldurarak ücretsiz tanışma antrenmanına yerinizi ayırtabilirsiniz.",
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export type Fixture = {
  comp: string;
  home: string;
  away: string;
  date: string;
  time: string;
  venue: string;
  status: "upcoming" | "finished";
  hs: number | null;
  as: number | null;
};

export const FIXTURES: Fixture[] = [
  { comp: "U-17 Gelişim Ligi", home: "Buca Yıldız", away: "Karşıyaka SK", date: "14 Haz 2026", time: "19:00", venue: "Buca Yıldız Tesisleri", status: "upcoming", hs: null, as: null },
  { comp: "U-15 Bölgesel", home: "Buca Yıldız", away: "Altay", date: "8 Haz 2026", time: "11:00", venue: "İskenderun Stadı", status: "finished", hs: 3, as: 1 },
  { comp: "U-18 Gelişim Ligi", home: "Göztepe", away: "Buca Yıldız", date: "21 Haz 2026", time: "17:30", venue: "Bornova Saha 2", status: "upcoming", hs: null, as: null },
  { comp: "A Takım Bölgesel", home: "Buca Yıldız", away: "Menemen FK", date: "7 Haz 2026", time: "20:00", venue: "Buca Yıldız Tesisleri", status: "finished", hs: 2, as: 2 },
  { comp: "Hazırlık Maçı", home: "Buca Yıldız", away: "Bucaspor", date: "28 Haz 2026", time: "18:00", venue: "Buca Yıldız Tesisleri", status: "upcoming", hs: null, as: null },
];

export type StandingRow = {
  pos: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
};

export const STANDINGS: StandingRow[] = [
  { pos: 1, team: "Buca Yıldız", played: 21, won: 16, drawn: 3, lost: 2, points: 51 },
  { pos: 2, team: "Karşıyaka SK", played: 21, won: 15, drawn: 3, lost: 3, points: 48 },
  { pos: 3, team: "Göztepe", played: 21, won: 13, drawn: 4, lost: 4, points: 43 },
  { pos: 4, team: "Altay", played: 21, won: 11, drawn: 5, lost: 5, points: 38 },
  { pos: 5, team: "Bornova 1877", played: 21, won: 9, drawn: 6, lost: 6, points: 33 },
  { pos: 6, team: "Menemen FK", played: 21, won: 8, drawn: 5, lost: 8, points: 29 },
  { pos: 7, team: "Aliağa FK", played: 21, won: 6, drawn: 6, lost: 9, points: 24 },
  { pos: 8, team: "Bucaspor", played: 21, won: 3, drawn: 4, lost: 14, points: 13 },
];
