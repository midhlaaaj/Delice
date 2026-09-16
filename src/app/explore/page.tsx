import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { getAllProducts } from "@/db/queries";

export const metadata = {
  title: "Full Catalogue — Delice",
  description: "Every Delice cheesecake and bake, in one place.",
};

export default async function ExploreAllPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getAllProducts();
  const filtered = category ? products.filter((p) => p.category === category) : products;

  return (
    <>
      <SiteHeader />
      <section className="w-full pt-32 pb-20 max-w-[1160px] mx-auto px-6">
        <div className="max-w-[560px] mb-9">
          <h1 className="font-editorial text-ac-primary text-[clamp(28px,4vw,38px)]">Full catalogue</h1>
          <p className="mt-3 font-humanist text-[15.5px] leading-relaxed text-ac-on-surface-variant">
            Every cheesecake and bake we make, all in one place.
          </p>
        </div>

        <div className="flex gap-2.5 mb-9">
          {[
            { key: undefined, label: "All" },
            { key: "cheesecake", label: "Cheesecakes" },
            { key: "bake", label: "Bakes" },
          ].map((f) => (
            <Link
              key={f.label}
              href={f.key ? `/explore?category=${f.key}` : "/explore"}
              className={`font-humanist text-sm px-4.5 py-2 rounded-full border transition-colors ${
                (category ?? undefined) === f.key
                  ? "bg-ac-primary text-ac-on-primary border-ac-primary"
                  : "border-ac-border-hairline text-ac-on-surface-variant hover:text-ac-on-surface"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing here yet"
            description="We don't have any flavors in this category right now — check back soon or browse everything we make."
            cta={{ label: "View all flavors", href: "/explore" }}
          />
        )}
      </section>
      <SiteFooter />
    </>
  );
}
