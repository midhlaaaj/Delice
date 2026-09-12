"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ugcVideos } from "@/db/schema";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertVideo(formData: FormData) {
  await requireAdmin();

  const id = str(formData, "id");
  const values = {
    handle: str(formData, "handle"),
    caption: str(formData, "caption"),
    videoUrl: str(formData, "videoUrl"),
    thumbnailUrl: str(formData, "thumbnailUrl") || null,
    soundLabel: str(formData, "soundLabel") || "Original audio",
    sortOrder: Number(str(formData, "sortOrder") || "0"),
    isPublished: formData.get("isPublished") === "on",
  };

  if (id) {
    await db.update(ugcVideos).set(values).where(eq(ugcVideos.id, id));
  } else {
    await db.insert(ugcVideos).values(values);
  }

  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/videos");
  redirect("/admin/videos");
}

export async function deleteVideo(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await db.delete(ugcVideos).where(eq(ugcVideos.id, id));
  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/videos");
}
