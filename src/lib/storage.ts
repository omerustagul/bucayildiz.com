import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Dosya depolama soyutlaması.
 * - S3_* env değişkenleri tanımlıysa: S3-uyumlu object storage (PROD, Türkiye'de
 *   bir sağlayıcı — Turkcell Object Storage, MinIO, vb.).
 * - Aksi halde: yerel dosya sistemi (DEV — public/uploads).
 * Çağıran kod (api/upload) değişmez; yalnızca bu modül ortamı algılar.
 */

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO = ["video/mp4", "video/webm"];
const ALLOWED_DOCUMENT = ["application/pdf"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB girdi (sharp ile WebP'ye sıkıştırılıp küçülür)
const MAX_VIDEO_BYTES = 30 * 1024 * 1024; // 30 MB (kısa kapak videosu)
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10 MB (CV / PDF)
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Dosyanın GERÇEK içeriğini (magic-byte) inceler — istemci MIME'ına güvenmez.
 * Sahte "image/png" başlığıyla SVG/HTML/script yüklenip aynı origin'den servis
 * edilmesini (stored-XSS) engeller. Tanınmazsa null döner.
 */
function sniffImage(buf: Buffer): { type: string; ext: string } | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { type: "image/jpeg", ext: "jpg" };
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return { type: "image/png", ext: "png" };
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return { type: "image/gif", ext: "gif" };
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  )
    return { type: "image/webp", ext: "webp" };
  return null;
}

/**
 * Video magic-byte doğrulaması — istemci MIME'ına güvenmez. MP4 (offset 4'te
 * "ftyp" kutusu) ve WebM/Matroska (EBML başlığı) tanınır; aksi halde null.
 */
export function sniffVideo(buf: Buffer): { type: string; ext: string } | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return { type: "video/webm", ext: "webm" };
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) return { type: "video/mp4", ext: "mp4" };
  return null;
}

/**
 * PDF magic-byte doğrulaması — istemci MIME'ına güvenmez. "%PDF-" (25 50 44 46 2D)
 * imzası aranır; aksi halde null. CV yüklemesi (iş başvurusu) yalnız gerçek PDF kabul eder.
 */
export function sniffDocument(buf: Buffer): { type: string; ext: string } | null {
  if (buf.length < 5) return null;
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46 && buf[4] === 0x2d) return { type: "application/pdf", ext: "pdf" };
  return null;
}

function s3Config() {
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!bucket || !accessKeyId || !secretAccessKey) return null;
  return {
    bucket,
    accessKeyId,
    secretAccessKey,
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined, // S3-uyumlu sağlayıcılar için
    publicBase: process.env.S3_PUBLIC_BASE_URL || undefined, // CDN/public URL kökü
  };
}

/** Yapılandırılmış S3 public taban URL'leri (varsa) — isOwnStorageUrl için. */
function storageBases(): string[] {
  const cfg = s3Config();
  if (!cfg) return [];
  const bases: string[] = [];
  if (cfg.publicBase) bases.push(cfg.publicBase.replace(/\/$/, ""));
  if (cfg.endpoint) bases.push(`${cfg.endpoint.replace(/\/$/, "")}/${cfg.bucket}`);
  bases.push(`https://${cfg.bucket}.s3.${cfg.region}.amazonaws.com`);
  return bases;
}

/**
 * Bir URL BİZİM depolama alanımıza mı ait? Yerel `/uploads/...` VEYA yapılandırılmış
 * S3 public tabanı altında olmalı. Keyfi harici `http(s)://...` adreslerini reddeder
 * (tracking-pixel / SSRF-lite riski). Kullanıcının verdiği tüm foto/dosya URL'leri
 * DB'ye yazılmadan önce bu kapıdan geçer — çünkü sonradan <img src>/<a href> olur.
 */
export function isOwnStorageUrl(url: string): boolean {
  const u = url.trim();
  if (u.startsWith("/uploads/")) return true;
  return storageBases().some((b) => u === b || u.startsWith(b + "/"));
}

