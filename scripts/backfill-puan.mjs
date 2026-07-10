// Sitede daha önce statik olarak tutulan puan durumu verisini (eski
// src/lib/data.ts STANDINGS dizisi) StandingRow tablosuna aktarır.
// İdempotenttir: takım adına göre "upsert" deseniyle çalışır — StandingRow'un
// teamName üzerinde benzersizlik kısıtı olmadığından (prisma/schema.prisma'ya
// DOKUNULMADI) find + create/update ile emüle edilir; birden çok kez
// çalıştırmak yinelenen satır OLUŞTURMAZ.
//
// Kullanım: node --env-file=.env scripts/backfill-puan.mjs
//
// Not: eski statik veri gol istatistiği (goalsFor/goalsAgainst) içermiyordu;
// bu alanlar 0 ile doldurulur — admin panelinden (/admin/puan-durumu) gerçek
// değerlerle güncellenebilir.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Kaynak: eski src/lib/data.ts STANDINGS statik dizisi.
const STANDINGS = [
  { pos: 1, team: "Buca Yıldız", played: 21, won: 16, drawn: 3, lost: 2, points: 51 },
  { pos: 2, team: "Karşıyaka SK", played: 21, won: 15, drawn: 3, lost: 3, points: 48 },
  { pos: 3, team: "Göztepe", played: 21, won: 13, drawn: 4, lost: 4, points: 43 },
  { pos: 4, team: "Altay", played: 21, won: 11, drawn: 5, lost: 5, points: 38 },
  { pos: 5, team: "Bornova 1877", played: 21, won: 9, drawn: 6, lost: 6, points: 33 },
  { pos: 6, team: "Menemen FK", played: 21, won: 8, drawn: 5, lost: 8, points: 29 },
  { pos: 7, team: "Aliağa FK", played: 21, won: 6, drawn: 6, lost: 9, points: 24 },
  { pos: 8, team: "Bucaspor", played: 21, won: 3, drawn: 4, lost: 14, points: 13 },
];

let created = 0;
let updated = 0;

for (const s of STANDINGS) {
  const data = {
    teamName: s.team,
    isOurs: s.team === "Buca Yıldız",
    played: s.played,
    wins: s.won,
    draws: s.drawn,
    losses: s.lost,
    goalsFor: 0,
    goalsAgainst: 0,
    points: s.points,
    sort: s.pos,
  };
  const existing = await prisma.standingRow.findFirst({ where: { teamName: s.team } });
  if (existing) {
    await prisma.standingRow.update({ where: { id: existing.id }, data });
    updated++;
  } else {
    await prisma.standingRow.create({ data });
    created++;
  }
}

console.log(`✔ Puan durumu backfill tamam: ${created} yeni, ${updated} güncellendi.`);
await prisma.$disconnect();
