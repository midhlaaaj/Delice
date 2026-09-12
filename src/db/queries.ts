import { db } from "./index";
import { products, stores, ugcVideos, siteSettings } from "./schema";
import { asc, desc, eq } from "drizzle-orm";

export async function getWheelProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.isFeaturedOnWheel, true))
    .orderBy(asc(products.sortOrder));
}

export async function getBakeProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.category, "bake"))
    .orderBy(asc(products.sortOrder));
}

export async function getAllProducts() {
  return db.select().from(products).where(eq(products.isPublished, true)).orderBy(asc(products.sortOrder));
}

export async function getLatestProducts(limit: number) {
  return db
    .select()
    .from(products)
    .where(eq(products.isPublished, true))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getProductBySlug(slug: string) {
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return product ?? null;
}

export async function getOtherProducts(excludeSlug: string) {
  const all = await getAllProducts();
  return all.filter((p) => p.slug !== excludeSlug);
}

export async function getApprovedStores() {
  return db.select().from(stores).where(eq(stores.isApproved, true)).orderBy(asc(stores.name));
}

export async function getPublishedVideos() {
  return db
    .select()
    .from(ugcVideos)
    .where(eq(ugcVideos.isPublished, true))
    .orderBy(asc(ugcVideos.sortOrder));
}

export async function getSiteSettings() {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, "default")).limit(1);
  return (
    row ?? {
      id: "default",
      heroMediaType: "none" as const,
      heroDesktopUrl: null,
      heroMobileUrl: null,
      trustTagText: null,
      updatedAt: new Date(),
    }
  );
}
