"use client";

/**
 * Kök (global) hata sınırı — kök layout'un kendisi render sırasında çökerse
 * devreye girer ve KENDİ <html>/<body>'sini kurar. Bu yüzden globals.css/tokenlar
 * ve özel fontlar burada YOKTUR; her şey gömülü (inline) hex + sistem fontuyla
 * yazılır ki en kötü senaryoda bile markalı, bozulmayan bir ekran görünsün.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "40px 20px",
          background: "radial-gradient(120% 120% at 50% 0%, #181547 0%, #0A0927 60%)",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <svg width="76" height="76" viewBox="0 0 72 72" fill="none" aria-hidden="true" style={{ marginBottom: 22 }}>
            <circle cx="36" cy="36" r="34" fill="#0A0927" stroke="#C9A227" strokeWidth="1.5" />
            <path d="M36 15.5l5.4 12.9 14 1.1-10.7 9.2 3.3 13.6-12-7.3-12 7.3 3.3-13.6L14.6 29.5l14-1.1z" fill="#DDBA4E" />
          </svg>
          <div style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "#DDBA4E", fontWeight: 700 }}>
            Buca Yıldız
          </div>
          <h1 style={{ fontSize: 27, fontWeight: 800, margin: "12px 0 0", letterSpacing: "0.01em" }}>
            Beklenmeyen Bir Hata
          </h1>
          <p style={{ color: "#B3B7D5", fontSize: 15.5, lineHeight: 1.6, margin: "12px auto 26px", maxWidth: 380 }}>
            Sistemde geçici bir sorun oluştu. Lütfen sayfayı yeniden yükleyin;
            sorun sürerse birkaç dakika sonra tekrar deneyin.
          </p>
          {error?.digest && (
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#8284BF", marginBottom: 24 }}>
              Hata kodu: {error.digest}
            </div>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              font: "inherit",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#0A0927",
              background: "linear-gradient(180deg, #E9CE79, #C9A227)",
              border: "1px solid #A8841F",
              borderRadius: 8,
              padding: "13px 26px",
              cursor: "pointer",
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
