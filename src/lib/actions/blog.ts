"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertBlogPost(formData: FormData) {
  await requireAdmin();

  const id = str(formData, "id");
  const values = {
    slug: str(formData, "slug"),
    title: str(formData, "title"),
    category: str(formData, "category") || "Journal",
    excerpt: str(formData, "excerpt"),
    content: str(formData, "content"),
    author: str(formData, "author") || "Team Delice",
    readMinutes: Number(str(formData, "readMinutes") || "4"),
    coverImageUrl: str(formData, "coverImageUrl") || null,
    colorFrom: str(formData, "colorFrom") || null,
    colorTo: str(formData, "colorTo") || null,
    sortOrder: Number(str(formData, "sortOrder") || "0"),
    isPublished: formData.get("isPublished") === "on",
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(blogPosts).set(values).where(eq(blogPosts.id, id));
  } else {
    await db.insert(blogPosts).values(values);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
