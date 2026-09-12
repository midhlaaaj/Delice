import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StoreDirectory } from "@/components/store-directory";
import { StoreStructuredData } from "@/components/store-schema";
import { getApprovedStores } from "@/db/queries";

export const metadata = {
  title: "Find a Store — Delice",
  description: "Every Delice store and partner shop, searchable by name, area, or your location.",
};

export default async function StoresPage() {
  const stores = await getApprovedStores();

  return (
    <>
      <StoreStructuredData stores={stores} />
      <SiteHeader />
      <section className="bg-gradient-to-b from-ac-surface-container-low to-ac-surface-container pt-32 pb-20 min-h-screen">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="max-w-[560px] mb-9">
            <h1 className="font-editorial text-ac-primary text-[clamp(28px,4vw,38px)]">Find a store</h1>
            <p className="mt-3 font-humanist text-[15.5px] leading-relaxed text-ac-on-surface-variant">
              Every Delice store and partner shop, in one place. Search by name, area, or use your
              location.
            </p>
          </div>
          <Suspense>
            <StoreDirectory stores={stores} />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
