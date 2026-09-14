import Link from "next/link";
import { getSiteSettings } from "@/db/queries";
import { SiteMobileMenu } from "@/components/site-mobile-menu";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ac-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-6 sm:px-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-3 justify-self-start min-w-0">
          <Link href="/" className="group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/delice-wordmark-dark.svg"
              alt="Delice"
              className="h-12 sm:h-14 w-auto max-w-none transition-opacity group-hover:opacity-80"
            />
          </Link>
          {settings.trustTagText && (
            <span className="hidden sm:inline-flex items-center gap-1.5 font-humanist text-[11px] font-semibold uppercase tracking-wide text-ac-secondary bg-ac-secondary-container/20 border border-ac-secondary/25 rounded-full px-3 py-1 truncate">
              <span aria-hidden>✦</span>
              {settings.trustTagText}
            </span>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-8 justify-self-center">
          <Link href="/explore" className="font-humanist text-sm font-medium uppercase tracking-wide text-ac-on-surface-variant hover:text-ac-on-surface transition-colors">
            Explore All
          </Link>
          <Link href="/stores" className="font-humanist text-sm font-medium uppercase tracking-wide text-ac-on-surface-variant hover:text-ac-on-surface transition-colors">
            Find a Store
          </Link>
          <Link href="/videos" className="font-humanist text-sm font-medium uppercase tracking-wide text-ac-on-surface-variant hover:text-ac-on-surface transition-colors">
            Videos
          </Link>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <Link
            href="/#partner-wholesale"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-ac-maroon text-ac-on-maroon hover:bg-ac-maroon-deep transition-all shadow-[0_2px_8px_rgba(42,22,32,0.12)] px-5 py-2.5 font-humanist text-xs font-bold uppercase tracking-wide whitespace-nowrap"
          >
            Become a Partner
          </Link>
          <SiteMobileMenu />
        </div>
      </div>
    </header>
  );
}
