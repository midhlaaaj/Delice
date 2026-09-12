import type { MetadataRoute } from "next";
import { getAllProducts } from "@/db/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  const products = await getAllProducts();

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/explore`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/videos`, changeFrequency: "daily", priority: 0.6 },
    ...products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
