import Link from "next/link";
import { getAllProducts, getApprovedStores, getPublishedVideos, getAllBlogPosts } from "@/db/queries";

export default async function AdminDashboard() {
  const [products, stores, videos, posts] = await Promise.all([
    getAllProducts(),
    getApprovedStores(),
    getPublishedVideos(),
    getAllBlogPosts(),
  ]);

  const cards = [
    {
      label: "Products",
      count: products.length,
      href: "/admin/products",
      icon: <path d="M3 7l9-4 9 4-9 4-9-4Zm0 5l9 4 9-4M3 17l9 4 9-4" strokeLinejoin="round" />,
    },
    {
      label: "Stores",
      count: stores.length,
      href: "/admin/stores",
      icon: (
        <>
          <path d="M4 10v10h16V10" />
          <path d="M2 10l2-6h16l2 6" />
          <path d="M9 20v-6h6v6" />
        </>
      ),
    },
    {
      label: "Videos",
      count: videos.length,
      href: "/admin/videos",
      icon: (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M10 9l5 3-5 3V9Z" />
        </>
      ),
    },
    {
      label: "Blog posts",
      count: posts.length,
      href: "/admin/blog",
      icon: (
        <>
          <path d="M4 19.5V5.5A2.5 2.5 0 0 1 6.5 3H19v16.5" />
          <path d="M6.5 21H19v-2H6.5a1.5 1.5 0 0 0 0 3Z" />
        </>
      ),
    },
  ];

  const recentProducts = [...products]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-editorial text-2xl text-ac-primary">Dashboard</h1>
        <p className="mt-1 font-humanist text-sm text-ac-on-surface-variant">
          A quick look at everything live on the site.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group bg-ac-surface-container-lowest border border-ac-border-hairline rounded-2xl p-5 flex flex-col gap-4 shadow-ac-card hover:-translate-y-0.5 hover:shadow-ac-pop transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-ac-maroon/8 text-ac-maroon flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="w-5 h-5">
                {c.icon}
              </svg>
            </div>
            <div>
              <div className="font-editorial text-3xl text-ac-primary">{c.count}</div>
              <div className="font-humanist text-sm text-ac-on-surface-variant mt-0.5">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-ac-surface-container-lowest border border-ac-border-hairline rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-ac-border-hairline flex items-center justify-between">
          <h2 className="font-editorial text-lg text-ac-primary">Recently added products</h2>
          <Link href="/admin/products" className="font-humanist text-sm text-ac-secondary hover:text-ac-cocoa transition-colors">
            View all →
          </Link>
        </div>
        {recentProducts.length === 0 ? (
          <div className="px-5 py-10 text-center font-humanist text-sm text-ac-on-surface-variant">
            No products yet.
          </div>
        ) : (
          <div className="divide-y divide-ac-border-hairline">
            {recentProducts.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-ac-surface-container-low/60 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-humanist text-sm font-medium text-ac-primary truncate">{p.name}</div>
                  <div className="font-humanist text-[12px] text-ac-on-surface-variant mt-0.5">
                    {p.category} · {p.priceLabel}
                  </div>
                </div>
                <span
                  className={`font-humanist text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                    p.isPublished ? "bg-ac-sage/20 text-ac-on-sage" : "bg-ac-surface-container text-ac-on-surface-variant"
                  }`}
                >
                  {p.isPublished ? "Published" : "Hidden"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
