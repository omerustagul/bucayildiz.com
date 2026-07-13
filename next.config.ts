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
};

export default nextConfig;
