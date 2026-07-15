"use client";

import { useEffect, useRef } from "react";

/**
 * Anasayfa medya şeridi kapak videosu — EKRAN DIŞINDAYKEN duraklatılır.
 *
 * Neden: `autoPlay loop` videolar görünmez olunca da oynamaya/decode etmeye devam
 * ediyordu (yatay şeritte birden çok kapak aynı anda) → boşuna CPU/pil/ısı.
 * IntersectionObserver ile görünürken oynar, çıkınca `pause()`.
 *
 * `autoPlay` KORUNUR: JS/observer yoksa davranış eskisi gibi (zarif düşüş).
 * MediaSection bir server component olduğu için video bu ince client sınırına
 * alındı — kartın geri kalanı sunucuda kalır.
 */
export function CoverVideo({ src, poster, style }: { src: string; poster?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return; // destek yoksa mevcut davranış
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // Tarayıcı reddedebilir (ör. güç tasarrufu) — sessizce yut.
          void el.play().catch(() => { });
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video ref={ref} autoPlay muted loop playsInline preload="metadata" poster={poster} style={style}>
      <source src={src} />
    </video>
  );
}
