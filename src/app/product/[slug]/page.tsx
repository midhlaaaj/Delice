import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getOtherProducts, getAllProducts } from "@/db/queries";
import { ProductVisual } from "@/components/cake-visuals";
import { ProductGallery } from "@/components/product-gallery";
import { buildGalleryItems } from "@/lib/product-gallery";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Delice`,
    description: product.description,
  };
}

const BOX_INFO: Record<string, string> = {
  cheesecake: "Whole box · 6 slices · Keep refrigerated",
  bake: "Whole loaf · Serves 6–8 · Keep refrigerated",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const others = await getOtherProducts(slug);
  const galleryItems = buildGalleryItems(product);

  return (
    <>
      <SiteHeader />

      <div className="w-full max-w-[1160px] mx-auto px-6 pt-24 md:pt-32 pb-20">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 font-humanist text-sm text-ac-on-surface-variant hover:text-ac-on-surface transition-colors mb-6 md:mb-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Back to catalogue
        </Link>

        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] lg:gap-16">
          <ProductGallery items={galleryItems} />

          <div className="md:sticky md:top-28 md:self-start">
            <div className="font-humanist text-xs uppercase tracking-widest text-ac-secondary font-semibold mb-2">
              {product.kicker}
            </div>
            <h1 className="font-editorial text-ac-primary text-[clamp(30px,4vw,44px)] leading-[1.05]">
              {product.name}
            </h1>
            <div className="inline-block mt-4 font-editorial text-[15px] font-bold text-ac-primary border border-ac-border-hairline px-4.5 py-2 rounded-full">
              {product.priceLabel}
            </div>
            <p className="mt-5 font-humanist text-[15.5px] leading-relaxed text-ac-on-surface-variant max-w-[440px]">
              {product.description}
            </p>

            <div className="mt-5 font-humanist text-[13px] text-ac-on-surface-variant flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 shrink-0">
                <rect x="3" y="7" width="18" height="14" rx="2" />
                <path d="M3 7l9-4 9 4" />
              </svg>
              {BOX_INFO[product.category] ?? BOX_INFO.cheesecake}
            </div>

            <div className="flex gap-3 mt-7 flex-wrap">
              <Link
                href="/stores"
                className="bg-ac-primary text-ac-on-primary hover:bg-ac-secondary rounded-full px-6.5 py-3.5 font-humanist text-[14.5px] transition-colors"
              >
                Find near you
              </Link>
              <Link
                href="/explore"
                className="bg-ac-surface-container-lowest text-ac-primary border border-ac-border-hairline hover:bg-ac-surface-container rounded-full px-6.5 py-3.5 font-humanist text-[14.5px] transition-colors"
              >
                Back to all products
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-ac-border-hairline">
              <h2 className="font-humanist text-[13px] tracking-wide text-ac-on-surface-variant mb-4">
                WHY YOU&apos;LL LOVE IT
              </h2>
              <ul className="grid gap-3.5 font-humanist text-[14.5px] text-ac-on-surface-variant">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-ac-secondary shrink-0" />
                  Made fresh to order, never frozen
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-ac-secondary shrink-0" />
                  No artificial preservatives
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-ac-secondary shrink-0" />
                  Boxed by hand, ready to gift
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-20">
          <h2 className="font-editorial text-xl text-ac-primary mb-4.5">Explore other flavors</h2>
          <div className="flex gap-3.5 overflow-x-auto pb-2 [scrollbar-width:none]">
            {others.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="flex-none w-[130px] text-center group">
                <div className="rounded-2xl bg-ac-surface-container-low flex items-center justify-center w-22 h-19.5 mx-auto mb-2.5 overflow-hidden">
                  <ProductVisual
                    product={p}
                    imageUrl={p.imageThreeQuarterUrl}
                    className="w-[70%] h-[70%] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="font-humanist text-[12.5px] text-ac-on-surface-variant">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