async function saveToS3(
  buffer: Buffer,
  filename: string,
  contentType: string,
  cfg: NonNullable<ReturnType<typeof s3Config>>,
): Promise<{ url: string }> {
  // Dinamik import: S3 istemcisi yalnızca yapılandırıldığında yüklenir.
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const client = new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,
    forcePathStyle: Boolean(cfg.endpoint), // MinIO/uyumlu sağlayıcılar için
    credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
  });
  const key = `uploads/${filename}`;
  try {
    await client.send(new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: buffer, ContentType: contentType }));
  } catch (e) {
    console.error("[storage] S3 yükleme hatası:", e);
    throw new Error("Dosya yüklenemedi (depolama hatası). Lütfen tekrar deneyin.");
  }

  if (cfg.publicBase) return { url: `${cfg.publicBase.replace(/\/$/, "")}/${key}` };
  if (cfg.endpoint) return { url: `${cfg.endpoint.replace(/\/$/, "")}/${cfg.bucket}/${key}` };
  return { url: `https://${cfg.bucket}.s3.${cfg.region}.amazonaws.com/${key}` };
}

export async function saveUpload(file: File, opts: { kind?: "image" | "video" | "document" } = {}): Promise<{ url: string }> {
  // Video/belge modu yalnızca açıkça istenirse; varsayılan GÖRSEL (medya kütüphanesi,
  // avatar vb. görsel-only + 5MB kalır — sertleştirme değişmez). Belge = CV (PDF).
  const kind = opts.kind ?? "image";
  const allowed = kind === "video" ? ALLOWED_VIDEO : kind === "document" ? ALLOWED_DOCUMENT : ALLOWED_IMAGE;
  const maxBytes = kind === "video" ? MAX_VIDEO_BYTES : kind === "document" ? MAX_DOCUMENT_BYTES : MAX_IMAGE_BYTES;

  if (!allowed.includes(file.type)) {
    throw new Error(
      kind === "video" ? "Yalnızca MP4 veya WebM video yükleyebilirsiniz."
        : kind === "document" ? "Yalnızca PDF belge yükleyebilirsiniz."
          : "Yalnızca JPG, PNG, WEBP veya GIF yükleyebilirsiniz.",
    );
  }
  if (file.size > maxBytes) {
    throw new Error(
      kind === "video" ? "Video boyutu 30 MB'ı aşamaz."
        : kind === "document" ? "Belge boyutu 10 MB'ı aşamaz."
          : "Görsel boyutu 10 MB'ı aşamaz.",
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // İçerik imzası doğrulaması — istemci MIME'ına güvenme (HER dosya için).
  const sniffed = kind === "video" ? sniffVideo(buffer) : kind === "document" ? sniffDocument(buffer) : sniffImage(buffer);
  if (!sniffed) {
    throw new Error(
      kind === "video" ? "Geçersiz veya bozuk video dosyası (yalnızca gerçek MP4/WebM)."
        : kind === "document" ? "Geçersiz veya bozuk PDF dosyası (yalnızca gerçek PDF)."
          : "Geçersiz veya bozuk görsel dosyası (yalnızca gerçek JPG/PNG/WEBP/GIF).",
    );
  }
  // Görsel sıkıştırma (SSD verimi): GIF HARİÇ (animasyon korunur) tüm görseller
  // sharp ile EXIF-döndürülür, en fazla 2000px'e sığdırılır (oran korunur,
  // büyütülmez) ve WebP q80'e çevrilir → depolanan dosya çok küçülür. Video/belge
  // dokunulmaz (kullanıcı kararı: video sıkıştırılmaz, 30MB sınır + uyarı). Sharp
  // herhangi bir sebeple başarısız olursa ORİJİNAL kaydedilir — yükleme bozulmaz.
  let out = buffer;
  let outExt = sniffed.ext;
  let outType = sniffed.type;
  if (kind === "image" && sniffed.ext !== "gif") {
    try {
      const sharp = (await import("sharp")).default;
      out = await sharp(buffer)
        .rotate() // EXIF oryantasyonunu piksele uygula (telefon fotoğrafları)
        .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      outExt = "webp";
      outType = "image/webp";
    } catch (e) {
      console.error("[storage] görsel sıkıştırma başarısız, orijinal kaydediliyor:", e);
    }
  }

  const filename = `${Date.now()}-${crypto.randomUUID()}.${outExt}`;

  const cfg = s3Config();
  if (cfg) return saveToS3(out, filename, outType, cfg);

  // Yerel disk (DEV)
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), out);
  return { url: `/uploads/${filename}` };
}
