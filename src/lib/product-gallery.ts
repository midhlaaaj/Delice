import type { Product } from "@/db/schema";
import type { GalleryItem } from "@/components/product-gallery";

/**
 * UI-first placeholder: builds a full gallery (5 images + 2 videos) from a
 * product's existing single-slot fields, synthesizing the rest. Once the
 * product_media table exists, this goes away and pages fetch real rows.
 */
export function buildGalleryItems(product: Product): GalleryItem[] {
  const colors = { colorFrom: product.colorFrom, colorTo: product.colorTo };

  const candidates: GalleryItem[] = [
    {
      id: "three_quarter",
      type: "image",
      kind: "three_quarter",
      label: "Three-quarter angle",
      url: product.imageThreeQuarterUrl,
      ...colors,
    },
    {
      id: "side_profile",
      type: "image",
      kind: "side_profile",
      label: "Side profile",
      url: product.imageSideUrl,
      ...colors,
    },
    {
      id: "top_down",
      type: "image",
      kind: "top_down",
      label: "Top-down",
      url: product.imageTopUrl,
      ...colors,
    },
    {
      id: "transition_video",
      type: "video",
      kind: "video",
      label: "Top-view to side-view",
      url: product.transitionVideoUrl,
      ...colors,
    },
  ];

  // Only show slots with a real uploaded asset — an empty gradient square
  // with no photo behind it reads as a broken thumbnail, not a placeholder.
  const withAssets = candidates.filter((item) => !!item.url);

  // Still show one item (the hero photo slot) so the gallery isn't empty
  // before any assets exist, falling back to its gradient placeholder.
  return withAssets.length > 0 ? withAssets : [candidates[0]];
}
