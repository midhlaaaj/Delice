"use client";

import { useState } from "react";
import { ProductVisual } from "./cake-visuals";
import type { Product } from "@/db/schema";

const PASTELS = ["bg-ac-blush/30", "bg-ac-secondary-container/30", "bg-ac-sage/25", "bg-ac-rose/25"];

export function FlavorVisualCarousel({ product, index }: { product: Product; index: number }) {
  const images = Array.from(
    new Set([product.imageThreeQuarterUrl, product.imageSideUrl, product.imageTopUrl].filter(Boolean))
  ) as string[];

  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div
      className={`relative aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center ${PASTELS[index % PASTELS.length]}`}
    >
      <ProductVisual product={product} imageUrl={images[imgIndex]} alt={product.name} />

      <span className="absolute top-3 right-3 font-editorial italic text-[13px] text-ac-primary bg-ac-surface-container-lowest/85 backdrop-blur-sm rounded-full px-3 py-1 shadow-ac-pop">
        {product.priceLabel}
      </span>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => setImgIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === imgIndex ? "bg-ac-maroon" : "bg-ac-maroon/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
