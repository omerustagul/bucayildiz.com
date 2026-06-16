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

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const extByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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
  await client.send(new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: buffer, ContentType: contentType }));

  if (cfg.publicBase) return { url: `${cfg.publicBase.replace(/\/$/, "")}/${key}` };
  if (cfg.endpoint) return { url: `${cfg.endpoint.replace(/\/$/, "")}/${cfg.bucket}/${key}` };
  return { url: `https://${cfg.bucket}.s3.${cfg.region}.amazonaws.com/${key}` };
}

export async function saveUpload(file: File): Promise<{ url: string }> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Yalnızca JPG, PNG, WEBP veya GIF yükleyebilirsiniz.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Dosya boyutu 5 MB'ı aşamaz.");
  }

  const ext = extByType[file.type] ?? "bin";
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const cfg = s3Config();
  if (cfg) return saveToS3(buffer, filename, file.type, cfg);

  // Yerel disk (DEV)
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return { url: `/uploads/${filename}` };
}
