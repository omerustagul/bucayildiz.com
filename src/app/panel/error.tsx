"use client";

import { SegmentError } from "@/components/ui/SegmentError";

/**
 * Sporcu/veli panel segment hata sınırı. PanelShell İÇİNDE render olur (alt/yan
 * nav durur); kök `error.tsx` yerine burası devreye girer → bir sayfa/aksiyon
 * hatası tüm uygulamayı blank etmez ve kullanıcı panel bağlamından atılmaz.
 */
export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError error={error} reset={reset} homeHref="/panel" homeLabel="Panele Dön" />;
}
