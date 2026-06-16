/** Public site veri yardımcıları — DB kayıtlarını görünüm biçimine çevirir. */

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const MONTHS_SHORT = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

export function fmtTrDate(ymd: string | null | undefined): string {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function fmtTrShort(ymd: string | null | undefined): string {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return ymd ?? "";
  return `${d} ${MONTHS_SHORT[m - 1]}`;
}

type DbFixture = {
  id: string;
  competition: string;
  opponent: string;
  isHome: boolean;
  date: string;
  time: string;
  venue: string;
  status: string;
  ourScore: number | null;
  oppScore: number | null;
};

export type FixtureView = {
  id: string;
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

/** DB fikstürünü, MatchList'in beklediği biçime çevirir. */
export function mapFixture(f: DbFixture): FixtureView {
  return {
    id: f.id,
    comp: f.competition,
    home: f.isHome ? "Buca Yıldız" : f.opponent,
    away: f.isHome ? f.opponent : "Buca Yıldız",
    date: fmtTrShort(f.date) + " " + f.date.slice(0, 4),
    time: f.time,
    venue: f.venue,
    status: f.status === "finished" ? "finished" : "upcoming",
    hs: f.isHome ? f.ourScore : f.oppScore,
    as: f.isHome ? f.oppScore : f.ourScore,
  };
}
