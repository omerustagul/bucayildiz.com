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

  // Build-time TYPE-CHECK atlanır. Deploy'da `next build`'in tip-denetimi fazı,
  // 2-çekirdekli VPS'te canlı cluster worker'larını CPU/bellek açlığına sokup Nginx
  // timeout→502→BAKIM EKRANI yaratıyordu. Zaman-damgalı ölçüm: faz AÇIKken 31/227
  // istek 503; kapatıldıktan sonraki 7 deploy'un HEPSİ 0×503. Build de ~2× hızlandı.
  // Güvenli: type-check commit ÖNCESİ `npm run typecheck` ile ZATEN çalışır (gerçek gate).
  // ⚠️ Tip güvenliği artık pre-commit typecheck'e BAĞLI — deploy öncesi tsc temiz OLMALI.
  //
  // NOT (2026-07-16): burada bir de `eslint: { ignoreDuringBuilds: true }` vardı.
  // Next 16 bu anahtarı DESTEKLEMİYOR ("`eslint` configuration ... is no longer
  // supported" + "Unrecognized key(s): 'eslint'") → hiçbir işe yaramadan her build/dev
  // çıktısını kirletiyordu. Next 16 zaten `next build` içinde ESLint çalıştırmıyor;
  // lint ayrı `npm run lint` ile yapılır. Kaldırıldı.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
