"use client";

import { useEffect } from "react";

/** Overlay (Drawer/Modal/Sheet/Popover-sheet) için Escape ile kapatma +
 *  arka plan scroll kilidi. Tek kaynak — kopyalamayın, buradan import edin. */
export function useOverlayDismiss(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}
