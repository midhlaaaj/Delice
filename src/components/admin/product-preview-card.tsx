"use client";

import { TriangleBox, RectBox } from "@/components/cake-visuals";
import { SERVES_LABEL } from "@/lib/product-info";

export function ProductPreviewCard({
  name,
  priceLabel,
  category,
  imageUrl,
  colorFrom,
  colorTo,
}: {
  name: string;
  priceLabel: string;
  category: string;
  imageUrl?: string;
  colorFrom: string;
  colorTo: string;
}) {
  const Visual = category === "bake" ? RectBox : TriangleBox;
  const serves = SERVES_LABEL[category] ?? SERVES_LABEL.cheesecake;

  return (
    <div className="sticky top-8 w-[240px] shrink-0">
      <p className="font-humanist text-[11px] font-semibold uppercase tracking-wide text-ac-on-surface-variant mb-2.5">
        Live preview
      </p>
      {/* Mirrors src/components/product-card.tsx exactly (aside from the fixed
          bg-ac-blush tint here, since the real per-product hash needs an id
          this product doesn't have until it's saved) — keep both in sync. */}
      <div className="w-full flex flex-col rounded-[22px] overflow-hidden bg-ac-surface-container-lowest shadow-ac-card">
        <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden bg-ac-blush/25">
          <Visual colorFrom={colorFrom} colorTo={colorTo} imageUrl={imageUrl} alt={name} />
        </div>
        <div className="flex items-center justify-between gap-2 py-2.5 px-3">
          <div className="min-w-0">
            <h3 className="font-editorial text-[15px] text-ac-primary leading-tight truncate">{name || "Product name"}</h3>
            <p className="font-humanist text-[11px] text-ac-on-surface-variant mt-0.5">{serves}</p>
          </div>
          <span className="font-editorial text-[13px] font-semibold text-ac-primary bg-ac-secondary-container/25 rounded-full px-2.5 py-1 shrink-0">
            {priceLabel || "₹—"}
          </span>
        </div>
      </div>
    </div>
  );
}
