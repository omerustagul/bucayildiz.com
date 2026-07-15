import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev'de ağ üzerinden erişim (telefon vb.) için izinli origin'ler.
  // IP DHCP ile değişse de bozulmasın diye yaygın yerel ağ aralıkları wildcard ile
  // (her oktet için "*"). Yalnız geliştirme sunucusunu etkiler.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],

  // Near-zero-downtime deploy: derleme çıktısı env ile ayrı bir klasöre
  // ("staging") yönlendirilebilir. deploy.sh önce `.next-build`e derler (canlı
  // `.next` bu sırada eski build'i sunmaya devam eder), sonra atomik takas yapıp
  // pm2'yi yeniden başlatır. `next start` env'siz çalışır → varsayılan `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  images: {
    // Modern formatlar — yerel /uploads dahil TÜM next/image çıktısı için (perf/LCP).
    formats: ["image/avif", "image/webp"],
    // S3/CDN'e geçilince (S3_PUBLIC_BASE_URL / S3_ENDPOINT dolunca) depolama absolute
    // URL döner → next/image remote host'u yoksa reddeder. Host'u env'den TÜRET, izinle.
    // Şu an env boş → dizi boş (yerel /uploads same-origin, remote gerekmez).
    remotePatterns: [process.env.S3_PUBLIC_BASE_URL, process.env.S3_ENDPOINT]
      .filter((v): v is string => !!v && /^https?:\/\//.test(v))
      .map((v) => {
        const u = new URL(v);
        return { protocol: u.protocol.replace(":", "") as "http" | "https", hostname: u.hostname };
      }),
  },
};

export default nextConfig;
