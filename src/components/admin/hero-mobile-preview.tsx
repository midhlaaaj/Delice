"use client";

import { HeroSection } from "@/components/hero-section";
import { SiteTrustBanner } from "@/components/site-trust-banner";
import type { SiteSettings } from "@/db/schema";

// Design reference matches a common mobile viewport — the real HeroSection
// is rendered at that size, then scaled down as one unit so the animation,
// fonts, and layout are identical to production, not a hand-rebuilt copy.
const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 796;
const FRAME_WIDTH = 228; // phone frame inner width
const SCALE = FRAME_WIDTH / DESIGN_WIDTH;

export function HeroMobilePreview({
  trustTagItems,
  bgLines,
  heroImageUrl,
}: {
  trustTagItems: string[];
  bgLines: string[];
  heroImageUrl?: string;
}) {
  const previewSettings: SiteSettings = {
    id: "preview",
    heroMediaType: heroImageUrl ? "image" : "none",
    heroDesktopUrl: heroImageUrl ?? null,
    heroMobileUrl: null,
    trustTagText: null,
    trustTagItems,
    heroBgText: bgLines[0] ?? "Slice of Happiness",
    heroBgLines: bgLines,
    updatedAt: new Date(),
  };

  return (
    <div className="sticky top-8">
      <p className="font-humanist text-[11px] font-semibold uppercase tracking-wide text-ac-on-surface-variant mb-2.5">
        Live preview (mobile)
      </p>
      <div className="w-[240px] aspect-[9/18.5] rounded-[28px] border-[6px] border-ac-ink bg-ac-ink overflow-hidden relative shadow-[0_20px_50px_-30px_rgba(42,22,32,0.5)]">
        <div className="w-full h-full bg-ac-background overflow-hidden flex flex-col">
          {/* Header — collapsed mobile state: wordmark + hamburger */}
          <div className="h-11 shrink-0 bg-ac-surface flex items-center justify-between px-3 border-b border-ac-border-hairline z-10 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/delice-wordmark-dark.svg" alt="Delice" className="h-4.5 w-auto" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5 text-ac-primary">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </div>

          {/* Real trust banner + HeroSection, rendered at real size and scaled down as one unit */}
          <div className="flex-1 overflow-hidden relative">
            <div
              style={{
                width: DESIGN_WIDTH,
                height: DESIGN_HEIGHT,
                transform: `scale(${SCALE})`,
                transformOrigin: "top left",
              }}
            >
              <SiteTrustBanner items={trustTagItems} />
              <HeroSection settings={previewSettings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
