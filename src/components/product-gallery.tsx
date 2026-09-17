"use client";

import { useEffect, useState } from "react";

export type GalleryItem = {
  id: string;
  type: "image" | "video";
  kind: "three_quarter" | "side_profile" | "top_down" | "detail" | "video";
  label: string;
  url?: string | null;
  colorFrom?: string | null;
  colorTo?: string | null;
};

function GalleryFrame({
  item,
  className = "",
  showLabel = true,
}: {
  item: GalleryItem;
  className?: string;
  showLabel?: boolean;
}) {
  if (item.url) {
    if (item.type === "video") {
      return (
        <video
          src={item.url}
          className={`w-full h-full object-contain ${className}`}
          controls
          playsInline
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.url} alt={item.label} className={`w-full h-full object-contain ${className}`} />
    );
  }

  // Placeholder: no real asset uploaded yet
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(160deg, ${item.colorFrom ?? "#E3A9B6"}, ${item.colorTo ?? "#7C4667"})`,
      }}
    >
      {item.type === "video" && (
        <div
          className={`rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center ${
            showLabel ? "w-14 h-14" : "w-7 h-7"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="#fff" className={showLabel ? "w-5 h-5 ml-0.5" : "w-3 h-3 ml-0.5"}>
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </div>
      )}
      {showLabel && (
        <span className="absolute bottom-3 left-3 text-[11px] text-white/85 bg-black/20 px-2.5 py-1 rounded-full">
          {item.label} · placeholder
        </span>
      )}
    </div>
  );
}

export function ProductGallery({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const active = items[activeIndex] ?? items[0];

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + items.length) % items.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, items.length]);

  return (
    <div className="min-w-0">
      {/* Desktop: thumbnail rail + main frame */}
      <div className="hidden md:flex gap-4">
        <div className="flex flex-col gap-3 w-[76px] shrink-0">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-ac-surface-container-low transition-colors ${
                i === activeIndex ? "border-ac-primary" : "border-transparent"
              }`}
            >
              <GalleryFrame item={item} showLabel={false} />
            </button>
          ))}
        </div>
        <button
          onClick={() => setLightboxOpen(true)}
          className="flex-1 aspect-[4/5] rounded-[24px] overflow-hidden bg-ac-surface-container-low cursor-zoom-in"
          aria-label="Open full size"
        >
          <GalleryFrame item={active} />
        </button>
      </div>

      {/* Mobile: swipeable carousel + dots */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl [scrollbar-width:none] min-w-0">
          {items.map((item) => (
            <div key={item.id} className="flex-none w-full basis-full min-w-0 aspect-[4/5] bg-ac-surface-container-low snap-start">
              <GalleryFrame item={item} />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((item, i) => (
            <span
              key={item.id}
              className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-ac-primary" : "bg-ac-primary/25"}`}
            />
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-ac-ink/95 flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <button
            className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i - 1 + items.length) % items.length);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <div
            className="w-full max-w-[560px] aspect-[4/5] rounded-[24px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <GalleryFrame item={active} />
          </div>
          <button
            className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((i) => (i + 1) % items.length);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
