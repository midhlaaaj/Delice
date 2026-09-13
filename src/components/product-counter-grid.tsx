import { ProductCard } from "./product-card";
import type { Product } from "@/db/schema";

export function ProductCounterGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} variant="rail" />
      ))}
    </div>
  );
}
