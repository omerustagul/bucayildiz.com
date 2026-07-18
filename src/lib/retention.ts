import { prisma } from "@/lib/prisma";

/**
 * KVKK saklama & imha (Faz 2.4/B). Süreler kullanıcı/işletme kararıdır (2026-07-18):
 * ödeme 10 yıl (VUK 5 / TTK 10) · sağlık derhal · rıza kaydı 10 yıl (ispat için tut) ·
 * başvuru 6-12 ay · bülten iptal sonrası 3 yıl.
 *
 * ⚠️ Bu modül KALICI SİLME yapar. Tasarım ilkeleri:
 *  - Seçim (collectExpired) ile silme (applyRetention) AYRIK → önce kuru çalışma raporu.
 *  - Silme, raporlanan KİMLİKLERLE yapılır (aradaki değişiklikte sürpriz silme olmaz).
 *  - MUAFİYETLER kod düzeyinde: sporcuya dönüştürülmüş başvuru ve canlı sporcuya/başvuruya
 *    bağlı rıza kaydı ASLA silinmez.
 *  - Raporda PII maskelenir (log'da veri minimizasyonu).
 *
 * SAĞLIK VERİSİ NOTU: "derhal" imhası periyodik işle DEĞİL, sporcu silinince CASCADE ile
 * uygulanır (bkz. deleteAthlete, Faz 2.4/A). Kulüpten AYRILAN ama silinmeyen sporcunun
 * sağlık verisi için ayrı bir "ayrıldı" durumu gerekir — henüz yok (bilinçli açık; tahmine
 * dayalı otomatik sağlık verisi silme TEHLİKELİ olurdu).
 */
export const RETENTION = {
  /** Sporcuya DÖNÜŞTÜRÜLMEMİŞ başvuru (karar aralığı 6-12 ay). */
  applicationMonths: 12,
  /** İptal edilmiş bülten aboneliği — iptal tarihinden itibaren. */
  newsletterYears: 3,
  /** YETİM rıza kaydı (sporcusu VE başvurusu kalmamış) — ispat penceresi. */
  orphanConsentYears: 10,
  /** Mali kayıt — yasal saklama süresi dolduktan sonra. */
  paymentYears: 10,
} as const;

export type ExpiredItem = { id: string; label: string; date: Date | null };
export type RetentionPlan = {
  applications: ExpiredItem[];
  newsletter: ExpiredItem[];
  orphanConsents: ExpiredItem[];
  payments: ExpiredItem[];
};

export function monthsAgo(now: Date, m: number): Date {
  const d = new Date(now);
  d.setMonth(d.getMonth() - m);
  return d;
}
export function yearsAgo(now: Date, y: number): Date {
  const d = new Date(now);
  d.setFullYear(d.getFullYear() - y);
  return d;
}

/** Rapor/log için ad maskeleme — KVKK veri minimizasyonu ("Ali Veli" → "A*** V***"). */
export function maskName(n: string | null | undefined): string {
  if (!n) return "—";
  return n.trim().split(/\s+/).map((w) => (w ? w[0] + "***" : "")).join(" ");
}
/** E-posta maskeleme ("veli@ornek.com" → "v***@ornek.com"). */
export function maskEmail(e: string | null | undefined): string {
  if (!e) return "—";
  const [local, domain] = e.split("@");
  if (!domain) return "***";
  return `${local[0] ?? ""}***@${domain}`;
}

/**
 * Süresi DOLMUŞ kayıtları toplar — HİÇBİR ŞEY SİLMEZ (kuru çalışma).
 * `now` dışarıdan verilir → test edilebilir ve sınır tarihleri deterministiktir.
 */
