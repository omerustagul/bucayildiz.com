import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import { getSettings } from "@/lib/settings";
import { resolveSocialLinks } from "@/lib/social";

/**
 * Tüm public sayfalar için varsayılan ISR aralığı: admin'de yapılan içerik
 * değişiklikleri (haber, fikstür, forma, medya) en geç 60 sn'de public siteye
 * yansır. Anlık güncelleme için admin action'ları ayrıca revalidatePath çağırır.
 */
export const revalidate = 60;

/** Public website shell — sticky header + footer around every public page. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const socials = resolveSocialLinks(settings);
  return (
    <>
      <SiteHeader socials={socials} logoUrl={settings.logoUrl} />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter socials={socials} logoUrl={settings.logoUrl} />
    </>
  );
}
