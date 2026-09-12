import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { storeUploadedFile } from "@/lib/media-storage";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "uploads");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const publicUrl = await storeUploadedFile(file, folder);
  return NextResponse.json({ publicUrl });
}
