import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { storeUploadedFile, validateUpload } from "@/lib/media-storage";
import { checkRateLimit, getIpFromHeaders } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getIpFromHeaders(req.headers);
  const { allowed, retryAfterSeconds } = checkRateLimit(`upload:${ip}`, 60, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please slow down." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "uploads");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const validationError = validateUpload(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 415 });
  }

  const publicUrl = await storeUploadedFile(file, folder);
  return NextResponse.json({ publicUrl });
}
