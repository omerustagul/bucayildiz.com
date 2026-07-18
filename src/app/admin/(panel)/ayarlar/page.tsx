import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth";
import { ViewHeader } from "@/components/admin/ui";
import { getSettings } from "@/lib/settings";
import { resolveSocialLinks } from "@/lib/social";
import { prisma } from "@/lib/prisma";
import { SettingsForm, type SettingsFormValues } from "@/components/admin/SettingsForm";
import { RetentionPanel, type RetentionRow } from "@/components/admin/RetentionPanel";
import { collectExpired, RETENTION, type ExpiredItem } from "@/lib/retention";

export const metadata: Metadata = { title: "Ayarlar" };

const fmt = (d: Date | string | null) => {
  if (!d) return "—";
  const x = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(x.getTime()) ? "—" : x.toLocaleDateString("tr-TR");
};
/** Kuru çalışma satırı — yalnız sayı + İLK 3 örnek (etiketler sunucuda maskeli). */
const row = (key: string, label: string, rule: string, items: ExpiredItem[]): RetentionRow => ({
  key,
  label,
  rule,
  count: items.length,
  samples: items.slice(0, 3).map((i) => ({ id: i.id, label: i.label, date: fmt(i.date) })),
});

export default async function AyarlarPage() {
  await requirePermission("ayarlar.view");
  const [s, categories, assets, expired] = await Promise.all([
    getSettings(),
    prisma.mediaCategory.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
    // Öne çıkan görsel seçici için fotoğraflar (kategoriye göre client'ta süzülür).
    prisma.mediaAsset.findMany({ where: { kind: "photo" }, orderBy: { createdAt: "desc" }, select: { id: true, url: true, title: true, categoryId: true } }),
    // KVKK imha kuru çalışması — HİÇBİR ŞEY SİLMEZ, yalnız süresi dolanları listeler.
    collectExpired(new Date()),
  ]);

  const retentionRows: RetentionRow[] = [
    row("applications", "Başvurular", `${RETENTION.applicationMonths} aydan eski · sporcuya dönüştürülmemiş`, expired.applications),
    row("newsletter", "Bülten abonelikleri", `iptalden ${RETENTION.newsletterYears} yıl sonra`, expired.newsletter),
    row("orphanConsents", "Yetim rıza kayıtları", `sporcusu/başvurusu kalmamış · ${RETENTION.orphanConsentYears} yıldan eski`, expired.orphanConsents),
    row("payments", "Ödeme kayıtları", `${RETENTION.paymentYears} yıldan eski · yasal saklama (VUK/TTK) doldu`, expired.payments),
  ];
  const retentionTotal = retentionRows.reduce((n, r) => n + r.count, 0);
  const str = (x: string | null) => x ?? "";
  const numStr = (x: number | null) => (x == null ? "" : String(x));

  const initial: SettingsFormValues = {
    clubName: s.clubName,
    clubShortName: s.clubShortName,
    logoUrl: str(s.logoUrl),
    foundedYear: numStr(s.foundedYear),
    phone: str(s.phone),
    email: str(s.email),
    address: str(s.address),
    latitude: s.latitude,
    longitude: s.longitude,
    socialLinks: JSON.stringify(resolveSocialLinks(s)),
    metaTitle: str(s.metaTitle),
    metaDescription: str(s.metaDescription),
    ogImageUrl: str(s.ogImageUrl),
    keywords: str(s.keywords),
    smtpHost: str(s.smtpHost),
    smtpPort: numStr(s.smtpPort),
    smtpUser: str(s.smtpUser),
    mailFrom: str(s.mailFrom),
    mailToAdmin: str(s.mailToAdmin),
    heroImageUrl: str(s.heroImageUrl),
    homeGalleryCategoryId: str(s.homeGalleryCategoryId),
    customCursor: s.customCursor,
    cursorStyle: s.cursorStyle,
    mobileNavAdmin: s.mobileNavAdmin,
    mobileNavPanel: s.mobileNavPanel,
  };

  return (
    <>
      <ViewHeader title="Ayarlar" subtitle="Kulüp, SEO, e-posta ve görünüm ayarlarını buradan yönetin" />
      <SettingsForm
        initial={initial}
        smtpPassSet={!!s.smtpPass}
        mediaCategories={categories}
        mediaAssets={assets}
        homeGalleryFeaturedUrl={str(s.homeGalleryFeaturedUrl)}
        heroMobileImageUrl={str(s.heroMobileImageUrl)}
      />
      <RetentionPanel rows={retentionRows} total={retentionTotal} />
    </>
  );
}
