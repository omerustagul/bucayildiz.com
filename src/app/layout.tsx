import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import { getSettings, activeCursor } from "@/lib/settings";

/* Self-hosted via next/font (no Google Fonts CDN call at runtime).
   CSS variables are consumed by src/styles/tokens/typography.css. */
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  variable: "--font-barlow-semicondensed",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const short = s.clubShortName || "Buca Yıldız";
  const full = s.clubName || "Buca Yıldız Futbol Akademisi";
  const title = s.metaTitle || full;
  const description =
    s.metaDescription ||
    "Buca Yıldız Futbol Akademisi — İzmir Buca'da disiplin, saygı ve takım ruhuyla genç yetenekleri geliştiren altyapı futbol akademisi.";

  return {
    title: { default: title, template: `%s — ${short}` },
    description,
    keywords: s.keywords || undefined,
    metadataBase: new URL("https://bucayildiz.com"),
    manifest: "/manifest.webmanifest",
    applicationName: short,
    appleWebApp: { capable: true, title: short, statusBarStyle: "default" },
    other: {
      // Eski iOS sürümlerinin tam-ekran (standalone) açılışı için klasik etiket
      "apple-mobile-web-app-capable": "yes",
    },
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: full,
      images: s.ogImageUrl ? [{ url: s.ogImageUrl }] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0E2148",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      data-cursor={activeCursor(settings)}
      className={`${barlow.variable} ${barlowCondensed.variable} ${barlowSemiCondensed.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
