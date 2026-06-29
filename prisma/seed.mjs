// İlk admin + takımlar + örnek sporcuları oluşturur (idempotent). Çalıştır:
//   node --env-file=.env prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
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
  for (const f of FIXTURES) await prisma.fixture.create({ data: f });
  console.log(`✔ Maçlar: ${FIXTURES.length}`);
} else {
  console.log(`• Maçlar zaten var (${existingFx}), atlandı.`);
}

// --- Trainings (yalnızca hiç yoksa) ---
const existingTr = await prisma.training.count();
if (existingTr === 0) {
  const TR = [
    { team: "u17", type: "Saha", date: "2026-06-15", time: "18:00", duration: 90, pitch: "Saha 1", notes: "Pas ve oyun kurma." },
    { team: "u17", type: "Kondisyon", date: "2026-06-17", time: "18:00", duration: 75, pitch: "Saha 2", notes: "Dayanıklılık." },
    { team: "u18", type: "Taktik", date: "2026-06-16", time: "19:00", duration: 80, pitch: "Saha 1", notes: "Maç hazırlığı." },
    { team: "a-takim", type: "Saha", date: "2026-06-16", time: "20:00", duration: 90, pitch: "Saha 1", notes: "" },
    { team: "u15", type: "Bireysel", date: "2026-06-18", time: "17:00", duration: 60, pitch: "Saha 2", notes: "Teknik gelişim." },
  ];
  for (const t of TR) await prisma.training.create({ data: { teamId: teamBySlug[t.team], type: t.type, date: t.date, time: t.time, duration: t.duration, pitch: t.pitch, notes: t.notes } });
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
        { athleteId: ardaForPerf.id, measuredAt: "2026-01-12", vo2: 51.2, percentile: 78, bodyFat: 13.1, muscle: 40.2, speed: 70, endurance: 76, power: 63, technique: 82, tactic: 75, passing: 84, sprint30: 4.42, verticalJump: 52, maxHr: 198, trainingLoad: 360, note: "Sezon başı testi" },
        { athleteId: ardaForPerf.id, measuredAt: "2026-02-16", vo2: 52.8, percentile: 81, bodyFat: 12.6, muscle: 40.9, speed: 72, endurance: 78, power: 65, technique: 84, tactic: 77, passing: 86, sprint30: 4.35, verticalJump: 54, maxHr: 197, trainingLoad: 375 },
        { athleteId: ardaForPerf.id, measuredAt: "2026-03-15", vo2: 53.4, percentile: 84, bodyFat: 12.2, muscle: 41.3, speed: 73, endurance: 80, power: 66, technique: 85, tactic: 78, passing: 87, sprint30: 4.30, verticalJump: 55, maxHr: 197, trainingLoad: 388 },
        { athleteId: ardaForPerf.id, measuredAt: "2026-04-19", vo2: 54.1, percentile: 87, bodyFat: 11.8, muscle: 41.8, speed: 75, endurance: 82, power: 68, technique: 86, tactic: 80, passing: 88, sprint30: 4.25, verticalJump: 56, maxHr: 196, trainingLoad: 398 },
        { athleteId: ardaForPerf.id, measuredAt: "2026-05-17", vo2: 55.0, percentile: 90, bodyFat: 11.5, muscle: 42.1, speed: 76, endurance: 84, power: 69, technique: 87, tactic: 81, passing: 89, sprint30: 4.21, verticalJump: 57, maxHr: 196, trainingLoad: 405 },
        { athleteId: ardaForPerf.id, measuredAt: "2026-06-08", vo2: 56.4, percentile: 92, bodyFat: 11.2, muscle: 42.5, speed: 78, endurance: 85, power: 70, technique: 88, tactic: 82, passing: 90, sprint30: 4.18, verticalJump: 58, maxHr: 196, trainingLoad: 412 },
      ],
    });
    console.log("✔ Performans ölçümleri (Arda, 6 dönem)");
  } else {
    console.log("• Performans ölçümleri zaten var, atlandı.");
  }
}

