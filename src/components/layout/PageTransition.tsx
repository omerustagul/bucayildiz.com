"use client";

import { usePathname } from "next/navigation";

/**
 * Sayfa geçiş efekti: rota değiştiğinde içeriğe kısa bir "giriş" animasyonu
 * (fade + hafif yukarı kayma) uygular. `key={pathname}` her gerçek rota
 * değişiminde wrapper'ı yeniden mount ederek CSS animasyonunu tetikler.
 * Navigasyonu BLOKLAMAZ — Next anında geçer, içerik ~0.28sn'de belirir.
 * (router.refresh gibi aynı-rota güncellemelerinde tetiklenmez → titreme yok.)
 */
export function PageTransition({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="by-page-transition" style={style}>
      {children}
    </div>
  );
}
