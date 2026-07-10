// Tek seferlik veri taşıma: eski statik teknik ekip/yönetim/tesis içeriğini
// (kurumsal/yonetim, altyapı/antrenörler, kurumsal/tesisler sayfalarındaki
// gömülü listeler) StaffMember / Facility tablolarına aktarır.
// Migration DEĞİLDİR — mevcut DB'ye idempotent upsert yapar (ad+grup / ad
// eşleşirse günceller, yoksa oluşturur). Birden fazla kez çalıştırmak güvenlidir.
// Kullanım: node --env-file=.env scripts/backfill-kadro.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STAFF = [
  // Yönetim (eski kurumsal/yonetim sayfası)
  { name: "Mehmet Yıldırım", title: "Kulüp Başkanı", group: "yonetim", sort: 0 },
  { name: "Ayşe Demir", title: "Genel Koordinatör", group: "yonetim", sort: 1 },
  { name: "Serkan Aydın", title: "Sportif Direktör", group: "yonetim", sort: 2 },
  { name: "Elif Kaya", title: "Akademi Müdürü", group: "yonetim", sort: 3 },
  { name: "Burak Şahin", title: "Mali İşler", group: "yonetim", sort: 4 },
  { name: "Deniz Çelik", title: "Basın & İletişim", group: "yonetim", sort: 5 },
  // Antrenörler (eski altyapı/antrenörler sayfası — src/lib/data.ts COACHES)
  { name: "Serkan Aydın", title: "A Takım — Baş Antrenör", group: "antrenor", licence: "UEFA A", sort: 0 },
  { name: "Tolga Demir", title: "U-18 — Antrenör", group: "antrenor", licence: "UEFA B", sort: 1 },
  { name: "Emre Kaya", title: "U-17 — Antrenör", group: "antrenor", licence: "UEFA B", sort: 2 },
  { name: "Barış Şahin", title: "U-16 — Antrenör", group: "antrenor", licence: "UEFA C", sort: 3 },
  { name: "Onur Çelik", title: "U-15 — Antrenör", group: "antrenor", licence: "UEFA C", sort: 4 },
  { name: "Kerem Aslan", title: "Kaleci Antrenörü", group: "antrenor", licence: "TFF Kaleci", sort: 5 },
  { name: "Mert Polat", title: "Atletik Performans", group: "antrenor", licence: "BESYO", sort: 6 },
  { name: "Deniz Korkmaz", title: "Fizyoterapist", group: "antrenor", licence: "Lisanslı", sort: 7 },
];

const FACILITIES = [
  { name: "Hibrit Çim Saha", description: "Her hava koşulunda oynanabilen, profesyonel ölçülerde ana antrenman sahası.", capacity: "2× tam saha", features: "Aydınlatma, Hibrit Çim, Otomatik Sulama", sort: 0 },
  { name: "Gelişim Salonu", description: "Kondisyon, kuvvet ve esneklik çalışmaları için donanımlı kapalı alan.", features: "Kondisyon Aletleri, Ağırlık Alanı", sort: 1 },
  { name: "Soyunma & Dinlenme", description: "Sporcu ve veliler için konforlu soyunma odaları ve bekleme alanları.", features: "Soyunma Odası, Bekleme Alanı, Duş", sort: 2 },
];

let staffCreated = 0;
let staffUpdated = 0;
for (const s of STAFF) {
  // Doğal anahtar: ad + unvan (aynı kişi farklı unvanla iki gruba girebilir — ör. Serkan Aydın).
  const existing = await prisma.staffMember.findFirst({ where: { name: s.name, title: s.title } });
  if (existing) {
    await prisma.staffMember.update({ where: { id: existing.id }, data: s });
    staffUpdated++;
  } else {
    await prisma.staffMember.create({ data: s });
    staffCreated++;
  }
}
console.log(`✔ Teknik ekip & yönetim: ${staffCreated} oluşturuldu, ${staffUpdated} güncellendi.`);

let facCreated = 0;
let facUpdated = 0;
for (const f of FACILITIES) {
  const existing = await prisma.facility.findFirst({ where: { name: f.name } });
  if (existing) {
    await prisma.facility.update({ where: { id: existing.id }, data: f });
    facUpdated++;
  } else {
    await prisma.facility.create({ data: f });
    facCreated++;
  }
}
console.log(`✔ Tesisler: ${facCreated} oluşturuldu, ${facUpdated} güncellendi.`);

await prisma.$disconnect();
console.log("Backfill tamam.");