export async function collectExpired(now: Date): Promise<RetentionPlan> {
  const [applications, newsletter, orphanConsents, payments] = await Promise.all([
    // MUAF: `athlete` bağı olan başvuru = sporcuya dönüştürülmüş → rıza soykütüğü, ASLA silinmez.
    prisma.application.findMany({
      where: { createdAt: { lt: monthsAgo(now, RETENTION.applicationMonths) }, athlete: { is: null } },
      select: { id: true, athleteName: true, createdAt: true },
    }),
    // MUAF: active/pending aboneler (yalnız iptal edilmişler, iptalden 3 yıl sonra).
    prisma.newsletterSubscriber.findMany({
      where: { status: "unsubscribed", unsubscribedAt: { lt: yearsAgo(now, RETENTION.newsletterYears) } },
      select: { id: true, email: true, unsubscribedAt: true },
    }),
    // MUAF: sporcuya VEYA başvuruya bağlı her rıza kaydı. Yalnız TAM YETİM olanlar.
    prisma.consentRecord.findMany({
      where: { athleteId: null, applicationId: null, createdAt: { lt: yearsAgo(now, RETENTION.orphanConsentYears) } },
      select: { id: true, documentKey: true, createdAt: true },
    }),
    // Mali kayıt: yasal saklama dolmuş (yaşa göre; sporcu bağı olsun olmasın).
    prisma.payment.findMany({
      where: { createdAt: { lt: yearsAgo(now, RETENTION.paymentYears) } },
      select: { id: true, payerName: true, period: true, createdAt: true },
    }),
  ]);

  return {
    applications: applications.map((a) => ({ id: a.id, label: maskName(a.athleteName), date: a.createdAt })),
    newsletter: newsletter.map((n) => ({ id: n.id, label: maskEmail(n.email), date: n.unsubscribedAt })),
    orphanConsents: orphanConsents.map((c) => ({ id: c.id, label: c.documentKey, date: c.createdAt })),
    payments: payments.map((p) => ({ id: p.id, label: `${maskName(p.payerName)} · ${p.period}`, date: p.createdAt })),
  };
}

export type RetentionCounts = { applications: number; newsletter: number; orphanConsents: number; payments: number };

/**
 * Planı UYGULAR — kalıcı siler. Yalnız plandaki KİMLİKLER silinir (yeni uygun hâle gelen
 * kayıt bu turda silinmez). Tek transaction + `adminAuditLog`'a imha kaydı.
 */
export async function applyRetention(plan: RetentionPlan, meta: { ipAddress?: string | null } = {}): Promise<RetentionCounts> {
  const counts: RetentionCounts = { applications: 0, newsletter: 0, orphanConsents: 0, payments: 0 };
  const ids = (items: ExpiredItem[]) => items.map((i) => i.id);

  await prisma.$transaction(async (tx) => {
    if (plan.applications.length)
      counts.applications = (await tx.application.deleteMany({ where: { id: { in: ids(plan.applications) } } })).count;
    if (plan.newsletter.length)
      counts.newsletter = (await tx.newsletterSubscriber.deleteMany({ where: { id: { in: ids(plan.newsletter) } } })).count;
    if (plan.orphanConsents.length)
      counts.orphanConsents = (await tx.consentRecord.deleteMany({ where: { id: { in: ids(plan.orphanConsents) } } })).count;
    if (plan.payments.length)
      counts.payments = (await tx.payment.deleteMany({ where: { id: { in: ids(plan.payments) } } })).count;
  });

  const total = counts.applications + counts.newsletter + counts.orphanConsents + counts.payments;
  if (total > 0) {
    await prisma.adminAuditLog.create({
      data: {
        actorId: "system",
        actorName: "Otomatik İmha (saklama politikası)",
        action: "retention.purge",
        detail:
          `başvuru ${counts.applications} (>${RETENTION.applicationMonths} ay, dönüştürülmemiş) · ` +
          `bülten ${counts.newsletter} (iptalden >${RETENTION.newsletterYears} yıl) · ` +
          `yetim rıza ${counts.orphanConsents} (>${RETENTION.orphanConsentYears} yıl) · ` +
          `ödeme ${counts.payments} (>${RETENTION.paymentYears} yıl)`,
        ipAddress: meta.ipAddress ?? null,
      },
    });
  }
  return counts;
}
