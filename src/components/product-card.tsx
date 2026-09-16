import Link from "next/link";
import { ProductVisual } from "./cake-visuals";
import { SERVES_LABEL } from "@/lib/product-info";
import type { Product } from "@/db/schema";

const CARD_PASTELS = ["bg-blush/30", "bg-orange/25", "bg-sage/25", "bg-rose/25"];

// Stable per-product color so a card keeps its tint regardless of sort/filter order.
function pastelForProduct(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return CARD_PASTELS[hash % CARD_PASTELS.length];
}

export function ProductCard({ product }: { product: Product }) {
  const serves = SERVES_LABEL[product.category] ?? SERVES_LABEL.cheesecake;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded-[22px] overflow-hidden bg-ac-surface-container-lowest shadow-[0_1px_3px_rgba(42,22,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_-16px_rgba(42,22,32,0.28)]"
    >
      <div
        className={`relative aspect-[4/3] flex items-center justify-center overflow-hidden ${pastelForProduct(product.id)}`}
      >
        <ProductVisual
          product={product}
          imageUrl={product.imageThreeQuarterUrl}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between gap-2 py-2.5 px-3">
        <div className="min-w-0">
          <h3 className="font-editorial text-[15px] text-ac-primary leading-tight truncate">{product.name}</h3>
          <p className="font-humanist text-[11px] text-ac-on-surface-variant mt-0.5">{serves}</p>
        </div>
        <span className="font-editorial text-[13px] font-bold text-ac-primary bg-ac-secondary-container/25 rounded-full px-2.5 py-1 shrink-0">
          {product.priceLabel}
        </span>
      </div>
    </Link>
  );
}
