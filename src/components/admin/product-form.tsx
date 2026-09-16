"use client";

import { useState } from "react";
import { upsertProduct } from "@/lib/actions/products";
import { MediaUploadField } from "./media-upload-field";
import { FallbackColorField } from "./fallback-color-field";
import { ProductPreviewCard } from "./product-preview-card";
import { Button } from "@/components/button";
import { adminInput, adminLabel } from "./admin-ui";
import type { Product } from "@/db/schema";

export function ProductForm({ product }: { product?: Product }) {
  const [name, setName] = useState(product?.name ?? "");
  const [priceValue, setPriceValue] = useState((product?.priceLabel ?? "").replace(/^₹\s*/, ""));
  const priceLabel = `₹${priceValue}`;
  const [category, setCategory] = useState<string>(product?.category ?? "cheesecake");
  const [colorFrom, setColorFrom] = useState(product?.colorFrom ?? "#EFC3CD");
  const [colorTo, setColorTo] = useState(product?.colorTo ?? "#D68C9E");
  const [heroImage, setHeroImage] = useState<string | undefined>(product?.imageThreeQuarterUrl ?? undefined);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      <form action={upsertProduct} className="grid gap-5 max-w-xl w-full">
        {product && <input type="hidden" name="id" value={product.id} />}

        <div>
          <label className={adminLabel}>Name</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={adminInput}
          />
        </div>

        <div>
          <label className={adminLabel}>Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={adminInput}
          >
            <option value="cheesecake">Cheesecake (triangular box)</option>
            <option value="bake">Bake (rectangular box)</option>
          </select>
        </div>

        <div>
          <label className={adminLabel}>Kicker</label>
          <input
            name="kicker"
            defaultValue={product?.kicker ?? ""}
            placeholder="e.g. Fan favorite"
            className={adminInput}
          />
        </div>

        <div>
          <label className={adminLabel}>Price</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-humanist text-sm text-ac-on-surface-variant pointer-events-none">
              ₹
            </span>
            <input
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="169"
              required
              className={`${adminInput} pl-7`}
            />
          </div>
          <input type="hidden" name="priceLabel" value={priceLabel} />
        </div>

        <div>
          <label className={adminLabel}>Description</label>
          <textarea name="description" defaultValue={product?.description} required rows={3} className={adminInput} />
        </div>

        <FallbackColorField
          defaultFrom={product?.colorFrom}
          defaultTo={product?.colorTo}
          onChange={(from, to) => {
            setColorFrom(from);
            setColorTo(to);
          }}
        />

        <MediaUploadField
          defaultImages={[product?.imageThreeQuarterUrl, product?.imageTopUrl, product?.imageSideUrl]}
          defaultVideo={product?.transitionVideoUrl}
          folder="products"
          onChange={(items) => {
            const firstImage = items.find((i) => i.type === "image");
            setHeroImage(firstImage?.url);
          }}
        />

        <input type="hidden" name="sortOrder" value={product?.sortOrder ?? 0} />

        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2 font-humanist text-sm text-ac-on-surface">
            <input type="checkbox" name="isFeaturedOnWheel" defaultChecked={product?.isFeaturedOnWheel} />
            Show on homepage wheel
          </label>
          <label className="flex items-center gap-2 font-humanist text-sm text-ac-on-surface">
            <input type="checkbox" name="isPublished" defaultChecked={product?.isPublished ?? true} />
            Published
          </label>
        </div>

        <Button type="submit" className="w-fit">
          Save product
        </Button>
      </form>

      <ProductPreviewCard
        name={name}
        priceLabel={priceLabel}
        category={category}
        imageUrl={heroImage}
        colorFrom={colorFrom}
        colorTo={colorTo}
      />
    </div>
  );
}
