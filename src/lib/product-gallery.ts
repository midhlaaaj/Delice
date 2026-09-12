import type { Product } from "@/db/schema";
import type { GalleryItem } from "@/components/product-gallery";

/**
 * UI-first placeholder: builds a full gallery (5 images + 2 videos) from a
 * product's existing single-slot fields, synthesizing the rest. Once the
 * product_media table exists, this goes away and pages fetch real rows.
 */
export function buildGalleryItems(product: Product): GalleryItem[] {
  const colors = { colorFrom: product.colorFrom, colorTo: product.colorTo };

  return [
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
      id: "detail",
      type: "image",
      kind: "detail",
      label: "Close-up detail",
      url: null,
      ...colors,
    },
    {
      id: "in_the_box",
      type: "image",
      kind: "detail",
      label: "In the box",
      url: null,
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
    {
      id: "bts_video",
      type: "video",
      kind: "video",
      label: "Behind the scenes",
      url: null,
      ...colors,
    },
  ];
}
