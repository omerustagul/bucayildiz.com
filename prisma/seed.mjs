// İlk admin + takımlar + örnek sporcuları oluşturur (idempotent). Çalıştır:
//   node --env-file=.env prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
import { CONSENT_DOCS, CONSENT_VERSION } from "./consent-texts.mjs";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

// --- Admin ---
const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase().trim();
const password = process.env.SEED_ADMIN_PASSWORD;
const name = process.env.SEED_ADMIN_NAME ?? "Admin";
if (!email || !password) throw new Error("SEED_ADMIN_EMAIL ve SEED_ADMIN_PASSWORD .env'de tanımlı olmalı.");

const passwordHash = await bcrypt.hash(password, 12);
const admin = await prisma.user.upsert({
  where: { email },
  update: { passwordHash, name },
  create: { email, passwordHash, name, role: "admin" },
});
console.log(`✔ Admin: ${admin.email}`);

// --- Teams ---
const TEAMS = [
  { slug: "a-takim", name: "A Takım", short: "A", coach: "Serkan Aydın", born: "Üst yapı", sort: 0 },
  { slug: "u18", name: "U-18", short: "U18", coach: "Tolga Demir", born: "2008", sort: 1 },
  { slug: "u17", name: "U-17", short: "U17", coach: "Emre Kaya", born: "2009", sort: 2 },
  { slug: "u16", name: "U-16", short: "U16", coach: "Barış Şahin", born: "2010", sort: 3 },
  { slug: "u15", name: "U-15", short: "U15", coach: "Onur Çelik", born: "2011", sort: 4 },
];
const teamBySlug = {};
for (const t of TEAMS) {
  const team = await prisma.team.upsert({ where: { slug: t.slug }, update: t, create: t });
  teamBySlug[t.slug] = team.id;
}
console.log(`✔ Takımlar: ${TEAMS.length}`);

// --- Athletes (yalnızca hiç yoksa) ---
const existing = await prisma.athlete.count();
if (existing === 0) {
  const POS = ["Kaleci", "Stoper", "Bek", "Orta Saha", "Kanat", "Forvet"];
  const ATHLETES = [
    { name: "Arda Yılmaz", team: "u17", position: "Forvet", number: 9, height: 176, weight: 66, foot: "Sağ", status: "active" },
    { name: "Kaan Demir", team: "u17", position: "Orta Saha", number: 8, height: 174, weight: 64, foot: "Sol", status: "active" },
    { name: "Emir Şahin", team: "u18", position: "Stoper", number: 4, height: 182, weight: 74, foot: "Sağ", status: "injured" },
    { name: "Berke Kaya", team: "u18", position: "Kaleci", number: 1, height: 185, weight: 78, foot: "Sağ", status: "active" },
    { name: "Doruk Çelik", team: "a-takim", position: "Forvet", number: 11, height: 180, weight: 73, foot: "Sağ", status: "active" },
    { name: "Çınar Aydın", team: "a-takim", position: "Bek", number: 2, height: 178, weight: 70, foot: "Sol", status: "rest" },
    { name: "Ali Arslan", team: "u16", position: "Orta Saha", number: 6, height: 170, weight: 60, foot: "Sağ", status: "active" },
    { name: "Efe Doğan", team: "u16", position: "Kanat", number: 7, height: 168, weight: 58, foot: "Sağ", status: "active" },
    { name: "Mert Kılıç", team: "u15", position: "Forvet", number: 10, height: 165, weight: 55, foot: "Sol", status: "active" },
    { name: "Deniz Aslan", team: "u15", position: "Stoper", number: 5, height: 169, weight: 59, foot: "Sağ", status: "active" },
    { name: "Bora Öztürk", team: "u17", position: "Kanat", number: 17, height: 175, weight: 65, foot: "Sağ", status: "active" },
    { name: "Ege Polat", team: "u18", position: "Bek", number: 3, height: 179, weight: 71, foot: "Sol", status: "active" },
  ];
  for (let i = 0; i < ATHLETES.length; i++) {
    const a = ATHLETES[i];
    await prisma.athlete.create({
      data: {
        name: a.name,
        teamId: teamBySlug[a.team],
        position: a.position,
        number: a.number,
        height: a.height,
        weight: a.weight,
        foot: a.foot,
        status: a.status,
        licenseNo: `BY-${1000 + i}`,
      },
    });
  }
  console.log(`✔ Sporcular: ${ATHLETES.length}`);
} else {
  console.log(`• Sporcular zaten var (${existing}), atlandı.`);
}

