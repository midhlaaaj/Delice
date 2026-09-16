"use client";

import { useState } from "react";
import { adminInput, adminLabel } from "./admin-ui";

export function HighlightsField({
  defaultItems,
  label = "Why you'll love it",
  description = "The bullet points shown under the description on the product page (e.g. \"Made fresh to order, never frozen\").",
}: {
  defaultItems: string[];
  label?: string;
  description?: string;
}) {
  const [items, setItems] = useState<string[]>(defaultItems.length > 0 ? defaultItems : [""]);

  function update(i: number, value: string) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? value : item)));
  }

  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <div>
      <label className={adminLabel}>{label}</label>
      <p className="font-humanist text-[12px] text-ac-on-surface-variant mb-2.5">{description}</p>
      <div className="grid gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              name="highlights"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder="e.g. No artificial preservatives"
              maxLength={80}
              className={`${adminInput} flex-1`}
            />
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label="Move up"
              className="w-8 h-8 rounded-lg border border-ac-border-hairline text-ac-on-surface-variant disabled:opacity-30 hover:bg-ac-surface-container-low transition-colors shrink-0"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              aria-label="Move down"
              className="w-8 h-8 rounded-lg border border-ac-border-hairline text-ac-on-surface-variant disabled:opacity-30 hover:bg-ac-surface-container-low transition-colors shrink-0"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="w-8 h-8 rounded-lg border border-ac-border-hairline text-ac-on-surface-variant hover:text-ac-rose transition-colors shrink-0"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="mx-auto">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, ""])}
        className="mt-2.5 font-humanist text-sm text-ac-secondary hover:text-ac-cocoa transition-colors"
      >
        + Add another
      </button>
    </div>
  );
}
