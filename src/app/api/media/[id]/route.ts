import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mediaBlobs } from "@/db/schema";
import { checkRateLimit, getIpFromHeaders } from "@/lib/rate-limit";

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Generous ceiling: this serves public product/blog/video images, so one
  // shared office/campus IP browsing a gallery can legitimately fire off a
  // lot of requests in a short window (responses are cached immutably after
  // the first load, so repeat views don't add to this).
  const ip = getIpFromHeaders(req.headers);
  const { allowed, retryAfterSeconds } = checkRateLimit(`media:${ip}`, 600, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const { id } = await params;
  const [row] = await db.select().from(mediaBlobs).where(eq(mediaBlobs.id, id)).limit(1);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Uploads are validated at write time, but this double-checks the stored
  // content type is one we intend to serve — old rows or a direct DB write
  // can't turn this route into an HTML/SVG-hosting (stored XSS) vector.
  if (!ALLOWED_CONTENT_TYPES.has(row.contentType)) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }

  const bytes = Buffer.from(row.dataBase64, "base64");
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": row.contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
