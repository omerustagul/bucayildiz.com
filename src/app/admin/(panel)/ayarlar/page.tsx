import type { Metadata } from "next";
import { ViewHeader } from "@/components/admin/ui";
import { getSettings } from "@/lib/settings";
import { SettingsForm, type SettingsFormValues } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Ayarlar" };

export default async function AyarlarPage() {
  const s = await getSettings();
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
    instagramUrl: str(s.instagramUrl),
    facebookUrl: str(s.facebookUrl),
    youtubeUrl: str(s.youtubeUrl),
    xUrl: str(s.xUrl),
    metaTitle: str(s.metaTitle),
    metaDescription: str(s.metaDescription),
    ogImageUrl: str(s.ogImageUrl),
    keywords: str(s.keywords),
    smtpHost: str(s.smtpHost),
    smtpPort: numStr(s.smtpPort),
    smtpUser: str(s.smtpUser),
    mailFrom: str(s.mailFrom),
    mailToAdmin: str(s.mailToAdmin),
    customCursor: s.customCursor,
    cursorStyle: s.cursorStyle,
    mobileNavAdmin: s.mobileNavAdmin,
    mobileNavPanel: s.mobileNavPanel,
  };

  return (
    <>
      <ViewHeader title="Ayarlar" subtitle="Kulüp, SEO, e-posta ve görünüm ayarlarını buradan yönetin" />
      <SettingsForm initial={initial} smtpPassSet={!!s.smtpPass} />
    </>
  );
}
