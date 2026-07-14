"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sayfa geçiş efekti: rota değiştiğinde içeriğe kısa bir "giriş" animasyonu
 * (fade + hafif yukarı kayma) uygular. `key={pathname}` her gerçek rota
 * değişiminde wrapper'ı yeniden mount ederek CSS animasyonunu tetikler.
 * Navigasyonu BLOKLAMAZ — Next anında geçer, içerik ~0.28sn'de belirir.
 * (router.refresh gibi aynı-rota güncellemelerinde tetiklenmez → titreme yok.)
 *
 * Ayrıca her rota değişiminde sayfa EN ÜSTE kaydırılır (masaüstü + mobil). Next'in
 * varsayılan scroll-to-top'u, mobil menü kapanışı + bu wrapper'ın remount'u ile
 * bazı cihazlarda (özellikle iOS Safari) sekteye uğrayıp sayfayı orta/alt konumda
 * bırakabiliyordu; bu açık scrollTo garanti altına alır. Hash (#...) varsa dokunmaz.
 */
export function PageTransition({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const pathname = usePathname();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div key={pathname} className="by-page-transition" style={style}>
      {children}
    </div>
  );
}
