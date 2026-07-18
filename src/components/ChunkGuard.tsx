"use client";

import { useEffect } from "react";
import { handleChunkEvent } from "@/lib/chunkRecovery";

/**
 * Bayat-chunk nöbetçisi (kök layout'ta). React hata sınırına DÜŞMEDEN oluşan
 * chunk yükleme hatalarını (ör. router prefetch / dinamik import reddi) yakalar
 * ve deploy sürüm-kaymasıysa sayfayı bir kez yeniler. Görsel çıktı yok.
 * Bkz. src/lib/chunkRecovery.ts (döngü koruması orada).
 */
export function ChunkGuard() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => handleChunkEvent(e.error ?? e.message);
    const onRejection = (e: PromiseRejectionEvent) => handleChunkEvent(e.reason);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
