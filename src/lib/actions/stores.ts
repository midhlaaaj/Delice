"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertStore(formData: FormData) {
  await requireAdmin();

  const id = str(formData, "id");
  const values = {
    name: str(formData, "name"),
    addressLine: str(formData, "addressLine"),
    city: str(formData, "city"),
    lat: Number(str(formData, "lat")),
    lng: Number(str(formData, "lng")),
    googleMapsUrl: str(formData, "googleMapsUrl") || null,
    isOwnOutlet: formData.get("isOwnOutlet") === "on",
    isApproved: formData.get("isApproved") === "on",
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(stores).set(values).where(eq(stores.id, id));
  } else {
    await db.insert(stores).values(values);
  }

  revalidatePath("/admin/stores");
  revalidatePath("/");
  redirect("/admin/stores");
}

export async function deleteStore(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await db.delete(stores).where(eq(stores.id, id));
  revalidatePath("/admin/stores");
  revalidatePath("/");
}
