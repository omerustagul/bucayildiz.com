import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Buca Yıldız Futbol Akademisi",
    short_name: "Buca Yıldız",
    description: "Buca Yıldız Akademi — kulüp sitesi, yönetim paneli ve sporcu paneli tek uygulamada.",
    start_url: "/giris",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0E2148",
    theme_color: "#0E2148",
    lang: "tr",
    dir: "ltr",
    categories: ["sports", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
