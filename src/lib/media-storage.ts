import { db } from "@/db";
import { mediaBlobs } from "@/db/schema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200MB

export function validateUpload(file: File): string | null {
  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);
  if (!isImage && !isVideo) {
    return "Unsupported file type. Upload an image (JPEG, PNG, WebP, GIF, AVIF) or video (MP4, WebM, MOV).";
  }
  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    return `File is too large. Max size is ${Math.floor(maxBytes / (1024 * 1024))}MB.`;
  }
  return null;
}

function r2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_BASE_URL
  );
}

async function uploadToR2(file: File, key: string): Promise<string> {
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  const bytes = new Uint8Array(await file.arrayBuffer());
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: bytes,
      ContentType: file.type,
    })
  );
  return `${process.env.R2_PUBLIC_BASE_URL}/${key}`;
}

async function uploadToNeon(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const [row] = await db
    .insert(mediaBlobs)
    .values({
      contentType: file.type,
      dataBase64: bytes.toString("base64"),
      fileName: file.name,
    })
    .returning({ id: mediaBlobs.id });

  return `/api/media/${row.id}`;
}

/**
 * Stores an uploaded file and returns its public URL. Uses R2 when
 * configured, otherwise falls back to storing bytes in Neon (dev/temporary
 * path) — callers never need to know which backend served the request.
 */
export async function storeUploadedFile(file: File, folder: string): Promise<string> {
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "-").replace(/\.\.+/g, "-").replace(/^\/+/, "") || "uploads";
  if (r2Configured()) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const key = `${safeFolder}/${Date.now()}-${safeName}`;
    return uploadToR2(file, key);
  }
  return uploadToNeon(file);
}
