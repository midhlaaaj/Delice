"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function setWheelMembership(productId: string, onWheel: boolean) {
  await requireAdmin();
  await db.update(products).set({ isFeaturedOnWheel: onWheel }).where(eq(products.id, productId));
  revalidatePath("/admin/wheel");
  revalidatePath("/");
}

export async function reorderWheel(orderedIds: string[]) {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) => db.update(products).set({ wheelSortOrder: index }).where(eq(products.id, id)))
  );
  revalidatePath("/admin/wheel");
  revalidatePath("/");
}
