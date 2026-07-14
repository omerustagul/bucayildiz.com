"use client";

import { SegmentError } from "@/components/ui/SegmentError";

/**
 * Admin panel segment hata sınırı. AdminShell İÇİNDE render olur (sol nav durur);
 * kök `error.tsx` yerine burası devreye girer → bir sayfa/aksiyon hatası tüm
 * uygulamayı blank etmez ve kullanıcı admin bağlamından atılmaz.
 */
export default function AdminPanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SegmentError error={error} reset={reset} homeHref="/admin" homeLabel="Panele Dön" />;
}
