import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import { getSettings } from "@/lib/settings";
import { resolveSocialLinks } from "@/lib/social";
import { prisma } from "@/lib/prisma";

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
  // Takımlar mega-menüsü DB'den beslenir — slug'lar elle yazılınca (u18) gerçek
  // slug'dan (u-18) kayıyordu; tek kaynak Team.slug. `sort` admin sıralamasını korur.
  const teams = await prisma.team.findMany({ orderBy: { sort: "asc" }, select: { slug: true, name: true } });
  return (
    <>
      <SiteHeader socials={socials} logoUrl={settings.logoUrl} teams={teams} />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter socials={socials} logoUrl={settings.logoUrl} address={settings.address} phone={settings.phone} />
    </>
  );
}
