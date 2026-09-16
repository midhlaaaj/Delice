type Colors = { colorFrom?: string | null; colorTo?: string | null };

const TRIANGLE_CLIP = "polygon(50% 3%, 4% 97%, 96% 97%)";

// `className` is for behavior only (transition/hover/etc) — sizing is owned
// here: a real photo always fills its parent edge-to-edge (no tint visible
// around it), while the gradient placeholder stays a smaller inset icon.
// The parent container must be `position: relative`.
export function TriangleBox({
  colorFrom,
  colorTo,
  imageUrl,
  alt = "",
  className = "",
}: Colors & { imageUrl?: string | null; alt?: string; className?: string }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={alt}
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none ${className}`}
      />
    );
  }

  return (
    <div className={`absolute inset-0 flex items-center justify-center select-none ${className}`}>
      <div
        role="img"
        aria-label={alt}
        className="w-[60%] h-[60%]"
        style={{
          clipPath: TRIANGLE_CLIP,
          background: `linear-gradient(160deg, ${colorFrom ?? "#E3A9B6"}, ${colorTo ?? "#7C4667"})`,
        }}
      />
    </div>
  );
}

export function RectBox({
  colorFrom,
  colorTo,
  imageUrl,
  alt = "",
  className = "",
}: Colors & { imageUrl?: string | null; alt?: string; className?: string }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={alt}
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none ${className}`}
      />
    );
  }

  return (
    <div className={`absolute inset-0 flex items-center justify-center select-none ${className}`}>
      <div
        role="img"
        aria-label={alt}
        className="relative w-[60%] h-[60%] rounded-[10px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colorFrom ?? "#DE8A4C"}, ${colorTo ?? "#C96B32"})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-white/70"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="1.75" />
            <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L3 20" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ProductVisual({
  product,
  imageUrl,
  alt,
  className = "",
}: {
  product: { category: string; colorFrom?: string | null; colorTo?: string | null; name?: string };
  imageUrl?: string | null;
  alt?: string;
  className?: string;
}) {
  const resolvedAlt = alt ?? (product.name ? `${product.name} — Delice` : "");

  if (product.category === "cheesecake") {
    return (
      <TriangleBox
        colorFrom={product.colorFrom}
        colorTo={product.colorTo}
        imageUrl={imageUrl}
        alt={resolvedAlt}
        className={className}
      />
    );
  }
  return (
    <RectBox
      colorFrom={product.colorFrom}
      colorTo={product.colorTo}
      imageUrl={imageUrl}
      alt={resolvedAlt}
      className={className}
    />
  );
}
