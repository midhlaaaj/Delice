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

export async function updateHeroSection(formData: FormData) {
  await requireAdmin();

  const heroMediaType = str(formData, "heroMediaType") as "none" | "image" | "video";
  const heroDesktopUrl = str(formData, "heroDesktopUrl") || null;
  const heroMobileUrl = str(formData, "heroMobileUrl") || null;
  const heroBgLines = [1, 2, 3].map((n) => str(formData, `heroBgLine${n}`) || "Slice of Happiness");
  const trustTagItems = formData
    .getAll("trustTagItems")
    .map((v) => String(v).trim())
    .filter(Boolean);

  const values = {
    heroMediaType,
    heroDesktopUrl,
    heroMobileUrl,
    heroBgLines,
    trustTagItems,
    updatedAt: new Date(),
  };

  await db
    .insert(siteSettings)
    .values({ id: "default", ...values })
    .onConflictDoUpdate({ target: siteSettings.id, set: values });

  revalidatePath("/");
  revalidatePath("/admin/hero");
  redirect("/admin/hero");
}
