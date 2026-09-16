"use client";

import { useState } from "react";
import { updateHeroSection } from "@/lib/actions/settings";
import { ImageUploadField } from "./image-upload-field";
import { TrustTagItemsField } from "./trust-tag-items-field";
import { HeroMobilePreview } from "./hero-mobile-preview";
import { adminInput, adminLabel } from "./admin-ui";
import { Button } from "@/components/button";
import type { SiteSettings } from "@/db/schema";

export function HeroForm({ settings }: { settings: SiteSettings }) {
  const [trustTagItems, setTrustTagItems] = useState(settings.trustTagItems);
  const [bgLines, setBgLines] = useState<string[]>(
    [0, 1, 2].map((i) => settings.heroBgLines[i] ?? "Slice of Happiness")
  );
  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(settings.heroDesktopUrl ?? undefined);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      <form action={updateHeroSection} className="grid gap-7 max-w-xl w-full">
        <TrustTagItemsField defaultItems={settings.trustTagItems} onChange={setTrustTagItems} />

        <div className="border-t border-ac-border-hairline pt-7">
          <label className={adminLabel}>Hero background text</label>
          <p className="font-humanist text-[12px] text-ac-on-surface-variant mb-2.5">
            The three big scrolling lines behind the homepage hero — each line is independent, not
            repeated.
          </p>
          <div className="grid gap-2.5">
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                name={`heroBgLine${i + 1}`}
                value={bgLines[i]}
                onChange={(e) =>
                  setBgLines((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                }
                placeholder={`Line ${i + 1}`}
                required
                className={adminInput}
              />
            ))}
          </div>
        </div>

        <div>
          <label className={adminLabel}>Media type</label>
          <select name="heroMediaType" defaultValue={settings.heroMediaType} className={adminInput}>
            <option value="none">None — show the plain gradient</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <ImageUploadField
          name="heroDesktopUrl"
          label="Overlapping hero image or video"
          defaultValue={settings.heroDesktopUrl}
          folder="hero"
          cropAspect={null}
          onUploaded={setHeroImageUrl}
        />
        <input type="hidden" name="heroMobileUrl" value={settings.heroMobileUrl ?? ""} />

        <Button type="submit" className="w-fit">
          Save hero section
        </Button>
      </form>

      <HeroMobilePreview trustTagItems={trustTagItems} bgLines={bgLines} heroImageUrl={heroImageUrl} />
    </div>
  );
}
