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
      className="group flex flex-col rounded-xl overflow-hidden bg-ac-surface-container-lowest shadow-ac-card transition-all duration-300 hover:-translate-y-1 hover:shadow-ac-card-hover"
    >
      <div
        className={`relative aspect-[4/3] flex items-center justify-center overflow-hidden ${pastelForProduct(product.id)}`}
      >
        <ProductVisual
          product={product}
          imageUrl={product.imageThreeQuarterUrl}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 font-editorial italic text-[13px] text-ac-primary bg-ac-surface-container-lowest/85 backdrop-blur-sm rounded-full px-3 py-1 shadow-ac-pop">
          {product.priceLabel}
        </span>
      </div>
      <div className="flex flex-col gap-1 py-3 px-3.5">
        <h3 className="font-editorial text-[16px] text-ac-primary leading-tight truncate transition-transform duration-300 group-hover:translate-x-0.5">
          {product.name}
        </h3>
        <p className="font-humanist text-[10.5px] uppercase tracking-[0.14em] text-ac-secondary/80 flex items-center gap-1.5">
          <span className="text-ac-secondary/50">✦</span>
          {serves}
        </p>
      </div>
    </Link>
  );
}
