import Link from "next/link";
import { getSiteSettings } from "@/db/queries";
import { SiteMobileMenu } from "@/components/site-mobile-menu";
import { SiteNav } from "@/components/site-nav";
import { SiteTrustBanner } from "@/components/site-trust-banner";
import { Button } from "@/components/button";
import { WHATSAPP_PARTNER_URL } from "@/lib/site";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ac-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-6 sm:px-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="col-start-1 flex items-center gap-3 justify-self-start min-w-0">
          <Link href="/" className="group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/delice-wordmark-dark.svg"
              alt="Delice"
              className="h-12 sm:h-14 w-auto max-w-none transition-opacity group-hover:opacity-80"
            />
          </Link>
        </div>

        <SiteNav />

        <div className="col-start-3 flex items-center gap-2 justify-self-end">
          <span className="hidden md:inline-flex">
            <Button href={WHATSAPP_PARTNER_URL} target="_blank" rel="noopener noreferrer" variant="solid" size="sm">
              Become a Partner
            </Button>
          </span>
          <SiteMobileMenu />
        </div>
      </div>
      <SiteTrustBanner items={settings.trustTagItems} />
    </header>
  );
}
