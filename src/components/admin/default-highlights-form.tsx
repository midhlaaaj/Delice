"use client";

import { updateDefaultHighlights } from "@/lib/actions/settings";
import { HighlightsField } from "./highlights-field";
import { Button } from "@/components/button";

export function DefaultHighlightsForm({ defaultHighlights }: { defaultHighlights: string[] }) {
  return (
    <form action={updateDefaultHighlights} className="grid gap-4">
      <HighlightsField
        defaultItems={defaultHighlights}
        label="Default trust points"
        description="Auto-filled onto every new product's “Why you'll love it” list. Editing this doesn't change points already saved on existing products — edit those from the product's own page."
      />
      <Button type="submit" size="sm" className="w-fit">
        Save defaults
      </Button>
    </form>
  );
}
