import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  doublePrecision,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const productCategoryEnum = pgEnum("product_category", [
  "cheesecake",
  "bake",
]);

export const heroMediaTypeEnum = pgEnum("hero_media_type", ["none", "image", "video"]);

// Singleton row (id is always "default") holding site-wide, admin-editable
// settings — the homepage hero background media and the header trust tag.
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("default"),
  heroMediaType: heroMediaTypeEnum("hero_media_type").notNull().default("none"),
  heroDesktopUrl: text("hero_desktop_url"),
  heroMobileUrl: text("hero_mobile_url"),
  trustTagText: text("trust_tag_text"),
  trustTagItems: text("trust_tag_items").array().notNull().default([]),
  defaultHighlights: text("default_highlights")
    .array()
    .notNull()
    .default(["Made fresh to order, never frozen", "No artificial preservatives", "Boxed by hand, ready to gift"]),
  // superseded by heroBgLines (kept, unused, to avoid an ambiguous rename migration)
  heroBgText: text("hero_bg_text").notNull().default("Slice of Happiness"),
  heroBgLines: text("hero_bg_lines")
    .array()
    .notNull()
    .default(["Slice of Happiness", "Slice of Happiness", "Slice of Happiness"]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: productCategoryEnum("category").notNull(),
  kicker: text("kicker"),
  priceLabel: text("price_label").notNull(),
  description: text("description").notNull(),
  highlights: text("highlights").array().notNull().default([]),

  // asset urls (R2-hosted); nullable until real photos are shot
  imageTopUrl: text("image_top_url"),
  imageSideUrl: text("image_side_url"),
  imageThreeQuarterUrl: text("image_three_quarter_url"),
  transitionVideoUrl: text("transition_video_url"),

  // fallback color swatch for mockup-style rendering before photos exist
  colorFrom: text("color_from"),
  colorTo: text("color_to"),

  sortOrder: integer("sort_order").notNull().default(0),
  wheelSortOrder: integer("wheel_sort_order").notNull().default(0),
  isFeaturedOnWheel: boolean("is_featured_on_wheel").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const stores = pgTable(
  "stores",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    addressLine: text("address_line").notNull(),
    city: text("city").notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    googleMapsUrl: text("google_maps_url"),
    isOwnOutlet: boolean("is_own_outlet").notNull().default(false),
    isApproved: boolean("is_approved").notNull().default(false),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("stores_name_address_unique").on(table.name, table.addressLine)]
);

export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull().default("Journal"),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull().default("Team Delice"),
  readMinutes: integer("read_minutes").notNull().default(4),

  coverImageUrl: text("cover_image_url"),
  // fallback gradient swatch for cards/covers before a real photo exists
  colorFrom: text("color_from"),
  colorTo: text("color_to"),

  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  publishedAt: timestamp("published_at").notNull().defaultNow(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ugcVideos = pgTable(
  "ugc_videos",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    handle: text("handle").notNull(),
    caption: text("caption").notNull(),
    videoUrl: text("video_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    soundLabel: text("sound_label").default("Original audio"),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("ugc_videos_handle_caption_unique").on(table.handle, table.caption)]
);

// Temporary media store: holds uploaded file bytes in Neon until R2 is
// configured. `/api/media/[id]` serves them; admin upload writes here when
// R2 env vars are absent. Swapping to R2 later needs no changes to the
// upload UI — only `src/lib/media-storage.ts`'s branch changes.
export const mediaBlobs = pgTable("media_blobs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  contentType: text("content_type").notNull(),
  dataBase64: text("data_base64").notNull(),
  fileName: text("file_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
export type UgcVideo = typeof ugcVideos.$inferSelect;
export type NewUgcVideo = typeof ugcVideos.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type MediaBlob = typeof mediaBlobs.$inferSelect;
