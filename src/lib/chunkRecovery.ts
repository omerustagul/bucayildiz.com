import { useEffect, useState } from "react";

/**
 * Bayat-chunk / deploy sürüm-kayması kurtarma. Zero-downtime deploy'da her sürüm
 * KENDİ chunk'larını üretir; kullanıcının AÇIK (veya mobil Safari'nin cache'lediği)
 * sayfası eski build'in chunk'larını isterken sürüm değişmişse o chunk 404 döner →
 * dinamik import `undefined` bileşene çözülür → React #130 / ChunkLoadError /
 * hydration hatası → kullanıcı "Bir şeyler ters gitti" görür. Çözüm: bunu ALGILA
 * ve sayfayı BİR KEZ yenile (güncel build'i çeker) → kullanıcı hiç fark etmez.
 * Döngü koruması: kısa pencerede zaten yenilediysek ikinci hata GERÇEK arıza
 * sayılır ve normal hata ekranı gösterilir.
 */
const RELOAD_KEY = "by-chunk-reload-at";
const WINDOW_MS = 12000;

export function isChunkError(error?: unknown): boolean {
  const e = error as { name?: string; message?: string } | null | undefined;
  if (!e) return false;
  if (e.name === "ChunkLoadError") return true;
  const msg = e.message ?? "";
  return /Loading chunk|Loading CSS chunk|dynamically imported module|Importing a module script failed|is not a valid JavaScript MIME|Minified React error #(?:130|418|421|422|423|425)|Element type is invalid|Hydration failed|hydrat/i.test(msg);
}

function reloadedRecently(): boolean {
  try {
    return Date.now() - Number(sessionStorage.getItem(RELOAD_KEY) || 0) < WINDOW_MS;
  } catch {
    return false;
  }
}

function triggerReload(): void {
  try {
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    /* yut */
  }
  window.location.reload();
}

/**
 * Hata sınırlarında kullanılır. `error` bayat-chunk'a benziyor ve yakın zamanda
 * yenilenmediyse `recovering=true` döner ve sayfayı yeniler; çağıran bu durumda
 * korkutucu hata UI'ı yerine nötr/boş ekran göstermeli (yenileme anında gelir).
 */
export function useChunkRecovery(error?: unknown): boolean {
  const [recovering] = useState(() => typeof window !== "undefined" && isChunkError(error) && !reloadedRecently());
  useEffect(() => {
    if (recovering) triggerReload();
  }, [recovering]);
  return recovering;
}

/** window 'error' / 'unhandledrejection' için: bayat-chunk ise bir kez yenile
 *  (React sınırına düşmeden — ör. router prefetch sırasında chunk 404). */
export function handleChunkEvent(reason: unknown): void {
  if (typeof window === "undefined" || reloadedRecently() || !isChunkError(reason)) return;
  triggerReload();
}
