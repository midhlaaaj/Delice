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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "product";
  let candidate = root;
  let n = 2;
  while (true) {
    const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.slug, candidate)).limit(1);
    if (!existing) return candidate;
    candidate = `${root}-${n++}`;
  }
}

export async function upsertProduct(formData: FormData) {
  await requireAdmin();

  const id = str(formData, "id");
  const name = str(formData, "name");
  const highlights = formData
    .getAll("highlights")
    .map((v) => String(v).trim())
    .filter(Boolean);
  const values = {
    name,
    category: str(formData, "category") as "cheesecake" | "bake",
    kicker: str(formData, "kicker") || null,
    priceLabel: str(formData, "priceLabel"),
    description: str(formData, "description"),
    highlights,
    colorFrom: str(formData, "colorFrom") || null,
    colorTo: str(formData, "colorTo") || null,
    imageTopUrl: str(formData, "imageTopUrl") || null,
    imageSideUrl: str(formData, "imageSideUrl") || null,
    imageThreeQuarterUrl: str(formData, "imageThreeQuarterUrl") || null,
    transitionVideoUrl: str(formData, "transitionVideoUrl") || null,
    sortOrder: Number(str(formData, "sortOrder") || "0"),
    isPublished: formData.get("isPublished") === "on",
    updatedAt: new Date(),
  };

  if (id) {
    // Slug is intentionally left untouched on edit — renaming a product
    // shouldn't silently break links already pointing at its old URL.
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    const slug = await uniqueSlug(name);
    await db.insert(products).values({ ...values, slug });
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/explore");
  redirect("/admin/products");
}

export async function reorderProducts(orderedIds: string[]) {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) => db.update(products).set({ sortOrder: index }).where(eq(products.id, id)))
  );
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/explore");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/explore");
}
