"use client";

import { useEffect, useState } from "react";
import { adminInput, adminLabel } from "./admin-ui";

export function TrustTagItemsField({
  defaultItems,
  onChange,
}: {
  defaultItems: string[];
  onChange?: (items: string[]) => void;
}) {
  const [items, setItems] = useState<string[]>(defaultItems.length > 0 ? defaultItems : [""]);

  useEffect(() => {
    onChange?.(items.filter((i) => i.trim()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

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
      <label className={adminLabel}>Trust tag items</label>
      <p className="font-humanist text-[12px] text-ac-on-surface-variant mb-2.5">
        The cycling strip shown right under the header on the homepage hero (e.g. &quot;Fresh
        Daily&quot;, &quot;No Preservatives&quot;). Leave all empty to hide it.
      </p>
      <div className="grid gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              name="trustTagItems"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder="e.g. FSSAI Certified"
              maxLength={60}
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
