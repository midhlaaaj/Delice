"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function updateHeroMedia(formData: FormData) {
  await requireAdmin();

  const heroMediaType = str(formData, "heroMediaType") as "none" | "image" | "video";
  const heroDesktopUrl = str(formData, "heroDesktopUrl") || null;
  const heroMobileUrl = str(formData, "heroMobileUrl") || null;

  await db
    .insert(siteSettings)
    .values({ id: "default", heroMediaType, heroDesktopUrl, heroMobileUrl, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { heroMediaType, heroDesktopUrl, heroMobileUrl, updatedAt: new Date() },
    });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}

export async function updateTrustTag(formData: FormData) {
  await requireAdmin();

  const trustTagText = str(formData, "trustTagText") || null;

  await db
    .insert(siteSettings)
    .values({ id: "default", trustTagText, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { trustTagText, updatedAt: new Date() },
    });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}
