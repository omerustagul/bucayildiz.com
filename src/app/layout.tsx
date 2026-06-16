import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Buca Yıldız Futbol Akademisi",
    template: "%s — Buca Yıldız Futbol Akademisi",
  },
  description:
    "Buca Yıldız Futbol Akademisi — İzmir Buca'da disiplin, saygı ve takım ruhuyla genç yetenekleri geliştiren altyapı futbol akademisi.",
  metadataBase: new URL("https://bucayildiz.com"),
  manifest: "/manifest.webmanifest",
  applicationName: "Buca Yıldız",
  appleWebApp: {
    capable: true,
    title: "Buca Yıldız",
    statusBarStyle: "default",
  },
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
    siteName: "Buca Yıldız Futbol Akademisi",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E2148",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${barlow.variable} ${barlowCondensed.variable} ${barlowSemiCondensed.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
