import { upsertProduct } from "@/lib/actions/products";
import { ImageUploadField } from "./image-upload-field";
import type { Product } from "@/db/schema";

export function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={upsertProduct} className="grid gap-4 max-w-xl">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Slug</label>
        <input
          name="slug"
          defaultValue={product?.slug}
          required
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Name</label>
        <input
          name="name"
          defaultValue={product?.name}
          required
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Category</label>
        <select
          name="category"
          defaultValue={product?.category ?? "cheesecake"}
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        >
          <option value="cheesecake">Cheesecake (triangular box)</option>
          <option value="bake">Bake (rectangular box)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Kicker</label>
        <input
          name="kicker"
          defaultValue={product?.kicker ?? ""}
          placeholder="e.g. Fan favorite"
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Price label</label>
        <input
          name="priceLabel"
          defaultValue={product?.priceLabel}
          placeholder="₹169"
          required
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Description</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          required
          rows={3}
          className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink/70 mb-1.5">Fallback color from</label>
          <input
            name="colorFrom"
            type="color"
            defaultValue={product?.colorFrom ?? "#E3A9B6"}
            className="w-full h-10 border border-line rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1.5">Fallback color to</label>
          <input
            name="colorTo"
            type="color"
            defaultValue={product?.colorTo ?? "#7C4667"}
            className="w-full h-10 border border-line rounded-lg"
          />
        </div>
      </div>

      <ImageUploadField
        name="imageThreeQuarterUrl"
        label="Three-quarter hero photo (cards, wheel, grid)"
        defaultValue={product?.imageThreeQuarterUrl}
        folder="products"
      />
      <ImageUploadField
        name="imageTopUrl"
        label="Top-down still"
        defaultValue={product?.imageTopUrl}
        folder="products"
      />
      <ImageUploadField
        name="imageSideUrl"
        label="Side-profile still"
        defaultValue={product?.imageSideUrl}
        folder="products"
      />
      <ImageUploadField
        name="transitionVideoUrl"
        label="Backup transition video"
        defaultValue={product?.transitionVideoUrl}
        folder="products"
      />

      <div>
        <label className="block text-sm text-ink/70 mb-1.5">Sort order</label>
        <input
          name="sortOrder"
          type="number"
          defaultValue={product?.sortOrder ?? 0}
          className="w-32 border border-line rounded-lg px-3.5 py-2.5 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isFeaturedOnWheel" defaultChecked={product?.isFeaturedOnWheel} />
        Show on homepage wheel
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={product?.isPublished ?? true} />
        Published
      </label>

      <button type="submit" className="bg-plum text-cream rounded-full px-6 py-2.5 text-sm w-fit">
        Save product
      </button>
    </form>
  );
}
