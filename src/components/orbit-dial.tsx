"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TriangleBox } from "./cake-visuals";
import { FlavorVisualCarousel } from "./flavor-visual-carousel";
import { Button } from "./button";
import type { Product } from "@/db/schema";

type Geometry = { cx: number; cy: number; itemSpacing: number; curveDepth: number; horizontal: boolean };

function getGeometry(stage: HTMLDivElement): Geometry {
  const rect = stage.getBoundingClientRect();
  // Matches the lg: breakpoint where the wrapper switches from a stacked
  // column to a side-by-side grid — the stage's own width can't be used
  // here since it stays full-width (and >640px) right up to that point.
  const horizontal = typeof window !== "undefined" ? window.innerWidth < 1024 : rect.width < 640;

  if (horizontal) {
    return {
      cx: rect.width / 2,
      cy: rect.height * 0.42,
      itemSpacing: rect.width * 0.32,
      curveDepth: Math.min(40, rect.height * 0.12),
      horizontal: true,
    };
  }

  return {
    cx: Math.min(rect.width * 0.42, rect.width - 220),
    cy: rect.height / 2,
    itemSpacing: rect.height * 0.36,
    curveDepth: Math.min(100, rect.width * 0.09),
    horizontal: false,
  };
}

function pathPoint(d: number, geo: Geometry) {
  if (geo.horizontal) {
    return { x: geo.cx + d * geo.itemSpacing, y: geo.cy - geo.curveDepth * d * d };
  }
  return { x: geo.cx - geo.curveDepth * d * d, y: geo.cy + d * geo.itemSpacing };
}

