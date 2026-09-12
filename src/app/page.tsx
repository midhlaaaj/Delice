import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/hero-section";
import { OrbitDial } from "@/components/orbit-dial";
import { ProductCounterGrid } from "@/components/product-counter-grid";
import { StoreLocatorPanel } from "@/components/store-locator-panel";
import { StoreStructuredData } from "@/components/store-schema";
import {
  getWheelProducts,
  getLatestProducts,
  getApprovedStores,
  getPublishedVideos,
  getSiteSettings,
} from "@/db/queries";

export default async function HomePage() {
  const [wheelProducts, latestProducts, stores, videos, heroSettings] = await Promise.all([
    getWheelProducts(),
    getLatestProducts(3),
    getApprovedStores(),
    getPublishedVideos(),
    getSiteSettings(),
  ]);

  const featuredVideos = videos.slice(0, 4);
  const videoGradients = [
    "linear-gradient(160deg,#E3A9B6,#7C4667)",
    "linear-gradient(160deg,#DE8A4C,#5A3222)",
    "linear-gradient(160deg,#8B9B72,#2A1620)",
    "linear-gradient(160deg,#C15D5E,#43223A)",
  ];

  return (
    <>
      <StoreStructuredData stores={stores} />
      <SiteHeader />

      <main className="w-full pt-20 bg-ac-background">
        <HeroSection settings={heroSettings} />

        {/* Orbit Dial */}
        <section
          className="w-full py-14 lg:py-22 bg-gradient-to-b from-ac-surface-container-high/60 via-ac-paper to-ac-surface-container-low border-y border-ac-border-hairline relative overflow-hidden flex items-center"
          id="orbit-dial-section"
        >
          <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-[640px] h-[640px] rounded-full bg-ac-secondary/10 blur-3xl" />
          <div className="pointer-events-none absolute right-4 top-1/3 w-80 h-80 rounded-full bg-ac-primary/5 blur-3xl" />
          <div className="max-w-[1160px] mx-auto px-6 relative z-10 w-full">
            <OrbitDial products={wheelProducts} />
          </div>
        </section>

        {/* Our Story */}
        <section className="w-full py-14 lg:py-22 bg-ac-paper" id="our-story">
          <div className="max-w-[1160px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-ac-blush/40 via-ac-surface-container to-ac-tertiary-container/20" />
              </div>

              <div className="lg:col-span-7 flex flex-col space-y-6 lg:pl-6">
                <span className="font-humanist text-sm text-ac-secondary font-medium">
                  Our story
                </span>
                <h2 className="font-editorial text-[32px] sm:text-[38px] leading-tight tracking-tight text-ac-primary">
                  Started in a home kitchen, now boxed for all of Kerala
                </h2>
                <p className="font-humanist text-base leading-relaxed text-ac-on-surface-variant">
                  What began as cheesecakes for family and friends turned into a small team
                  hand-cutting, boxing, and delivering to shops from Kozhikode to Kochi — every
                  slice still made the way it started.
                </p>
                <div className="flex gap-10 pt-2">
                  <div>
                    <span className="block font-editorial text-2xl text-ac-primary font-bold">6+</span>
                    <span className="font-humanist text-sm text-ac-on-surface-variant">
                      Flavors
                    </span>
                  </div>
                  <div>
                    <span className="block font-editorial text-2xl text-ac-primary font-bold">
                      {stores.length}+
                    </span>
                    <span className="font-humanist text-sm text-ac-on-surface-variant">
                      Partner stores
                    </span>
                  </div>
                  <div>
                    <span className="block font-editorial text-2xl text-ac-primary font-bold">2021</span>
                    <span className="font-humanist text-sm text-ac-on-surface-variant">
                      Since
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* From the Counter */}
        <section className="w-full py-14 lg:py-22 bg-ac-surface-container" id="flavors">
          <div className="max-w-[1160px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-11 gap-4">
              <div className="max-w-xl">
                <h2 className="font-editorial text-[32px] sm:text-[38px] leading-tight tracking-tight text-ac-primary">
                  More from the counter
                </h2>
                <p className="font-humanist text-base text-ac-on-surface-variant mt-3">
                  Beyond the wheel — our signature cakes, boxed and ready.
                </p>
              </div>
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 font-humanist text-sm text-ac-secondary hover:text-ac-cocoa transition-colors whitespace-nowrap"
              >
                Explore All
                <span aria-hidden>→</span>
              </Link>
            </div>
            <ProductCounterGrid products={latestProducts} />
          </div>
        </section>

        {/* UGC Videos */}
        {featuredVideos.length > 0 && (
          <section className="w-full py-14 lg:py-22 bg-ac-paper overflow-hidden">
            <div className="max-w-[1160px] mx-auto px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ac-secondary" />
                    <span className="font-humanist text-xs text-ac-secondary uppercase tracking-widest font-semibold">
                      Social Unboxing
                    </span>
                  </div>
                  <h2 className="font-editorial text-[32px] sm:text-[38px] leading-tight tracking-tight text-ac-primary">
                    Loved by Kerala Foodies
                  </h2>
                  <p className="font-humanist text-base text-ac-on-surface-variant mt-1">
                    Real reactions and unboxing clips from bakers, cafe-hoppers, and dessert lovers.
                  </p>
                </div>
                <Link
                  href="/videos"
                  className="inline-flex items-center gap-1.5 font-humanist text-sm text-ac-secondary hover:text-ac-cocoa transition-colors whitespace-nowrap"
                >
                  See all community videos →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {featuredVideos.map((v, i) => (
                  <Link
                    key={v.id}
                    href="/videos"
                    className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                    style={{
                      background: v.thumbnailUrl ? undefined : videoGradients[i % videoGradients.length],
                      backgroundImage: v.thumbnailUrl ? `url(${v.thumbnailUrl})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-ac-primary/80 via-transparent to-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-ac-paper/90 text-ac-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        ▶
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-ac-on-primary">
                      <p className="font-humanist text-xs font-semibold truncate">{v.handle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Store Locator */}
        <section className="w-full py-14 lg:py-22 bg-ac-maroon text-ac-on-maroon relative" id="store-locator">
          <div className="max-w-[1160px] mx-auto px-6">
            <div className="max-w-3xl mx-auto flex flex-col space-y-8">
              <div className="space-y-3 text-center">
                <div className="inline-flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ac-secondary-container" />
                  <span className="font-humanist text-xs text-ac-secondary-container uppercase tracking-widest font-semibold">
                    Chilled Counters
                  </span>
                </div>
                <h2 className="font-editorial text-[32px] sm:text-[42px] leading-tight tracking-tight text-ac-on-maroon">
                  Find Delice Near You
                </h2>
                <p className="font-humanist text-base text-ac-on-maroon-muted max-w-xl mx-auto">
                  Every store below carries the full lineup. Search your area or use your location.
                </p>
              </div>

              <StoreLocatorPanel stores={stores} limit={6} />

              <div className="pt-6 border-t border-ac-on-maroon-line flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left" id="partner-wholesale">
                <div>
                  <h4 className="font-editorial text-base text-ac-on-maroon font-semibold">
                    Own a café or gourmet counter?
                  </h4>
                  <p className="font-humanist text-sm text-ac-on-maroon-muted">
                    Join our wholesale route with 3x weekly chilled deliveries across Kerala.
                  </p>
                </div>
                <a
                  href="mailto:partner@delicedesserts.com?subject=Wholesale%20Partner%20Inquiry"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-ac-on-maroon-line px-6 py-3 font-humanist text-sm text-ac-on-maroon transition-all whitespace-nowrap"
                >
                  Partner Inquiries
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
