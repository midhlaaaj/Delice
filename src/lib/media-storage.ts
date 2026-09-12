import { db } from "@/db";
import { mediaBlobs } from "@/db/schema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
  if (r2Configured()) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const key = `${folder}/${Date.now()}-${safeName}`;
    return uploadToR2(file, key);
  }
  return uploadToNeon(file);
}
