"use client";

import { useEffect, useRef } from "react";

/** Overlay (Drawer/Modal/Sheet) için Escape ile kapatma + arka plan scroll kilidi.
 *  iOS Safari'de `overflow: hidden` dokunmatik kaydırmayı DURDURMAZ; bu yüzden
 *  body `position: fixed` tekniği kullanılır (scroll konumu saklanır ve
 *  kapanışta geri yüklenir). Tek kaynak — kopyalamayın, buradan import edin.
 *
 *  Kilit REFERANS SAYAÇLIDIR: iç içe overlay'lerde (ör. büyük takvim + program
 *  detayı sheet'i) her kancanın kendi "önceki stil" fotoğrafını saklaması,
 *  kapanış sırasına göre gövdeye kilitli hâli geri yazabiliyordu (sayfa donması).
 *  İlk açılış kilitler, son kapanış geri yükler — sıra bağımsız. */

let lockCount = 0;
let saved: {
  scrollY: number;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  overflow: string;
} | null = null;

function acquireScrollLock() {
  lockCount += 1;
  if (lockCount > 1) return; // zaten kilitli — yalnız sayaç artar
  const body = document.body;
  saved = {
    scrollY: window.scrollY,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
  };
  body.style.position = "fixed";
  body.style.top = `-${saved.scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
}

function releaseScrollLock() {
  if (lockCount === 0) return; // eşleşmeyen release'e karşı güvenlik
  lockCount -= 1;
  if (lockCount > 0 || !saved) return; // hâlâ açık overlay var
  const body = document.body;
  body.style.position = saved.position;
  body.style.top = saved.top;
  body.style.left = saved.left;
  body.style.right = saved.right;
  body.style.width = saved.width;
  body.style.overflow = saved.overflow;
  window.scrollTo(0, saved.scrollY);
  saved = null;
}

export function useOverlayDismiss(open: boolean, onClose: () => void) {
  // onClose çoğu çağrıda satır içi ok fonksiyonu (her render'da yeni kimlik).
  // Ref'te tutarak effect'in gereksiz yıkılıp yeniden kurulmasını önleriz —
  // aksi hâlde iç içe kilitlerde save/restore fotoğrafları çaprazlanabiliyor.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    acquireScrollLock();
    return () => {
      document.removeEventListener("keydown", onKey);
      releaseScrollLock();
    };
  }, [open]);
}
