"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertProduct(formData: FormData) {
  await requireAdmin();

  const id = str(formData, "id");
  const values = {
    slug: str(formData, "slug"),
    name: str(formData, "name"),
    category: str(formData, "category") as "cheesecake" | "bake",
    kicker: str(formData, "kicker") || null,
    priceLabel: str(formData, "priceLabel"),
    description: str(formData, "description"),
    colorFrom: str(formData, "colorFrom") || null,
    colorTo: str(formData, "colorTo") || null,
    imageTopUrl: str(formData, "imageTopUrl") || null,
    imageSideUrl: str(formData, "imageSideUrl") || null,
    imageThreeQuarterUrl: str(formData, "imageThreeQuarterUrl") || null,
    transitionVideoUrl: str(formData, "transitionVideoUrl") || null,
    sortOrder: Number(str(formData, "sortOrder") || "0"),
    isFeaturedOnWheel: formData.get("isFeaturedOnWheel") === "on",
    isPublished: formData.get("isPublished") === "on",
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    await db.insert(products).values(values);
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/explore");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/explore");
}
