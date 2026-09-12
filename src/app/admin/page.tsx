import Link from "next/link";
import { getAllProducts, getApprovedStores, getPublishedVideos } from "@/db/queries";

export default async function AdminDashboard() {
  const [products, stores, videos] = await Promise.all([
    getAllProducts(),
    getApprovedStores(),
    getPublishedVideos(),
  ]);

  const cards = [
    { label: "Products", count: products.length, href: "/admin/products" },
    { label: "Stores", count: stores.length, href: "/admin/stores" },
    { label: "Videos", count: videos.length, href: "/admin/videos" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-plum mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-paper border border-line rounded-2xl p-6 block">
            <div className="text-3xl font-serif text-plum">{c.count}</div>
            <div className="text-sm text-ink/60 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
