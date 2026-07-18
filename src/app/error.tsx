"use client";

import { Button } from "@/components/ui/Button";
import { useChunkRecovery } from "@/lib/chunkRecovery";

/** Marka amblemi (yıldız) — dış görsele bağımsız. */
function Emblem() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="34" fill="#100E34" stroke="#C9A227" strokeWidth="1.5" />
      <path
        d="M36 15.5l5.4 12.9 14 1.1-10.7 9.2 3.3 13.6-12-7.3-12 7.3 3.3-13.6L14.6 29.5l14-1.1z"
        fill="#DDBA4E"
      />
    </svg>
  );
}

/** Rota hata sınırı — bir sayfa render'ı sırasında beklenmeyen hata olursa
 *  kök layout İÇİNDE bu gösterilir (fontlar + tokenlar mevcut). `reset()` aynı
 *  rotayı yeniden dener. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Bayat-chunk/deploy sürüm-kaymasıysa sessizce yenile (kullanıcı hata görmez).
  if (useChunkRecovery(error)) return null;
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "48px 20px",
        background: "var(--surface-subtle)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <Emblem />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(26px, 6.5vw, 36px)",
            textTransform: "uppercase",
            color: "var(--text-strong)",
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          Bir Şeyler Ters Gitti
        </h1>
        <p style={{ color: "var(--ink-500)", fontSize: 15.5, lineHeight: 1.6, margin: "12px auto 24px", maxWidth: 400 }}>
          Beklenmeyen bir hata oluştu. Tekrar deneyebilir veya ana sayfaya
          dönebilirsiniz. Sorun sürerse lütfen bizimle iletişime geçin.
        </p>
        {error?.digest && (
          <div
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 12,
              color: "var(--ink-400)",
              background: "var(--ink-100)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              padding: "5px 10px",
              marginBottom: 24,
            }}
          >
            Hata kodu: {error.digest}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Button onClick={reset} variant="primary" size="lg">
            Tekrar Dene
          </Button>
          <Button as="a" href="/" variant="secondary" size="lg">
            Ana Sayfa
          </Button>
        </div>
      </div>
    </main>
  );
}
