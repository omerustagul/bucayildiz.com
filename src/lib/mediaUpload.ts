/** Çoklu medya yükleme akışı — istemci-güvenli, framework'süz (test edilebilir).
 *
 *  KRİTİK: her dosya AYRI AYRI yüklenir; böylece /api/upload'un dosya-başı
 *  doğrulaması (magic-byte + 5MB + kullanıcı-başı rate-limit) HER dosyaya
 *  uygulanır — "sadece ilki" değil. Kısmi başarı: bir dosya reddedilse de
 *  diğerleri yüklenir; reddedilenler sebebiyle raporlanır. */

export type UploadStep = (file: File) => Promise<{ ok: true; url: string } | { ok: false; reason: string }>;
export type CreateStep = (url: string, file: File) => Promise<{ ok: true } | { ok: false; reason: string }>;

export type UploadOutcome = {
  okCount: number;
  failed: { name: string; reason: string }[];
};

/**
 * `files`'ı tek tek `up` (yükleme) → `create` (kayıt) adımlarından geçirir.
 * Her adım enjekte edilir (test kolaylığı + /api/upload sertleştirmesini
 * baypas etmemek: gerçek çağrıcı `up` içinde tek dosyalık POST atar).
 */
export async function uploadFiles(files: File[], up: UploadStep, create: CreateStep): Promise<UploadOutcome> {
  const failed: { name: string; reason: string }[] = [];
  let okCount = 0;
  for (const file of files) {
    const uploaded = await up(file);
    if (!uploaded.ok) {
      failed.push({ name: file.name, reason: uploaded.reason });
      continue;
    }
    const created = await create(uploaded.url, file);
    if (!created.ok) {
      failed.push({ name: file.name, reason: created.reason });
      continue;
    }
    okCount++;
  }
  return { okCount, failed };
}
