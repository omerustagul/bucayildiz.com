import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/layout/PageTransition";

/**
 * Tüm public sayfalar için varsayılan ISR aralığı: admin'de yapılan içerik
 * değişiklikleri (haber, fikstür, forma, medya) en geç 60 sn'de public siteye
 * yansır. Anlık güncelleme için admin action'ları ayrıca revalidatePath çağırır.
 */
export const revalidate = 60;

/** Public website shell — sticky header + footer around every public page. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
    </>
  );
}
