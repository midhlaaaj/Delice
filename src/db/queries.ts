import { db } from "./index";
import { products, stores, ugcVideos, siteSettings, blogPosts } from "./schema";
import { asc, desc, eq, ne, and } from "drizzle-orm";

export async function getWheelProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.isFeaturedOnWheel, true))
    .orderBy(asc(products.wheelSortOrder));
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

export async function getPublishedBlogPosts() {
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getAllBlogPosts() {
  return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)))
    .limit(1);
  return post ?? null;
}

export async function getOtherBlogPosts(excludeSlug: string, limit = 3) {
  return db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.isPublished, true), ne(blogPosts.slug, excludeSlug)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
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
      trustTagItems: [],
      heroBgText: "Slice of Happiness",
      heroBgLines: ["Slice of Happiness", "Slice of Happiness", "Slice of Happiness"],
      updatedAt: new Date(),
    }
  );
}