// --- Fixtures (yalnızca hiç yoksa) ---
const existingFx = await prisma.fixture.count();
if (existingFx === 0) {
  const FIXTURES = [
    { competition: "U-17 Gelişim Ligi", opponent: "Karşıyaka SK", isHome: true, date: "2026-06-14", time: "19:00", venue: "Buca Yıldız Tesisleri", status: "upcoming" },
    { competition: "U-15 Bölgesel", opponent: "Altay", isHome: true, date: "2026-06-08", time: "11:00", venue: "İskenderun Stadı", status: "finished", ourScore: 3, oppScore: 1 },
    { competition: "U-18 Gelişim Ligi", opponent: "Göztepe", isHome: false, date: "2026-06-21", time: "17:30", venue: "Bornova Saha 2", status: "upcoming" },
    { competition: "A Takım Bölgesel", opponent: "Menemen FK", isHome: true, date: "2026-06-07", time: "20:00", venue: "Buca Yıldız Tesisleri", status: "finished", ourScore: 2, oppScore: 2 },
    { competition: "Hazırlık Maçı", opponent: "Bucaspor", isHome: true, date: "2026-06-28", time: "18:00", venue: "Buca Yıldız Tesisleri", status: "upcoming" },
  ];
  // Maçları takıma bağla (competition'dan çıkarımla).
  const fxTeams = await prisma.team.findMany({ select: { id: true, name: true } });
  const fxNorm = (s) => (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const fxATeam = fxTeams.find((t) => fxNorm(t.name).includes("ATAKIM")) || fxTeams[0];
  const fxPick = (comp) => {
    const c = fxNorm(comp);
    for (const t of fxTeams) {
      const n = fxNorm(t.name);
      if (n.startsWith("U") && c.includes(n)) return t.id;
    }
    return fxATeam?.id ?? null;
  };
  for (const f of FIXTURES) await prisma.fixture.create({ data: { ...f, teamId: fxPick(f.competition) } });
  console.log(`✔ Maçlar: ${FIXTURES.length}`);
} else {
  console.log(`• Maçlar zaten var (${existingFx}), atlandı.`);
}

// --- Trainings (yalnızca hiç yoksa) ---
const existingTr = await prisma.training.count();
if (existingTr === 0) {
  const TR = [
    { team: "u17", date: "2026-06-15", time: "18:00", duration: 90, pitch: "Saha 1", notes: "Pas ve oyun kurma." },
    { team: "u17", date: "2026-06-17", time: "18:00", duration: 75, pitch: "Saha 2", notes: "Dayanıklılık." },
    { team: "u18", date: "2026-06-16", time: "19:00", duration: 80, pitch: "Saha 1", notes: "Maç hazırlığı." },
    { team: "a-takim", date: "2026-06-16", time: "20:00", duration: 90, pitch: "Saha 1", notes: "" },
    { team: "u15", date: "2026-06-18", time: "17:00", duration: 60, pitch: "Saha 2", notes: "Teknik gelişim." },
  ];
  for (const t of TR) await prisma.training.create({ data: { teamId: teamBySlug[t.team], scope: "team", date: t.date, time: t.time, duration: t.duration, pitch: t.pitch, notes: t.notes } });
  console.log(`✔ Antrenmanlar: ${TR.length}`);
} else {
  console.log(`• Antrenmanlar zaten var (${existingTr}), atlandı.`);
}

// --- Posts (yalnızca hiç yoksa) ---
const existingPosts = await prisma.post.count();
if (existingPosts === 0) {
  const POSTS = [
    {
      slug: "a-takim-sezonu-kupayla-tacladi",
      title: "A Takımımız sezonu kupayla taçlandırdı",
      category: "Manşet",
      template: "macraporu",
      status: "published",
      author: "Basın",
      featured: true,
      publishedAt: "2026-06-11",
      excerpt: "Final karşılaşmasında sahadan 2-0 galip ayrılan A Takımımız, bölgesel ligi namağlup şampiyon olarak tamamladı.",
      body: "Sezon boyunca gösterdiği istikrarlı performansla zirveyi bırakmayan A Takımımız, final karşılaşmasını da 2-0 kazanarak bölgesel ligi namağlup şampiyon tamamladı.\n\nTeknik ekibimiz ve sporcularımızı yürekten kutluyor; bu başarının akademimizin gelişim felsefesinin bir meyvesi olduğunu gururla paylaşıyoruz.",
    },
    {
      slug: "u17-grubunu-lider-tamamladi",
      title: "U-17 takımımız grubunu lider tamamladı",
      category: "Altyapı",
      template: "sondakika",
      status: "published",
      author: "Basın",
      publishedAt: "2026-06-10",
      excerpt: "Sezonun son maçında alınan galibiyetle play-off biletini erken aldık.",
      body: "U-17 takımımız, gelişim liginde grubunu lider tamamlayarak play-off biletini bir hafta önceden garantiledi.\n\nGenç sporcularımızın sahadaki disiplini ve mücadelesi, akademimizin bireysel gelişim takibinin sonucudur.",
    },
    {
      slug: "yeni-antrenman-sahamiz-hizmete-girdi",
      title: "Yeni antrenman sahamız hizmete girdi",
      category: "Tesis",
      template: "standart",
      status: "published",
      author: "Kulüp",
      publishedAt: "2026-06-06",
      excerpt: "Hibrit çim yüzeyli yeni sahamız tüm yaş gruplarımızın hizmetinde.",
      body: "Hibrit çim yüzeyli yeni antrenman sahamız, her hava koşulunda kesintisiz çalışma imkânı sunacak şekilde tüm yaş gruplarımızın hizmetine açıldı.\n\nYatırımlarımız, sporcularımıza en iyi gelişim ortamını sağlama hedefimiz doğrultusunda sürüyor.",
    },
    {
      slug: "yaz-okulu-kayitlari-basladi",
      title: "Yaz okulu kayıtları başladı",
      category: "Etkinlik",
      template: "duyuru",
      status: "draft",
      author: "Kulüp",
      publishedAt: "2026-06-02",
      excerpt: "7-14 yaş arası tüm çocuklarımızı ücretsiz tanışma antrenmanına bekliyoruz.",
      body: "Yaz okulu kayıtlarımız başladı. 7-14 yaş arası tüm çocukları, alanında uzman antrenörlerimiz eşliğinde futbolla tanışmaya davet ediyoruz.\n\nKontenjanlarımız sınırlıdır; başvuru formunu doldurarak ücretsiz tanışma antrenmanına yerinizi ayırtabilirsiniz.",
    },
  ];
  for (const p of POSTS) await prisma.post.create({ data: p });
  console.log(`✔ Haberler: ${POSTS.length}`);
} else {
  console.log(`• Haberler zaten var (${existingPosts}), atlandı.`);
}

// --- Jerseys (yalnızca hiç yoksa) ---
const existingJ = await prisma.jersey.count();
if (existingJ === 0) {
  const JERSEYS = [
    { name: "İç Saha", kind: "home", primary: "#15295A", accent: "#DDBA4E", description: "Lacivert gövde, altın detaylar", active: true, sort: 0 },
    { name: "Deplasman", kind: "away", primary: "#FFFFFF", accent: "#15295A", description: "Beyaz gövde, lacivert detaylar", active: true, sort: 1 },
    { name: "Üçüncü Forma", kind: "third", primary: "#C9A227", accent: "#0E2148", description: "Altın gövde, lacivert detaylar", active: true, sort: 2 },
    { name: "Kaleci", kind: "gk", primary: "#1E7D4F", accent: "#F8EFD2", description: "Yeşil gövde, krem detaylar", active: true, sort: 3 },
  ];
  for (const j of JERSEYS) await prisma.jersey.create({ data: j });
  console.log(`✔ Formalar: ${JERSEYS.length}`);
} else {
  console.log(`• Formalar zaten var (${existingJ}), atlandı.`);
}

// --- Media categories (yalnızca hiç yoksa) ---
const existingC = await prisma.mediaCategory.count();
if (existingC === 0) {
  const CATS = [
    { name: "Antrenman", color: "#1D3568", sort: 0 },
    { name: "Maç Günü", color: "#B23A3A", sort: 1 },
    { name: "Ödül Töreni", color: "#C9A227", sort: 2 },
    { name: "Tesisler", color: "#1E7D4F", sort: 3 },
  ];
  for (const c of CATS) await prisma.mediaCategory.create({ data: c });
  console.log(`✔ Medya kategorileri: ${CATS.length}`);
} else {
  console.log(`• Medya kategorileri zaten var (${existingC}), atlandı.`);
}

// --- Folders (yalnızca hiç yoksa) ---
const existingF = await prisma.folder.count();
if (existingF === 0) {
  const root = await prisma.folder.create({ data: { name: "Tüm Medya", parentId: null } });
  const s2026 = await prisma.folder.create({ data: { name: "2026 Sezonu", parentId: root.id } });
  await prisma.folder.create({ data: { name: "U-17 Kamp", parentId: s2026.id } });
  await prisma.folder.create({ data: { name: "Final Maçı", parentId: s2026.id } });
  await prisma.folder.create({ data: { name: "Ödül Gecesi", parentId: s2026.id } });
  await prisma.folder.create({ data: { name: "Arşiv", parentId: root.id } });
  console.log("✔ Klasörler: 6");
} else {
  console.log(`• Klasörler zaten var (${existingF}), atlandı.`);
}

// --- Home media cards (yalnızca hiç yoksa) ---
const existingHC = await prisma.homeMediaCard.count();
if (existingHC === 0) {
  const cats = await prisma.mediaCategory.findMany();
  const catId = (n) => cats.find((c) => c.name === n)?.id ?? null;
  const CARDS = [
    { title: "Antrenman", category: "Antrenman", kind: "photo", featured: false, sort: 0 },
    { title: "Maç Günü", category: "Maç Günü", kind: "photo", featured: false, sort: 1 },
    { title: "Ödül Töreni", category: "Ödül Töreni", kind: "photo", featured: false, sort: 2 },
    { title: "Tesisler", category: "Tesisler", kind: "photo", featured: false, sort: 3 },
    { title: "Sezon 2025/26 — Akademi Özeti", category: "Maç Günü", kind: "video", featured: true, sort: 4 },
  ];
  for (const c of CARDS) await prisma.homeMediaCard.create({ data: { title: c.title, categoryId: catId(c.category), kind: c.kind, featured: c.featured, sort: c.sort } });
  console.log(`✔ Ana sayfa kartları: ${CARDS.length}`);
} else {
  console.log(`• Ana sayfa kartları zaten var (${existingHC}), atlandı.`);
}

// --- Teknik ekip & yönetim (yalnızca hiç yoksa) ---
const existingStaff = await prisma.staffMember.count();
if (existingStaff === 0) {
  const STAFF = [
    // Yönetim
    { name: "Mehmet Yıldırım", title: "Kulüp Başkanı", group: "yonetim", sort: 0 },
    { name: "Ayşe Demir", title: "Genel Koordinatör", group: "yonetim", sort: 1 },
    { name: "Serkan Aydın", title: "Sportif Direktör", group: "yonetim", sort: 2 },
    { name: "Elif Kaya", title: "Akademi Müdürü", group: "yonetim", sort: 3 },
    { name: "Burak Şahin", title: "Mali İşler", group: "yonetim", sort: 4 },
    { name: "Deniz Çelik", title: "Basın & İletişim", group: "yonetim", sort: 5 },
    // Antrenörler
    { name: "Serkan Aydın", title: "A Takım — Baş Antrenör", group: "antrenor", licence: "UEFA A", sort: 0 },
    { name: "Tolga Demir", title: "U-18 — Antrenör", group: "antrenor", licence: "UEFA B", sort: 1 },
    { name: "Emre Kaya", title: "U-17 — Antrenör", group: "antrenor", licence: "UEFA B", sort: 2 },
    { name: "Barış Şahin", title: "U-16 — Antrenör", group: "antrenor", licence: "UEFA C", sort: 3 },
    { name: "Onur Çelik", title: "U-15 — Antrenör", group: "antrenor", licence: "UEFA C", sort: 4 },
    { name: "Kerem Aslan", title: "Kaleci Antrenörü", group: "antrenor", licence: "TFF Kaleci", sort: 5 },
    { name: "Mert Polat", title: "Atletik Performans", group: "antrenor", licence: "BESYO", sort: 6 },
    { name: "Deniz Korkmaz", title: "Fizyoterapist", group: "antrenor", licence: "Lisanslı", sort: 7 },
  ];
  for (const s of STAFF) await prisma.staffMember.create({ data: s });
  console.log(`✔ Teknik ekip & yönetim: ${STAFF.length}`);
} else {
  console.log(`• Teknik ekip & yönetim zaten var (${existingStaff}), atlandı.`);
}

// --- Tesisler (yalnızca hiç yoksa) ---
const existingFacilities = await prisma.facility.count();
if (existingFacilities === 0) {
  const FACILITIES = [
    { name: "Hibrit Çim Saha", description: "Her hava koşulunda oynanabilen, profesyonel ölçülerde ana antrenman sahası.", capacity: "2× tam saha", features: "Aydınlatma, Hibrit Çim, Otomatik Sulama", sort: 0 },
    { name: "Gelişim Salonu", description: "Kondisyon, kuvvet ve esneklik çalışmaları için donanımlı kapalı alan.", features: "Kondisyon Aletleri, Ağırlık Alanı", sort: 1 },
    { name: "Soyunma & Dinlenme", description: "Sporcu ve veliler için konforlu soyunma odaları ve bekleme alanları.", features: "Soyunma Odası, Bekleme Alanı, Duş", sort: 2 },
  ];
  for (const f of FACILITIES) await prisma.facility.create({ data: f });
  console.log(`✔ Tesisler: ${FACILITIES.length}`);
} else {
  console.log(`• Tesisler zaten var (${existingFacilities}), atlandı.`);
}

// --- Athlete login (test) ---
const existingAthleteUser = await prisma.user.count({ where: { role: "athlete" } });
if (existingAthleteUser === 0) {
  const arda = await prisma.athlete.findFirst({ where: { name: "Arda Yılmaz" } });
  if (arda) {
    const pwHash = await bcrypt.hash("Sporcu2026!", 12);
    await prisma.user.create({ data: { username: "arda.yilmaz", passwordHash: pwHash, name: arda.name, role: "athlete", athleteId: arda.id } });
    console.log("✔ Sporcu girişi: arda.yilmaz / Sporcu2026!");
  }
} else {
  console.log(`• Sporcu girişi zaten var, atlandı.`);
}

// --- Periyodik performans ölçümleri (Arda, zaman serisi) ---
const ardaForPerf = await prisma.athlete.findFirst({ where: { name: "Arda Yılmaz" } });
if (ardaForPerf) {
  const hasPerf = await prisma.performanceMeasurement.count({ where: { athleteId: ardaForPerf.id } });
  if (hasPerf === 0) {
    await prisma.performanceMeasurement.createMany({
      data: [
        { athleteId: ardaForPerf.id, measuredAt: "2026-01-12", yoyoLevel: "IR1", yoyoDistance: 1080, repeatedSprint: 7.40, bodyFat: 13.1, muscle: 40.2, sprint10: 2.05, sprint20: 3.35, sprint30: 4.62, verticalJump: 42, standingLongJump: 198, tTest: 11.20, agility505: 2.62, note: "Sezon başı testi" },
        { athleteId: ardaForPerf.id, measuredAt: "2026-02-16", yoyoLevel: "IR1", yoyoDistance: 1180, repeatedSprint: 7.30, bodyFat: 12.6, muscle: 40.9, sprint10: 2.01, sprint20: 3.30, sprint30: 4.55, verticalJump: 44, standingLongJump: 203, tTest: 11.00, agility505: 2.57 },
        { athleteId: ardaForPerf.id, measuredAt: "2026-03-15", yoyoLevel: "IR1", yoyoDistance: 1280, repeatedSprint: 7.20, bodyFat: 12.2, muscle: 41.3, sprint10: 1.98, sprint20: 3.25, sprint30: 4.48, verticalJump: 46, standingLongJump: 208, tTest: 10.80, agility505: 2.53 },
        { athleteId: ardaForPerf.id, measuredAt: "2026-04-19", yoyoLevel: "IR1", yoyoDistance: 1400, repeatedSprint: 7.12, bodyFat: 11.8, muscle: 41.8, sprint10: 1.95, sprint20: 3.20, sprint30: 4.42, verticalJump: 47, standingLongJump: 213, tTest: 10.60, agility505: 2.49 },
        { athleteId: ardaForPerf.id, measuredAt: "2026-05-17", yoyoLevel: "IR1", yoyoDistance: 1540, repeatedSprint: 7.05, bodyFat: 11.5, muscle: 42.1, sprint10: 1.91, sprint20: 3.15, sprint30: 4.36, verticalJump: 49, standingLongJump: 218, tTest: 10.45, agility505: 2.45 },
        { athleteId: ardaForPerf.id, measuredAt: "2026-06-08", yoyoLevel: "IR1", yoyoDistance: 1680, repeatedSprint: 7.00, bodyFat: 11.2, muscle: 42.5, sprint10: 1.88, sprint20: 3.10, sprint30: 4.30, verticalJump: 50, standingLongJump: 222, tTest: 10.30, agility505: 2.42 },
      ],
    });
    console.log("✔ Performans ölçümleri (Arda, 6 dönem)");
  } else {
    console.log("• Performans ölçümleri zaten var, atlandı.");
  }
}

// --- KVKK onay belgeleri (sürümlü; metinler kapsamlı TASLAK — avukat onayı bekleniyor) ---
// Metinler tek kaynaktan (prisma/consent-texts.mjs) gelir.
for (const d of CONSENT_DOCS) {
  await prisma.consentDocument.upsert({
    where: { key_version: { key: d.key, version: CONSENT_VERSION } },
    update: { title: d.title, summary: d.summary, body: d.body, isConsent: d.isConsent, required: d.required, ordering: d.ordering, active: true },
    create: { key: d.key, version: CONSENT_VERSION, title: d.title, summary: d.summary, body: d.body, isConsent: d.isConsent, required: d.required, ordering: d.ordering },
  });
}
// Eski sürümleri pasifleştir — formda yalnızca güncel sürüm görünsün.
await prisma.consentDocument.updateMany({ where: { version: { not: CONSENT_VERSION } }, data: { active: false } });
console.log(`✔ KVKK onay belgeleri: ${CONSENT_DOCS.length} (sürüm ${CONSENT_VERSION})`);

// --- Arda için örnek sporcu-seviyesi onay kayıtları (izinler sayfası demo) ---
const ardaC = await prisma.athlete.findFirst({ where: { name: "Arda Yılmaz" } });
if (ardaC) {
  const existing = await prisma.consentRecord.count({ where: { athleteId: ardaC.id } });
  if (existing === 0) {
    for (const d of CONSENT_DOCS) {
      await prisma.consentRecord.create({
        data: {
          documentKey: d.key,
          documentVersion: CONSENT_VERSION,
          documentTitle: d.title,
          textHash: createHash("sha256").update(d.body, "utf8").digest("hex"),
          granted: d.key !== "pazarlama", // pazarlama hariç hepsi verildi
          granterName: "Arda Yılmaz velisi",
          granterRelation: "veli",
          channel: "basvuru",
          athleteId: ardaC.id,
        },
      });
    }
    console.log("✔ Arda örnek onay kayıtları");
  } else {
    console.log("• Arda onay kayıtları zaten var, atlandı.");
  }
}

// --- Arda için örnek ödeme kayıtları (panel demo) ---
if (ardaC) {
  const payCount = await prisma.payment.count({ where: { athleteId: ardaC.id } });
  if (payCount === 0) {
    await prisma.payment.createMany({
      data: [
        { athleteId: ardaC.id, amount: 1500, period: "Nisan 2026", status: "paid", paidAt: "2026-04-05", method: "havale" },
        { athleteId: ardaC.id, amount: 1500, period: "Mayıs 2026", status: "paid", paidAt: "2026-05-04", method: "havale" },
        { athleteId: ardaC.id, amount: 1500, period: "Haziran 2026", status: "pending", dueDate: "2026-06-10" },
      ],
    });
    console.log("✔ Arda örnek ödeme kayıtları");
  } else {
    console.log("• Arda ödeme kayıtları zaten var, atlandı.");
  }
}

// --- Site ayarları (tekil satır) ---
await prisma.siteSetting.upsert({
  where: { id: "site" },
  update: {},
  create: {
    id: "site",
    clubName: "Buca Yıldız Futbol Akademisi",
    clubShortName: "Buca Yıldız",
    foundedYear: 2010,
    email: "bilgi@bucayildiz.com",
    metaDescription:
      "Buca Yıldız Futbol Akademisi — İzmir Buca'da disiplin, saygı ve takım ruhuyla genç yetenekleri geliştiren altyapı futbol akademisi.",
    customCursor: false,
    cursorStyle: "star",
  },
});
console.log("✔ Site ayarları");

await prisma.$disconnect();
console.log("Seed tamam.");