function buildArcPath(geo: Geometry) {
  const steps = 32;
  const span = 1.8;
  let path = "";
  for (let i = 0; i <= steps; i++) {
    const d = -span + (i / steps) * span * 2;
    const { x, y } = pathPoint(d, geo);
    path += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return path;
}

export function OrbitDial({ products }: { products: Product[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arcPathRef = useRef<SVGPathElement>(null);

  const rotationRef = useRef(0); // fractional index offset, animated
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [panelFading, setPanelFading] = useState(false);

  const n = products.length;

  const layout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || n === 0) return;
    const geo = getGeometry(stage);

    arcPathRef.current?.setAttribute("d", buildArcPath(geo));

    products.forEach((_, i) => {
      const node = nodeRefs.current[i];
      if (!node) return;

      let d = i - rotationRef.current;
      d = ((d % n) + n * 1.5) % n - n * 0.5; // shortest signed distance, wraps around

      const { x: rawX, y: rawY } = pathPoint(d, geo);
      const posX = Math.round(rawX);
      const posY = Math.round(rawY);
      const absD = Math.abs(d);

      let scale = 0;
      let opacity = 0;
      let zIndex = 0;
      let pointerEvents: "auto" | "none" = "none";

      if (absD < 0.5) {
        const t = absD / 0.5;
        scale = 1.55 - 0.15 * t;
        opacity = 1;
        zIndex = 30;
        pointerEvents = "auto";
      } else if (absD <= 1.5) {
        const t = (absD - 0.5) / 1;
        scale = 0.6 - 0.12 * t;
        opacity = 0.6 - 0.18 * t;
        zIndex = 10;
        pointerEvents = "auto";
      }

      node.style.display = opacity <= 0.01 ? "none" : "flex";
      node.style.opacity = opacity.toFixed(2);
      node.style.zIndex = String(zIndex);
      node.style.pointerEvents = pointerEvents;
      node.style.left = `${posX}px`;
      node.style.top = `${posY}px`;
      node.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(2)})`;
    });
  }, [products, n]);

  const animateTo = useCallback(
    (targetIndex: number, onComplete?: () => void) => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      let diff = targetIndex - rotationRef.current;
      diff = ((diff % n) + n * 1.5) % n - n * 0.5;
      const duration = 380;
      const startTime = performance.now();
      const startVal = rotationRef.current;

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        rotationRef.current = startVal + diff * ease;
        layout();
        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          rotationRef.current = ((targetIndex % n) + n) % n;
          layout();
          onComplete?.();
        }
      }
      animFrameRef.current = requestAnimationFrame(step);
    },
    [layout, n]
  );

  const jumpTo = useCallback(
    (index: number) => {
      const normalized = ((index % n) + n) % n;
      animateTo(index, () => {
        setActiveIndex(normalized);
        setPanelFading(true);
        setTimeout(() => setPanelFading(false), 100);
      });
    },
    [animateTo, n]
  );

  const scheduleAutoplayRef = useRef<() => void>(() => {});

  const scheduleAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    if (n <= 1) return;
    autoplayTimerRef.current = setTimeout(() => {
      if (!draggingRef.current) {
        jumpTo(Math.round(rotationRef.current) + 1);
      }
      scheduleAutoplayRef.current();
    }, 5000);
  }, [jumpTo, n]);

  useEffect(() => {
    scheduleAutoplayRef.current = scheduleAutoplay;
  }, [scheduleAutoplay]);

  useEffect(() => {
    layout();
    const stage = stageRef.current;
    if (!stage) return;

    scheduleAutoplay();

    function onPointerDown(e: PointerEvent) {
      if ((e.target as HTMLElement).closest("button")) return;
      draggingRef.current = true;
      startYRef.current = e.clientY;
      startXRef.current = e.clientX;
      startRotationRef.current = rotationRef.current;
      if (stage) stage.style.cursor = "grabbing";
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    }
    function onPointerMove(e: PointerEvent) {
      if (!draggingRef.current || !stage) return;
      const geo = getGeometry(stage);
      const delta = geo.horizontal ? e.clientX - startXRef.current : e.clientY - startYRef.current;
      rotationRef.current = startRotationRef.current - delta / geo.itemSpacing;
      layout();
    }
    function snap() {
      const targetIndex = Math.round(rotationRef.current);
      const normalizedIndex = ((targetIndex % n) + n) % n;
      animateTo(targetIndex, () => {
        setActiveIndex(normalizedIndex);
        setPanelFading(true);
        setTimeout(() => setPanelFading(false), 100);
      });
    }
    function onPointerUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (stage) stage.style.cursor = "grab";
      snap();
      scheduleAutoplay();
    }

    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", layout);

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", layout);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };

  }, [layout, animateTo, n, scheduleAutoplay]);

  const active = products[activeIndex];

  if (n === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-12 sm:gap-8 sm:items-stretch lg:gap-14">
      <div
        ref={stageRef}
        className="sm:col-span-7 relative h-[230px] sm:h-auto min-h-[320px] w-full flex items-center justify-center overflow-hidden touch-none cursor-grab select-none"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path ref={arcPathRef} fill="none" stroke="rgba(102,26,38,0.18)" strokeDasharray="4 7" strokeWidth={1.5} />
        </svg>

        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {products.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="absolute cursor-pointer select-none pointer-events-auto flex flex-col items-center justify-center"
              style={{ willChange: "transform, opacity" }}
              onClick={(e) => {
                e.stopPropagation();
                jumpTo(i);
                scheduleAutoplay();
              }}
            >
              <div className="relative p-3 rounded-3xl flex flex-col items-center">
                {/* Float animation always runs, in phase, on every node — only the
                    shadow accents cross-fade on activeIndex change, so switching
                    the active item never restarts or snaps the motion itself. */}
                <div
                  className="relative w-28 h-28 sm:w-44 sm:h-44 animate-float-3d"
                  style={{
                    filter: i === activeIndex ? "drop-shadow(0 16px 18px rgba(42,22,32,0.3))" : "none",
                    transition: "filter 500ms ease",
                  }}
                >
                  <TriangleBox
                    colorFrom={p.colorFrom}
                    colorTo={p.colorTo}
                    imageUrl={p.imageThreeQuarterUrl}
                    alt={p.name}
                  />
                </div>
                <div
                  className="absolute left-1/2 -translate-x-1/2 bottom-1 w-[55%] h-3"
                  style={{ opacity: i === activeIndex ? 1 : 0, transition: "opacity 500ms ease" }}
                >
                  <div className="animate-float-3d-shadow w-full h-full rounded-full bg-ac-ink/30 blur-md" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex sm:hidden absolute inset-y-0 left-1 right-1 items-center justify-between z-20 pointer-events-none">
          <button
            aria-label="Previous flavor"
            onClick={() => {
              jumpTo(activeIndex - 1);
              scheduleAutoplay();
            }}
            className="pointer-events-auto w-9 h-9 rounded-full bg-ac-paper hover:bg-ac-cream-deep text-ac-primary border border-ac-border-hairline flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            ←
          </button>
          <button
            aria-label="Next flavor"
            onClick={() => {
              jumpTo(activeIndex + 1);
              scheduleAutoplay();
            }}
            className="pointer-events-auto w-9 h-9 rounded-full bg-ac-paper hover:bg-ac-cream-deep text-ac-primary border border-ac-border-hairline flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            →
          </button>
        </div>

        <div className="hidden sm:flex absolute top-4 right-4 flex-col gap-2 z-20">
          <button
            aria-label="Previous flavor"
            onClick={() => {
              jumpTo(activeIndex - 1);
              scheduleAutoplay();
            }}
            className="w-9 h-9 rounded-full bg-ac-paper hover:bg-ac-cream-deep text-ac-primary border border-ac-border-hairline flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            ↑
          </button>
          <button
            aria-label="Next flavor"
            onClick={() => {
              jumpTo(activeIndex + 1);
              scheduleAutoplay();
            }}
            className="w-9 h-9 rounded-full bg-ac-paper hover:bg-ac-cream-deep text-ac-primary border border-ac-border-hairline flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            ↓
          </button>
        </div>
      </div>

      <div
        className="sm:col-span-5 flex flex-col justify-center gap-3 sm:gap-4 transition-opacity duration-150"
        style={{ opacity: panelFading ? 0.7 : 1 }}
      >
        <div>
          <span className="font-humanist text-[11px] font-semibold text-ac-secondary">
            Flavor {activeIndex + 1} of {n}
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl leading-tight text-ac-primary mt-1.5">
            {active.name}
          </h2>
        </div>

        <FlavorVisualCarousel key={active.id} product={active} index={activeIndex} />

        <div className="flex items-end justify-between gap-3.5">
          <p className="font-humanist text-[13px] leading-snug text-ac-on-surface-variant line-clamp-2">
            {active.description}
          </p>
          <span className="font-editorial text-xl text-ac-primary font-semibold whitespace-nowrap">
            {active.priceLabel}
          </span>
        </div>

        <Button href={`/product/${active.slug}`} variant="solid" className="w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}
