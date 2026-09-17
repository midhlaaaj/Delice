"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ProductVisual } from "@/components/cake-visuals";
import { deleteProduct, reorderProducts } from "@/lib/actions/products";
import { StatusPill } from "./admin-ui";
import { DeleteButton } from "./delete-button";
import type { Product } from "@/db/schema";

export function ProductsGrid({ products }: { products: Product[] }) {
  const [items, setItems] = useState(products);
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function reorder(from: number, to: number) {
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function save() {
    startTransition(() => reorderProducts(items.map((p) => p.id)));
    setEditing(false);
  }

  function cancel() {
    setItems(products);
    setEditing(false);
  }

  if (products.length === 0) {
    return (
      <div className="bg-ac-surface-container-lowest border border-ac-border-hairline rounded-2xl px-5 py-14 text-center font-humanist text-sm text-ac-on-surface-variant">
        No products yet.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-2.5 mb-4">
        {editing ? (
          <>
            <button
              type="button"
              onClick={cancel}
              className="font-humanist text-sm text-ac-on-surface-variant border border-ac-border-hairline rounded-full px-4 py-2 hover:bg-ac-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="font-humanist text-sm font-medium text-ac-on-primary bg-ac-maroon hover:bg-ac-maroon-deep rounded-full px-4 py-2 transition-colors"
            >
              Save order
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-humanist text-sm text-ac-secondary hover:text-ac-cocoa font-medium transition-colors"
          >
            Edit order
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p, i) => (
          <div
            key={p.id}
            draggable={editing}
            onDragStart={() => {
              dragIndex.current = i;
            }}
            onDragOver={(e) => {
              if (!editing) return;
              e.preventDefault();
              setOverIndex(i);
            }}
            onDragLeave={() => setOverIndex((cur) => (cur === i ? null : cur))}
            onDrop={(e) => {
              if (!editing) return;
              e.preventDefault();
              if (dragIndex.current !== null && dragIndex.current !== i) reorder(dragIndex.current, i);
              dragIndex.current = null;
              setOverIndex(null);
            }}
            onDragEnd={() => {
              dragIndex.current = null;
              setOverIndex(null);
            }}
            className={`group flex flex-col bg-ac-surface-container-lowest border rounded-2xl overflow-hidden shadow-ac-card transition-shadow ${
              overIndex === i ? "border-ac-secondary" : "border-ac-border-hairline"
            } ${editing ? "cursor-grab active:cursor-grabbing" : "hover:shadow-[0_12px_24px_-14px_rgba(42,22,32,0.25)]"}`}
          >
            <div className="relative aspect-[4/3] bg-ac-surface-container-low flex items-center justify-center">
              {editing && (
                <span className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-ac-on-surface-variant shadow-sm" aria-hidden>
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                    <circle cx="6" cy="4" r="1.4" />
                    <circle cx="14" cy="4" r="1.4" />
                    <circle cx="6" cy="10" r="1.4" />
                    <circle cx="14" cy="10" r="1.4" />
                    <circle cx="6" cy="16" r="1.4" />
                    <circle cx="14" cy="16" r="1.4" />
                  </svg>
                </span>
              )}
              {editing ? (
                <ProductVisual product={p} imageUrl={p.imageThreeQuarterUrl} />
              ) : (
                <Link href={`/admin/products/${p.id}`} className="absolute inset-0">
                  <ProductVisual
                    product={p}
                    imageUrl={p.imageThreeQuarterUrl}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              )}
              {p.isFeaturedOnWheel && (
                <span className="absolute top-2.5 right-2.5">
                  <StatusPill tone="warning" label="Wheel" />
                </span>
              )}
            </div>

            <div className="p-3.5 flex flex-col gap-1.5 flex-1">
              <div className="min-w-0">
                <h3 className="font-humanist text-sm font-medium text-ac-primary truncate">{p.name}</h3>
                <p className="font-humanist text-[12px] text-ac-on-surface-variant mt-0.5">
                  {p.category} · {p.priceLabel}
                </p>
              </div>

              <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-ac-border-hairline">
                <StatusPill tone={p.isPublished ? "positive" : "neutral"} label={p.isPublished ? "Published" : "Hidden"} />
                {!editing && (
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-humanist text-[13px] text-ac-secondary hover:text-ac-cocoa font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteProduct} id={p.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
