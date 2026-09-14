import Link from "next/link";
import type { SiteSettings } from "@/db/schema";

const TICKER_ITEMS = ["Slice of Happiness", "Fresh Daily", "Kerala Wide", "No Preservatives"];

function Ticker() {
  const row = (
    <span className="inline-flex items-center">
      {TICKER_ITEMS.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="font-humanist text-xs font-semibold uppercase tracking-[0.15em] text-ac-on-maroon px-7">
            {item}
          </span>
          <span className="text-ac-on-maroon-muted">✦</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="border-y border-ac-on-maroon-line py-3 overflow-hidden whitespace-nowrap">
      <div
        className="inline-flex animate-marquee"
        style={{ animationDuration: "28s", "--marquee-end": "-33.3333%" } as React.CSSProperties}
      >
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}

function MarqueeRow({ reverse, duration }: { reverse?: boolean; duration: string }) {
  const text = (
    <span className="inline-flex items-center">
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="font-display text-[90px] sm:text-[130px] lg:text-[170px] uppercase tracking-tight text-ac-on-maroon leading-none px-4">
            Slice of Happiness
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className="inline-flex animate-marquee"
        style={{ animationDuration: duration, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {text}
        {text}
      </div>
    </div>
  );
}

export function HeroSection({ settings }: { settings: SiteSettings }) {
  const overlapImageUrl = settings.heroMediaType === "image" ? settings.heroDesktopUrl : null;
  const overlapVideoUrl = settings.heroMediaType === "video" ? settings.heroDesktopUrl : null;

  return (
    <section className="relative isolate w-full overflow-hidden bg-ac-maroon flex flex-col min-h-[calc(100svh-80px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeGaussianBlur stdDeviation='0.3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />
      <Ticker />

      <div className="relative flex-1 flex flex-col justify-center py-10">
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 opacity-90 blur-[3px] sm:blur-[4px]">
          <MarqueeRow duration="34s" />
          <MarqueeRow duration="30s" reverse />
          <MarqueeRow duration="38s" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6 pb-20 sm:pb-28">
          <div
            className="relative w-[400px] h-[400px] sm:w-[560px] sm:h-[560px] lg:w-[680px] lg:h-[680px] flex items-center justify-center overflow-hidden"
            style={{ borderRadius: "63% 37% 54% 46% / 43% 39% 61% 57%" }}
          >
            {overlapVideoUrl ? (
              <video
                src={overlapVideoUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : overlapImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={overlapImageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-ac-secondary-container via-ac-secondary to-ac-maroon-deep" />
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-20 sm:bottom-28 flex justify-center px-6 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-full bg-ac-on-maroon text-ac-maroon px-7 py-3.5 font-humanist text-sm font-semibold shadow-lg hover:bg-white transition-all"
          >
            Explore Flavors
          </Link>
        </div>
      </div>
    </section>
  );
}
