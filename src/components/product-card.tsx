import Link from "next/link";
import { ProductVisual } from "./cake-visuals";
import { SERVES_LABEL, CATEGORY_LABEL } from "@/lib/product-info";
import type { Product } from "@/db/schema";

const CARD_PASTELS = ["bg-blush/30", "bg-orange/25", "bg-sage/25", "bg-rose/25"];

// Stable per-product color so a card keeps its tint regardless of sort/filter order.
function pastelForProduct(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return CARD_PASTELS[hash % CARD_PASTELS.length];
}

export function ProductCard({
  product,
  variant = "rail",
}: {
  product: Product;
  variant?: "grid" | "rail";
}) {
  const serves = SERVES_LABEL[product.category] ?? SERVES_LABEL.cheesecake;
  const category = CATEGORY_LABEL[product.category] ?? product.category;

  const metaRow = (
    <div className="flex items-center gap-2">
      <span className="font-humanist text-[11px] uppercase tracking-wide text-ac-secondary font-semibold">
        {category}
      </span>
      <span className="w-1 h-1 rounded-full bg-ac-border-hairline" />
      <span className="font-humanist text-[12px] text-ac-on-surface-variant">{serves}</span>
    </div>
  );

  if (variant === "grid") {
    return (
      <Link
        href={`/product/${product.slug}`}
        className="group flex flex-col rounded-2xl overflow-hidden bg-ac-surface-container-lowest transition-transform active:scale-[0.97]"
      >
        <div
          className={`relative flex-none aspect-[4/3] flex items-center justify-center ${pastelForProduct(product.id)}`}
        >
          <ProductVisual product={product} imageUrl={product.imageThreeQuarterUrl} className="w-[78%] h-[78%]" />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-editorial text-[17px] text-ac-primary leading-tight">{product.name}</h3>
            <span className="font-editorial text-[16px] font-bold text-ac-primary shrink-0">
              {product.priceLabel}
            </span>
          </div>
          <div className="mt-2">{metaRow}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col justify-between bg-ac-paper p-[18px] rounded-2xl transition-transform active:scale-[0.97]"
    >
      <div>
        <div className="relative w-full aspect-[5/3] rounded-[10px] overflow-hidden bg-ac-surface-container-low mb-3.5 flex items-center justify-center">
          <ProductVisual product={product} imageUrl={product.imageThreeQuarterUrl} className="w-full h-full" />
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-editorial text-lg text-ac-primary font-medium leading-tight">{product.name}</h3>
          <span className="font-editorial text-lg text-ac-primary font-bold shrink-0">{product.priceLabel}</span>
        </div>
        <div className="mt-1.5">{metaRow}</div>
      </div>
      <div className="mt-4 pt-3.5 border-t border-ac-border-hairline">
        <span className="font-humanist text-sm text-ac-secondary group-hover:text-ac-cocoa font-medium">
          View Details →
        </span>
      </div>
    </Link>
  );
}
