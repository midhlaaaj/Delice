import Link from "next/link";
import { ProductVisual } from "./cake-visuals";
import type { Product } from "@/db/schema";

export function ProductCounterGrid({ products }: { products: Product[] }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {products.map((p) => (
          <div
            key={p.id}
            className="group flex flex-col justify-between bg-ac-paper p-[18px] rounded-2xl transition-shadow hover:shadow-sm"
          >
            <div>
              <div className="relative w-full aspect-[5/3] rounded-[10px] overflow-hidden bg-ac-surface-container-low mb-3.5 flex items-center justify-center">
                <ProductVisual
                  product={p}
                  imageUrl={p.imageThreeQuarterUrl}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-editorial text-lg text-ac-primary font-medium">{p.name}</h3>
              <p className="font-humanist text-sm text-ac-on-surface-variant mt-1 line-clamp-2">
                {p.description}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-ac-border-hairline flex items-center justify-between">
              <span className="font-editorial text-xl text-ac-primary font-bold">{p.priceLabel}</span>
              <Link
                href={`/product/${p.slug}`}
                className="inline-flex items-center gap-1 font-humanist text-sm text-ac-secondary hover:text-ac-cocoa font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
