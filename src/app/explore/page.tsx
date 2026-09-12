import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductVisual } from "@/components/cake-visuals";
import { getAllProducts } from "@/db/queries";

export const metadata = {
  title: "Full Catalogue — Delice",
  description: "Every Delice cheesecake and bake, in one place.",
};

const CARD_PASTELS = ["bg-blush/30", "bg-orange/25", "bg-sage/25", "bg-rose/25"];

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

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden bg-ac-surface-container-lowest shadow-[0_14px_28px_-18px_rgba(58,15,22,.35)] hover:shadow-[0_18px_32px_-16px_rgba(58,15,22,.4)] transition-shadow"
            >
              <div
                className={`relative flex-none aspect-[4/3] flex items-center justify-center ${CARD_PASTELS[i % CARD_PASTELS.length]}`}
              >
                <ProductVisual
                  product={p}
                  imageUrl={p.imageThreeQuarterUrl}
                  className="w-[78%] h-[78%] group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-editorial text-[17px] text-ac-primary leading-tight">{p.name}</h3>
                <p className="mt-1 font-humanist text-[12px] text-ac-on-surface-variant leading-snug line-clamp-1">
                  {p.description}
                </p>
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-ac-border-hairline">
                  <span className="font-editorial text-[16px] font-bold text-ac-primary">
                    {p.priceLabel}
                  </span>
                  <span className="font-humanist text-xs text-ac-secondary group-hover:translate-x-0.5 transition-transform">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
