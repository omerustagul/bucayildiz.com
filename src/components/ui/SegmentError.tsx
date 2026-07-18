"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useChunkRecovery } from "@/lib/chunkRecovery";

/** Segment hata amblemi — dış görsele/ikon adına bağımsız (inline SVG). */
function WarnMark() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="25" fill="#FBEBEB" stroke="#D64545" strokeWidth="1.5" />
      <path d="M26 15v14" stroke="#D64545" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="26" cy="36.5" r="2.2" fill="#D64545" />
    </svg>
  );
}

/**
 * Segment (admin/panel) hata sınırı gövdesi. Kök `error.tsx`'ten FARKI: ilgili
 * shell (AdminShell/PanelShell) İÇİNDE render olur — nav/sidebar durur, kullanıcı
 * bağlamdan atılmaz ve hata TÜM uygulamayı blank etmez. `reset()` yalnız bu
 * segmenti yeniden dener; ayrıca rota değişince Next.js sınırı OTOMATİK sıfırlar
 * → hızlı-navigasyon sırasında oluşan geçici hatalar kendiliğinden iyileşir.
 */
export function SegmentError({
  error,
  reset,
  homeHref,
  homeLabel,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref: string;
  homeLabel: string;
}) {
  const recovering = useChunkRecovery(error);
  useEffect(() => {
    // Üretimde `digest` ile sunucu loglarından izlenir; geliştirmede konsola düşer.
    console.error("[segment-error]", error);
  }, [error]);

  // Bayat-chunk/deploy sürüm-kaymasıysa sessizce yenile (kullanıcı hata görmez).
  if (recovering) return null;

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", padding: "40px 20px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          textAlign: "center",
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 28px",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <WarnMark />
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 21, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>
          Bir Şeyler Ters Gitti
        </h2>
        <p style={{ color: "var(--ink-500)", fontSize: 14.5, lineHeight: 1.6, margin: "10px auto 22px", maxWidth: 380 }}>
          Bu bölüm yüklenirken beklenmeyen bir hata oluştu. Tekrar deneyebilirsiniz;
          sorun sürerse birkaç saniye sonra yeniden deneyin.
        </p>
        {error?.digest && (
          <div
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 11.5,
              color: "var(--ink-400)",
              background: "var(--ink-100)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              padding: "4px 9px",
              marginBottom: 20,
            }}
          >
            Hata kodu: {error.digest}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Button onClick={reset} variant="primary" size="md">
            Tekrar Dene
          </Button>
          <Button as="a" href={homeHref} variant="secondary" size="md">
            {homeLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
