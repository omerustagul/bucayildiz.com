import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Sayfa Bulunamadı" };

/** Marka amblemi (yıldız) — dış görsele bağımlı değil; hata sayfası her koşulda
 *  kendi kendine yeter (görsel yüklenemese bile bozulmaz). */
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

/** 404 — kök layout içinde render olur (fontlar + tokenlar mevcut). */
export default function NotFound() {
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
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(72px, 22vw, 104px)",
            lineHeight: 0.9,
            color: "var(--gold-500)",
            letterSpacing: "0.02em",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(24px, 6vw, 32px)",
            textTransform: "uppercase",
            color: "var(--text-strong)",
            margin: "8px 0 0",
            letterSpacing: "0.01em",
          }}
        >
          Sayfa Bulunamadı
        </h1>
        <p style={{ color: "var(--ink-500)", fontSize: 15.5, lineHeight: 1.6, margin: "12px auto 28px", maxWidth: 380 }}>
          Aradığınız sayfa taşınmış, adı değişmiş veya hiç var olmamış olabilir.
          Ana sayfadan devam edebilirsiniz.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Button as="a" href="/" variant="primary" size="lg">
            Ana Sayfaya Dön
          </Button>
          <Button as="a" href="/iletisim" variant="secondary" size="lg">
            İletişim
          </Button>
        </div>
      </div>
    </main>
  );
}
