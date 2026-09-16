"use client";

import { useRef, useState, useTransition } from "react";
import { ProductVisual } from "@/components/cake-visuals";
import { setWheelMembership, reorderWheel } from "@/lib/actions/wheel";
import type { Product } from "@/db/schema";

export function WheelManager({ products }: { products: Product[] }) {
  const [onWheel, setOnWheel] = useState(
    [...products].filter((p) => p.isFeaturedOnWheel).sort((a, b) => a.wheelSortOrder - b.wheelSortOrder)
  );
  const [offWheel, setOffWheel] = useState(products.filter((p) => !p.isFeaturedOnWheel));
  const [, startTransition] = useTransition();
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function addToWheel(product: Product) {
    setOffWheel((prev) => prev.filter((p) => p.id !== product.id));
    setOnWheel((prev) => {
      const next = [...prev, product];
      startTransition(() => {
        setWheelMembership(product.id, true);
        reorderWheel(next.map((p) => p.id));
      });
      return next;
    });
  }

  function removeFromWheel(product: Product) {
    setOnWheel((prev) => {
      const next = prev.filter((p) => p.id !== product.id);
      startTransition(() => {
        setWheelMembership(product.id, false);
        reorderWheel(next.map((p) => p.id));
      });
      return next;
    });
    setOffWheel((prev) => [product, ...prev]);
  }

  function reorder(from: number, to: number) {
    setOnWheel((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      startTransition(() => reorderWheel(next.map((p) => p.id)));
      return next;
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
      <div>
        <h2 className="font-editorial text-lg text-ac-primary mb-3">On the wheel ({onWheel.length})</h2>
        {onWheel.length === 0 ? (
          <div className="bg-ac-surface-container-lowest border border-ac-border-hairline rounded-2xl px-5 py-10 text-center font-humanist text-sm text-ac-on-surface-variant">
            Nothing on the wheel yet — add products from the list on the right.
          </div>
        ) : (
          <ul className="grid gap-2">
            {onWheel.map((p, i) => (
              <li
                key={p.id}
                draggable
                onDragStart={() => {
                  dragIndex.current = i;
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(i);
                }}
                onDragLeave={() => setOverIndex((cur) => (cur === i ? null : cur))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex.current !== null && dragIndex.current !== i) reorder(dragIndex.current, i);
                  dragIndex.current = null;
                  setOverIndex(null);
                }}
                onDragEnd={() => {
                  dragIndex.current = null;
                  setOverIndex(null);
                }}
                className={`flex items-center gap-3 bg-ac-surface-container-lowest border rounded-xl px-3.5 py-3 transition-colors ${
                  overIndex === i ? "border-ac-secondary" : "border-ac-border-hairline"
                }`}
              >
                <span className="cursor-grab active:cursor-grabbing text-ac-on-surface-variant/60 shrink-0" aria-hidden>
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                    <circle cx="6" cy="4" r="1.4" />
                    <circle cx="14" cy="4" r="1.4" />
                    <circle cx="6" cy="10" r="1.4" />
                    <circle cx="14" cy="10" r="1.4" />
                    <circle cx="6" cy="16" r="1.4" />
                    <circle cx="14" cy="16" r="1.4" />
                  </svg>
                </span>
                <div className="relative w-11 h-11 rounded-lg bg-ac-surface-container-low shrink-0 flex items-center justify-center overflow-hidden">
                  <ProductVisual product={p} imageUrl={p.imageThreeQuarterUrl} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-humanist text-sm font-medium text-ac-primary truncate">{p.name}</div>
                  <div className="font-humanist text-[12px] text-ac-on-surface-variant">{p.priceLabel}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromWheel(p)}
                  className="font-humanist text-[13px] text-ac-on-surface-variant hover:text-ac-rose transition-colors shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="font-editorial text-lg text-ac-primary mb-3">Add products</h2>
        {offWheel.length === 0 ? (
          <p className="font-humanist text-sm text-ac-on-surface-variant">Every product is on the wheel.</p>
        ) : (
          <ul className="grid gap-2">
            {offWheel.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 bg-ac-surface-container-lowest border border-ac-border-hairline rounded-xl px-3.5 py-3"
              >
                <div className="relative w-9 h-9 rounded-lg bg-ac-surface-container-low shrink-0 flex items-center justify-center overflow-hidden">
                  <ProductVisual product={p} imageUrl={p.imageThreeQuarterUrl} />
                </div>
                <span className="font-humanist text-sm text-ac-primary truncate flex-1 min-w-0">{p.name}</span>
                <button
                  type="button"
                  onClick={() => addToWheel(p)}
                  className="font-humanist text-[13px] text-ac-secondary hover:text-ac-cocoa font-medium transition-colors shrink-0"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
