"use client";

import { useEffect, useState } from "react";
import { adminLabel } from "./admin-ui";

const PRESETS = [
  { from: "#EFC3CD", to: "#D68C9E" },
  { from: "#F0A868", to: "#D97A2E" },
  { from: "#A9B98E", to: "#6E7E55" },
  { from: "#DD8E8B", to: "#B4494A" },
  { from: "#9A6289", to: "#5F3450" },
  { from: "#7A4A34", to: "#40200F" },
];

export function FallbackColorField({
  defaultFrom,
  defaultTo,
  onChange,
}: {
  defaultFrom?: string | null;
  defaultTo?: string | null;
  onChange?: (from: string, to: string) => void;
}) {
  const initialIndex = PRESETS.findIndex((p) => p.from === defaultFrom && p.to === defaultTo);
  const [selected, setSelected] = useState(initialIndex >= 0 ? initialIndex : 0);
  const current = PRESETS[selected];

  useEffect(() => {
    onChange?.(current.from, current.to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div>
      <label className={adminLabel}>Fallback color</label>
      <p className="font-humanist text-[12px] text-ac-on-surface-variant mb-2.5">
        Used as a placeholder gradient until real photos are uploaded.
      </p>
      <input type="hidden" name="colorFrom" value={current.from} />
      <input type="hidden" name="colorTo" value={current.to} />
      <div className="flex gap-2.5">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            aria-label={`Fallback color preset ${i + 1}`}
            className={`w-9 h-9 rounded-full transition-all ${
              i === selected ? "ring-2 ring-offset-2 ring-ac-primary" : "hover:scale-105"
            }`}
            style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
          />
        ))}
      </div>
    </div>
  );
}