// --- KVKK onay belgeleri (sürümlü; metinler TASLAK — avukat onayı bekleniyor) ---
const CONSENT_VERSION = "2026-06-15";
const DRAFT = "\n\n— — —\n⚠️ Bu metin taslaktır; nihai hali KVKK avukatı tarafından hazırlanıp onaylanacaktır.";
const consentDocs = [
  { key: "aydinlatma", title: "Aydınlatma Metni", summary: "Aydınlatma metnini okudum.", isConsent: false, required: true, ordering: 1,
    body: "Buca Yıldız Futbol Akademisi (\"Kulüp\") olarak, 6698 sayılı KVKK kapsamında veri sorumlusu sıfatıyla; sporcu adayının ve velisinin kimlik, iletişim, doğum tarihi, fiziksel ölçüm ve sağlık verileri ile varsa görsel verilerini, akademi başvurusu, antrenman planlaması, performans takibi ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işliyoruz. Verileriniz Türkiye'de barındırılır. KVKK md.11 haklarınızı kullanabilirsiniz." + DRAFT },
  { key: "acik-riza", title: "Kişisel Verilerin İşlenmesi — Açık Rıza", summary: "Kişisel verilerimin yukarıdaki amaçlarla işlenmesine açık rıza veriyorum.", isConsent: true, required: true, ordering: 2,
    body: "Sporcu adayına ve veliye ait kimlik ve iletişim verilerinin; başvurunun değerlendirilmesi, deneme antrenmanı organizasyonu ve Kulüp ile iletişim amaçlarıyla işlenmesine açık rıza veriyorum. Rızamı dilediğim zaman geri alabileceğimi biliyorum." + DRAFT },
  { key: "saglik-verisi", title: "Sağlık ve Fiziksel Ölçüm Verileri — Açık Rıza (Özel Nitelikli)", summary: "Sporcunun sağlık ve fiziksel ölçüm (özel nitelikli) verilerinin işlenmesine açık rıza veriyorum.", isConsent: true, required: true, ordering: 3,
    body: "Sporcunun boy, kilo, fiziksel performans ölçümleri ve sağlık durumuna ilişkin özel nitelikli kişisel verilerinin; antrenman güvenliği, gelişim ve performans takibi amaçlarıyla, yalnızca yetkili antrenör/sağlık personeli tarafından işlenmesine açık rıza veriyorum." + DRAFT },
  { key: "foto-video", title: "Fotoğraf ve Video Paylaşım Muvafakatnamesi", summary: "Sporcunun fotoğraf/videolarının Kulüp tanıtımında ve sosyal medyada paylaşılmasına izin veriyorum.", isConsent: true, required: false, ordering: 4,
    body: "Sporcunun antrenman, maç ve etkinliklerde çekilen fotoğraf ve videolarının; Kulübün web sitesi, sosyal medya hesapları ve tanıtım materyallerinde paylaşılmasına muvafakat ediyorum. Bu izin OPSİYONELDİR; vermemem üyelik/kayıt hakkımı etkilemez ve izni dilediğim zaman geri alabilirim." + DRAFT },
  { key: "pazarlama", title: "Ticari Elektronik İleti (Pazarlama) İzni", summary: "Kulüpten haber, duyuru ve kampanyalardan haberdar olmak istiyorum.", isConsent: true, required: false, ordering: 5,
    body: "Kulübe ait haber, duyuru, etkinlik ve kampanyalara ilişkin ticari elektronik iletilerin (SMS/e-posta) tarafıma gönderilmesine izin veriyorum. İzni dilediğim zaman geri alabilirim." + DRAFT },
];
for (const d of consentDocs) {
  await prisma.consentDocument.upsert({
    where: { key_version: { key: d.key, version: CONSENT_VERSION } },
    update: { title: d.title, summary: d.summary, body: d.body, isConsent: d.isConsent, required: d.required, ordering: d.ordering, active: true },
    create: { key: d.key, version: CONSENT_VERSION, title: d.title, summary: d.summary, body: d.body, isConsent: d.isConsent, required: d.required, ordering: d.ordering },
  });
}
console.log(`✔ KVKK onay belgeleri: ${consentDocs.length} (sürüm ${CONSENT_VERSION})`);

// --- Arda için örnek sporcu-seviyesi onay kayıtları (izinler sayfası demo) ---
const ardaC = await prisma.athlete.findFirst({ where: { name: "Arda Yılmaz" } });
if (ardaC) {
  const existing = await prisma.consentRecord.count({ where: { athleteId: ardaC.id } });
  if (existing === 0) {
    for (const d of consentDocs) {
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
